import React from "react";

export default function Home() {
  return (
    <div className=" flex flex-col ">
      <section className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center py-48 h-screen">
        <div className="text-center max-w-4xl px-4">
          <h1 className="text-4xl md:text-5xl font-bold mt-8 mb-8">
            La solución inteligente para un futuro financiero seguro
          </h1>
          <p className="mt-4 text-lg mb-8">
            Nuestra solución utiliza inteligencia artificial para prevenir
            fraudes financieros. Con un modelo basado en redes neuronales
            profundas, ayudamos a las empresas a proteger sus activos y
            fortalecer la confianza de sus clientes
          </p>
          <div className="mt-8 space-x-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-200 w-56">
              Comenzar
            </button>
            <button className="px-6 py-3 bg-transparent border border-white text-white rounded-full font-semibold hover:bg-blue-700 w-56">
              Contáctanos
            </button>
          </div>
        </div>
      </section>
      <section className="container mx-auto py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
          Confianza y seguridad en cada análisis
        </h2>
        <p className="text-lg text-gray-600 mb-16 px-36">
          Nuestro sistema de análisis financiero ofrece resultados precisos y
          confiables en cada evaluación. La información de tu empresa está
          protegida y respaldada por tecnología avanzada, lo que permite tomar
          decisiones con confianza
        </p>

        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-16 px-32">
          <div className="text-left pr-14">
            <div className="flex items-center mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4365/4365924.png"
                alt="Consulting icon"
                className="h-8 w-8 mr-4"
              />
              <h3 className="text-xl font-semibold">
                Consulta tus datos financieros
              </h3>
            </div>
            <p className="font-bold text-gray-700 mb-2">
              Revisa fácilmente tus informes y prevén cualquier irregularidad al
              instante
            </p>
            <p className="text-gray-600">
              Accede fácilmente a todos tus datos subiendo tus archivos a una
              plataforma que ofrece una vista clara y actualizada. Detecta
              riesgos y toma decisiones informadas con reportes automáticos
              sobre la salud financiera de tu empresa
            </p>
          </div>

          <div className="text-left pr-14">
            <div className="flex items-center mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/256/8855/8855517.png"
                alt="Reduce time icon"
                className="h-8 w-8 mr-4"
              />
              <h3 className="text-xl font-semibold">Optimiza tiempo</h3>
            </div>
            <p className="font-bold text-gray-700 mb-2">
              Ahorra tiempo en la identificación de irregularidades con análisis
              automatizados
            </p>
            <p className="text-gray-600">
              Identifica irregularidades de manera rápida y automática,
              acelerando los procesos de revisión financiera y permitiéndote
              tomar decisiones informadas en menos tiempo
            </p>
          </div>

          <div className="text-left pr-14">
            <div className="flex items-center mb-4">
              <img
                src="https://cdn-icons-png.freepik.com/512/7088/7088243.png"
                alt="Innovation icon"
                className="h-8 w-8 mr-4"
              />
              <h3 className="text-xl font-semibold">
                Utiliza herramientas innovadoras
              </h3>
            </div>
            <p className="font-bold text-gray-700 mb-2">
              Aprovecha la inteligencia artificial para anticiparte a los
              riesgos y proteger tu negocio
            </p>
            <p className="text-gray-600">
              Nuestra tecnología avanzada te permite identificar patrones y
              detectar posibles amenazas antes de que se conviertan en problemas&quot;
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Tarifas claras y accesibles para todos
          </h2>
          <p className="text-lg text-gray-300 mb-12">
            Independientemente del tamaño de su empresa, nuestro software se
            ajusta perfectamente a sus necesidades
          </p>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-sm">
              <h3 className="text-2xl font-semibold mb-4">
                Plan Pequeña Empresa
              </h3>
              <p className="text-5xl font-bold mb-4">S/.50/mes</p>
              <p className="text-lg mb-6">
                Ideal para negocios emergentes y autónomos
              </p>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300 mb-6 w-4/5">
                Comenzar
              </button>
              <ul className="text-left space-y-3">
                <li> Sube hasta 2 estados financieros cada 6 meses</li>
                <li> Acceso a reportes inmediatos semestrales</li>
                <li> Exportación limitada de reportes</li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg w-full max-w-sm transform lg:scale-105">
              <h3 className="text-2xl font-semibold mb-4">
                Plan Mediana Empresa
              </h3>
              <p className="text-5xl font-bold mb-4">S/.110/mes</p>
              <p className="text-lg mb-6">
                Perfecto para empresas en crecimiento con necesidades
                financieras más complejas.
              </p>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition duration-300 mb-6 w-4/5">
                Comenzar
              </button>
              <ul className="text-left space-y-3">
                <li>
                  Permite subir hasta 5 estados financieros cada trimestre
                </li>
                <li>
                  Reportes inmediatos para hasta 5 archivos cada trimestre
                </li>
                <li>Exportación de hasta 10 reportes</li>
              </ul>
            </div>

            <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-sm">
              <h3 className="text-2xl font-semibold mb-4">
                Plan Grande Empresa 
              </h3>
              <p className="text-5xl font-bold mb-4">S/.185/mes</p>
              <p className="text-lg mb-6">
                Diseñado para grandes corporaciones que requieren una gestión
                financiera integral.
              </p>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300 mb-6 w-4/5">
                Comenzar
              </button>
              <ul className="text-left space-y-3">
                <li>Subida ilimitada de estados financieros.</li>
                <li>Reportes inmediatos por cada archivo subido</li>
                <li>Exportación ilimitada de reportes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-14">
          La herramienta de confianza del Perú
          </h2>
          <div className="grid md:grid-cols-3 gap-8 px-12">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
              &quot; La herramienta de FraudShieldAI, nos permite optimizar tiempo
                en nuestro control de estados financieros y mantener la salud de
                nuestra empresa.&quot;
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- PECSA -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
              &quot; FraudShieldAI nos ha permitido prevenir discrepancias
                financieras y grandes pérdidas. Es una herramienta indispensable
                en nuestra gestión financiera&quot;
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Grupo Andrade -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
              &quot; El sistema es amigable y fácil de usar. Nos ha permitido
                mantener un control detallado de nuestras finanzas y tomar
                decisiones informadas.&quot;
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- GlobalT -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                &quot;La herramienta es muy intuitiva y rápida&quot;
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Agroindustria VerdeSol -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
              &quot; Reducimos los tiempos de auditoría a la mitad gracias a la
                detección automatizada de posibles irregularidades financieras
                que nos ofrece FraudShieldAI&quot;
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Banco Solar-</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
              &quot; Nuestra auditoría financiera anual fue mucho más eficiente
                gracias a las funciones automatizadas de detección de riesgos
                que ofrece FraudShieldAI. &quot;
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- SunriseTech -</p>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="bg-gray-100 py-20">
        <div className="container mx-auto px-20 my-3">
          <h2 className="text-3xl font-bold text-left mb-8 text-gray-800">
            Preguntas Frecuentes
          </h2>
          <p className="text-lg mb-12">
          Encuentra respuestas a las preguntas más comunes sobre FraudShieldAI
          y cómo puede ayudarte a mejorar la gestión financiera de tu empresa.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Cómo funciona la detección de fraude?
              </h3>
              <p className="text-justify pr-8">
                Nuestro sistema utiliza un algoritmo de inteligencia artificial y
                aprendizaje automático para analizar tus datos financieros,
                detectando patrones inusuales y posibles anomalías.
              </p>
            </div>
            <div className="">
              <h3 className="font-semibold mb-4 pr-8">
              ¿Puedo actualizar mi plan más tarde?
              </h3>
              <p className="text-justify pr-8">
                Sí, puedes actualizar o cambiar tu plan en cualquier momento
                desde la configuración de tu cuenta, ajustando así el servicio a
                las necesidades crecientes de tu empresa.
              </p>
            </div>
            <div className="">
              <h3 className="font-semibold mb-4 pr-8">
              ¿Hay una prueba gratuita disponible?
              </h3>
              <p className="text-justify pr-8">
                Sí, ofrecemos una prueba gratuita de 14 días para que puedas
                explorar las capacidades de FraudShieldAI y experimentar cómo
                puede transformar tu gestión financiera.
              </p>
            </div>
            <div className="s">
              <h3 className="font-semibold mb-4 pr-8">
              ¿FraudShieldAI cumple con las normativas locales?
              </h3>
              <p className="text-justify pr-8">
                Sí, nuestra plataforma está diseñada para cumplir con todas las
                normativas locales e internacionales de seguridad y gestión
                financiera, asegurando un servicio conforme a la ley.
              </p>
            </div>
            <div className="s">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Qué tan segura permanece mi información financiera?
              </h3>
              <p className="text-justify pr-8">
                Utilizamos los más altos estándares de seguridad y cifrado de
                última generación para garantizar que tus datos financieros
                estén completamente protegidos.
              </p>
            </div>
            <div className="s">
              <h3 className="font-semibold mb-4 pr-8">¿Cómo se maneja la información una vez cargada en la plataforma?
              </h3>
              <p className="text-justify pr-8">
                Una vez que subes tus archivos a FraudShieldAI, nuestro
                algoritmo procesa y analiza los datos de forma segura. Solo
                tú tendrás acceso a los reportes generados, y puedes eliminarlos
                en cualquier momento.
              </p>
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
  );
}