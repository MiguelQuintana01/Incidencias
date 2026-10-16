<script lang="ts">
  // Ubicacion sugerida: src/App.svelte
  import {
    ESTADOS,
    PRIORIDADES,
    repo,
    type EstadoNombre,
    type IncidenciaVista,
    type PrioridadNombre,
  } from "./lib/db/incidencias-db";

  /* ---------- Consultas en vivo (liveQuery cumple el contrato de store) ---------- */

  const todas = repo.observar(); // sin filtro: solo para los contadores

  let filtroEstado: EstadoNombre | "" = "";
  let filtroPrioridad: PrioridadNombre | "" = "";

  let incidencias = repo.observar();
  $: incidencias = repo.observar({
    estado: filtroEstado || undefined,
    prioridad: filtroPrioridad || undefined,
  });

  $: lista = [...($incidencias ?? [])].sort(
    (a, b) => b.fechaCreacion.localeCompare(a.fechaCreacion) || b.id - a.id,
  );
  $: visibles = ($todas ?? []).filter((i) => !filtroPrioridad || i.prioridad === filtroPrioridad);
  $: porEstado = Object.fromEntries(
    ESTADOS.map((e) => [e, visibles.filter((i) => i.estado === e).length]),
  );

  /* ---------- Formulario (crear / editar) ---------- */

  let titulo = "";
  let descripcion = "";
  let prioridad: PrioridadNombre = "Media";
  let editandoId: number | null = null;
  let errorForm = "";
  let campoTitulo: HTMLInputElement | undefined;

  const mensaje = (e: unknown) => (e instanceof Error ? e.message : "Ocurrio un error inesperado.");

  function reiniciarFormulario() {
    titulo = "";
    descripcion = "";
    prioridad = "Media";
    editandoId = null;
    errorForm = "";
  }

  async function guardar() {
    errorForm = "";
    try {
      if (editandoId === null) {
        await repo.crear({ titulo, descripcion, prioridad });
        // Que la incidencia nueva no quede oculta por un filtro activo
        if (filtroEstado && filtroEstado !== "Nueva") filtroEstado = "";
        if (filtroPrioridad && filtroPrioridad !== prioridad) filtroPrioridad = "";
      } else {
        await repo.actualizar(editandoId, { titulo, descripcion, prioridad });
      }
      reiniciarFormulario();
    } catch (e) {
      errorForm = mensaje(e);
    }
  }

  function editar(inc: IncidenciaVista) {
    editandoId = inc.id;
    titulo = inc.titulo;
    descripcion = inc.descripcion;
    prioridad = inc.prioridad as PrioridadNombre;
    errorForm = "";
    campoTitulo?.focus();
  }

  /* ---------- Acciones sobre la lista ---------- */

  let errorLista = "";
  let confirmandoId: number | null = null;

  async function cambiarEstado(inc: IncidenciaVista, estado: EstadoNombre) {
    if (inc.estado === estado) return;
    errorLista = "";
    try {
      await repo.cambiarEstado(inc.id, estado);
    } catch (e) {
      errorLista = mensaje(e);
    }
  }

  async function eliminar(id: number) {
    errorLista = "";
    try {
      await repo.eliminar(id);
      if (editandoId === id) reiniciarFormulario();
    } catch (e) {
      errorLista = mensaje(e);
    } finally {
      confirmandoId = null;
    }
  }

  const formatoFecha = new Intl.DateTimeFormat("es-MX", { dateStyle: "medium", timeStyle: "short" });
</script>

<main class="app">
  <div class="contenido">
    <header>
      <h1>Incidencias</h1>
      <p class="suave">Registro guardado en este navegador.</p>
    </header>

    <div class="rejilla">
      <form class="panel formulario" on:submit|preventDefault={guardar}>
        <h2>{editandoId === null ? "Nueva incidencia" : `Editar incidencia #${editandoId}`}</h2>

        <label class="campo">
          <span>Titulo</span>
          <input bind:this={campoTitulo} bind:value={titulo} autocomplete="off" required />
        </label>

        <label class="campo">
          <span>Descripcion</span>
          <textarea bind:value={descripcion} rows="5" required></textarea>
        </label>

        <fieldset class="campo">
          <legend>Prioridad</legend>
          <div class="prioridades">
            {#each PRIORIDADES as p}
              <label class="opcion" data-prioridad={p}>
                <input type="radio" name="prioridad" value={p} bind:group={prioridad} />
                <span>{p}</span>
              </label>
            {/each}
          </div>
        </fieldset>

        {#if errorForm}<p class="error" role="alert">{errorForm}</p>{/if}

        <div class="botones">
          <button type="submit" class="primario">
            {editandoId === null ? "Registrar incidencia" : "Guardar cambios"}
          </button>
          {#if editandoId !== null}
            <button type="button" on:click={reiniciarFormulario}>Cancelar</button>
          {/if}
        </div>
      </form>

      <section aria-label="Lista de incidencias">
        <div class="barra">
          <div class="filtros" role="group" aria-label="Filtrar por estado">
            <button type="button" aria-pressed={filtroEstado === ""} on:click={() => (filtroEstado = "")}>
              Todas <span class="n">{visibles.length}</span>
            </button>
            {#each ESTADOS as e}
              <button type="button" aria-pressed={filtroEstado === e} on:click={() => (filtroEstado = e)}>
                {e} <span class="n">{porEstado[e]}</span>
              </button>
            {/each}
          </div>

          <label class="selector">
            Prioridad
            <select bind:value={filtroPrioridad}>
              <option value="">Todas</option>
              {#each PRIORIDADES as p}<option value={p}>{p}</option>{/each}
            </select>
          </label>
        </div>

        {#if errorLista}<p class="error" role="alert">{errorLista}</p>{/if}

        {#if $incidencias === undefined}
          <p class="vacio">Cargando…</p>
        {:else if lista.length === 0}
          <div class="vacio">
            {#if $todas?.length}
              <p>Ninguna incidencia coincide con los filtros.</p>
              <button type="button" on:click={() => ((filtroEstado = ""), (filtroPrioridad = ""))}>
                Quitar filtros
              </button>
            {:else}
              <p>Todavia no hay incidencias. Describe la primera en el formulario.</p>
            {/if}
          </div>
        {:else}
          <ul class="lista">
            {#each lista as inc (inc.id)}
              <li class="fila" data-prioridad={inc.prioridad} class:resuelta={inc.estado === "Resuelta"}>
                <div class="encabezado-fila">
                  <h3>{inc.titulo}</h3>
                  <span class="suave">#{inc.id}</span>
                </div>
                <p class="descripcion">{inc.descripcion}</p>
                <p class="meta suave">
                  <span class="prio">Prioridad {inc.prioridad.toLowerCase()}</span>
                  <time datetime={inc.fechaCreacion}>{formatoFecha.format(new Date(inc.fechaCreacion))}</time>
                </p>

                <div class="acciones">
                  <div class="estado" role="group" aria-label="Estado de la incidencia {inc.id}">
                    {#each ESTADOS as e}
                      <button type="button" aria-pressed={inc.estado === e} on:click={() => cambiarEstado(inc, e)}>
                        {e}
                      </button>
                    {/each}
                  </div>

                  <div class="texto">
                    {#if confirmandoId === inc.id}
                      <button type="button" class="peligro" on:click={() => eliminar(inc.id)}>Si, eliminar</button>
                      <button type="button" on:click={() => (confirmandoId = null)}>Cancelar</button>
                    {:else}
                      <button type="button" on:click={() => editar(inc)}>Editar</button>
                      <button type="button" on:click={() => (confirmandoId = inc.id)}>Eliminar</button>
                    {/if}
                  </div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </section>
    </div>
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    display: block;
  }

  .app {
    --fondo: #edf0f3;
    --superficie: #ffffff;
    --tinta: #17222e;
    --suave: #556577;
    --regla: #cdd5dd;
    --acento: #1d3b5c;
    --sobre-acento: #ffffff;
    --peligro: #b3261e;
    --prio: var(--suave);

    min-height: 100vh;
    box-sizing: border-box;
    padding: clamp(1rem, 4vw, 3rem);
    background: var(--fondo);
    color: var(--tinta);
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    line-height: 1.5;
    text-align: left;
  }
  .contenido {
    max-width: 72rem;
    margin: 0 auto;
  }
  [data-prioridad="Alta"] { --prio: #c23a2b; }
  [data-prioridad="Media"] { --prio: #c98512; }
  [data-prioridad="Baja"] { --prio: #3f7f78; }

  h1 { margin: 0; font-size: 1.875rem; line-height: 1.2; letter-spacing: -0.02em; }
  h2 { margin: 0 0 1rem; font-size: 1rem; }
  h3 { margin: 0; font-size: 1.0625rem; line-height: 1.3; }
  p { margin: 0; }
  header { margin-bottom: 1.75rem; }
  .suave { color: var(--suave); font-size: 0.875rem; font-variant-numeric: tabular-nums; }

  .rejilla {
    display: grid;
    grid-template-columns: minmax(16rem, 20rem) minmax(0, 1fr);
    gap: 2rem;
    align-items: start;
  }
  .panel, .lista, .vacio {
    background: var(--superficie);
    border: 1px solid var(--regla);
    border-radius: 6px;
  }
  .formulario { position: sticky; top: 1.5rem; padding: 1.25rem; }

  /* Controles */
  button, input, select, textarea { font: inherit; color: inherit; }
  input:not([type="radio"]), textarea, select {
    box-sizing: border-box;
    width: 100%;
    padding: 0.5rem 0.65rem;
    background: var(--superficie);
    border: 1px solid var(--regla);
    border-radius: 6px;
  }
  textarea { resize: vertical; }
  button { cursor: pointer; }
  :where(button, input, select, textarea):focus-visible {
    outline: 2px solid var(--acento);
    outline-offset: 2px;
  }

  .campo { display: block; margin: 0 0 1rem; padding: 0; border: 0; }
  .campo > span, legend { display: block; margin-bottom: 0.3rem; padding: 0; font-size: 0.875rem; font-weight: 600; }

  .prioridades { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; }
  .opcion { position: relative; }
  .opcion input { position: absolute; inset: 0; margin: 0; opacity: 0; cursor: pointer; }
  .opcion span {
    display: flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.45rem; font-size: 0.875rem;
    border: 1px solid var(--regla); border-radius: 6px;
  }
  .opcion span::before { content: ""; width: 0.6rem; height: 0.6rem; border-radius: 50%; background: var(--prio); }
  .opcion input:checked + span { border-color: var(--prio); box-shadow: inset 0 0 0 1px var(--prio); }
  .opcion input:focus-visible + span { outline: 2px solid var(--acento); outline-offset: 2px; }

  .botones { display: flex; gap: 0.5rem; flex-wrap: wrap; }
  .botones button, .vacio button {
    padding: 0.5rem 0.9rem; background: transparent;
    border: 1px solid var(--regla); border-radius: 6px;
  }
  .botones .primario { background: var(--acento); border-color: var(--acento); color: var(--sobre-acento); }

  .error {
    margin: 0 0 1rem; padding: 0.5rem 0.75rem; font-size: 0.875rem;
    color: var(--peligro); border-left: 3px solid var(--peligro); background: var(--superficie);
  }

  /* Filtros */
  .barra { display: flex; flex-wrap: wrap; align-items: end; justify-content: space-between; gap: 0.75rem 1.5rem; margin-bottom: 1rem; }
  .filtros { display: flex; flex-wrap: wrap; gap: 0.25rem 1.25rem; }
  .filtros button {
    padding: 0.35rem 0; background: none; border: 0; border-bottom: 2px solid transparent;
    color: var(--suave);
  }
  .filtros button[aria-pressed="true"] { color: var(--tinta); border-bottom-color: var(--acento); }
  .n { font-size: 0.8125rem; font-variant-numeric: tabular-nums; }
  .selector { display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
  .selector select { width: auto; }

  /* Lista */
  .lista { margin: 0; padding: 0; list-style: none; overflow: hidden; }
  .fila { position: relative; padding: 1rem 1rem 1rem 1.5rem; }
  .fila + .fila { border-top: 1px solid var(--regla); }
  .fila::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 6px; background: var(--prio); }
  .fila.resuelta::before { opacity: 0.35; }
  .fila.resuelta h3 { color: var(--suave); }
  .encabezado-fila { display: flex; justify-content: space-between; gap: 1rem; align-items: baseline; }
  .descripcion { margin-top: 0.25rem; max-width: 68ch; white-space: pre-line; }
  .meta { display: flex; gap: 1rem; margin-top: 0.5rem; }
  .acciones { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 0.5rem 1rem; margin-top: 0.75rem; }

  .estado { display: inline-flex; border: 1px solid var(--regla); border-radius: 6px; overflow: hidden; }
  .estado button { padding: 0.3rem 0.7rem; background: transparent; border: 0; color: var(--suave); font-size: 0.8125rem; }
  .estado button + button { border-left: 1px solid var(--regla); }
  .estado button[aria-pressed="true"] { background: var(--acento); color: var(--sobre-acento); }

  .texto { display: flex; gap: 0.75rem; }
  .texto button { padding: 0; background: none; border: 0; color: var(--suave); font-size: 0.875rem; text-decoration: underline; }
  .texto .peligro { color: var(--peligro); }

  .vacio { padding: 1.5rem; color: var(--suave); }
  .vacio button { margin-top: 0.75rem; }

  @media (prefers-reduced-motion: no-preference) {
    button { transition: background-color 120ms, color 120ms; }
  }
  @media (max-width: 52rem) {
    .rejilla { grid-template-columns: 1fr; }
    .formulario { position: static; }
  }
</style>
