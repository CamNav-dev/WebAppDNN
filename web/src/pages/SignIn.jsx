import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
  signOut,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const [errorMessages, setErrorMessages] = useState({
    email: '',
    password: '',
    general: ''
  });
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    // Limpiar el mensaje de error cuando el usuario empieza a escribir
    setErrorMessages(prev => ({
      ...prev,
      [e.target.id]: '',
      general: ''
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Resetear mensajes de error
    setErrorMessages({
      email: '',
      password: '',
      general: ''
    });

    // Validación del correo electrónico
    if (!validateEmail(formData.email)) {
      setErrorMessages(prev => ({
        ...prev,
        email: 'Por favor, ingrese un correo electrónico válido'
      }));
      return;
    }

    // Validación de la contraseña
    if (!formData.password || formData.password.length < 6) {
      setErrorMessages(prev => ({
        ...prev,
        password: 'La contraseña debe tener al menos 6 caracteres'
      }));
      return;
    }

    try {
      dispatch(signInStart());
  
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        // Manejar errores específicos del backend
        switch (data.message) {
          case 'User not found':
            setErrorMessages(prev => ({
              ...prev,
              email: 'No existe una cuenta con este correo electrónico'
            }));
            break;
          case 'Invalid password':
            setErrorMessages(prev => ({
              ...prev,
              password: 'La contraseña es incorrecta'
            }));
            break;
          default:
            setErrorMessages(prev => ({
              ...prev,
              general: 'Error al iniciar sesión. Por favor, intente nuevamente'
            }));
        }
        throw new Error(data.message);
      }
  
      dispatch(signInSuccess({
        ...data.user,
        token: data.token,
      }));
  
      localStorage.setItem('token', data.token);
      localStorage.setItem('tokenExpiration', new Date().getTime() + data.expiresIn);
      
      navigate('/dashboard');
  
    } catch (error) {
      dispatch(signInFailure({ message: error.message }));
    }
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiration = localStorage.getItem('tokenExpiration');
  
    if (token && expiration) {
      const remainingTime = parseInt(expiration) - new Date().getTime();
      if (remainingTime > 0) {
        setTimeout(() => {
          dispatch(signOut());
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          navigate('/signin');
        }, remainingTime);
      }
    } else {
      dispatch(signOut());
      navigate('/signin');
    }
  }, [dispatch, navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Iniciar Sesión</h2>
          <p className="text-gray-500">¿Ya te registraste en ...?</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Correo electrónico
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorMessages.email ? 'border-red-500' : ''
              }`}
              id="email"
              type="email"
              placeholder=""
              required
              onChange={handleChange}
            />
            {errorMessages.email && (
              <p className="text-red-500 text-xs italic mt-1">{errorMessages.email}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errorMessages.password ? 'border-red-500' : ''
              }`}
              id="password"
              type="password"
              placeholder=""
              required
              onChange={handleChange}
            />
            {errorMessages.password && (
              <p className="text-red-500 text-xs italic mt-1">{errorMessages.password}</p>
            )}
          </div>
          <div className="flex items-center justify-center">
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Iniciar Sesión'}
            </button>
          </div>
          <div className="mt-4 text-center text-gray-500">
            ¿Todavía no tienes una cuenta?
            <Link to="/signup" className="text-orange-500 font-bold ml-4">
              Registrar usuario
            </Link>
          </div>
          {errorMessages.general && (
            <p className='text-red-500 text-sm text-center mt-4'>
              {errorMessages.general}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}