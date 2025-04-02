import { useState, useEffect } from 'react';
import { Table } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { db, auth } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [searchEmail, setSearchEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');

  // Verificar autenticación y rol al cargar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data()?.role === 'admin');
        fetchUsuarios(user.uid);
      } else {
        setIsAdmin(false);
        setUsuarios([]);
      }
    });
    return unsubscribe;
  }, []);

  // Obtener usuarios (solo para admins)
  const fetchUsuarios = async (uid) => {
    try {
      setLoading(true);
      
      // Verificar si es admin
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.data()?.role !== 'admin') {
        toast.error("Acceso restringido a administradores");
        setUsuarios([]);
        return;
      }

      const usersCollection = collection(db, 'users');
      let q = searchEmail 
        ? query(usersCollection, where('email', '>=', searchEmail), where('email', '<=', searchEmail + '\uf8ff'))
        : usersCollection;
      
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        email: doc.data().email || 'No email',
        role: doc.data().role || 'user',
        createdAt: doc.data().createdAt || Timestamp.now()
      }));
      
      setUsuarios(usersData);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      toast.error("Error de permisos al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchUsuarios(currentUserId);
    }
  }, [searchEmail, currentUserId]);

  // Eliminar usuario (solo admin)
  const handleDelete = async (userId) => {
    if (!isAdmin) {
      toast.error("Solo administradores pueden eliminar usuarios");
      return;
    }
    
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      await deleteDoc(doc(db, 'users', userId));
      toast.success("Usuario eliminado correctamente");
      fetchUsuarios(currentUserId);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error("No tienes permisos para esta acción");
    }
  };

  // Actualizar usuario (solo admin)
  const handleUpdate = async () => {
    if (!editUser || !isAdmin) {
      toast.error("Solo administradores pueden editar usuarios");
      return;
    }
    
    if (!editUser.email.includes('@')) {
      toast.warning("Por favor ingresa un email válido");
      return;
    }

    try {
      const userRef = doc(db, 'users', editUser.id);
      await updateDoc(userRef, {
        email: editUser.email,
        role: editUser.role
      });
      
      toast.success("Usuario actualizado correctamente");
      setEditUser(null);
      fetchUsuarios(currentUserId);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      toast.error("Error de permisos al actualizar");
    }
  };

  // Formatear fecha
  const formatDate = (firebaseTimestamp) => {
    if (!firebaseTimestamp) return 'Fecha desconocida';
    try {
      return firebaseTimestamp.toDate 
        ? new Date(firebaseTimestamp.toDate()).toLocaleDateString('es-ES')
        : new Date(firebaseTimestamp.seconds * 1000).toLocaleDateString('es-ES');
    } catch (e) {
      console.error("Error formateando fecha:", e);
      return 'Fecha inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ 
            borderColor: 'var(--color-accent)',
            filter: 'drop-shadow(0 0 6px var(--color-accent))'
          }}
        ></div>
      </div>
    );
  }

  return (
<div className="space-y-6 w-full flex flex-col">
  <h1 className="text-2xl lg:text-3xl font-bold">Gestión de Usuarios</h1>
  
  <div className="border rounded-lg w-full" style={{ 
    backgroundColor: 'var(--color-card-bg)',
    borderColor: 'var(--color-glass-border)',
    overflow: 'hidden' // Esto es clave
  }}>
    <div className="scrollbar-hidden w-full"> {/* Aplicar scrollbar-hidden aquí */}
      <Table className="w-full">
      <thead>
                <tr style={{ 
                  backgroundColor: 'var(--color-prueba)',
                  color: 'var(--color-accent)'
                }}>
                  <th className="px-4 py-3 text-left">Correo</th>
                  <th className="px-4 py-3 text-left">Rol</th>
                  <th className="px-4 py-3 text-left">Fecha de Creación</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.length > 0 ? (
                  usuarios.map((usuario) => (
                    <tr 
                      key={usuario.id}
                      className="hover:bg-opacity-20 hover:bg-accent transition-colors duration-150"
                      style={{
                        borderBottom: '1px solid var(--color-glass-border)',
                        backgroundColor: 'var(--color-bg)'
                      }}
                    >
                      <td className="px-4 py-3 truncate max-w-xs">{usuario.email}</td>
                      <td className="px-4 py-3 truncate capitalize">{usuario.role}</td>
                      <td className="px-4 py-3 truncate">{formatDate(usuario.createdAt)}</td>
                      <td className="px-4 py-3 flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setEditUser(usuario)}
                              className="flex items-center gap-1"
                              style={{
                                color: 'var(--color-primary)',
                                textShadow: '0 0 8px rgba(23, 67, 227, 0.5)'
                              }}
                            >
                              <Pencil className="w-4 h-4" /> Editar
                            </Button>
                          </DialogTrigger>
                          
                          {editUser && (
                            <DialogContent 
                              style={{
                                backgroundColor: 'var(--color-bg)',
                                borderColor: 'var(--color-glass-border)',
                                boxShadow: '0 0 30px rgba(0, 247, 255, 0.2)'
                              }}
                            >
                              <DialogHeader>
                                <DialogTitle style={{ color: 'var(--color-accent)' }}>Editar Usuario</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="email" className="text-right" style={{ color: 'var(--color-text)' }}>
                                    Email
                                  </Label>
                                  <Input
                                    id="email"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                                    className="col-span-3"
                                    style={{
                                      backgroundColor: 'var(--color-glass)',
                                      borderColor: 'var(--color-glass-border)',
                                      color: 'var(--color-text)'
                                    }}
                                  />
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                  <Label htmlFor="role" className="text-right" style={{ color: 'var(--color-text)' }}>
                                    Rol
                                  </Label>
                                  <Select
                                    value={editUser.role}
                                    onValueChange={(value) => setEditUser({...editUser, role: value})}
                                  >
                                    <SelectTrigger 
                                      className="col-span-3"
                                      style={{
                                        backgroundColor: 'var(--color-glass)',
                                        borderColor: 'var(--color-glass-border)',
                                        color: 'var(--color-text)'
                                      }}
                                    >
                                      <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent
                                      style={{
                                        backgroundColor: 'var(--color-bg)',
                                        borderColor: 'var(--color-glass-border)'
                                      }}
                                    >
                                      <SelectItem 
                                        value="admin"
                                        style={{ color: 'var(--color-accent)' }}
                                      >
                                        Admin
                                      </SelectItem>
                                      <SelectItem 
                                        value="user"
                                        style={{ color: 'var(--color-text)' }}
                                      >
                                        Usuario
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <Button 
                                onClick={handleUpdate}
                                style={{
                                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                                  color: 'var(--color-bg)',
                                  fontWeight: 'bold'
                                }}
                              >
                                Guardar Cambios
                              </Button>
                            </DialogContent>
                          )}
                        </Dialog>
                        
                        <Button 
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(usuario.id)}
                          className="flex items-center gap-1"
                          style={{
                            color: 'var(--color-accent)',
                            textShadow: '0 0 8px rgba(0, 247, 255, 0.5)'
                          }}
                        >
                          <Trash className="w-4 h-4" /> Eliminar
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center" style={{ color: 'var(--color-text)' }}>
                      {searchEmail 
                        ? `No se encontraron usuarios con email que contenga "${searchEmail}"`
                        : 'No hay usuarios registrados'}
                    </td>
                  </tr>
                )}
              </tbody>      </Table>
    </div>
  </div>
</div>
  );
}


