# Actas: Firebase y Vercel

## 1. Crear el proyecto de Firebase

1. Entra a [Firebase Console](https://console.firebase.google.com/) y crea un proyecto.
2. En **Authentication > Sign-in method**, activa **Anonymous**.
3. En **Firestore Database**, crea la base de datos en modo producción.
4. En **Configuración del proyecto > Tus aplicaciones**, registra una aplicación web.
5. Copia la configuración de la aplicación web en `firebase-config.js`, reemplazando todos los valores `REEMPLAZAR_*`.
6. En **Firestore Database > Reglas**, publica el contenido de `firestore.rules`.

La aplicación usa autenticación anónima solo para evitar acceso completamente no autenticado a Firestore. Todos los navegadores comparten la colección `actas`, por lo que cualquier persona con el enlace puede ver, editar y eliminar el historial.

Si las actas deben ser privadas, hay que cambiar este flujo a cuentas con correo y contraseña o a otro proveedor de autenticación.

## 2. Publicar las reglas con Firebase CLI (opcional)

Instala la CLI e inicia sesión:

```bash
npm install -g firebase-tools
firebase login
```

Desde esta carpeta, vincula el proyecto y publica las reglas:

```bash
firebase use --add
firebase deploy --only firestore:rules
```

Cuando `firebase use --add` lo solicite, selecciona el proyecto creado en Firebase.

## 3. Publicar en Vercel

1. Sube esta carpeta a un repositorio de GitHub, GitLab o Bitbucket.
2. Entra a [Vercel](https://vercel.com/), selecciona **Add New > Project** e importa el repositorio.
3. Deja el framework como **Other**, sin comando de build y con la raíz del proyecto como directorio.
4. Pulsa **Deploy**.

También puedes instalar Vercel CLI y ejecutar:

```bash
npm install -g vercel
vercel
vercel --prod
```

La configuración de Firebase Web es pública por diseño. La protección de los datos depende de Authentication y `firestore.rules`, no de ocultar el `apiKey`.
