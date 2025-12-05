import * as XLSX from 'xlsx';
import type { Orden } from '../types';
import { calcularTotales, ventasPorCategoria } from './calculations';

export const exportarExcel = (ordenes: Orden[], fechaInicio?: string, fechaFin?: string) => {
  const { totalVentas, totalOrdenes, totalProductos } = calcularTotales(ordenes);

  const datosExcel = ordenes.map((o) => ({
    ID: o.id,
    Fecha: o.fecha,
    Hora: o.hora,
    Producto: o.recetaNombre,
    Categoría: o.categoria || 'Sin categoría',
    Cantidad: o.cantidad,
    'Precio Unitario': o.total / o.cantidad,
    Total: o.total,
  }));

  datosExcel.push({
    ID: '',
    Fecha: '',
    Hora: '',
    Producto: 'TOTALES',
    Categoría: '',
    Cantidad: totalProductos,
    'Precio Unitario': '',
    Total: totalVentas,
  } as any);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(datosExcel), 'Órdenes');

  // 🔥 FIX: Resumen que acepta valores string o number
  const resumen: { Métrica: string; Valor: string | number }[] = [
    { Métrica: 'Total de Órdenes', Valor: totalOrdenes },
    { Métrica: 'Productos Vendidos', Valor: totalProductos },
    { Métrica: 'Total de Ventas', Valor: totalVentas },
    { Métrica: 'Promedio por Orden', Valor: totalOrdenes > 0 ? Math.round(totalVentas / totalOrdenes) : 0 },
  ];

  if (fechaInicio && fechaFin) {
    resumen.unshift(
      { Métrica: 'Fecha Inicio', Valor: fechaInicio },
      { Métrica: 'Fecha Fin', Valor: fechaFin }
    );
  }

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(resumen), 'Resumen');

  const categorias = ventasPorCategoria(ordenes);
  const datosCategoria = Object.entries(categorias).map(([cat, data]) => ({
    Categoría: cat,
    Órdenes: data.ordenes,
    'Productos Vendidos': data.cantidad,
    'Total Ventas': data.ventas,
    'Promedio por Orden': data.ordenes > 0 ? Math.round(data.ventas / data.ordenes) : 0,
  }));

  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(datosCategoria), 'Ventas por Categoría');

  XLSX.writeFile(workbook, `reporte-ventas-${new Date().toISOString().split('T')[0]}.xlsx`);
};
