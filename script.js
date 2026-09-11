const HISTORIAL_KEY = "historialActas";

const inputItem = document.getElementById("input-item");
const inputProducto = document.getElementById("input-producto");
const inputCantidad = document.getElementById("input-cantidad");
const tbodyProductos = document.getElementById("tbody-productos");
const tablaTotalItems = document.getElementById("tabla-total-items");
const tablaTotalCantidades = document.getElementById("tabla-total-cantidades");
const inputSerialCondensadora = document.getElementById("input-serial-condensadora");
const inputSerialEvaporadora = document.getElementById("input-serial-evaporadora");
const tbodySeriales = document.getElementById("tbody-seriales");

const camposActa = [
    "fecha", "identificacion", "nombre", "direccion", "telefono", "correo",
    "nit", "razon-social", "direccion-facturacion", "telefono-facturacion",
    "correo-facturacion", "observaciones", "firma-nombre", "firma-cedula"
];

const parametros = new URLSearchParams(window.location.search);
let actaEnEdicion = parametros.get("id");

function leerHistorial() {
    return JSON.parse(localStorage.getItem(HISTORIAL_KEY)) || [];
}

function guardarHistorial(historial) {
    localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
}

function guardarCambiosAutomaticamente() {
    if (actaEnEdicion) guardarActa(false);
}

function leerTablaProductos() {
    return Array.from(tbodyProductos.children).map((fila) => ({
        item: fila.children[0].textContent.trim(),
        producto: fila.children[1].textContent.trim(),
        cantidad: fila.children[2].textContent.trim()
    }));
}

function leerTablaSeriales() {
    return Array.from(tbodySeriales.children).map((fila) => ({
        serialCondensadora: fila.children[1].textContent.trim(),
        serialEvaporadora: fila.children[2].textContent.trim()
    }));
}

function obtenerDatosActa() {
    const datos = {};
    camposActa.forEach((campo) => {
        datos[campo] = document.getElementById(campo).value.trim();
    });

    return {
        id: actaEnEdicion || String(Date.now()),
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
        ...datos,
        productos: leerTablaProductos(),
        seriales: leerTablaSeriales()
    };
}

function guardarActa(mostrarAviso = true) {
    const acta = obtenerDatosActa();
    const historial = leerHistorial();
    const indice = historial.findIndex((registro) => registro.id === acta.id);

    if (indice === -1) {
        historial.unshift(acta);
    } else {
        acta.creadoEn = historial[indice].creadoEn || acta.creadoEn;
        historial[indice] = acta;
    }

    guardarHistorial(historial);
    actaEnEdicion = acta.id;

    if (mostrarAviso) {
        mostrarNotificacion("Acta guardada en el historial");
    }

    return acta;
}

function cargarDatosActa(acta) {
    camposActa.forEach((campo) => {
        document.getElementById(campo).value = acta[campo] || "";
    });

    tbodyProductos.innerHTML = "";
    (acta.productos || []).forEach(agregarFilaProducto);
    tbodySeriales.innerHTML = "";
    (acta.seriales || []).forEach(agregarFilaSerial);
    actualizarTotales();
}

function crearBoton(texto, accion) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = texto;
    boton.addEventListener("click", accion);
    return boton;
}

function agregarFilaProducto(producto) {
    const fila = document.createElement("tr");
    [producto.item, producto.producto, producto.cantidad].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor || "";
        fila.appendChild(celda);
    });

    const acciones = document.createElement("td");
    acciones.appendChild(crearBoton("Editar", () => editarFila(fila, acciones)));
    acciones.appendChild(crearBoton("Eliminar", () => {
        fila.remove();
        actualizarTotales();
        guardarCambiosAutomaticamente();
    }));
    fila.appendChild(acciones);
    tbodyProductos.appendChild(fila);
}

function agregarFilaSerial(serial) {
    const fila = document.createElement("tr");
    const item = document.createElement("td");
    item.textContent = tbodySeriales.children.length + 1;
    fila.appendChild(item);

    [serial.serialCondensadora, serial.serialEvaporadora].forEach((valor) => {
        const celda = document.createElement("td");
        celda.textContent = valor || "";
        fila.appendChild(celda);
    });

    const acciones = document.createElement("td");
    acciones.appendChild(crearBoton("Editar", () => editarFila(fila, acciones, true)));
    acciones.appendChild(crearBoton("Eliminar", () => {
        fila.remove();
        renumerarSeriales();
        guardarCambiosAutomaticamente();
    }));
    fila.appendChild(acciones);
    tbodySeriales.appendChild(fila);
}

function editarFila(fila, acciones, esSerial = false) {
    if (acciones.querySelector("input")) {
        fila.querySelectorAll("input").forEach((entrada) => {
            entrada.parentElement.textContent = entrada.value.trim();
        });
        acciones.innerHTML = "";
        acciones.appendChild(crearBoton("Editar", () => editarFila(fila, acciones, esSerial)));
        acciones.appendChild(crearBoton("Eliminar", () => {
            fila.remove();
            if (esSerial) renumerarSeriales();
            actualizarTotales();
            guardarCambiosAutomaticamente();
        }));
        if (esSerial) renumerarSeriales();
        actualizarTotales();
        guardarCambiosAutomaticamente();
        return;
    }

    const inicio = esSerial ? 1 : 0;
    Array.from(fila.children).slice(inicio, 3).forEach((celda) => {
        const entrada = document.createElement("input");
        entrada.value = celda.textContent;
        celda.textContent = "";
        celda.appendChild(entrada);
    });
    acciones.innerHTML = "";
    acciones.appendChild(crearBoton("Guardar", () => editarFila(fila, acciones, esSerial)));
    acciones.appendChild(crearBoton("Eliminar", () => {
        fila.remove();
        if (esSerial) renumerarSeriales();
        actualizarTotales();
        guardarCambiosAutomaticamente();
    }));
}

function renumerarSeriales() {
    Array.from(tbodySeriales.children).forEach((fila, indice) => {
        fila.children[0].textContent = indice + 1;
    });
}

function actualizarTotales() {
    tablaTotalItems.textContent = tbodyProductos.children.length;
    tablaTotalCantidades.textContent = leerTablaProductos()
        .reduce((total, producto) => total + (Number(producto.cantidad) || 0), 0);
    inputItem.value = tbodyProductos.children.length + 1;
}

function mostrarNotificacion(mensaje) {
    const notificacion = document.getElementById("notificacion-app");
    notificacion.textContent = mensaje;
    window.clearTimeout(mostrarNotificacion.temporizador);
    mostrarNotificacion.temporizador = window.setTimeout(() => {
        notificacion.textContent = "";
    }, 2500);
}

document.getElementById("btn-agregar").addEventListener("click", () => {
    if (!inputItem.value.trim() || !inputProducto.value.trim() || !inputCantidad.value.trim()) {
        mostrarNotificacion("Complete los datos del producto");
        return;
    }
    agregarFilaProducto({
        item: inputItem.value.trim(),
        producto: inputProducto.value.trim(),
        cantidad: inputCantidad.value.trim()
    });
    inputProducto.value = "";
    inputCantidad.value = "";
    actualizarTotales();
    guardarCambiosAutomaticamente();
});

document.getElementById("btn-agregar-serial").addEventListener("click", () => {
    if (!inputSerialCondensadora.value.trim() && !inputSerialEvaporadora.value.trim()) {
        mostrarNotificacion("Ingrese al menos un serial");
        return;
    }
    agregarFilaSerial({
        serialCondensadora: inputSerialCondensadora.value.trim(),
        serialEvaporadora: inputSerialEvaporadora.value.trim()
    });
    inputSerialCondensadora.value = "";
    inputSerialEvaporadora.value = "";
    guardarCambiosAutomaticamente();
});

document.getElementById("btn-guardar-acta").addEventListener("click", () => guardarActa());
document.getElementById("btn-generar-acta").addEventListener("click", () => {
    const acta = guardarActa(false);
    window.open(`./reportes/acta-de-entrega.html?id=${encodeURIComponent(acta.id)}`, "_blank");
});
document.getElementById("btn-eliminar-acta").addEventListener("click", () => {
    if (!actaEnEdicion) {
        document.querySelectorAll("input, textarea").forEach((elemento) => elemento.value = "");
        tbodyProductos.innerHTML = "";
        tbodySeriales.innerHTML = "";
        actualizarTotales();
        return;
    }
    guardarHistorial(leerHistorial().filter((acta) => acta.id !== actaEnEdicion));
    window.location.href = "index.html";
});

const registroInicial = actaEnEdicion && leerHistorial().find((acta) => acta.id === actaEnEdicion);
if (registroInicial) {
    cargarDatosActa(registroInicial);
} else {
    actualizarTotales();
}

let guardadoPendiente;
camposActa.forEach((campo) => {
    document.getElementById(campo).addEventListener("input", () => {
        if (!actaEnEdicion) return;
        window.clearTimeout(guardadoPendiente);
        guardadoPendiente = window.setTimeout(() => guardarActa(false), 300);
    });
});
