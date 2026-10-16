# BiblioTech API

API REST de la biblioteca (Node.js, Express y MongoDB).

## Préstamos (`/api/loans`)

Todos los endpoints requieren token (`Authorization: Bearer <token>`).

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| POST | `/api/loans` | Token | Pide prestado un libro. Body: `{ "book": "<id>" }` |
| GET | `/api/loans/me` | Token | Préstamos del usuario logueado, con populate del libro |
| PATCH | `/api/loans/:id/return` | Token | Devuelve un libro (solo el dueño del préstamo o un ADMIN) |
| GET | `/api/loans` | ADMIN | Todos los préstamos. Filtro opcional `?status=ACTIVE` o `RETURNED` |
| GET | `/api/loans/overdue` | ADMIN | Préstamos ACTIVE cuya `dueDate` ya pasó |
| PATCH | `/api/loans/:id/renew` | Token | Bonus: renueva el préstamo (+14 días, máximo 1 vez) |
| GET | `/api/loans/top` | ADMIN | Bonus: top 5 de libros más prestados |

Las listas aceptan `?page=` y `?limit=`.

### Reglas de negocio

| Regla | Descripción | Respuesta si no se cumple |
|---|---|---|
| R1 | Solo se presta si el libro está activo y `availableCopies > 0` | 409 "No hay copias disponibles" |
| R2 | Máximo 3 préstamos ACTIVE por usuario | 409 "Límite de préstamos alcanzado" |
| R3 | No puede tener dos préstamos ACTIVE del mismo libro | 409 "Ya tienes este libro prestado" |
| R4 | Al prestar `availableCopies` baja 1; al devolver sube 1, `status = RETURNED` y `returnDate = ahora` | — |
| R6 | No se puede devolver un préstamo ya devuelto | 400 "El préstamo ya fue devuelto" |
| R7 | Solo el dueño del préstamo o un ADMIN puede devolverlo | 403 "No tienes permiso" |

**Multa (bonus):** al devolver con retraso se guarda en `fine` $1.000 por cada día de retraso.

El usuario sale del token (`req.user`), nunca del body. `dueDate` = `loanDate` + 14 días.

### Pruebas
La colección de Hoppscotch está en `docs/prestamos.collection.json` (Importar → Postman). Configura las variables `baseUrl`, los tokens y los ids de libros/préstamos.
