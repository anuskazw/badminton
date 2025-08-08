# Resumen del proyecto de Bádminton

Este repositorio contiene una aplicación React que gestiona información sobre una liga de bádminton. A continuación se describen las páginas actuales, sus funcionalidades y posibles desarrollos pendientes.

## Páginas existentes

1. **Login (`/`)**  
   Formulario sencillo de inicio de sesión con campos de correo y contraseña. Actualmente solo registra los datos en consola sin conectarse a un servicio de autenticación.

2. **Dashboard (`/dashboard`)**  
   Panel de entrada con tarjetas que enlazan al ranking, listado de equipos y listado de jugadores. La tarjeta de normativa aún no dirige a ninguna página.

3. **Ranking (`/ranking`)**  
   Muestra rankings por modalidades a partir de ficheros JSON. Permite expandir cada sección y navegar al detalle de un jugador concreto.

4. **Jugadores (`/jugadores`)**  
   Lista o muestra información de un jugador según el parámetro de consulta. Al expandir un jugador se visualizan sus puntos por modalidad. La sección de competiciones está pendiente de contenido.

5. **Equipos (`/equipos`)**  
   Listado de equipos con la puntuación total. Al pulsar sobre un equipo se despliegan los nombres de sus jugadores.

6. **Formulario de Sets (`/form`)**  
   Formulario para registrar el resultado de un encuentro: selección de modalidad, jornada, equipos y jugadores, introducción de los sets y cálculo automático de puntos locales y visitantes.

7. **Jornadas (`/jornadas`)**  
   Visualiza los enfrentamientos de una ronda de ejemplo y permite filtrar por modalidad. Muestra equipos, jugadores y puntuaciones.

8. **Competición (`/competicion`)**  
   Interfaz con arrastre y reordenación de equipos utilizando `@dnd-kit`. La zona de pistas todavía no gestiona los elementos arrastrados.

9. **Competición Drag & Drop (`/competicion-2`)**  
   Asignador de equipos a pistas mediante arrastrar y soltar entre columnas. Comprueba jugadores repetidos por tramos y guarda el estado en `localStorage`.

## Desarrollos pendientes

- Conectar la página de **Login** con un sistema real de autenticación y gestión de sesiones.
- Añadir contenido o enlace funcional en la tarjeta de **Normativa** del Dashboard.
- Completar la sección de **Competiciones** en la vista de Jugadores, posiblemente mostrando históricos de partidos.
- Persistir los datos introducidos en el **Formulario de Sets** y validar todas las combinaciones posibles.
- Alimentar la página de **Jornadas** con datos reales y ofrecer detalles ampliados de cada encuentro.
- Finalizar la lógica de asignación a pistas en la página de **Competición** e integrar validaciones similares a las de la versión Drag & Drop.
- Revisar el archivo `src/components/index.ts` que exporta un componente inexistente (`CompeticionPistas`).

