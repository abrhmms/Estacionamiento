import { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { NavLink, useLocation, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  ParkingSquare,
  Users,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Sidebar } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Tooltip } from "@/components/ui/tooltip";
import { useAuth } from "../AuthContext";

export default function AdminLayout({ children }) {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
  
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
  
    const toggleCollapse = () => {
      setCollapsed(!collapsed);
    };
  
    const menuItems = [
        { 
          icon: <LayoutDashboard className="h-4 w-4" />, 
          label: "Dashboard",
          path: "/admin" 
        },
        { 
          icon: <ParkingSquare className="h-4 w-4" />, 
          label: "Estacionamientos",
          path: "/admin/estacionamientos" 
        },
        { 
          icon: <ParkingSquare className="h-4 w-4" />, 
          label: "Areas",
          path: "/admin/areas" 
        },
        { 
          icon: <ParkingSquare className="h-4 w-4" />, 
          label: "Espacios",
          path: "/admin/espacios" 
        },
        { 
          icon: <Users className="h-4 w-4" />, 
          label: "Usuarios",
          path: "/admin/usuarios" 
        },
        { 
          icon: <Settings className="h-4 w-4" />, 
          label: "Configuración",
          path: "/admin/configuracion" 
        }
      ];
  
    return (
      <SidebarProvider>
        <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)] pt-17">
          {/* Mobile Sidebar Overlay */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={toggleSidebar}
            />
          )}
  
          {/* Sidebar */}
          <Sidebar 
            className={`fixed md:relative z-50 h-full transition-all duration-300 ${
              collapsed ? 'w-20' : 'w-64'
            } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            style={{
              backgroundColor: 'var(--navbar)',
              borderColor: 'var(--color-glass-border)'
            }}
          >
            <div className="p-4 flex items-center justify-between">
              {!collapsed && (
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <ParkingSquare className="h-5 w-5" style={{ color: 'var(--color-accent)' }} />
                  <span>SmartPark</span>
                  <span className="text-xs px-2 py-1 rounded-full ml-auto" style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'white'
                  }}>Admin</span>
                </h2>
              )}
              <button 
                onClick={toggleCollapse}
                className="hidden md:block p-1 rounded hover:bg-[var(--color-glass)]"
              >
                <Menu className="h-4 w-4" />
              </button>
            </div>
  
            <Separator className="my-2" style={{ backgroundColor: 'var(--color-glass-border)' }} />
  
            <nav className="p-2 flex-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'hover:bg-[var(--color-glass)]'
                    } ${collapsed ? 'justify-center' : ''}`
                  }
                >
                  <Tooltip content={collapsed ? item.label : ''} side="right">
                    <div className="flex items-center">
                      {item.icon}
                      {!collapsed && <span className="ml-3">{item.label}</span>}
                    </div>
                  </Tooltip>
                </NavLink>
              ))}
            </nav>
  
            <div className="p-4">
              <Separator className="my-2" style={{ backgroundColor: 'var(--color-glass-border)' }} />
              <button 
                onClick={logout}
                className={`flex items-center gap-2 text-sm w-full p-2 rounded-lg hover:bg-[var(--color-glass)] ${
                  collapsed ? 'justify-center' : ''
                }`}
                style={{ color: 'var(--color-accent)' }}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Cerrar sesión</span>}
              </button>
            </div>
          </Sidebar>
  
          {/* Main Content */}
          <div 
            className={`flex-1 flex flex-col overflow-auto transition-all duration-300 ${
              collapsed ? 'md:ml-20' : 'md:ml-0'
            }`}
            style={{
              backgroundColor: 'var(--background)'
            }}
          >
            {/* Mobile Header */}
            <div className="md:hidden p-2 flex items-center justify-between bg-[var(--navbar)] border-b border-[var(--color-glass-border)]">
              <button 
                onClick={toggleSidebar}
                className="p-1 rounded hover:bg-[var(--color-glass)]"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold">Panel de Control</h1>
              <div className="w-6"></div>
            </div>
  
            {/* Contenido dinámico */}
            <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto">
              <Outlet />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
}