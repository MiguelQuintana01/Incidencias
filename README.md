# Sistema de Seguimiento de Incidencias

Aplicación web funcional para el registro, gestión y seguimiento de incidencias, desarrollada como parte del reto técnico.

## Enlace al proyecto publicado

* URL en producción: https://incidencias-amber.vercel.app/

## Tiempo dedicado y herramientas

* Tiempo estimado de desarrollo (código): aproximadamente 1.5 horas.
* Tecnologías principales: Svelte, TypeScript, Vite y Dexie.js (IndexedDB).
* Herramientas de apoyo: varios modelos de Inteligencia Artificial, utilizados a través de OpenRouter y Ollama (el detalle está en la sección "Uso de IA").

## Uso de IA

La IA intervino en varios puntos del proyecto. Este fue el proceso:

1. Primero decidí qué tecnologías usar. Después le pedí a la IA que procesara los requerimientos del reto y me propusiera los campos necesarios; a partir de esos campos le pedí las tablas, y las validé.
2. Elegí almacenamiento local con la librería Dexie porque ya la he usado en el pasado.
3. Le pedí que simulara un CRUD completo (crear, editar y borrar información). La idea era que, de ser necesario, pudiera crear una API formal o seguir con este modelo, y que ambas opciones fueran fácilmente intercambiables porque la interfaz solo usa funciones del repositorio. La IA también creó el listado.
4. Después le pedí un archivo `.svelte` dedicado exclusivamente a consumir ese archivo `.ts` con todas las funciones de Dexie. El resultado fue mejor de lo esperado y decidí trabajar sobre esa plantilla.
5. El manual lo redacté yo y le pedí a la IA que lo adaptara a Markdown. Al darme cuenta de que era más sencillo hacerlo como componente `.svelte` e importarlo, le pedí que lo tradujera de `.md` a Svelte (muy parecido a HTML, por lo que no tuvo complicación) y que revisara la redacción. Por simplicidad, lo coloqué justo debajo de la vista principal.
6. Además, la IA me ayudó con la maquetación CSS y con dudas sintácticas.

## Decisiones de arquitectura y diseño

Para esta primera versión, la prioridad fue entregar una solución sólida y funcional, enfocada en el alcance mínimo indispensable antes de invertir tiempo en detalles secundarios:

1. **Persistencia en el navegador (Dexie.js).** Dexie interactúa con IndexedDB de forma estructurada, de modo que la información persiste localmente sin perder reactividad (las consultas se actualizan solas en la interfaz). En una etapa posterior, la evolución natural sería una API REST con una base de datos relacional en backend. Como la interfaz solo consume funciones del repositorio (`lib/db/incidencias-db.ts`), ese cambio afectaría principalmente a ese archivo.
2. **Vista única.** Al tratarse de una prueba técnica orientada a la agilidad, opté por componentes modulares (`App.svelte`, `manual.svelte`) dentro de una sola pantalla, en lugar de un sistema de rutas.
3. **Flujo unificado (usuario / soporte).** En lugar de separar roles (reportador y personal de soporte), la creación, el filtrado, la edición y el cambio de estados viven en una vista centralizada, para simplificar la experiencia y reducir tiempos de desarrollo.
4. **Manual de operación integrado.** Un componente de ayuda dentro de la propia aplicación explica su funcionamiento, sin requerir documentación externa.

## Puntos de profundidad opcional elegidos

De los puntos opcionales del reto elegí dos:

* **Persistencia durable en almacenamiento local.** Una aplicación de seguimiento que pierde los datos al recargar la página no es utilizable. Además, ya tenía experiencia guardando datos con Dexie, por lo que me resultó sencillo incorporarlo.
* **Manejo de errores y validaciones.** Se rechazan títulos y descripciones vacíos o con solo espacios en blanco, y los errores del repositorio se muestran al usuario en el formulario y en la lista. JavaScript ofrece buenas herramientas para validar strings y era sencillo implementarlo aquí.

## Funcionalidad adicional

Además del alcance mínimo agregué **editar y eliminar** incidencias (con confirmación al eliminar). No era un requisito; con Dexie es sencillo de implementar y, junto con la IA, se resuelve en pocos minutos.

## Instrucciones para ejecutar en entorno local

### Requisitos previos

* Tener instalada la versión más reciente de Node.js (probado y desarrollado en Node.js v26.11).

### Pasos de ejecución

1. Clonar el repositorio:

   ```bash
   git clone https://github.com/MiguelQuintana01/Incidencias
   cd Incidencias
   ```

2. Instalar dependencias:

   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abrir la dirección indicada en el navegador (usualmente [http://localhost:5173](http://localhost:5173)).

## Mejoras con más tiempo

De los puntos opcionales del reto, estos quedaron fuera de esta versión:

* Pruebas automatizadas sobre la lógica principal.
* Separación clara de responsabilidades.

Con más tiempo, evolucionaría la solución hacia una aplicación completa:

* Usuarios y registro, para saber quién reporta cada incidencia.
* Organización del trabajo por departamento o responsable, con asignación de incidencias.
* Documentación del código.
* Aumento de urgencia por tiempo sin atender.
