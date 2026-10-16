# BiblioTech  (Usuarios)

 todo lo que tiene que ver con los usuarios, o sea, registrarse, entrar a la cuenta (login) y manejar los permisos de cada persona.

## ¿Qué puede hacer cada cosa?

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

## Cosas que hay que saber

- Para hacer casi todo (menos registrarse y entrar) hay que mandar el token que te dieron en el login. Se manda en el header que se llama `x-token`.
- Si no eres Admin, no puedes ver la lista de usuarios ni cambiar el rol de nadie, te va a salir un error.
- La contraseña se guarda protegida, no se guarda tal cual la escribiste.

