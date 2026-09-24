import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    setDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { db, usuarioListo } from "./firebase-config.js";

const COLECCION_ACTAS = "actas";

async function referenciaUsuario() {
    return usuarioListo();
}

export async function leerHistorialRemoto() {
    await referenciaUsuario();
    const resultado = await getDocs(collection(db, COLECCION_ACTAS));
    return resultado.docs.map((registro) => registro.data())
        .sort((a, b) => new Date(b.actualizadoEn) - new Date(a.actualizadoEn));
}

export async function leerActaRemota(id) {
    await referenciaUsuario();
    const registro = await getDoc(doc(db, COLECCION_ACTAS, id));
    if (!registro.exists()) return null;
    return registro.data();
}

export async function guardarActaRemota(acta) {
    const usuario = await referenciaUsuario();
    await setDoc(doc(db, COLECCION_ACTAS, acta.id), {
        ...acta,
        ownerId: usuario.uid
    });
}

export async function eliminarActaRemota(id) {
    await referenciaUsuario();
    const referencia = doc(db, COLECCION_ACTAS, id);
    const registro = await getDoc(referencia);
    if (registro.exists()) {
        await deleteDoc(referencia);
    }
}
