import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        style={{ backdropFilter: "blur(10px)" }}
      >
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold">Crear una cuenta</h2>
          <p className="text-gray-500">¿Eres nuevo en ...?</p>
        </div>
        <form>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="name"
            >
              Nombre
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="email"
            >
              Correo electrónico
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-bold mb-2"
              htmlFor="password"
            >
              Contraseña
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
              type="button"
            >
              Crear usuario
            </button>
          </div>
          <div className=" mt-4 text-center text-gray-500">
            ¿Ya tienes una cuenta?
            <Link to="/sign-in" className="text-orange-500 font-bold ml-4">
              Iniciar sesión
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
