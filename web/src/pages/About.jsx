import React from 'react'

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
  <section className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 py-20 text-white">
    <div className="container mx-auto text-center">
      <h2 className="text-4xl font-bold text-white mb-12 tracking-wide">
        Conoce a nuestro equipo
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
        {/* Cuadro Misión */}
        <div className="p-8 bg-white text-gray-800 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4">Nuestra Misión</h3>
          <p className="text-xl leading-relaxed">
            Somos estudiantes apasionadas por el desarrollo tecnológico y el impacto que este puede generar en nuestra comunidad. Nuestra misión es llevar soluciones avanzadas a las empresas peruanas y contribuir con el crecimiento económico del país a través de la innovación tecnológica.
          </p>
        </div>
        {/* Cuadro Visión */}
        <div className="p-8 bg-white text-gray-800 rounded-lg shadow-lg">
          <h3 className="text-3xl font-bold mb-4">Nuestra Visión</h3>
          <p className="text-xl leading-relaxed">
            Nuestra visión es convertirnos en líderes en el desarrollo de herramientas tecnológicas que transformen la manera en que las empresas gestionan sus finanzas, ayudando a prevenir fraudes y garantizar la transparencia.
          </p>
        </div>
      </div>
    </div>
  </section>

  <section className="py-20 bg-white">
    <div className="container mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 tracking-wide">
          Nuestro equipo
        </h3>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-12">
        {/* Perfil Camilla Navinta */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-xs transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
          <img
            className="w-full h-60 object-cover filter brightness-90 hover:brightness-100 transition duration-300"
            src="https://media.licdn.com/dms/image/v2/D4E03AQFBb4u8tNXYcA/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1702960242055?e=1730937600&v=beta&t=_YcquQz3QkNwKxTAVqQJXMIVX7e4gnOllWQYklREXaI"
            alt="Camilla Navinta"
          />
          <div className="p-6">
            <h4 className="font-bold text-xl text-gray-800 mb-4 tracking-tight">Camilla Navinta</h4>
            <p className="text-gray-600 leading-relaxed">
              Estudiante de Ingeniería de Sistemas en la Universidad Peruana de Ciencias Aplicadas y participante en el programa de doble titulación con The University of Arizona. Apasionada por el análisis de datos y la tecnología, con experiencia en recopilación, procesamiento y análisis de datos. Liderazgo y organización son sus mayores fortalezas.
            </p>
          </div>
          <div className="px-6 pt-4 pb-6 flex flex-wrap justify-center space-x-2">
          <span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Co-fundadora</span>
          <span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Frontend & Backend developer</span>
          </div>
        </div>

        {/* Perfil Delia Vasquez */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-xs transform hover:scale-105 transition-transform duration-300 hover:shadow-2xl">
          <img
            className="w-full h-60 object-cover filter brightness-90 hover:brightness-100 transition duration-300"
            src="https://media.licdn.com/dms/image/v2/D4E03AQGxjC0RuSp5tw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1713805983779?e=1730937600&v=beta&t=XuT4SgDnIsK3I7inePf76pMBYfWsRnGBubEO_5c22Pw"
            alt="Delia Vasquez"
          />
          <div className="p-6">
            <h4 className="font-bold text-xl text-gray-800 mb-4 tracking-tight">Delia Vasquez</h4>
            <p className="text-gray-600 leading-relaxed">
              Estudiante de Ingeniería de Sistemas en la Universidad Peruana de Ciencias Aplicadas y participante en el programa de doble titulación con The University of Arizona. Con gran interés en el uso y desarrollo de la tecnología y su impacto en la sociedad. Experta en organización de equipos y desarrollo de soluciones para empresas.
            </p>
          </div>
          <div className="px-6 pt-4 pb-6 flex flex-wrap justify-center space-x-2">
          <span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Co-fundadora</span>
          <span className="inline-block bg-blue-600 rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2">Project manager & Model developer</span>
          </div>
        </div>
      </div>
    </div>
  </section>
  <footer className="bg-blue-600 text-white py-6">
        <div className="container text-center my-3">
          <p>&copy; 2024 FraudDetect Inc. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:text-blue-300">
              Twitter
            </a>
            <a href="#" className="hover:text-blue-300">
              LinkedIn
            </a>
            <a href="#" className="hover:text-blue-300">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
