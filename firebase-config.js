import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Replace these values with the Firebase Web app configuration.
const firebaseConfig = {
    apiKey: "AIzaSyBUjsMKpqRrO1mwybDhxZVhftXT_CpCQCw",
    authDomain: "actas-entrega.firebaseapp.com",
    projectId: "actas-entrega",
    storageBucket: "actas-entrega.firebasestorage.app",
    messagingSenderId: "976405270493",
    appId: "1:976405270493:web:201a0a416ee895e1383034"
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
