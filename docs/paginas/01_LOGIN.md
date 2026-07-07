# Página: Login

**Ruta:** `/`  
**Componente:** `src/components/Login.js`  
**CSS:** `src/components/Login.css`

---

## Descripción

Pantalla de acceso inicial de la aplicación. Es la primera página que ve el usuario. No implementa autenticación real: cualquier email y contraseña válidos en formato redirigen directamente al Dashboard.

---

## Elementos de la pantalla

| Elemento | Tipo | Comportamiento |
|----------|------|----------------|
| Correo Electrónico | `<input type="email">` | Obligatorio; el navegador valida el formato email |
| Contraseña | `<input type="password">` | Obligatorio |
| Botón "Iniciar sesión" | `<button type="submit">` | Envía el formulario y navega a `/dashboard` |

---

## Lógica

- Al hacer submit, `handleSubmit` llama a `navigate('/dashboard')` sin ninguna validación de credenciales contra backend.
- El estado `email` y `password` se almacena localmente en el componente pero no se usa para nada más allá del formulario HTML nativo.

---

## Estado local

| Variable | Valor inicial | Uso |
|----------|--------------|-----|
| `email` | `''` | Controla el campo de email |
| `password` | `''` | Controla el campo de contraseña |

---

## Navegación

- Entrada: acceso directo a `/`
- Salida: `/dashboard` al hacer submit

---

## Notas

- No hay lógica de sesión, token ni cookie. Cualquier usuario que conozca la URL puede acceder directamente al dashboard.
- El botón "Cerrar sesión" en el Dashboard vuelve a `/`, simulando un cierre de sesión.
