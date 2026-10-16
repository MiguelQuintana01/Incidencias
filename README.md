# Sistema de Seguimiento de Incidencias

Aplicacion web funcional para el registro, gestion y seguimiento de incidencias, desarrollada como parte del reto tecnico.

## Enlace al proyecto publicado

*   URL en produccion: https://incidencias-delta.vercel.app/
    

## Tiempo dedicado y herramientas

*   Tiempo estimado de desarrollo: Aproximadamente 1.5 horas.
    
*   Tecnologias principales: Svelte, TypeScript, Vite y Dexie.js (IndexedDB).
    
*   Herramientas de apoyo: Inteligencia Artificial utilizada como asistente para agilizar la maquetacion CSS y consultar dudas sintacticas.
    

## Decisiones de arquitectura y diseno

Para esta primera version, la prioridad fue entregar una solucion solida, funcional y enfocada en el alcance minimo indispensable antes de invertir tiempo en detalles secundarios:

1.  Persistencia de datos en navegador (Dexie.js): Se utilizo Dexie.js para interactuar con IndexedDB de forma estructurada. Esto garantiza que la informacion persista localmente en el navegador sin perder reactividad. En una etapa posterior, la evolucion natural seria implementar una API REST con una base de datos relacional en backend.
    
2.  Diseño en vista unica: Al tratarse de una prueba tecnica orientada a la agilidad, se opto por una arquitectura basada en componentes modulares (App.svelte, Manual.svelte, entre otros) dentro de una sola pantalla en lugar de implementar un sistema de rutas, lo que facilito iterar con mayor rapidez.
    
3.  Flujo unificado (Usuario / Soporte): En lugar de separar roles de usuario (reportador y personal de soporte), se integro la creacion, filtrado, edicion y cambio de estados en una vista centralizada para simplificar la experiencia y reducir tiempos de desarrollo.
    
4.  Manual de operacion integrado: Se incluyo un componente de ayuda dentro de la propia aplicacion para explicar su funcionamiento sin requerir documentacion externa.
    

## Instrucciones para ejecutar en entorno local

### Requisitos previos

*   Tener instalada la version mas reciente de Node.js (probado y desarrollado en Node.js v26.11).
    

### Pasos de ejecucion

1.  Clonar el repositorio:
    git clone https://github.com/MiguelQuintana01/Incidencias
    cd Incidencias
    
2.  Instalar dependencias:
    npm install
    
3.  Iniciar el servidor de desarrollo:
    npm run dev
    
4.  Abrir la direccion indicada en el navegador (usualmente [http://localhost:5173](http://localhost:5173)).
    

## Funcionalidades omitidas y futuras mejoras

Para cumplir con el margen de tiempo y asegurar la calidad del alcance minimo, se omitieron intencionalmente los siguientes puntos:

*   Pruebas automatizadas sobre la logica principal.
    
*   Separacion avanzada de responsabilidades en la arquitectura.
    
*   Manejo de errores y validaciones adicionales en el formulario.
    
