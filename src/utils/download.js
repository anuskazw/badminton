import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';

const SETS_EDITABLES = [
  'Set 1 Local', 'Set 1 Visitante',
  'Set 2 Local', 'Set 2 Visitante',
  'Set 3 Local', 'Set 3 Visitante',
];

export async function descargarPartidosExcel(filas, nombreHoja, nombreArchivo) {
  if (!filas.length) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(nombreHoja);

  const headers = Object.keys(filas[0]);
  sheet.columns = headers.map(h => ({
    header: h,
    key: h,
    width: Math.max(h.length + 4, 14),
  }));

  // Cabecera bloqueada con fondo gris
  sheet.getRow(1).eachCell(cell => {
    cell.font = { bold: true };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2E8F0' } };
    cell.protection = { locked: true };
  });

  filas.forEach(f => {
    const row = sheet.addRow(f);
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      const col = headers[colNumber - 1];
      const editable = SETS_EDITABLES.includes(col);
      cell.protection = { locked: !editable };
      if (editable) {
        // Fondo amarillo claro para indicar que es editable
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF9C4' } };
      }
    });
  });

  // Proteger hoja: bloquea celdas locked, permite editar unlocked
  await sheet.protect('', {
    selectLockedCells: true,
    selectUnlockedCells: true,
    insertRows: false,
    deleteRows: false,
    insertColumns: false,
    deleteColumns: false,
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombreArchivo;
  a.click();
  URL.revokeObjectURL(a.href);
}

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
