import React, { useState } from 'react';

const ParkingManager = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [notification, setNotification] = useState(null);

  // Datos de espacios con algunos ocupados
  const availableSlots = [1, 2, 3, 4, 5, 6].map(id => ({
    id,
    status: id % 2 === 0 ? 'Libre' : 'Ocupado',
    user: id % 2 === 0 ? null : 'UsuarioEjemplo',
    userEjemplo:  'UserGeth'  

  }));

  const CarIcon = ({ color = 'var(--color-accent)' }) => (
    <svg width={50} height={25} viewBox="0 0 24 18" style={{ fill: color }}>
      <path d="M18.9 6.5c-.2-.6-.8-1-1.4-1h-11c-.7 0-1.2.4-1.4 1l-2 6v5c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-1h12v1c0 .6.4 1 1 1h1c.6 0 1-.4 1-1v-5l-2-6zm-12.4 1h11l1.3 4h-13.6l1.3-4zm-1.5 6c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5zm13 0c.8 0 1.5-.7 1.5-1.5s-.7-1.5-1.5-1.5-1.5.7-1.5 1.5.7 1.5 1.5 1.5z" />
    </svg>
  );

  const handleSlotSelect = (slot) => {
    if (slot.status === 'Ocupado') {
      setNotification({
        type: 'error',
        message: `El espacio #${slot.id} ya está ocupado por ${slot.user}`
      });
      setTimeout(() => setNotification(null), 3000);
      return;
    }
    setSelectedSlot(slot.id);
  };

  return (
    <div className="min-h-screen pt-25" style={{
      backgroundColor: 'var(--color-bg)',
      color: 'var(--color-text)',
    }}>
      {/* Notificación */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg z-50 ${notification.type === 'error'
            ? 'bg-red-500/90 text-white'
            : 'bg-green-500/90 text-white'
          }`}>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 gradient-text">
          Sistema de Reserva de Estacionamiento
        </h1>
        <p className="text-lg font-bold" style={{ color: 'var(--color-accent)' }}>
          Selecciona un espacio disponible y confirma tu reserva
        </p>
      </header>

      {/* Contenedor principal */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-screen-xl mx-auto">
        {/* Panel de selección */}
        <div className="w-full lg:w-2/5">
          <div className="bg-card-bg border border-glass-border rounded-xl p-6 h-full">
            <div className="flex items-center mb-6">
              <CarIcon className="mr-3" />
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
                      <div className="text-xs bg-green-900/30 text-green-300 px-2 py-1 rounded-full inline-block">
                        Disponible
                      </div>
                    ) : (
                      <div className="text-xs bg-red-900/30 text-red-300 px-2 py-1 rounded-full inline-block">
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
              <CarIcon className="mr-3" />
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
              <div className="bg-glass rounded-lg p-4 border border-glass-border">
                <h3 className="text-xl font-semibold mb-3">Confirmar Reserva</h3>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm opacity-80">Número:</p>
                    <p className="font-bold text-lg">#{selectedSlot}</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Solicitante:</p>
                    <p className="font-bold text-lg">
                      {availableSlots.find(s => s.id === selectedSlot)?.userEjemplo}
                    </p>
                  </div>
                </div>

                <button
                  className="w-full py-3 rounded-lg font-bold gradient-bg2 text-white hover:shadow-primary transition-all"
                  onClick={() => {
                    alert(`¡Reserva confirmada para el Espacio #${selectedSlot}!`);
                    setSelectedSlot(null);
                  }}
                >
                  CONFIRMAR RESERVA
                </button>
              </div>
            ) : (
              <div className="text-center p-4 bg-glass rounded-lg border border-glass-border">
                <CarIcon size={24} className="mx-auto mb-2" />
                <p>Ningún espacio seleccionado aún</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingManager;