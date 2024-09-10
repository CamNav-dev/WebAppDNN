import React, { useState } from "react";

export default function ContactUs() {
  const [formSubmitted, setFormSubmitted] = useState(false); // Estado para mostrar el mensaje de éxito
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    title: '',
    query: ''
  }); // Estado para manejar los valores del formulario

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes agregar la lógica para enviar el formulario

    setFormSubmitted(true); // Cambia el estado a true cuando el formulario es enviado
    setFormData({ name: '', email: '', title: '', query: '' }); // Reinicia los campos del formulario
  };

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex flex-col items-center justify-center py-20">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-4xl font-bold mt-8">Estamos aquí para ayudarte</h1>
          <p className="mt-4 text-lg">
          Todas las consultas serán respondidas dentro de un plazo de 24 a 48 horas, después de una evaluación detallada de cada caso.
          </p>
        </div>
      </section>

      <section className="flex-1 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto bg-gray-100 p-8 rounded-lg shadow">
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-900">
                  Título de consulta
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="query" className="block mb-2 text-sm font-medium text-gray-900">
                  Consulta
                </label>
                <textarea
                  id="query"
                  rows="4"
                  value={formData.query}
                  onChange={handleInputChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  maxLength="350"
                  required
                />
              </div>
              <button
                type="submit"
                className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
              >
                Enviar consulta
              </button>
            </form>
            {/* Mensaje de éxito */}
            {formSubmitted && (
              <p className="text-green-600 mt-4">¡Consulta enviada exitosamente!</p>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-blue-600 text-white py-6">
        <div className="container text-center my-3">
          <p>&copy; 2024 FraudDetect Inc. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-blue-300">Twitter</a>
            <a href="#" className="hover:text-blue-300">LinkedIn</a>
            <a href="#" className="hover:text-blue-300">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
