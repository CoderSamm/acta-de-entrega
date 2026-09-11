const HISTORIAL_KEY = "historialActas";
const tabla = document.getElementById("tablaHistorial");
const estado = document.getElementById("estado-historial");

function leerHistorial() {
	return JSON.parse(localStorage.getItem(HISTORIAL_KEY)) || [];
}

function guardarHistorial(historial) {
	localStorage.setItem(HISTORIAL_KEY, JSON.stringify(historial));
}

function textoSeguro(valor) {
	return valor || "Sin datos";
}

function fechaLegible(valor) {
	if (!valor) return "Sin fecha";
	return new Date(`${valor}T00:00:00`).toLocaleDateString("es-CO");
}

function fechaHoraLegible(valor) {
	return valor ? new Date(valor).toLocaleString("es-CO") : "Sin cambios";
}

function renderizarHistorial() {
	const historial = leerHistorial();
	tabla.innerHTML = "";

	if (!historial.length) {
		tabla.innerHTML = '<tr><td colspan="6" class="vacio">Aún no hay actas guardadas.</td></tr>';
		return;
	}

	historial.forEach((acta) => {
		const fila = document.createElement("tr");
		[
			fechaLegible(acta.fecha),
			textoSeguro(acta.nombre),
			textoSeguro(acta.identificacion),
			textoSeguro(acta.telefono),
			fechaHoraLegible(acta.actualizadoEn)
		].forEach((valor) => {
			const celda = document.createElement("td");
			celda.textContent = valor;
			fila.appendChild(celda);
		});

		const acciones = document.createElement("td");
		const editar = document.createElement("button");
		editar.textContent = "Editar";
		editar.addEventListener("click", () => {
			window.location.href = `../index.html?id=${encodeURIComponent(acta.id)}`;
		});

		const pdf = document.createElement("button");
		pdf.textContent = "PDF / imprimir";
		pdf.addEventListener("click", () => {
			window.open(`../reportes/acta-de-entrega.html?id=${encodeURIComponent(acta.id)}`, "_blank");
		});

		const eliminar = document.createElement("button");
		eliminar.textContent = "Eliminar";
		eliminar.className = "btn-danger";
		eliminar.addEventListener("click", () => {
			if (!window.confirm("¿Eliminar esta acta del historial?")) return;
			guardarHistorial(leerHistorial().filter((registro) => registro.id !== acta.id));
			renderizarHistorial();
		});

		acciones.append(editar, pdf, eliminar);
		fila.appendChild(acciones);
		tabla.appendChild(fila);
	});
}

document.getElementById("btn-exportar").addEventListener("click", () => {
	const archivo = new Blob([JSON.stringify(leerHistorial(), null, 2)], { type: "application/json" });
	const enlace = document.createElement("a");
	enlace.href = URL.createObjectURL(archivo);
	enlace.download = "respaldo-actas.json";
	enlace.click();
	URL.revokeObjectURL(enlace.href);
});

document.getElementById("input-importar").addEventListener("change", (evento) => {
	const archivo = evento.target.files[0];
	if (!archivo) return;
	const lector = new FileReader();
	lector.onload = () => {
		try {
			const respaldo = JSON.parse(lector.result);
			if (!Array.isArray(respaldo)) throw new Error("Formato invalido");
			guardarHistorial(respaldo);
			estado.textContent = "Respaldo importado correctamente";
			renderizarHistorial();
		} catch {
			estado.textContent = "No se pudo importar el respaldo";
		}
	};
	lector.readAsText(archivo);
});

renderizarHistorial();
