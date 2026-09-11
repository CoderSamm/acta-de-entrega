const parametros = new URLSearchParams(window.location.search);
const idActa = parametros.get("id");
const historial = JSON.parse(localStorage.getItem("historialActas")) || [];
const acta = historial.find((registro) => registro.id === idActa);
const campos = [
    "cliente", "direccion", "fecha", "identificacion", "telefono", "correo", "nit",
    "razon-social", "direccion-facturacion", "telefono-facturacion", "correo-facturacion",
    "firma-nombre", "firma-cedula"
];

function mostrar(valor) {
    return valor || "No registrado";
}

if (!acta) {
    document.querySelector(".contenedor-acta").innerHTML = "<p>El acta no existe o fue eliminada.</p>";
} else {
    document.getElementById("cliente").textContent = mostrar(acta.nombre);
    campos.filter((campo) => campo !== "cliente").forEach((campo) => {
        const elemento = document.getElementById(campo);
        if (elemento) elemento.textContent = mostrar(acta[campo]);
    });
    document.getElementById("caja-observaciones").textContent = mostrar(acta.observaciones);

    const tablaProductos = document.getElementById("tabla-productos-acta");
    (acta.productos || []).forEach((producto) => {
        const fila = document.createElement("tr");
        [producto.item, producto.producto, producto.cantidad].forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = mostrar(valor);
            fila.appendChild(celda);
        });
        tablaProductos.appendChild(fila);
    });

    const tablaSeriales = document.getElementById("tabla-seriales-acta");
    (acta.seriales || []).forEach((serial, indice) => {
        const fila = document.createElement("tr");
        [indice + 1, serial.serialCondensadora, serial.serialEvaporadora].forEach((valor) => {
            const celda = document.createElement("td");
            celda.textContent = mostrar(valor);
            fila.appendChild(celda);
        });
        tablaSeriales.appendChild(fila);
    });

    document.getElementById("btn-editar-acta").addEventListener("click", () => {
        window.location.href = `../index.html?id=${encodeURIComponent(acta.id)}`;
    });
    document.getElementById("btn-imprimir").addEventListener("click", () => window.print());
}
