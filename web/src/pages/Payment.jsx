import React, { useState, useEffect } from "react";
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
export default function Payment() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams(); // Get userId from URL
  const { token } = useSelector((state) => state.user.currentUser);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/signin');
    }
  }, [currentUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cardNumber, expiryDate, cvv, cardHolder } = formData;
    if (!cardNumber || !expiryDate || !cvv || !cardHolder) {
      setError('All fields are required.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/auth/payment/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError('Error in card registration.');
        return;
      }

      // Redirigir a la página de confirmación de pago
      navigate('/payment-confirmation');
    } catch (error) {
      setLoading(false);
      setError('There was a problem processing the card. Please try again.');
    }
};


  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className="bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 w-full max-w-md relative overflow-hidden"
        style={{
          borderRadius: "15px",
          backgroundImage: "linear-gradient(135deg, #00c6ff 10%, #0072ff 100%)",
          color: "white",
        }}
      >
        {/* Tarjeta de crédito visual */}
        <div className="credit-card p-4 rounded-lg shadow-md mb-4">
          <div className="credit-card-logo text-right mb-4">
            {/* Logo de la tarjeta */}
            <img
              src="https://usa.visa.com/dam/VCOM/blogs/visa-logo-white-on-blue-800x450.png"
              alt="Logo"
              className="w-12 inline-block"
            />
          </div>
          <div className="credit-card-number text-lg font-mono mb-4">
            {formData.cardNumber || "**** **** **** ****"}
          </div>
          <div className="flex justify-between items-center">
            <div className="credit-card-holder font-mono text-sm">
              {formData.cardHolder || "NOMBRE COMPLETO"}
            </div>
            <div className="credit-card-expiry font-mono text-sm">
              {formData.expiryDate || "MM/AA"}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-2" htmlFor="cardHolder">
              Nombre en la tarjeta
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cardHolder"
              type="text"
              placeholder="Nombre Completo"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2" htmlFor="cardNumber">
              Número de tarjeta
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9123 4567"
              required
              onChange={handleChange}
            />
          </div>
          <div className="flex space-x-4">
            <div className="mb-4 w-1/2">
              <label className="block font-bold mb-2" htmlFor="expiryDate">
                Fecha de vencimiento
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="expiryDate"
                type="text"
                placeholder="MM/AA"
                required
                onChange={handleChange}
              />
            </div>
            <div className="mb-4 w-1/2">
              <label className="block font-bold mb-2" htmlFor="cvv">
                CVV
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="cvv"
                type="password"
                placeholder="123"
                required
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Pago'}
            </button>
          </div>
          {error && <p className='text-red-700 mt-5'>{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-300 font-bold">Cancelar</Link>
        </div>
      </div>
    </div>
  );
}
