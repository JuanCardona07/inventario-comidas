import { ClipboardList, History, Package, UtensilsCrossed } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";
import Toast from "./Toast";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { toasts, removeToast, loading } = useAppContext();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/inventario", label: "Inventario", icon: Package },
    { path: "/recetas", label: "Recetas", icon: UtensilsCrossed },
    { path: "/ordenes", label: "Nueva Orden", icon: ClipboardList },
    { path: "/historial", label: "Historial", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>

      <header className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border-b border-slate-600/50 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-red-600 to-yellow-500 flex items-center justify-center shadow-lg ring-2 ring-slate-600">
              <span className="text-2xl">🍔</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Kitchify
              </h1>
              <p className="text-sm text-slate-300 mt-0.5">
                Gestión inteligente de cocina
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="mx-4 sm:mx-6 mt-6 relative z-40">
        <div className="bg-slate-800/80 backdrop-blur-sm shadow-2xl rounded-2xl max-w-3xl mx-auto border border-slate-700/50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 justify-center py-3 px-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active =
                  isActive(item.path) ||
                  (item.path === "/inventario" && isActive("/"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 whitespace-nowrap px-4 py-2.5 rounded-xl transition-all text-sm font-medium ${active
                      ? "bg-gradient-to-r from-red-500 via-red-600 to-yellow-500 text-white shadow-lg transform scale-105"
                      : "bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white"
                      }`}
                  >
                    <div className={`${active ? "text-white" : "text-slate-400"}`}>
                      <Icon size={18} />
                    </div>
                    <span className="hidden sm:inline">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? <Loading /> : children}
      </main>
    </div>
  );
}
