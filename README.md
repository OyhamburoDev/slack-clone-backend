# Slack Clone - Backend

Backend de un clon de Slack desarrollado como proyecto final para UTN. API RESTful construida con Node.js, Express y MongoDB.

## 🚀 Tecnologías

- **Node.js** con **Express** - Framework web
- **MongoDB Atlas** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación basada en tokens
- **Bcrypt** - Hash de contraseñas
- **Nodemailer** - Envío de emails de verificación
- **CORS** - Configuración de Cross-Origin Resource Sharing

## 📋 Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta en MongoDB Atlas
- Cuenta de Gmail (para envío de emails)

## ⚙️ Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/slack-clone-backend.git
cd slack-clone-backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB
MONGO_DB_CONNECTION_STRING=tu_connection_string_de_mongodb_atlas

# JWT
JWT_SECRET=tu_clave_secreta_para_jwt

# URLs
URL_API_BACKEND=http://localhost:8080
URL_FRONTEND=http://localhost:5173

# Gmail (para verificación de email)
GMAIL_USERNAME=tu_email@gmail.com
GMAIL_PASSWORD=tu_app_password_de_gmail
```

> **Nota:** Para obtener un App Password de Gmail, ve a tu cuenta de Google > Seguridad > Verificación en dos pasos > Contraseñas de aplicaciones.

4. **Ejecutar el servidor**

**Modo desarrollo (con hot reload):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

El servidor estará corriendo en `http://localhost:8080`

## 📚 Documentación de Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Ruta                                | Descripción                           | Autenticación | Body                        |
| ------ | ----------------------------------- | ------------------------------------- | ------------- | --------------------------- |
| `POST` | `/register`                         | Registra un nuevo usuario             | No            | `{ email, password, name }` |
| `POST` | `/login`                            | Inicia sesión y devuelve un token JWT | No            | `{ email, password }`       |
| `GET`  | `/verify-email/:verification_token` | Verifica el email del usuario         | No            | -                           |

#### Ejemplo de registro:

```json
POST /api/auth/register
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123",
  "name": "Juan Pérez"
}
```

#### Ejemplo de login:

```json
POST /api/auth/login
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Respuesta exitosa:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "usuario@ejemplo.com",
    "name": "Juan Pérez"
  }
}
```

---

### 🏢 Workspaces (`/api/workspace`)

Todas las rutas de workspace requieren autenticación mediante token JWT en el header:

```
Authorization: Bearer tu_token_jwt
```

| Método   | Ruta                    | Descripción                              | Permisos              |
| -------- | ----------------------- | ---------------------------------------- | --------------------- |
| `GET`    | `/`                     | Obtiene todos los workspaces del usuario | Usuario autenticado   |
| `GET`    | `/:workspace_id`        | Obtiene un workspace específico          | Miembro del workspace |
| `POST`   | `/`                     | Crea un nuevo workspace                  | Usuario autenticado   |
| `PUT`    | `/:workspace_id`        | Actualiza un workspace                   | Admin del workspace   |
| `DELETE` | `/:workspace_id`        | Elimina un workspace                     | Admin del workspace   |
| `POST`   | `/:workspace_id/invite` | Invita a un miembro al workspace         | Admin del workspace   |

#### Ejemplo de creación de workspace:

```json
POST /api/workspace
Headers: { Authorization: "Bearer tu_token" }
Body:
{
  "name": "Mi Empresa",
  "description": "Workspace de la empresa"
}
```

#### Ejemplo de invitación:

```json
POST /api/workspace/123456/invite
Headers: { Authorization: "Bearer tu_token" }
Body:
{
  "email": "nuevo@ejemplo.com",
  "role": "member"
}
```

---

### 📢 Canales (`/api/workspace/:workspace_id/channels`)

Requiere autenticación y ser miembro del workspace.

| Método | Ruta                      | Descripción                               | Permisos              |
| ------ | ------------------------- | ----------------------------------------- | --------------------- |
| `GET`  | `/:workspace_id/channels` | Obtiene todos los canales de un workspace | Miembro del workspace |
| `POST` | `/:workspace_id/channels` | Crea un nuevo canal                       | Miembro del workspace |

#### Ejemplo de creación de canal:

```json
POST /api/workspace/123456/channels
Headers: { Authorization: "Bearer tu_token" }
Body:
{
  "name": "general",
  "description": "Canal general del workspace"
}
```

---

### 💬 Mensajes (`/api/workspace/:workspace_id/channels/:channel_id/message`)

Requiere autenticación y ser miembro del workspace y canal.

| Método | Ruta                                          | Descripción                            | Permisos          |
| ------ | --------------------------------------------- | -------------------------------------- | ----------------- |
| `GET`  | `/:workspace_id/channels/:channel_id/message` | Obtiene todos los mensajes de un canal | Miembro del canal |
| `POST` | `/:workspace_id/channels/:channel_id/message` | Crea un mensaje en un canal            | Miembro del canal |

#### Ejemplo de envío de mensaje:

```json
POST /api/workspace/123456/channels/789/message
Headers: { Authorization: "Bearer tu_token" }
Body:
{
  "content": "Hola a todos!"
}
```

---

### 👥 Miembros (`/api/members`)

| Método | Ruta                         | Descripción                          | Autenticación                   |
| ------ | ---------------------------- | ------------------------------------ | ------------------------------- |
| `GET`  | `/confirm-invitation/:token` | Confirma la invitación de un miembro | No (se usa token de invitación) |

---

## 🔒 Autenticación y Autorización

### Flujo de Autenticación

1. **Registro:** El usuario se registra y recibe un email de verificación
2. **Verificación:** El usuario hace clic en el enlace del email
3. **Login:** Una vez verificado, puede iniciar sesión y recibir un JWT
4. **Autorización:** Incluir el JWT en el header `Authorization: Bearer <token>` para rutas protegidas

### Roles y Permisos

- **Admin:** Puede invitar miembros, editar y eliminar workspaces
- **Member:** Puede ver workspaces, canales y enviar mensajes

---

## 🗂️ Estructura del Proyecto

```
slack-clone-backend/
├── src/
│   ├── config/
│   │   ├── environment.config.js  # Variables de entorno
│   │   ├── mongoDB.config.js      # Configuración de MongoDB
│   │   └── nodemailer.config.js   # Configuración de Nodemailer (emails)
│   ├── controllers/               # Lógica de negocio y manejo de peticiones HTTP
│   │   ├── auth.controller.js
│   │   ├── workspace.controller.js
│   │   ├── channel.controller.js
│   │   ├── channelMessage.controller.js
│   │   └── member.controller.js
│   ├── middlewares/               # Middlewares de autenticación y validación
│   │   ├── auth.middleware.js
│   │   ├── workspace.middleware.js
│   │   └── channel.middleware.js
│   ├── models/                    # Modelos de Mongoose (esquemas de la DB)
│   ├── repositories/              # Capa de acceso a datos (interacción con MongoDB)
│   ├── routes/                    # Definición de rutas de la API
│   │   ├── auth.route.js
│   │   ├── workspace.route.js
│   │   ├── channel.route.js
│   │   ├── messageChannel.route.js
│   │   └── member.route.js
│   ├── services/                  # Servicios (lógica de autenticación)
│   │   └── auth.service.js
│   ├── utils/                     # Funciones utilitarias y helpers
│   └── server.js                  # Punto de entrada de la aplicación
├── .env                           # Variables de entorno (no incluir en git)
├── .gitignore
├── package.json
├── vercel.json                    # Configuración de deployment en Vercel
└── README.md
```

---

## 🚀 Deployment

El proyecto está desplegado en **Vercel**.

### URL de Producción

```
https://tu-proyecto.vercel.app
```

### Variables de entorno en Vercel

Asegúrate de configurar todas las variables de entorno en el dashboard de Vercel:

- `MONGO_DB_CONNECTION_STRING`
- `JWT_SECRET`
- `URL_API_BACKEND`
- `URL_FRONTEND`
- `GMAIL_USERNAME`
- `GMAIL_PASSWORD`

---

## 📮 Documentación API (Postman)

La colección de Postman con todos los endpoints documentados se encuentra en: `/docs/postman-collection.json`

### Cómo importarla en Postman:

1. Abrir Postman Desktop o Web
2. Click en **"Import"** (esquina superior izquierda)
3. Seleccionar **"Upload Files"**
4. Navegar a `/docs/postman-collection.json` y seleccionarlo
5. Click en **"Import"**

### Configuración de Variables de Entorno (opcional):

Una vez importada la colección, puedes configurar las siguientes variables en Postman para facilitar las pruebas:

- `URL_API_SLACK`: `http://localhost:8080` (desarrollo) o tu URL de producción
- `token`: Se auto-completa después del login

### Contenido de la colección:

La colección incluye ejemplos de todos los endpoints documentados en este README:

- Autenticación (registro, login, verificación)
- Gestión de workspaces
- Gestión de canales
- Mensajes
- Invitaciones de miembros

---

## 🧪 Testing

Para ejecutar tests (cuando estén implementados):

```bash
npm test
```

---

## 📝 Notas Importantes

- El puerto por defecto es `8080`
- El servidor acepta peticiones desde `http://localhost:5173` y la URL configurada en `URL_FRONTEND`
- Los emails de verificación se envían desde la cuenta configurada en `GMAIL_USERNAME`
- Los tokens JWT tienen una expiración configurable en el código

---

## 👨‍💻 Autor

Proyecto final desarrollado para la certificación de Backend Developer en UTN (Universidad Tecnológica Nacional).

---

## 📄 Licencia

ISC
