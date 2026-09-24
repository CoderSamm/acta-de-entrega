import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

const formulario = document.getElementById("formulario-acceso");
const botonRegistrar = document.getElementById("btn-registrar");
const mensaje = document.getElementById("mensaje-acceso");

function mostrarError(error) {
    const mensajes = {
        "auth/email-already-in-use": "Ese correo ya tiene una cuenta.",
        "auth/invalid-credential": "El correo o la contraseña no son correctos.",
        "auth/invalid-email": "Escribe un correo válido.",
        "auth/weak-password": "La contraseña debe tener al menos 6 caracteres."
    };
    mensaje.textContent = mensajes[error.code] || "No se pudo completar el acceso.";
}

function irAInicio() {
    window.location.replace("index.html");
}

onAuthStateChanged(auth, (usuario) => {
    if (usuario) irAInicio();
});

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensaje.textContent = "";
    try {
        await signInWithEmailAndPassword(
            auth,
            document.getElementById("correo").value.trim(),
            document.getElementById("password").value
        );
    } catch (error) {
        mostrarError(error);
    }
});

botonRegistrar.addEventListener("click", async () => {
    mensaje.textContent = "";
    try {
        await createUserWithEmailAndPassword(
            auth,
            document.getElementById("correo").value.trim(),
            document.getElementById("password").value
        );
    } catch (error) {
        mostrarError(error);
    }
});
