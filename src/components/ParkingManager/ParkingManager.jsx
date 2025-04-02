import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../AuthContext';

const ParkingManager = () => {
  // Estados principales
  const [view, setView] = useState('selection');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [notification, setNotification] = useState(null);
  const [currentTime] = useState(new Date());
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(60);
  const [vehicleDetected, setVehicleDetected] = useState(false);

  // Hooks de navegación y parámetros
  const navigate = useNavigate();
  const { id: reservationIdFromUrl } = useParams();
  const { user } = useAuth();

  // Datos de espacios de estacionamiento (temporales)
  const availableSlots = [1, 2, 3, 4, 5, 6].map(id => ({
    id,
    status: id % 2 === 0 ? 'Libre' : 'Ocupado',
    user: id % 2 === 0 ? null : `Usuario${id}`
  }));

  // Efecto para simular carga de reservas
  useEffect(() => {
    // Datos temporales de ejemplo
    const tempReservations = [
      {
        id: 1,
        slotId: 2,
        entryTime: '10:00',
        user: user?.username || 'Invitado',
        confirmedAt: new Date(),
        status: 'active',
        vehicle: 'ABC-1234',
        paymentMethod: 'Pendiente',
        estimatedTime: 120
      }
    ];
    setReservations(tempReservations);

    if (reservationIdFromUrl) {
      const found = tempReservations.find(r => r.id === parseInt(reservationIdFromUrl));
      if (found) {
        setSelectedReservation(found);
        setView('reservation-details');
      }
    }
  }, [reservationIdFromUrl, user]);

  // Componente de icono de auto
  const CarIcon = ({ color = 'var(--color-accent)', size = 50 }) => (
    <svg width={size} height={size / 2} viewBox="0 0 24 18" style={{ fill: color }}>
      <path d="M18.9 6.5c-.2-.6-.8-1-1.4-1h-11c-.7 0-1.2.4-1.4 1l-2 6v5c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-5l-2-6zm-12.4 1h11l1.3 4h-13.6l1.3-4zm-1.5 6c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm13 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z" />
    </svg>
  );

  // Funciones de utilidad
  const calculateElapsedTime = (startTime) => {
    const now = currentTime;
    const start = new Date(startTime);
    const diffMs = now - start;
    const diffMins = Math.round(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours} hora${hours !== 1 ? 's' : ''}${mins > 0 ? ` y ${mins} minuto${mins !== 1 ? 's' : ''}` : ''}`;
  };

  const calculateTotalToPay = (startTime) => {
    const now = currentTime;
    const start = new Date(startTime);
    const diffHours = (now - start) / (1000 * 60 * 60);
    return (Math.ceil(diffHours) * 2.50).toFixed(2);
  };

  // Manejadores de eventos
  const handleSlotSelect = (slot) => {
    if (slot.status === 'Ocupado') {
      setNotification({
        type: 'error',
        message: `El espacio #${slot.id} ya está ocupado por ${slot.user}`
      });
      return;
    }
    setSelectedSlot(slot.id);
  };

  const handleReservationSubmit = (e) => {
    e.preventDefault();
    const entryTime = e.target.entryTime.value;

    if (!entryTime) {
      setNotification({
        type: 'error',
        message: 'Por favor selecciona una hora de entrada'
      });
      return;
    }

    const newReservation = {
      id: Date.now(),
      slotId: selectedSlot,
      entryTime,
      user: user?.username || 'Invitado',
      confirmedAt: new Date(),
      status: 'active',
      vehicle: 'ABC-1234',
      paymentMethod: 'Pendiente',
      notes: '',
      estimatedTime: estimatedTime
    };

    setReservations([...reservations, newReservation]);
    setSelectedReservation(newReservation);
    navigate(`/reserva/${newReservation.id}`);

    setNotification({
      type: 'success',
      message: `¡Reserva confirmada para el Espacio #${selectedSlot}!`
    });
  };

  const handlePayment = (reservationId, method = 'Efectivo') => {
    setReservations(reservations.map(r =>
      r.id === reservationId ? { ...r, status: 'paid', paymentMethod: method } : r
    ));
    setNotification({
      type: 'success',
      message: `Pago realizado con éxito (${method})`
    });
  };

  const handleCancelReservation = (reservationId) => {
    setReservations(reservations.filter(r => r.id !== reservationId));
    navigate('/mis-reservas');
    setNotification({
      type: 'success',
      message: 'Reserva cancelada con éxito'
    });
  };

  const handleExtendTime = (reservationId, additionalMinutes) => {
    setReservations(reservations.map(r =>
      r.id === reservationId ? { ...r, estimatedTime: r.estimatedTime + additionalMinutes } : r
    ));
    setNotification({
      type: 'success',
      message: `Tiempo extendido ${additionalMinutes} minutos`
    });
  };

  // Componentes de vista
  const SelectionView = () => (
    <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto px-4">
      {/* Panel de selección */}
      <div className="w-full lg:w-2/5">
        <div className="bg-card-bg border border-glass-border rounded-xl p-6 h-full">
          <div className="flex items-center mb-6">
            <CarIcon size={40} className="mr-3" />
            <h2 className="text-2xl font-semibold">Espacios Disponibles</h2>
          </div>

          <div className="space-y-4">
            {availableSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotSelect(slot)}
                className={`w-full p-4 rounded-lg transition-all flex justify-between items-center ${selectedSlot === slot.id
                  ? 'bg-accent bg-opacity-20 border-2 border-accent'
                  : slot.status === 'Ocupado'
                    ? 'bg-red-500/10 border border-red-500/30 cursor-not-allowed'
                    : 'bg-glass hover:bg-opacity-70 border border-glass-border'
                  }`}
                disabled={slot.status === 'Ocupado'}
              >
                <div className="text-left">
                  <div className="font-bold text-lg">Espacio #{slot.id}</div>
                  <div className={`text-sm ${slot.status === 'Ocupado' ? 'text-red-400' : 'opacity-80'
                    }`}>
                    Estado: {slot.status}
                    {slot.status === 'Ocupado' && ` por ${slot.user}`}
                  </div>
                </div>
                <div className="text-right">
                  {slot.status === 'Libre' ? (
                    <div className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded-full">
                      Disponible
                    </div>
                  ) : (
                    <div className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full">
                      Ocupado
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Área de visualización */}
      <div className="w-full lg:w-3/5">
        <div className="bg-card-bg border border-glass-border rounded-xl p-6 h-full">
          <h2 className="text-2xl font-semibold mb-6 flex items-center">
            <CarIcon size={40} className="mr-3" />
            {selectedSlot ? `Reservando Espacio #${selectedSlot}` : "Información del Espacio"}
          </h2>

          {/* Mapa del estacionamiento */}
          <div className="relative bg-prueba rounded-lg h-60 w-full overflow-hidden mb-6">
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <div className="grid grid-cols-3 gap-x-3 gap-y-15 w-full">
                {availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`h-16 w-full rounded flex items-center justify-center transition-all ${selectedSlot === slot.id
                      ? 'bg-accent bg-opacity-30 border-2 border-accent'
                      : slot.status === 'Ocupado'
                        ? 'bg-red-500/10 border border-red-500/30'
                        : 'bg-glass border border-glass-border'
                      }`}
                  >
                    {selectedSlot === slot.id ? (
                      <div className="flex flex-col items-center">
                        <CarIcon size={24} />
                        <span className="text-xs mt-1">#{slot.id}</span>
                      </div>
                    ) : (
                      <span className={`text-xs ${slot.status === 'Ocupado' ? 'text-red-400' : 'opacity-70'
                        }`}>
                        #{slot.id}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {!selectedSlot && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                <div className="text-center p-4">
                  <CarIcon size={40} className="mx-auto mb-3" />
                  <p className="text-lg font-medium">Selecciona un espacio disponible</p>
                  <p className="text-sm opacity-80 mt-1">de la lista a la izquierda</p>
                </div>
              </div>
            )}
          </div>

          {/* Panel de confirmación */}
          {selectedSlot ? (
            <form onSubmit={handleReservationSubmit} className="bg-glass rounded-lg p-4 border border-glass-border">
              <h3 className="text-xl font-semibold mb-3">Confirmar Reserva</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm opacity-80">Número:</p>
                  <p className="font-bold text-lg">#{selectedSlot}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Solicitante:</p>
                  <p className="font-bold text-lg">
                    {user?.username || 'Invitado'}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm opacity-80 mb-2">Hora de entrada:</label>
                <input
                  type="time"
                  name="entryTime"
                  className="w-full p-2 rounded-lg bg-card-bg border border-glass-border"
                  min="08:00"
                  max="20:00"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm opacity-80 mb-2">Tiempo estimado (minutos):</label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(parseInt(e.target.value) || 60)}
                  className="w-full p-2 rounded-lg bg-card-bg border border-glass-border"
                  min="15"
                  max="240"
                  step="15"
                />
              </div>

              <button
                type="button"
                className="w-full py-3 rounded-lg font-bold gradient-bg2 text-white hover:shadow-primary transition-all"
                onClick={() => {
                  const form = document.querySelector('form');
                  const entryTime = form?.entryTime?.value;

                  if (!entryTime) {
                    setNotification({
                      type: 'error',
                      message: 'Por favor selecciona una hora de entrada'
                    });
                    return;
                  }

                  const newReservation = {
                    id: Date.now(),
                    slotId: selectedSlot,
                    entryTime,
                    user: user?.username || 'Invitado', // Usar el usuario del contexto
                    confirmedAt: new Date(),
                    status: 'active',
                    vehicle: 'ABC-1234',
                    paymentMethod: 'Pendiente',
                    notes: '',
                    estimatedTime: estimatedTime
                  };

                  // Actualizar estado local
                  const updatedReservations = [...reservations, newReservation];
                  setReservations(updatedReservations);

                  // Guardar en localStorage
                  localStorage.setItem('parkingReservations', JSON.stringify(updatedReservations));

                  // Mostrar notificación
                  setNotification({
                    type: 'success',
                    message: `¡Reserva confirmada para el Espacio #${selectedSlot}!`
                  });

                  // Redirigir después de 500ms (para mejor UX)
                  setTimeout(() => {
                    navigate('/mis-reservas');
                  }, 500);
                }}
              >
                CONFIRMAR RESERVA
              </button>
            </form>
          ) : (
            <div className="text-center p-4 bg-glass rounded-lg border border-glass-border">
              <CarIcon size={24} className="mx-auto mb-2" />
              <p>Ningún espacio seleccionado aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ReservationsView = () => (
    <div className="max-w-screen-md mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold gradient-text">Mis Reservas</h1>
        <button
          onClick={() => setView('selection')}
          className="px-4 py-2 rounded-lg border border-glass-border hover:bg-glass"
        >
          Nueva Reserva
        </button>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center p-8 bg-glass rounded-xl border border-glass-border">
          <CarIcon size={60} className="mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No tienes reservas activas</h3>
          <p className="opacity-80 mb-4">Realiza una nueva reserva para comenzar</p>
          <button
            onClick={() => setView('selection')}
            className="px-6 py-2 rounded-lg bg-accent text-white font-medium"
          >
            Buscar Espacio
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="bg-glass rounded-xl p-6 border border-glass-border">
              <div className="flex items-start mb-4">
                <CarIcon size={40} className="mr-4 flex-shrink-0" />
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold">Espacio #{reservation.slotId}</h3>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-sm opacity-80">Hora de entrada:</p>
                      <p className="font-medium">{reservation.entryTime}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Tiempo transcurrido:</p>
                      <p className="font-medium">{calculateElapsedTime(reservation.confirmedAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Estado:</p>
                      <p className="font-medium capitalize">{reservation.status}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-80">Total a pagar:</p>
                      <p className="font-bold text-accent">${calculateTotalToPay(reservation.confirmedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 border-t border-glass-border pt-4">
                <button
                  onClick={() => {
                    setSelectedReservation(reservation);
                    setView('reservation-details');
                  }}
                  className="flex-1 py-2 rounded-lg border border-glass-border hover:bg-glass"
                >
                  Ver detalles
                </button>
                {reservation.status === 'active' && (
                  <button
                    onClick={() => handlePayment(reservation.id)}
                    className="flex-1 py-2 rounded-lg bg-accent text-white font-medium"
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
  );

  const ReservationDetailsView = ({ reservation }) => {
    const elapsedMinutes = (currentTime - new Date(reservation.confirmedAt)) / (1000 * 60);
    const remainingTime = reservation.estimatedTime - elapsedMinutes;

    return (
      <div className="max-w-screen-md mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold gradient-text">Detalles de Reserva</h1>
          <button
            onClick={() => setView('reservations')}
            className="px-4 py-2 rounded-lg border border-glass-border hover:bg-glass"
          >
            Volver
          </button>
        </div>

        <div className="bg-glass rounded-xl p-6 border border-glass-border">
          <div className="flex items-start mb-6">
            <CarIcon size={60} className="mr-6 flex-shrink-0" />
            <div className="flex-grow">
              <h2 className="text-2xl font-bold mb-2">Espacio #{reservation.slotId}</h2>
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <p className="text-sm opacity-80">Usuario:</p>
                  <p className="font-medium">{reservation.user}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Hora de llegada:</p>
                  <p className="font-medium">{reservation.entryTime}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Fecha reserva:</p>
                  <p className="font-medium">{new Date(reservation.confirmedAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Tiempo transcurrido:</p>
                  <p className="font-medium">{calculateElapsedTime(reservation.confirmedAt)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Tiempo restante:</p>
                  <p className={`font-medium ${remainingTime <= 15 ? 'text-yellow-500' :
                    remainingTime <= 0 ? 'text-red-500' : 'text-green-500'
                    }`}>
                    {remainingTime > 0 ? `${Math.ceil(remainingTime)} min` : 'Tiempo terminado'}
                  </p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Estado:</p>
                  <p className="font-medium capitalize">{reservation.status}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Total a pagar:</p>
                  <p className="font-bold text-accent">${calculateTotalToPay(reservation.confirmedAt)}</p>
                </div>
                <div>
                  <p className="text-sm opacity-80">Vehículo detectado:</p>
                  <p className={`font-medium ${vehicleDetected ? 'text-green-500' : 'text-yellow-500'
                    }`}>
                    {vehicleDetected ? 'Sí' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-glass-border pt-4">
            <h3 className="text-lg font-semibold mb-3">Opciones</h3>

            {reservation.status === 'active' && (
              <div className="space-y-3">
                {!vehicleDetected && (
                  <button
                    onClick={() => handleCancelReservation(reservation.id)}
                    className="w-full py-3 rounded-lg bg-red-500/10 text-red-500 border border-red-500/30 font-medium"
                  >
                    Cancelar Reserva
                  </button>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => handleExtendTime(reservation.id, 30)}
                    className="py-2 rounded-lg border border-glass-border hover:bg-glass"
                  >
                    +30 min
                  </button>
                  <button
                    onClick={() => handleExtendTime(reservation.id, 60)}
                    className="py-2 rounded-lg border border-glass-border hover:bg-glass"
                  >
                    +1 hora
                  </button>
                  <button
                    onClick={() => handleExtendTime(reservation.id, 120)}
                    className="py-2 rounded-lg border border-glass-border hover:bg-glass"
                  >
                    +2 horas
                  </button>
                </div>

                <button
                  onClick={() => handlePayment(reservation.id, 'PayPal')}
                  className="w-full py-3 rounded-lg bg-blue-500 text-white font-medium flex items-center justify-center"
                >
                  <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M7.3 17.9h2.6c2.5 0 3.9-1.4 4.3-3.9c.2-1.2.3-2.4.3-3.6c0-1.1-.1-2.1-.4-3c-.5-1.6-1.7-2.4-3.5-2.4H7.3v15.9zm0-18H12c3.3 0 5.7 1.5 6.5 4.5c.5 1.7.5 3.5.2 5.4c-.5 3.2-2.7 5.1-6.1 5.1H7.3V22H3V2h4.3v-.1z" />
                  </svg>
                  Pagar con PayPal
                </button>
              </div>
            )}

            {reservation.status === 'paid' && (
              <div className="text-center py-4">
                <p className="text-green-500 font-medium mb-2">¡Pago realizado con éxito!</p>
                <p className="text-sm opacity-80">Método: {reservation.paymentMethod}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render principal
  return (
    <div className="relative min-h-screen overflow-hidden" style={{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      <div className="h-screen overflow-y-auto scrollbar-hidden pt-28 pb-8">
        {notification && (
          <div className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${notification.type === 'error' ? 'bg-red-500/90' :
            notification.type === 'warning' ? 'bg-yellow-500/90' : 'bg-green-500/90'
            } text-white`}>
            {notification.message}
            <button onClick={() => setNotification(null)} className="ml-4">✕</button>
          </div>
        )}

        <header className="text-center mb-8 px-4">
          <h1 className="text-4xl font-bold mb-2 gradient-text">
            Sistema de Reserva de Estacionamiento
          </h1>
          <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
            {view === 'selection'
              ? "Selecciona un espacio disponible y confirma tu reserva"
              : view === 'reservations'
                ? `Reservas de ${user?.username || 'Invitado'}`
                : "Detalles de tu reserva"}
          </p>
        </header>

        {view === 'selection' && <SelectionView />}
        {view === 'reservations' && <ReservationsView />}
        {view === 'reservation-details' && selectedReservation && (
          <ReservationDetailsView reservation={selectedReservation} />
        )}
      </div>
    </div>
  );
};

export default ParkingManager;