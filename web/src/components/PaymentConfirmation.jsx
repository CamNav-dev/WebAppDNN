import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // Importa el icono de check

export default function PaymentConfirmation() {
  const navigate = useNavigate();

  // Redirigir automáticamente al dashboard después de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 3000); // 3000 milisegundos = 3 segundos

    // Limpiar el temporizador si el componente se desmonta antes
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md text-center">
        <div className="flex justify-center items-center mb-4">
          {/* Icono de éxito */}
          <FaCheckCircle className="text-green-500" size={50} /> {/* Icono de check verde */}
        </div>
        <h2 className="text-xl font-bold mb-4">¡Pago realizado con éxito!</h2>
        <p className="text-gray-700 mb-8">
          Tu pago ha sido procesado correctamente. Redirigiéndote al dashboard...
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Redirigiendo al dashboard
        </button>
      </div>
    </div>
  );
}
