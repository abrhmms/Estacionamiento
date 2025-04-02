import { Table } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";

const usuarios = [
    { id: 1, email: "admin@example.com", role: "admin", createdAt: "2025-04-01 04:51:30" },
    { id: 2, email: "user1@example.com", role: "user", createdAt: "2025-04-01 05:10:15" },
    { id: 3, email: "user2@example.com", role: "user", createdAt: "2025-04-01 06:30:45" },
];

export default function Areas() {
    return (
<div className="space-y-6 w-full flex flex-col">
              <h1 className="text-2xl lg:text-3xl font-bold">Gestión de Usuarios</h1>
            
            <div className="border rounded-lg w-full flex flex-col overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-glass-border)' }}>
                {/* Este div tiene la clase scrollbar-hidden que oculta el scrollbar */}
                <div className="w-full flex-1 overflow-y-auto scrollbar-hidden table-container">                    <Table className="w-full table-fixed border-collapse">
                        <thead>
                            <tr style={{ backgroundColor: 'var(--color-prueba)' }}>
                                <th className="px-4 py-3 text-left text-base w-1/4">Correo</th>
                                <th className="px-4 py-3 text-left text-base w-1/4">Rol</th>
                                <th className="px-4 py-3 text-left text-base w-1/4">Fecha de Creación</th>
                                <th className="px-4 py-3 text-left text-base w-1/4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="border-t hover:bg-opacity-5 hover:bg-white transition-colors" style={{ borderColor: 'var(--color-glass-border)' }}>
                                    <td className="px-4 py-3 text-base truncate">{usuario.email}</td>
                                    <td className="px-4 py-3 text-base truncate">{usuario.role}</td>
                                    <td className="px-4 py-3 text-base truncate">{usuario.createdAt}</td>
                                    <td className="px-4 py-3 flex gap-2">
                                        <button className="text-[var(--color-primary)] hover:underline flex items-center gap-1">
                                            <Pencil className="w-4 h-4 gap-x-1.5 " /> <strong>Editar</strong>
                                        </button>
                                        <button className="text-[var(--color-accent)] hover:underline flex items-center gap-1">
                                            <Trash className="w-4 h-4" /> <strong>Eliminar</strong>
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



