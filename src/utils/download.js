import * as XLSX from 'xlsx';

export function descargarExcel(filas, nombreHoja, nombreArchivo) {
  if (!filas.length) return;
  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, nombreHoja);
  XLSX.writeFile(libro, nombreArchivo);
}

export function descargarCSV(filas, nombreArchivo) {
  if (!filas.length) return;
  const cols = Object.keys(filas[0]);
  const csv = [
    cols.join(','),
    ...filas.map(f =>
      cols.map(k => `"${String(f[k] ?? '').replace(/"/g, '""')}"`).join(',')
    ),
  ].join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' }));
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(a.href);
}
