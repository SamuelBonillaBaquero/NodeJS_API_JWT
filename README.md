# 🚀 Crypto Exchange API - Secure NodeJS Backend

![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?style=for-the-badge&logo=mongodb&logoColor=white)

Backend robusto para una plataforma de **Exchange de Criptomonedas**. Este proyecto implementa un sistema de autenticación seguro y una arquitectura escalable para gestionar transacciones mediante el uso de tokens de acceso.

## 🌟 Características Principales

* **Autenticación JWT:** Seguridad mediante JSON Web Tokens para la protección de rutas privadas.
* **Gestión de Usuarios:** Registro, login y perfiles con encriptación `bcrypt`.
* **Lógica de Exchange:** Endpoints para simulación de trading y consulta de balances.
* **Arquitectura MVC:** Separación de Modelos, Controladores y Rutas.

## 🛡️ Seguridad & Gestión de Errores

### Autenticación Stateless (JWT)
He optado por **JSON Web Tokens** para permitir una escalabilidad horizontal. Al ser *stateless*, el servidor no necesita almacenar sesiones, optimizando el rendimiento.

### Resolución de Conflictos Técnicos
Durante el desarrollo, se aplicaron estrategias de **Git Flow** para resolver estados complejos (como errores de `Detached HEAD`), asegurando un flujo de trabajo profesional.

## 🛠️ Stack Tecnológico

* **Entorno:** Node.js
* **Framework:** Express.js
* **Seguridad:** JWT & Bcrypt
* **Base de Datos:** MongoDB con Mongoose
