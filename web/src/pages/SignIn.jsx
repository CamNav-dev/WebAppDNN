import { useSelector, useDispatch } from 'react-redux';
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (data.success === false) {
        dispatch(signInFailure(data));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error));
    }
  };

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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder=""
              required
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder=""
              required
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Iniciar Sesión'}
            </button>
          </div>
          <div className=" mt-4 text-center text-gray-500">
            ¿Todavía no tienes una cuenta?
            <Link to="/sign-up" className="text-orange-500 font-bold ml-4">
              Registrar usuario
            </Link>
          </div>
          <p className='text-red-700 mt-5'>{error ? error.message || 'Something went wrong when you tried to log in just now. Please try again later.' : ''}</p>
        </form>
      </div>
    </div>
  );
}
