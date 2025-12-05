import { useEffect } from 'react';
import InventarioList from "../components/Inventario";
import Loading from '../components/Loading';
import { useAppContext } from "../context/AppContext";

export default function InventarioPage() {
  const {
    ingredientes,
    ingredientesCargados,
    loading,
    refrescarIngredientes,
    reabastecerIngrediente
  } = useAppContext();

  useEffect(() => {
    if (!ingredientesCargados) {
      refrescarIngredientes();
    }
  }, [ingredientesCargados, refrescarIngredientes]);

  if (loading && !ingredientesCargados) {
    return <Loading />;
  }

  return (
    <InventarioList
      ingredientes={ingredientes}
      onReabastecer={reabastecerIngrediente}
    />
  );
}
