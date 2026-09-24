import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { auth, db, usuarioListo } from "./firebase-config.js";

const COLECCION_ACTAS = "actas";

async function referenciaUsuario() {
    await usuarioListo;
    return auth.currentUser;
}

export async function leerHistorialRemoto() {
    const usuario = await referenciaUsuario();
    const consulta = query(
        collection(db, COLECCION_ACTAS),
        where("ownerId", "==", usuario.uid)
    );
    const resultado = await getDocs(consulta);
    return resultado.docs.map((registro) => registro.data())
        .sort((a, b) => new Date(b.actualizadoEn) - new Date(a.actualizadoEn));
}

export async function leerActaRemota(id) {
    const usuario = await referenciaUsuario();
    const registro = await getDoc(doc(db, COLECCION_ACTAS, id));
    if (!registro.exists() || registro.data().ownerId !== usuario.uid) return null;
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
    const usuario = await referenciaUsuario();
    const referencia = doc(db, COLECCION_ACTAS, id);
    const registro = await getDoc(referencia);
    if (registro.exists() && registro.data().ownerId === usuario.uid) {
        await deleteDoc(referencia);
    }
}
