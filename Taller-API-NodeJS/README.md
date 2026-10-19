# Biblioteca Tech API

API REST para administrar autores y libros. Utiliza Node.js, Express y MongoDB.

## Requisitos

- Node.js y npm
- Una base de datos MongoDB

## Instalación y configuración

1. Instala las dependencias:

   ```bash
   npm install
   ```

2. Crea un archivo `.env` en la carpeta principal del proyecto y configura:

   ```env
   PORT=3000
   MONGO_URL=<URI_DE_CONEXION_A_MONGODB>
   ```

   No publiques el archivo `.env` ni compartas credenciales.

3. Inicia el servidor:

   ```bash
   npm start
   ```

   El comando inicia `app.js`, según la configuración de [package.json](<C:/apache/htdocs/biblioteca tech/Taller-API-NodeJS/package.json>). La API queda disponible en `http://localhost:3000`.

## Formato de las solicitudes

Para las solicitudes `POST` y `PUT`, selecciona el método correspondiente en Hoppscotch y agrega el header:

```text
Content-Type: application/json
```

## Autores

Base de la ruta: `/api/autores`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/autores` | Lista los autores activos |
| GET | `/api/autores/:id` | Obtiene un autor y sus libros activos |
| POST | `/api/autores` | Registra un autor |
| PUT | `/api/autores/:id` | Actualiza un autor |
| DELETE | `/api/autores/:id` | Desactiva un autor si no tiene libros activos |

Ejemplo para `POST /api/autores`:

```json
{
  "name": "Isabel Allende",
  "nationality": "Chilena",
  "birthYear": 1942
}
```

## Libros

Base de la ruta: `/api/libros`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/libros` | Lista los libros |
| GET | `/api/libros/available` | Lista los libros disponibles |
| GET | `/api/libros/:id` | Obtiene un libro |
| POST | `/api/libros` | Registra un libro |
| PUT | `/api/libros/:id` | Actualiza un libro |
| DELETE | `/api/libros/:id` | Desactiva un libro |

Ejemplo para `POST /api/libros`:

```json
{
  "title": "La casa de los espíritus",
  "isbn": "9780307474728",
  "author": "<ID_MONGODB_DEL_AUTOR>",
  "genre": "novela",
  "year": 1982,
  "totalCopies": 3
}
```

El campo `author` debe contener el `_id` real de un autor existente. Puedes obtenerlo con `GET /api/autores`.

Los géneros permitidos son: `novela`, `cuento`, `poesia`, `ensayo`, `tecnologia`, `historia` e `infantil`. El ISBN debe tener 10 o 13 dígitos y ser único.

## Respuestas

La API responde en formato JSON. Por ejemplo, al crear un recurso correctamente devuelve el estado HTTP `201` y los datos creados. Las solicitudes inválidas devuelven errores de validación.