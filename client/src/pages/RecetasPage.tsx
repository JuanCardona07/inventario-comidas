import { useEffect } from 'react';
import Loading from '../components/Loading';
import MenuList from '../components/Menu';
import { useAppContext } from '../context/AppContext';

export default function RecetasPage() {
  const {
    recetas,
    ingredientes,
    recetasCargadas,
    ingredientesCargados,
    loading,
    refrescarRecetas,
    refrescarIngredientes
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

  return <MenuList recetas={recetas} ingredientes={ingredientes} />;
}
