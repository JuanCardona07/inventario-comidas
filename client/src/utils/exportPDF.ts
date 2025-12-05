import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Orden } from '../types';
import { calcularTotales } from './calculations';
import { formatCurrency } from './format';

export const exportarPDF = (ordenes: Orden[], fechaInicio?: string, fechaFin?: string) => {
  const { totalVentas, totalOrdenes, totalProductos, promedioOrden } = calcularTotales(ordenes);

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.setTextColor(37, 99, 235);
  doc.text('Kitchify - Reporte de Ventas', 14, 20);

  doc.setFontSize(10);
  doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 28);

  if (fechaInicio || fechaFin) {
    const inicio = fechaInicio ?? 'N/A';
    const fin = fechaFin ?? 'N/A';
    doc.text(`Período: ${inicio} al ${fin}`, 14, 34);
  }

  const startY = fechaInicio || fechaFin ? 42 : 36;

  // Resumen
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);

  doc.text(`Total de Órdenes: ${totalOrdenes}`, 14, startY);
  doc.text(`Productos Vendidos: ${totalProductos}`, 14, startY + 6);
  doc.text(`Promedio por Orden: ${formatCurrency(promedioOrden)}`, 14, startY + 12);

  doc.text(`Total Ventas: ${formatCurrency(totalVentas)}`, 120, startY);

  // Tabla
  autoTable(doc, {
    startY: startY + 20,
    head: [['Fecha', 'Hora', 'Producto', 'Categoría', 'Cant.', 'P. Unit.', 'Total']],
    body: ordenes.map((o) => [
      o.fecha,
      o.hora,
      o.recetaNombre,
      o.categoria || 'N/A',
      o.cantidad,
      formatCurrency(o.total / o.cantidad),
      formatCurrency(o.total),
    ]),
    foot: [['', '', '', 'TOTALES', totalProductos, '', formatCurrency(totalVentas)]],
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: 255,
    },
  });

  doc.save(`reporte-ventas-${new Date().toISOString().split('T')[0]}.pdf`);
};
