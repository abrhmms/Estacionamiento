import { useState } from 'react';

import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "../AuthContext";
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
import { Table } from "@/components/ui/table";
import { Tooltip } from "@/components/ui/tooltip";
import { NavLink, useLocation } from 'react-router-dom';
import  Usuarios  from "./usuarios"

export default function AdminPage() {
    const { user, role } = useAuth();
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
          icon: <Usuarios className="h-4 w-4" />, 
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
                onClick={() => setSidebarOpen(false)} // Cierra el sidebar en móvil al seleccionar
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
                className={`flex items-center gap-2 text-sm ${
                  collapsed ? 'justify-center' : ''
                }`}
                style={{ color: 'var(--color-accent)' }}
              >
              </button>
            </div>
          </Sidebar>
  
          {/* Main Content - Versión optimizada */}
          <div 
            className={`flex-1 flex flex-col overflow-auto transition-all duration-300 ${
              collapsed ? 'md:ml-20' : 'md:ml-0'
            } scrollbar-hidden`}
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
  
            {/* Contenido principal responsivo */}
            <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 w-full max-w-[1800px] mx-auto scrollbar-hidden">
              {/* Desktop Header */}
              <header className="hidden md:flex justify-between items-center mb-6 lg:mb-8 w-full">
                <h1 className="text-2xl lg:text-3xl font-bold">Panel de Control</h1>
                <div className="flex gap-2">
                  <div className="h-10 w-10 rounded-full" style={{
                    backgroundColor: 'var(--color-primary)'
                  }}></div>
                </div>
              </header>
  
              {/* Stats Cards - Más anchas en desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8 w-full">
                {[
                  { value: "45", label: "Espacios ocupados", color: "var(--color-accent)" },
                  { value: "12", label: "Reservas hoy", color: "var(--color-primary)" },
                  { value: "₡1.2M", label: "Ingresos mensuales", color: "var(--color-secondary)" },
                  { value: "78%", label: "Ocupación total", color: "var(--color-accent)" }
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="border rounded-lg p-4 lg:p-6 backdrop-blur-sm w-full"
                    style={{
                      backgroundColor: 'var(--color-card-bg)',
                      borderColor: 'var(--color-glass-border)'
                    }}
                  >
                    <p className="text-sm lg:text-base mb-2 opacity-80">{stat.label}</p>
                    <h3
                      className="text-xl lg:text-2xl font-bold"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </h3>
                  </div>
                ))}
              </div>
  
              {/* Tabla optimizada para pantallas grandes */}
              <div
                className="border rounded-lg overflow-hidden backdrop-blur-sm w-full"
                style={{
                  backgroundColor: 'var(--color-card-bg)',
                  borderColor: 'var(--color-glass-border)'
                }}
              >
                <div className="overflow-x-auto w-full">
                  <Table className="w-full">
                    <thead>
                      <tr style={{
                        backgroundColor: 'var(--color-prueba)'
                      }}>
                        <th className="px-4 py-3 text-left lg:px-8">ID Reserva</th>
                        <th className="px-4 py-3 text-left lg:px-8">Usuario</th>
                        <th className="px-4 py-3 text-left lg:px-8">Espacio</th>
                        <th className="px-4 py-3 text-left lg:px-8">Estado</th>
                        <th className="px-4 py-3 text-left lg:px-8">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[1, 2, 3, 4, 5].map((item) => (
                        <tr
                          key={item}
                          className="border-t hover:bg-opacity-5 hover:bg-white transition-colors"
                          style={{ borderColor: 'var(--color-glass-border)' }}
                        >
                          <td className="px-4 py-4 lg:px-8">#00{item}</td>
                          <td className="px-4 py-4 lg:px-8">user{item}@example.com</td>
                          <td className="px-4 py-4 lg:px-8">A-{item}</td>
                          <td className="px-4 py-4 lg:px-8">
                            <span
                              className="px-3 py-1.5 rounded-full text-xs lg:text-sm font-medium"
                              style={{
                                backgroundColor: item % 2 === 0
                                  ? 'rgba(0, 247, 255, 0.1)'
                                  : 'rgba(23, 67, 227, 0.1)',
                                color: item % 2 === 0
                                  ? 'var(--color-accent)'
                                  : 'var(--color-primary)',
                                border: `1px solid ${item % 2 === 0
                                  ? 'var(--color-accent)'
                                  : 'var(--color-primary)'}`
                              }}
                            >
                              {item % 2 === 0 ? "Activo" : "Pendiente"}
                            </span>
                          </td>
                          <td className="px-4 py-4 lg:px-8">
                            <button className="text-sm text-[var(--color-accent)] hover:underline">
                              Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }