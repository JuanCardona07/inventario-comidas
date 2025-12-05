import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { AppProvider } from "./context/AppContext";
import EstadisticasPage from "./pages/EstadisticasPage";
import HistorialPage from "./pages/HistorialPage";
import InventarioPage from "./pages/InventarioPage";
import OrdenesPage from "./pages/OrdenesPage";
import RecetasPage from "./pages/RecetasPage";

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min.h-screen bg-slate-950 text-gray-900">
          <Layout>
            <Routes>
              <Route path="/" element={<Navigate to="/inventario" replace />} />
              <Route path="/inventario" element={<InventarioPage />} />
              <Route path="/recetas" element={<RecetasPage />} />
              <Route path="/ordenes" element={<OrdenesPage />} />
              <Route path="/historial" element={<HistorialPage />} />
              <Route path="/estadisticas" element={<EstadisticasPage />} />
            </Routes>
          </Layout>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
