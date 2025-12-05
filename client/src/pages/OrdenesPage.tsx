import { useEffect } from 'react';
import Loading from '../components/Loading';
import NuevaOrden from '../components/NuevaOrden';
import { useAppContext } from '../context/AppContext';

export default function OrdenesPage() {
  const {
    recetas,
    ingredientes,
    recetasCargadas,
    ingredientesCargados,
    loading,
    processingOrder,
    refrescarRecetas,
    refrescarIngredientes,
    procesarOrden
  } = useAppContext();

  useEffect(() => {
    if (!recetasCargadas) {
      refrescarRecetas();
    }
    if (!ingredientesCargados) {
      refrescarIngredientes();
    }
  }, [recetasCargadas, ingredientesCargados, refrescarRecetas, refrescarIngredientes]);

  if (loading && (!recetasCargadas || !ingredientesCargados)) {
    return <Loading />;
  }

  return (
    <NuevaOrden
      recetas={recetas}
      ingredientes={ingredientes}
      onProcesarOrden={procesarOrden}
      processingOrder={processingOrder}
    />
  );
}
