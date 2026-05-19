
# Full Stack Open 2026

Repositorio del curso **Full Stack Open** - University of Helsinki

## Progreso

- [ ] Part 0 - Fundamentals of Web apps
- [ ] Part 1 - Introduction to React
- [ ] Part 2 - Communicating with server
- [ ] Part 3 - Programming a server with NodeJS and Express
- [ ] Part 4 - Testing Express servers, user administration
- [ ] Part 5 - Testing React apps
- [ ] Part 6 - Advanced state management
- [ ] Part 7 - React router, custom hooks, styling app with CSS and webpack
- [ ] Part 8 - GraphQL
- [ ] Part 9 - TypeScript

## Part 0: Fundamentals of Web apps

### Ejercicio 0.4 - Nuevo diagrama de nota

```mermaid
sequenceDiagram
    participant browser
    participant server

    Note right of browser: Usuario escribe una nota y pulsa "Save"

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note
    activate server
    server-->>browser: HTTP 302 Redirect (Location: /exampleapp/notes)
    deactivate server

    Note right of browser: El navegador sigue la redirección

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/notes
    activate server
    server-->>browser: HTML document
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.css
    activate server
    server-->>browser: CSS file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/main.js
    activate server
    server-->>browser: JavaScript file
    deactivate server

    browser->>server: GET https://studies.cs.helsinki.fi/exampleapp/data.json
    activate server
    server-->>browser: [{content: "...", date: "..."}, ...]
    deactivate server

    Note right of browser: El navegador renderiza las notas actualizadas

## Tecnologías que voy a usar
- Vanilla JavaScript
- React + TypeScript
- Node.js + Express
- MongoDB

---

**Curso oficial**: [fullstackopen.com](https://fullstackopen.com/en/)