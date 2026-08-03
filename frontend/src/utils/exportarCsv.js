export function generarNombreArchivo(prefijo) {
  const fecha = new Date();

  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minutos = String(fecha.getMinutes()).padStart(2, "0");

  return `${prefijo}-${anio}-${mes}-${dia}-${hora}${minutos}.csv`;
}

function escaparValorCsv(valor) {
  if (valor === null || valor === undefined) {
    return "";
  }

  const texto = String(valor).replace(/"/g, '""');

  return `"${texto}"`;
}

export function descargarCsv(nombreArchivo, columnas, filas) {
  const encabezados = columnas.map((columna) =>
    escaparValorCsv(columna.titulo),
  );

  const contenidoFilas = filas.map((fila) =>
    columnas.map((columna) => escaparValorCsv(fila[columna.clave])).join(";"),
  );

  const contenidoCsv = [encabezados.join(";"), ...contenidoFilas].join("\n");

  const blob = new Blob([`\uFEFF${contenidoCsv}`], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const enlace = document.createElement("a");

  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();

  URL.revokeObjectURL(url);
}