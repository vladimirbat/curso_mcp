# Curso de Model Context Protocol (MCP)

Proyecto principal del curso de **Model Context Protocol (MCP)** para desarrolladores JavaScript / Node.js. Contiene el material teórico y presentaciones del curso, las guías de estudio y una aplicación web local de prueba («Calculadora de Descuentos») utilizada para los ejercicios prácticos de depuración e inspección con servidores MCP.

---

## Contenido del repositorio

### 1. Presentación
- [doc/PRESENTACION_CURSO_MCP.md](doc/PRESENTACION_CURSO_MCP.md): Presentación completa del curso en formato Marp (introducción, arquitectura, transportes `stdio` y `Streamable HTTP`, creación de servidores y seguridad).

### 2. Práctica
- [doc/PRACTICA_USO_MCP_EXISTENTE.md](doc/PRACTICA_USO_MCP_EXISTENTE.md): Práctica de consumo y depuración asistida por IA utilizando el servidor **Chrome DevTools MCP** sobre la aplicación web del proyecto.

### 3. Aplicación web de ejemplo
- `index.html`, `app.js`, `styles.css`: Aplicación web («Calculadora de Descuentos») para reproducir fallos en tiempo de ejecución, inspeccionarlos con Chrome DevTools MCP y verificar la corrección del código.

---

## Proyectos del curso

Este repositorio forma parte de los tres proyectos que componen el curso:
1. **curso_mcp** (este repositorio): Material docente, diapositivas y práctica con MCP existente.
2. **curso_mcp_server**: Servidor MCP en Node.js que expone herramientas para consultar la API de TMDB (The Movie Database).
3. **web_peliculas**: Aplicación web estática generada con GitHub Copilot consumiendo el servidor MCP de TMDB.

---

## Scripts disponibles

- `npm start`: Inicia el servidor HTTP local en el puerto 3000 (`serve -l 3000`) para la aplicación de prueba.
- `npm run recalc:toc`: Actualiza automáticamente los números de diapositiva en los índices de la presentación.
- `npm run convert:diagram`: Convierte diagramas Mermaid a formato SVG.
