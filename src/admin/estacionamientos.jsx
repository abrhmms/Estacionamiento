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
  getDoc,
  addDoc
} from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';

export default function Estacionamientos() {
  const [estacionamientos, setEstacionamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editEstacionamiento, setEditEstacionamiento] = useState(null);
  const [searchNombre, setSearchNombre] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUserId, setCurrentUserId] = useState('');
  const [newEstacionamiento, setNewEstacionamiento] = useState({
    nombre: '',
    direccion: ''
  });

  // Verificar autenticación y rol al cargar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserId(user.uid);
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.data()?.role === 'admin');
        fetchEstacionamientos();
      } else {
        setIsAdmin(false);
        setEstacionamientos([]);
      }
    });
    return unsubscribe;
  }, []);

  // Obtener estacionamientos
  const fetchEstacionamientos = async () => {
    try {
      setLoading(true);
      const estacionamientosCollection = collection(db, 'estacionamientos');
      let q = searchNombre 
        ? query(estacionamientosCollection, where('nombre', '>=', searchNombre), where('nombre', '<=', searchNombre + '\uf8ff'))
        : estacionamientosCollection;
      
      const querySnapshot = await getDocs(q);
      const estacionamientosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        nombre: doc.data().nombre || 'Sin nombre',
        direccion: doc.data().direccion || 'Sin dirección',
        createdAt: doc.data().createdAt || Timestamp.now()
      }));
      
      setEstacionamientos(estacionamientosData);
    } catch (error) {
      console.error("Error al obtener estacionamientos:", error);
      toast.error("Error al cargar estacionamientos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchEstacionamientos();
    }
  }, [searchNombre, currentUserId]);

  // Crear nuevo estacionamiento
  const handleCreate = async () => {
    if (!newEstacionamiento.nombre || !newEstacionamiento.direccion) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    try {
      await addDoc(collection(db, 'estacionamientos'), {
        ...newEstacionamiento,
        createdAt: Timestamp.now()
      });
      toast.success("Estacionamiento creado correctamente");
      setNewEstacionamiento({ nombre: '', direccion: '' });
      fetchEstacionamientos();
    } catch (error) {
      console.error("Error al crear estacionamiento:", error);
      toast.error("Error al crear estacionamiento");
    }
  };

  // Eliminar estacionamiento
  const handleDelete = async (id) => {
    if (!isAdmin) {
      toast.error("Solo administradores pueden eliminar estacionamientos");
      return;
    }
    
    if (!window.confirm('¿Estás seguro de eliminar este estacionamiento?')) return;
    
    try {
      await deleteDoc(doc(db, 'estacionamientos', id));
      toast.success("Estacionamiento eliminado correctamente");
      fetchEstacionamientos();
    } catch (error) {
      console.error("Error al eliminar estacionamiento:", error);
      toast.error("No tienes permisos para esta acción");
    }
  };

  // Actualizar estacionamiento
  const handleUpdate = async () => {
    if (!editEstacionamiento || !isAdmin) {
      toast.error("Solo administradores pueden editar estacionamientos");
      return;
    }
    
    if (!editEstacionamiento.nombre || !editEstacionamiento.direccion) {
      toast.warning("Todos los campos son obligatorios");
      return;
    }

    try {
      const estacionamientoRef = doc(db, 'estacionamientos', editEstacionamiento.id);
      await updateDoc(estacionamientoRef, {
        nombre: editEstacionamiento.nombre,
        direccion: editEstacionamiento.direccion
      });
      
      toast.success("Estacionamiento actualizado correctamente");
      setEditEstacionamiento(null);
      fetchEstacionamientos();
    } catch (error) {
      console.error("Error al actualizar estacionamiento:", error);
      toast.error("Error al actualizar");
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
      <h1 className="text-2xl lg:text-3xl font-bold">Gestión de Estacionamientos</h1>
      
      {/* Formulario de creación */}
      <div className="border rounded-lg p-4" style={{ 
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-glass-border)'
      }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-accent)' }}>Nuevo Estacionamiento</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="nombre" style={{ color: 'var(--color-text)' }}>Nombre</Label>
            <Input
              id="nombre"
              value={newEstacionamiento.nombre}
              onChange={(e) => setNewEstacionamiento({...newEstacionamiento, nombre: e.target.value})}
              style={{
                backgroundColor: 'var(--color-glass)',
                borderColor: 'var(--color-glass-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
          <div>
            <Label htmlFor="direccion" style={{ color: 'var(--color-text)' }}>Dirección</Label>
            <Input
              id="direccion"
              value={newEstacionamiento.direccion}
              onChange={(e) => setNewEstacionamiento({...newEstacionamiento, direccion: e.target.value})}
              style={{
                backgroundColor: 'var(--color-glass)',
                borderColor: 'var(--color-glass-border)',
                color: 'var(--color-text)'
              }}
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleCreate}
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                color: 'var(--color-bg)',
                fontWeight: 'bold'
              }}
            >
              Crear Estacionamiento
            </Button>
          </div>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar por nombre..."
          value={searchNombre}
          onChange={(e) => setSearchNombre(e.target.value)}
          className="max-w-md"
          style={{
            backgroundColor: 'var(--color-glass)',
            borderColor: 'var(--color-glass-border)',
            color: 'var(--color-text)'
          }}
        />
      </div>

      {/* Tabla de estacionamientos */}
      <div className="border rounded-lg w-full" style={{ 
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-glass-border)',
        overflow: 'hidden'
      }}>
        <div className="scrollbar-hidden w-full">
          <Table className="w-full">
            <thead>
              <tr style={{ 
                backgroundColor: 'var(--color-prueba)',
                color: 'var(--color-accent)'
              }}>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Dirección</th>
                <th className="px-4 py-3 text-left">Fecha de Creación</th>
                <th className="px-4 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {estacionamientos.length > 0 ? (
                estacionamientos.map((estacionamiento) => (
                  <tr 
                    key={estacionamiento.id}
                    className="hover:bg-opacity-20 hover:bg-accent transition-colors duration-150"
                    style={{
                      borderBottom: '1px solid var(--color-glass-border)',
                      backgroundColor: 'var(--color-bg)'
                    }}
                  >
                    <td className="px-4 py-3 truncate max-w-xs">{estacionamiento.nombre}</td>
                    <td className="px-4 py-3 truncate">{estacionamiento.direccion}</td>
                    <td className="px-4 py-3 truncate">{formatDate(estacionamiento.createdAt)}</td>
                    <td className="px-4 py-3 flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setEditEstacionamiento(estacionamiento)}
                            className="flex items-center gap-1"
                            style={{
                              color: 'var(--color-primary)',
                              textShadow: '0 0 8px rgba(23, 67, 227, 0.5)'
                            }}
                          >
                            <Pencil className="w-4 h-4" /> Editar
                          </Button>
                        </DialogTrigger>
                        
                        {editEstacionamiento && (
                          <DialogContent 
                            style={{
                              backgroundColor: 'var(--color-bg)',
                              borderColor: 'var(--color-glass-border)',
                              boxShadow: '0 0 30px rgba(0, 247, 255, 0.2)'
                            }}
                          >
                            <DialogHeader>
                              <DialogTitle style={{ color: 'var(--color-accent)' }}>Editar Estacionamiento</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-nombre" className="text-right" style={{ color: 'var(--color-text)' }}>
                                  Nombre
                                </Label>
                                <Input
                                  id="edit-nombre"
                                  value={editEstacionamiento.nombre}
                                  onChange={(e) => setEditEstacionamiento({...editEstacionamiento, nombre: e.target.value})}
                                  className="col-span-3"
                                  style={{
                                    backgroundColor: 'var(--color-glass)',
                                    borderColor: 'var(--color-glass-border)',
                                    color: 'var(--color-text)'
                                  }}
                                />
                              </div>
                              <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="edit-direccion" className="text-right" style={{ color: 'var(--color-text)' }}>
                                  Dirección
                                </Label>
                                <Input
                                  id="edit-direccion"
                                  value={editEstacionamiento.direccion}
                                  onChange={(e) => setEditEstacionamiento({...editEstacionamiento, direccion: e.target.value})}
                                  className="col-span-3"
                                  style={{
                                    backgroundColor: 'var(--color-glass)',
                                    borderColor: 'var(--color-glass-border)',
                                    color: 'var(--color-text)'
                                  }}
                                />
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
                        onClick={() => handleDelete(estacionamiento.id)}
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
                    {searchNombre 
                      ? `No se encontraron estacionamientos con nombre que contenga "${searchNombre}"`
                      : 'No hay estacionamientos registrados'}
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}