import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Replace these values with the Firebase Web app configuration.
const firebaseConfig = {
    apiKey: "REEMPLAZAR_API_KEY",
    authDomain: "REEMPLAZAR_PROJECT_ID.firebaseapp.com",
    projectId: "REEMPLAZAR_PROJECT_ID",
    storageBucket: "REEMPLAZAR_PROJECT_ID.appspot.com",
    messagingSenderId: "REEMPLAZAR_SENDER_ID",
    appId: "REEMPLAZAR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const authReady = new Promise((resolve) => {
    const cancelar = onAuthStateChanged(auth, (usuario) => {
        cancelar();
        resolve(usuario);
    });
});

export async function usuarioListo() {
    const usuario = await authReady;
    if (!usuario) throw new Error("Se requiere iniciar sesión");
    return usuario;
}
