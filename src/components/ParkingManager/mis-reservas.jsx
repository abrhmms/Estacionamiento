import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const MisReservas = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar y sincronizar reservas
  useEffect(() => {
    const loadReservations = () => {
      try {
        const savedReservations = localStorage.getItem('parkingReservations');
        if (savedReservations) {
          const parsed = JSON.parse(savedReservations);
          setReservations(parsed);
        }
      } catch (error) {
        console.error("Error al cargar reservas:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReservations();

    // Escuchar cambios en localStorage
    const handleStorageChange = () => loadReservations();
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filtrar reservas del usuario actual
  const userReservations = reservations.filter(
    reservation => reservation.user === (user?.username || 'Invitado')
  );

  // Calcular tiempo transcurrido
  const calculateElapsedTime = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffMs = now - start;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} hora${hours !== 1 ? 's' : ''}${mins > 0 ? ` y ${mins} minuto${mins !== 1 ? 's' : ''}` : ''}`;
  };

  // Calcular total a pagar
  const calculateTotalToPay = (startTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const diffHours = (now - start) / (1000 * 60 * 60);
    return (Math.ceil(diffHours) * 2.50).toFixed(2);
  };

  // Manejar pago de reserva
  const handlePayment = (reservationId) => {
    const updatedReservations = reservations.map(reservation =>
      reservation.id === reservationId
        ? { ...reservation, status: 'paid', paymentMethod: 'Efectivo' }
        : reservation
    );

    setReservations(updatedReservations);
    localStorage.setItem('parkingReservations', JSON.stringify(updatedReservations));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mt-4 text-lg">Cargando tus reservas...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] text-[var(--color-text)]">
        <div className="h-screen overflow-y-auto scrollbar-hidden pt-28 pb-8">
          <header className="text-center mb-8 px-4">
            <h1 className="text-4xl font-bold mb-2 gradient-text">
              Mis Reservas
            </h1>
            <p className="text-lg font-bold text-[var(--color-accent)]">
              {userReservations.length > 0
                ? `Reservas de ${user?.username || 'Invitado'}`
                : "No tienes reservas activas"}
            </p>
          </header>

          <div className="max-w-screen-md mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Historial de Reservas</h2>
              <button
                onClick={() => navigate('/ParkingManager')}
                className="px-4 py-2 rounded-lg border border-glass-border hover:bg-glass transition-colors"
              >
                Nueva Reserva
              </button>
            </div>

            {userReservations.length === 0 ? (
              <div className="text-center p-8 bg-glass rounded-xl border border-glass-border">
                <h3 className="text-xl font-semibold mb-2">No tienes reservas activas</h3>
                <p className="opacity-80 mb-4">Realiza una nueva reserva para comenzar</p>
                <button
                  onClick={() => navigate('/ParkingManager')}
                  className="px-6 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors"
                >
                  Buscar Espacio
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userReservations.map((reservation) => (
                  <div key={reservation.id} className="bg-glass rounded-xl p-6 border border-glass-border hover:shadow-md transition-shadow">
                    <div className="flex items-start mb-4">
                      <div className="flex-grow">
                        <h3 className="text-xl font-semibold">Espacio #{reservation.slotId}</h3>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <ReservationDetail label="Hora de entrada" value={reservation.entryTime} />
                          <ReservationDetail
                            label="Tiempo transcurrido"
                            value={calculateElapsedTime(reservation.confirmedAt)}
                          />
                          <ReservationDetail
                            label="Estado"
                            value={reservation.status === 'paid' ? 'Pagado' : 'Activo'}
                            highlight={reservation.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}
                          />
                          <ReservationDetail
                            label="Total a pagar"
                            value={`$${calculateTotalToPay(reservation.confirmedAt)}`}
                            highlight="font-bold text-accent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-glass-border pt-4">
                      <button
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setIsModalOpen(true);
                        }}
                        className="flex-1 py-2 rounded-lg border border-glass-border hover:bg-glass transition-colors"
                      >
                        Ver detalles
                      </button>
                      {reservation.status === 'active' && (
                        <button
                          onClick={() => handlePayment(reservation.id)}
                          className="flex-1 py-2 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors"
                        >
                          Pagar ahora
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de detalles */}
      {isModalOpen && selectedReservation && (
  <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
    <div 
      className="bg-[var(--color-card-bg)] backdrop-blur-lg border border-[var(--color-glass-border)] rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      style={{
        boxShadow: '0 0 20px rgba(0, 247, 255, 0.2)'
      }}
    >
      {/* Encabezado del Modal */}
      <div className="flex justify-between items-center mb-6 border-b border-[var(--color-glass-border)] pb-4">
        <h3 className="text-xl font-bold text-[var(--color-accent)]">Detalles de Reserva</h3>
        <button 
          onClick={() => setIsModalOpen(false)}
          className="text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {/* Cuerpo del Modal */}
      <div className="space-y-4">
        <DetailItem 
          label="Espacio" 
          value={`#${selectedReservation.slotId}`} 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
        />
        <DetailItem 
          label="Usuario" 
          value={selectedReservation.user} 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>}
        />
        <DetailItem 
          label="Vehículo" 
          value={selectedReservation.vehicle} 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>}
        />
        <DetailItem 
          label="Hora de entrada" 
          value={selectedReservation.entryTime} 
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <DetailItem 
          label="Tiempo transcurrido" 
          value={calculateElapsedTime(selectedReservation.confirmedAt)}
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <DetailItem 
          label="Estado" 
          value={selectedReservation.status === 'paid' ? 'Pagado' : 'Activo'}
          highlight={selectedReservation.status === 'paid' ? 'text-green-400' : 'text-[var(--color-accent)]'}
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
        <DetailItem 
          label="Total a pagar" 
          value={`$${calculateTotalToPay(selectedReservation.confirmedAt)}`}
          highlight="font-bold text-[var(--color-accent)]"
          icon={<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
        />
      </div>
      
      {/* Pie del Modal */}
      <div className="mt-8 flex justify-end space-x-3 border-t border-[var(--color-glass-border)] pt-4">
        <button
          onClick={() => setIsModalOpen(false)}
          className="px-4 py-2 rounded-lg border border-[var(--color-glass-border)] hover:bg-[var(--color-glass)] text-[var(--color-text)] transition-colors"
        >
          Cerrar
        </button>
        {selectedReservation.status === 'active' && (
          <button
            onClick={() => {
              handlePayment(selectedReservation.id);
              setIsModalOpen(false);
            }}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-white font-medium transition-colors"
          >
            Pagar ahora
          </button>
        )}
      </div>
    </div>
  </div>
)}
    </>
  );
};

// Componente auxiliar para mostrar detalles de reserva en la lista
const ReservationDetail = ({ label, value, highlight = '' }) => (
  <div>
    <p className="text-sm opacity-80">{label}:</p>
    <p className={`font-medium ${highlight}`}>{value}</p>
  </div>
);

// Componente auxiliar para mostrar detalles en el modal
const DetailItem = ({ label, value, highlight = '', icon = null }) => (
  <div className="flex items-center p-3 rounded-lg bg-[var(--color-glass)] border border-[var(--color-glass-border)]">
    {icon && (
      <div className="text-[var(--color-accent)] mr-3">
        {icon}
      </div>
    )}
    <div className="flex-grow">
      <p className="text-sm text-[var(--color-text)] opacity-80">{label}</p>
      <p className={`mt-1 ${highlight || 'text-[var(--color-text)]'}`}>
        {value}
      </p>
    </div>
  </div>
);

export default MisReservas;