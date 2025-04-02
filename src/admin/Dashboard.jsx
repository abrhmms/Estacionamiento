import { ParkingSquare, Clock, DollarSign, PieChart } from "lucide-react";
import { Table } from "@/components/ui/table";

export default function Dashboard() {
    return (
        <div className="space-y-6  w-full h-[calc(100vh-5rem)] overflow-y-auto scrollbar-hidden">
            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold">Bienvenido al Panel de Control</h1>
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
                        A
                    </div>
                </div>
            </header>

            {/* Stats Cards - Tamaño moderado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 w-full">
                {[
                    { 
                        value: "45", 
                        label: "Espacios ocupados", 
                        color: "var(--color-accent)",
                        icon: <ParkingSquare className="h-5 w-5" />
                    },
                    { 
                        value: "12", 
                        label: "Reservas hoy", 
                        color: "var(--color-primary)",
                        icon: <Clock className="h-5 w-5" />
                    },
                    { 
                        value: "₡1.2M", 
                        label: "Ingresos mensuales", 
                        color: "var(--color-secondary)",
                        icon: <DollarSign className="h-5 w-5" />
                    },
                    { 
                        value: "78%", 
                        label: "Ocupación total", 
                        color: "var(--color-accent)",
                        icon: <PieChart className="h-5 w-5" />
                    }
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="border rounded-lg p-4 lg:p-5 w-full"
                        style={{
                            backgroundColor: 'var(--color-card-bg)',
                            borderColor: 'var(--color-glass-border)'
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm lg:text-base mb-2 opacity-80">{stat.label}</p>
                                <h3
                                    className="text-xl lg:text-2xl font-bold"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </h3>
                            </div>
                            <div 
                                className="p-2 rounded-lg"
                                style={{ 
                                    backgroundColor: `${stat.color}20`,
                                    border: `1px solid ${stat.color}`
                                }}
                            >
                                {stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tabla - Tamaño moderado */}
            <div
                className="border rounded-lg overflow-hidden w-full"
                style={{
                    backgroundColor: 'var(--color-card-bg)',
                    borderColor: 'var(--color-glass-border)'
                }}
            >
                <div className="overflow-x-auto w-full scrollbar-hidden">
                    <Table className="w-full">
                        <thead>
                            <tr style={{
                                backgroundColor: 'var(--color-prueba)'
                            }}>
                                <th className="px-4 py-3 text-left text-base">ID Reserva</th>
                                <th className="px-4 py-3 text-left text-base">Usuario</th>
                                <th className="px-4 py-3 text-left text-base">Espacio</th>
                                <th className="px-4 py-3 text-left text-base">Estado</th>
                                <th className="px-4 py-3 text-left text-base">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map((item) => (
                                <tr
                                    key={item}
                                    className="border-t hover:bg-opacity-5 hover:bg-white transition-colors"
                                    style={{ borderColor: 'var(--color-glass-border)' }}
                                >
                                    <td className="px-4 py-3 text-base">#00{item}</td>
                                    <td className="px-4 py-3 text-base">user{item}@example.com</td>
                                    <td className="px-4 py-3 text-base">A-{item}</td>
                                    <td className="px-4 py-3">
                                        <span
                                            className="px-3 py-1 rounded-full text-xs lg:text-sm font-medium"
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
                                    <td className="px-4 py-3">
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
    );
}