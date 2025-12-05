import type { Orden } from '../types';

export const calcularTotales = (ordenes: Orden[]) => {
  const totalVentas = ordenes.reduce((sum, o) => sum + o.total, 0);
  const totalOrdenes = ordenes.length;
  const totalProductos = ordenes.reduce((sum, o) => sum + o.cantidad, 0);

  return {
    totalVentas,
    totalOrdenes,
    totalProductos,
    promedioOrden: totalVentas / totalOrdenes,
  };
};

export const ventasPorCategoria = (ordenes: Orden[]) => {
  const resultado: Record<string, { cantidad: number; ventas: number; ordenes: number }> = {};

  ordenes.forEach((o) => {
    const cat = o.categoria || 'Sin categoria';

    if (!resultado[cat]) {
      resultado[cat] = { cantidad: 0, ventas: 0, ordenes: 0 };
    }

    resultado[cat].cantidad += o.cantidad;
    resultado[cat].ventas += o.total;
    resultado[cat].ordenes += 1;
  });

  return resultado;

}
