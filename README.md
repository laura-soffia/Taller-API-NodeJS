# BiblioTech API

API REST de la biblioteca (Node.js, Express y MongoDB).

## Contenido

- [Autenticación](#autenticación)
- [Usuarios](#usuarios)
- [Autores](#autores)
- [Libros](#libros)
- [Préstamos](#préstamos)
- [Pruebas](#pruebas)

## Autenticación

Para hacer casi todo (menos registrarse y entrar) hay que mandar el token que se recibe en el login.

- Endpoints de usuarios: el token va en el header `x-token`.
- Endpoints de préstamos: el token va en el header `Authorization: Bearer <token>`.

Nota: las rutas protegidas de esta API leen el token desde el header `x-token`.

## Usuarios

Todo lo que tiene que ver con los usuarios: registrarse, entrar a la cuenta (login) y manejar los permisos de cada persona.

### Crear una cuenta nueva
Para registrarse hay que enviar el nombre, el correo y una contraseña.

```
POST /api/auth/register
{
  "name": "Luka",
  "email": "lukanet@g.com",
  "password": "contraseña1234"
}
```

### Entrar a la cuenta (login)
Con el correo y la contraseña que ya tenías, entras y te dan un token. Ese token es como una llave que después hay que usar para poder hacer otras cosas en la app.

```
POST /api/auth/login
{
  "email": "aco@re.com",
  "password": "contraseña"
}
```

### Ver mis datos
Con el token que te dieron al entrar, puedes ver tu propia información.

```
GET /api/auth/me
```

### Ver todos los usuarios (solo para el Admin)
Si eres administrador, puedes ver la lista de todas las personas que se registraron.

```
GET /api/users
```

### Cambiar el rol de alguien (solo para el Admin)
El administrador puede cambiar si una persona es USER o ADMIN.

```
PATCH /api/users/:id/role
{
  "role": "USER"
}
```

### Cosas que hay que saber

- Si no eres Admin, no puedes ver la lista de usuarios ni cambiar el rol de nadie; te va a salir un error.
- La contraseña se guarda protegida, no se guarda tal cual la escribiste.

## Autores

Base: `/api/authors`. Las consultas son públicas; para crear, actualizar o eliminar autores se requiere un token de administrador en el header `x-token`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/authors` | Público | Lista los autores activos |
| GET | `/api/authors/:id` | Público | Obtiene un autor y sus libros activos |
| POST | `/api/authors` | ADMIN | Crea un autor. Body: `{ "name": "Luisa Perez", "nationality": "Mexicana", "birthYear": 1980 }` |
| PUT | `/api/authors/:id` | ADMIN | Actualiza los datos del autor |
| DELETE | `/api/authors/:id` | ADMIN | Desactiva el autor; no se puede desactivar si tiene libros activos |

## Libros

Base: `/api/books`. Las consultas son públicas; para crear, actualizar o eliminar libros se requiere un token de administrador en el header `x-token`.

| Método | Ruta | Acceso | Descripción |
|---|---|---|---|
| GET | `/api/books` | Público | Lista los libros activos e incluye el nombre del autor |
| GET | `/api/books/available` | Público | Lista los libros activos con copias disponibles |
| GET | `/api/books/:id` | Público | Obtiene un libro activo y sus datos de autor |
| POST | `/api/books` | ADMIN | Crea un libro. Body: `{ "title": "El loco ananias", "isbn": "9780307478733", "author": "<id del autor>", "genre": "novela", "year": 2018, "totalCopies": 4 }` |
| PUT | `/api/books/:id` | ADMIN | Actualiza los datos del libro |
| DELETE | `/api/books/:id` | ADMIN | Desactiva el libro |

Al crear un libro, `availableCopies` se inicializa con el valor de `totalCopies`. Al actualizar `totalCopies`, no puede quedar por debajo del número de copias que están prestadas.

## Préstamos

Base: `/api/loans`. Todos los endpoints requieren token.

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

## Pruebas

Las colecciones de Hoppscotch están en `docs/autoresLibros.collection.json`, `docs/prestamos.collection.json` y `docs/users.collection.json` (Importar → Postman). Configura los tokens y los ids necesarios para ejecutar las peticiones.