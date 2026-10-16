

<div class="manual-container">
  <header class="header">
    <h1>Manual de Usuario: Sistema de Gestión de Incidencias</h1>
    <p class="subtitle">
      Plataforma diseñada para el registro, seguimiento, filtrado y control de incidentes.
    </p>
    <div class="disclaimer">
      <strong>Aviso Importante:</strong> Los datos de las incidencias se almacenan localmente en el navegador web en uso.
    </div>
    
  </header>

  <section class="content-section">
    <h2>1. Funcionalidades Principales</h2>
    <ul class="feature-list">
      <li><strong>Registro de Incidencias:</strong> Permite la creación de nuevos registros especificando Título, Descripción y Prioridad.</li>
      <li><strong>Visualización de Datos:</strong> Muestra un listado estructurado de todos los incidentes registrados.</li>
      <li><strong>Segmentación y Filtros:</strong> Permite filtrar la lista de incidentes por Estado (por ejemplo, Abierto o Resuelto) y por Prioridad (Alta, Media, Baja).</li>
      <li><strong>Administración de Registros:</strong> Permite la edición de información, actualización del estado operativo y eliminación de registros.</li>
    </ul>

    <h2>2. Guía de Operación</h2>

    <article class="guide-step">
      <h3>2.1. Creación de un Nuevo Incidente</h3>
      <ol>
        <li>Diríjase a la sección del formulario de registro.</li>
        <li><strong>Título:</strong> Ingrese un título representativo y preciso sobre el incidente.</li>
        <li><strong>Descripción:</strong> Proporcione una explicación detallada en el campo correspondiente.</li>
        <li><strong>Prioridad:</strong> Seleccione el nivel de urgencia adecuado (Alta, Media o Baja).</li>
        <li>Haga clic en el botón <strong>"Registrar incidente"</strong>.</li>
        <li>El incidente se agregará automáticamente al listado principal.</li>
      </ol>
    </article>

    <article class="guide-step">
      <h3>2.2. Edición de un Incidente</h3>
      <ol>
        <li>En la lista de incidentes, ubique el registro que desea modificar.</li>
        <li>Haga clic en el botón <strong>"Editar"</strong> correspondiente.</li>
        <li>Los campos de <strong>Título</strong>, <strong>Descripción</strong> y <strong>Prioridad</strong> se cargarán con la información actual.</li>
        <li>Realice las modificaciones requeridas. Para descartar los cambios, haga clic en <strong>"Cancelar"</strong>.</li>
        <li>Para confirmar las modificaciones, haga clic en <strong>"Guardar cambios"</strong>.</li>
      </ol>
    </article>

    <article class="guide-step">
      <h3>2.3. Gestión y Actualización de Estado</h3>
      <p>Permite reflejar el flujo de trabajo y progreso del incidente:</p>
      <ol>
        <li>Ubique el registro correspondiente dentro del listado.</li>
        <li>En la columna <strong>"Estado"</strong>, seleccione el botón relativo al nuevo estado requerimiento (por ejemplo, cambiar de "Abierto" a "Resuelto").</li>
        <li>El sistema actualizará el estado de forma inmediata y aplicará el indicador visual pertinente.</li>
      </ol>
    </article>

    <article class="guide-step">
      <h3>2.4. Eliminación de un Incidente</h3>
      <p>Procedimiento para remover permanentemente un registro:</p>
      <ol>
        <li>Localice el incidente en el listado.</li>
        <li>Haga clic en el botón <strong>"Eliminar"</strong>.</li>
        <li>Ante el mensaje de confirmación, haga clic en <strong>"Sí, eliminar"</strong> para completar la acción.</li>
      </ol>
    </article>

    <article class="guide-step">
      <h3>2.5. Filtrado de Registros</h3>
      <p>Permite segmentar la información para facilitar la consulta:</p>
      <ol>
        <li><strong>Filtro por Estado:</strong> En la barra de herramientas, seleccione el botón correspondiente al estado requerido (por ejemplo, "Abierto").</li>
        <li><strong>Filtro por Prioridad:</strong> Utilice el selector de <strong>Prioridad</strong> para desplegar únicamente las incidencias clasificadas bajo el nivel seleccionado.</li>
        <li>Para restablecer la vista completa, seleccione la opción <strong>"Todas"</strong> en los controles de filtro correspondientes.</li>
      </ol>
    </article>
  </section>

  <footer>
    <p>Manual de Usuario &mdash; Sistema de Gestión de Incidencias</p>
  </footer>
</div>

<style>
  /* Estilos para el contenedor del manual */
  .manual-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
    border: 1px solid var(--pico-border);
    border-radius: var(--pico-border-radius);
    box-shadow: var(--pico-shadow);
  }

  .header {
    text-align: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--pico-border);
  }

  .header h1 {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    color: var(--pico-primary);
  }

  .subtitle {
    color: var(--pico-text-secondary);
  }

  .disclaimer {
    margin-top: 1rem;
    padding: 0.75rem 1rem;
    background-color: var(--pico-background-alt);
    border-left: 4px solid var(--pico-primary);
    text-align: left;
    font-size: 0.95rem;
  }

  .content-section {
    margin-top: 2rem;
  }

  h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    border-bottom: 2px solid var(--pico-border);
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
  }

  .guide-step {
    margin-bottom: 1.5rem;
    padding: 1.25rem;
    border: 1px solid var(--pico-border-alt);
    border-radius: var(--pico-border-radius);
    background-color: var(--pico-card-background-color);
  }

  .guide-step h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
    color: var(--pico-primary-dark);
  }

  .feature-list {
    list-style-type: square;
    padding-left: 1.25rem;
  }

  .feature-list li {
    margin-bottom: 0.5rem;
  }

  .guide-step ol {
    padding-left: 1.25rem;
  }

  .guide-step li {
    margin-bottom: 0.5rem;
  }

  footer {
    text-align: center;
    margin-top: 3rem;
    padding-top: 1rem;
    border-top: 1px solid var(--pico-border);
    font-size: 0.85rem;
    color: var(--pico-text-secondary);
  }

  /* Botón flotante para regresar */
  .back-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    width: auto;
    padding: 0.6rem 1.2rem;
    background-color: var(--pico-primary);
    color: var(--pico-text-on-primary);
    border: none;
    border-radius: var(--pico-border-radius);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    transition: background-color 0.2s ease, transform 0.1s ease;
  }

  .back-button:hover {
    background-color: var(--pico-primary-dark);
    transform: translateY(-2px);
  }
</style>
