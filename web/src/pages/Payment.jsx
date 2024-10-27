import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Payment() {
  const [formData, setFormData] = useState({
    creditCard: {
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardHolder: ''
    }
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams(); // Get userId from URL
  const { token } = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  const formatCardNumber = (value) => {
    return value.replace(/\s+/g, "").replace(/(\d{4})/g, "$1 ").trim();
  };

  const insertCreditCard = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      creditCard: {
        ...prevState.creditCard,
        [name]: name === "cardNumber" ? formatCardNumber(value) : value
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { cardNumber, expiryDate, cvv, cardHolder } = formData.creditCard;

    // Validaciones de campos
    const cardNumberRegex = /^\d{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^\d{3}$/;
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,}$/;

    if (!cardHolder || !cardNumber || !expiryDate || !cvv) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (
      !nameRegex.test(cardHolder) ||
      cardHolder.trim().split(" ").length < 3
    ) {
      setError("El nombre debe contener al menos un nombre y dos apellidos.");
      return;
    }

    const cleanedCardNumber = cardNumber.replace(/\s+/g, "");
    if (!cardNumberRegex.test(cleanedCardNumber)) {
      setError("El número de tarjeta debe contener 16 dígitos.");
      return;
    }

    if (!expiryDateRegex.test(expiryDate)) {
      setError("La fecha de vencimiento debe estar en formato MM/AA.");
      return;
    }

    // Validar que la tarjeta no haya vencido
    const [expMonth, expYear] = expiryDate.split("/");
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;

    if (
      parseInt(expYear, 10) < currentYear ||
      (parseInt(expYear, 10) === currentYear &&
        parseInt(expMonth, 10) < currentMonth)
    ) {
      setError("La tarjeta ha vencido.");
      return;
    }

    if (!cvvRegex.test(cvv)) {
      setError("El CVV debe ser un número de 3 dígitos.");
      return;
    }

    // Formato de fecha sin "/"
    const cleanedExpiryDate = expiryDate.replace("/", "");

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/auth/payment/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardNumber: cleanedCardNumber,
          expiryDate: cleanedExpiryDate,
          cvv,
          cardHolder,
        }),
      });
      
      const data = await res.json();
      setLoading(false);

      if (data.success === false) {
        setError("Error en el registro de la tarjeta.");
        return;
      }

      // Redirigir a la página de confirmación de pago
      navigate("/payment-confirmation");
    } catch (error) {
      setLoading(false);
      setError("Hubo un problema procesando la tarjeta. Inténtalo de nuevo.");
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
            <img
              src="https://usa.visa.com/dam/VCOM/blogs/visa-logo-white-on-blue-800x450.png"
              alt="Logo"
              className="w-12 inline-block"
            />
          </div>
          <div className="credit-card-number text-lg font-mono mb-4">
            {formData.creditCard.cardNumber || "**** **** **** ****"}
          </div>
          <div className="flex justify-between items-center">
            <div className="credit-card-holder font-mono text-sm">
              {formData.creditCard.cardHolder || "NOMBRE COMPLETO"}
            </div>
            <div className="credit-card-expiry font-mono text-sm">
              {formData.creditCard.expiryDate || "MM/AA"}
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
              name="cardHolder"
              type="text"
              placeholder="Nombre Completo"
              required
              onChange={insertCreditCard}
              value={formData.creditCard.cardHolder || ""}
            />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-2" htmlFor="cardNumber">
              Número de tarjeta
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              name="cardNumber"
              type="text"
              placeholder="1234 5678 9123 4567"
              maxLength="19"
              required
              onChange={insertCreditCard}
              value={formData.creditCard.cardNumber || ""}
            />
          </div>
          <div className="flex space-x-4">
            <div className="mb-4 w-1/2">
              <label className="block font-bold mb-2" htmlFor="expiryDate">
                Fecha de vencimiento
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="expiryDate"
                type="text"
                placeholder="MM/AA"
                required
                maxLength="5"
                onChange={insertCreditCard}
                value={formData.creditCard.expiryDate || ""}
              />
            </div>
            <div className="mb-4 w-1/2">
              <label className="block font-bold mb-2" htmlFor="cvv">
                CVV
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                name="cvv"
                type="password"
                placeholder="123"
                required
                maxLength="3"
                onChange={insertCreditCard}
                value={formData.creditCard.cvv || ""}
              />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              type="submit"
              disabled={loading}
            >
              {loading ? "Procesando..." : "Confirmar Pago"}
            </button>
          </div>
          {error && <p className="text-red-700 mt-5">{error}</p>}
        </form>
        <div className="mt-4 text-center">
          <Link to="/" className="text-blue-300 font-bold">
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}

