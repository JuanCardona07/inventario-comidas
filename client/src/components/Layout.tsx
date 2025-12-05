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
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8DC] via - [#FFEAA7] to - [#8B0000] / 10">
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

      <header className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center ring-1 ring-white/20">
              <span className="text-lg">🍔</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Kitchify
              </h1>
              <p className="text-sm text-white/90 mt-0.5">
                Gestión inteligente de cocina
              </p>
            </div>
          </div>
        </div>
      </header>

      <nav className="mx-4 sm:mx-6 mt-4 relative z-40">
        <div className="bg-gradient-to-r from-[#F4F7FF] to-[#F0F4FF] shadow-sm rounded-2xl max-w-3xl mx-auto">
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
                    className={`flex items-center gap-3 whitespace-nowrap px-4 py-2 rounded-lg transition-all text-sm font-medium shadow-sm ${active
                      ? "bg-gradient-to-r from-sky-600 to-indigo-600 text-white ring-1 ring-sky-200 transform -translate-y-[1px]"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    <div
                      className={`${active ? "text-white" : "text-gray-500"}`}
                    >
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
