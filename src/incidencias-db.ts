// npm i dexie
// Ubicacion sugerida: src/lib/db/incidencias-db.ts
import Dexie, { liveQuery, type EntityTable, type Observable } from "dexie";

/* ======================= TIPOS Y MODELOS ======================= */

export const PRIORIDADES = ["Baja", "Media", "Alta"] as const;
export const ESTADOS = ["Nueva", "En proceso", "Resuelta"] as const;

export type PrioridadNombre = (typeof PRIORIDADES)[number];
export type EstadoNombre = (typeof ESTADOS)[number];

export interface Prioridad {
  id: number;
  nombre: string;
}

export interface Estado {
  id: number;
  nombre: string;
}

export interface Incidencia {
  id: number;
  titulo: string;
  descripcion: string;
  prioridadId: number; // FK -> prioridades.id
  estadoId: number; // FK -> estados.id
  fechaCreacion: string; // ISO 8601
}

// Incidencia ya "unida" con los nombres de sus catalogos (resultado del JOIN)
export interface IncidenciaVista extends Incidencia {
  prioridad: string;
  estado: string;
}

export interface NuevaIncidencia {
  titulo: string;
  descripcion: string;
  prioridad: PrioridadNombre;
}

export type CambiosIncidencia = Partial<{
  titulo: string;
  descripcion: string;
  prioridad: PrioridadNombre;
  estado: EstadoNombre;
}>;

export interface FiltroIncidencias {
  estado?: EstadoNombre;
  prioridad?: PrioridadNombre;
}

/* ======================= TABLAS ======================= */

class IncidenciasDB extends Dexie {
  prioridades!: EntityTable<Prioridad, "id">;
  estados!: EntityTable<Estado, "id">;
  incidencias!: EntityTable<Incidencia, "id">;

  constructor() {
    super("IncidenciasDB");

    this.version(1).stores({
      prioridades: "++id, &nombre",
      estados: "++id, &nombre",
      incidencias: "++id, prioridadId, estadoId, fechaCreacion, [estadoId+prioridadId]",
    });

    // Datos iniciales de los catalogos (solo al crear la base)
    this.on("populate", (tx) => {
      tx.table("prioridades").bulkAdd(PRIORIDADES.map((nombre) => ({ nombre })));
      tx.table("estados").bulkAdd(ESTADOS.map((nombre) => ({ nombre })));
    });
  }
}

export const db = new IncidenciasDB();

/* ======================= CRUD ======================= */

export class IncidenciasRepository {
  constructor(private readonly database: IncidenciasDB = db) {}

  /* ---------- Incidencias ---------- */

  async crear({ titulo, descripcion, prioridad }: NuevaIncidencia): Promise<IncidenciaVista> {
    const t = (titulo ?? "").trim();
    const d = (descripcion ?? "").trim();
    if (!t) throw new Error("El titulo es obligatorio.");
    if (!d) throw new Error("La descripcion es obligatoria.");

    const prio = await this.database.prioridades.get({ nombre: prioridad });
    if (!prio) throw new Error("Prioridad invalida. Use: Baja, Media o Alta.");

    const nueva = await this.database.estados.get({ nombre: "Nueva" });
    if (!nueva) throw new Error('Falta el estado "Nueva" en el catalogo.');

    const id = await this.database.incidencias.add({
      titulo: t,
      descripcion: d,
      prioridadId: prio.id,
      estadoId: nueva.id,
      fechaCreacion: new Date().toISOString(),
    } as Incidencia);

    return (await this.obtener(id))!;
  }

  async obtener(id: number): Promise<IncidenciaVista | undefined> {
    const inc = await this.database.incidencias.get(id);
    return inc ? (await this.unir([inc]))[0] : undefined;
  }

  async listar({ estado, prioridad }: FiltroIncidencias = {}): Promise<IncidenciaVista[]> {
    const filtro: Partial<Pick<Incidencia, "estadoId" | "prioridadId">> = {};

    if (estado) {
      const e = await this.database.estados.get({ nombre: estado });
      if (!e) return [];
      filtro.estadoId = e.id;
    }
    if (prioridad) {
      const p = await this.database.prioridades.get({ nombre: prioridad });
      if (!p) return [];
      filtro.prioridadId = p.id;
    }

    const lista = Object.keys(filtro).length
      ? await this.database.incidencias.where(filtro).toArray()
      : await this.database.incidencias.toArray();

    return this.unir(lista);
  }

  async actualizar(id: number, cambios: CambiosIncidencia): Promise<IncidenciaVista> {
    const parche: Partial<Incidencia> = {};

    if (cambios.titulo !== undefined) {
      if (!cambios.titulo.trim()) throw new Error("El titulo no puede quedar vacio.");
      parche.titulo = cambios.titulo.trim();
    }
    if (cambios.descripcion !== undefined) {
      if (!cambios.descripcion.trim()) throw new Error("La descripcion no puede quedar vacia.");
      parche.descripcion = cambios.descripcion.trim();
    }
    if (cambios.prioridad !== undefined) {
      const p = await this.database.prioridades.get({ nombre: cambios.prioridad });
      if (!p) throw new Error("Prioridad invalida.");
      parche.prioridadId = p.id;
    }
    if (cambios.estado !== undefined) {
      const e = await this.database.estados.get({ nombre: cambios.estado });
      if (!e) throw new Error("Estado invalido.");
      parche.estadoId = e.id;
    }

    const n = await this.database.incidencias.update(id, parche);
    if (!n) throw new Error(`No existe la incidencia ${id}.`);
    return (await this.obtener(id))!;
  }

  cambiarEstado(id: number, estado: EstadoNombre): Promise<IncidenciaVista> {
    return this.actualizar(id, { estado });
  }

  async eliminar(id: number): Promise<void> {
    const existe = await this.database.incidencias.get(id);
    if (!existe) throw new Error(`No existe la incidencia ${id}.`);
    await this.database.incidencias.delete(id);
  }

  // Observable reactivo: compatible con la sintaxis $store de Svelte
  observar(filtro: FiltroIncidencias = {}): Observable<IncidenciaVista[]> {
    return liveQuery(() => this.listar(filtro));
  }

  /* ---------- Prioridades ---------- */
  listarPrioridades(): Promise<Prioridad[]> {
    return this.database.prioridades.toArray();
  }
  obtenerPrioridad(id: number): Promise<Prioridad | undefined> {
    return this.database.prioridades.get(id);
  }
  crearPrioridad(nombre: string): Promise<Prioridad> {
    return this.catCrear(this.database.prioridades, nombre);
  }
  actualizarPrioridad(id: number, nombre: string): Promise<Prioridad> {
    return this.catActualizar(this.database.prioridades, id, nombre);
  }
  eliminarPrioridad(id: number): Promise<void> {
    return this.catEliminar(this.database.prioridades, "prioridadId", id);
  }

  /* ---------- Estados ---------- */
  listarEstados(): Promise<Estado[]> {
    return this.database.estados.toArray();
  }
  obtenerEstado(id: number): Promise<Estado | undefined> {
    return this.database.estados.get(id);
  }
  crearEstado(nombre: string): Promise<Estado> {
    return this.catCrear(this.database.estados, nombre);
  }
  actualizarEstado(id: number, nombre: string): Promise<Estado> {
    return this.catActualizar(this.database.estados, id, nombre);
  }
  eliminarEstado(id: number): Promise<void> {
    return this.catEliminar(this.database.estados, "estadoId", id);
  }

  /* ---------- Utilidades ---------- */

  // Borra todo y vuelve a sembrar los catalogos
  async reiniciar(): Promise<void> {
    await this.database.delete();
    await this.database.open();
  }

  /* ---------- Internos ---------- */

  // Equivalente al JOIN de SQL
  private async unir(incidencias: Incidencia[]): Promise<IncidenciaVista[]> {
    const [prios, estados] = await Promise.all([
      this.database.prioridades.bulkGet(incidencias.map((i) => i.prioridadId)),
      this.database.estados.bulkGet(incidencias.map((i) => i.estadoId)),
    ]);
    return incidencias.map((inc, k) => ({
      ...inc,
      prioridad: prios[k]?.nombre ?? "",
      estado: estados[k]?.nombre ?? "",
    }));
  }

  private async catCrear<T extends { id: number; nombre: string }>(
    tabla: EntityTable<T, "id">,
    nombre: string,
  ): Promise<T> {
    const n = (nombre ?? "").trim();
    if (!n) throw new Error("El nombre es obligatorio.");
    if (await tabla.get({ nombre: n } as any)) throw new Error(`"${n}" ya existe.`);
    const id = await tabla.add({ nombre: n } as any);
    return (await tabla.get(id as number))!;
  }

  private async catActualizar<T extends { id: number; nombre: string }>(
    tabla: EntityTable<T, "id">,
    id: number,
    nombre: string,
  ): Promise<T> {
    const n = (nombre ?? "").trim();
    if (!n) throw new Error("El nombre es obligatorio.");
    const repetido = await tabla.get({ nombre: n } as any);
    if (repetido && repetido.id !== id) throw new Error(`"${n}" ya existe.`);
    if (!(await tabla.update(id, { nombre: n } as any))) {
      throw new Error(`No existe el registro ${id}.`);
    }
    return (await tabla.get(id))!;
  }

  // Simula la restriccion de llave foranea (no borrar si esta en uso)
  private async catEliminar(
    tabla: EntityTable<any, "id">,
    campoFK: "prioridadId" | "estadoId",
    id: number,
  ): Promise<void> {
    const enUso = await this.database.incidencias.where(campoFK).equals(id).count();
    if (enUso) throw new Error(`No se puede eliminar: lo usan ${enUso} incidencia(s).`);
    await tabla.delete(id);
  }
}

// Instancia lista para importar en componentes Svelte
export const repo = new IncidenciasRepository();
