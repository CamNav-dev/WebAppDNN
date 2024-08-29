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
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Itaque,
            sit magni distinctio corrupti minus illo molestias et? Eaque
            sapiente rerum exercitationem minus harum odit recusandae fugiat
            veritatis debitis expedita. Quae.
          </p>
          <div className="mt-8 space-x-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-200 w-56">
              Get Started
            </button>
            <button className="px-6 py-3 bg-transparent border border-white text-white rounded-full font-semibold hover:bg-blue-700 w-56">
              Watch Video
            </button>
          </div>
        </div>
      </section>
      <section className="container mx-auto py-24 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">
        Confianza y seguridad en cada análisis
        </h2>
        <p className="text-lg text-gray-600 mb-16 px-36">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Pariatur possimus molestias eaque nisi voluptate adipisci error. Eligendi eos eaque porro atque, suscipit odio dolorum facere! Excepturi maxime asperiores porro libero.
        </p>

        <div className="flex flex-col md:flex-row md:justify-between gap-8 mb-16 px-32">
          <div className="text-left pr-14">
            <div className="flex items-center mb-4">
              <img
                src="/path-to-icon"
                alt="Reporting icon"
                className="h-8 w-8 mr-4"
              />
              <h3 className="text-xl font-semibold">Reporting</h3>
            </div>
            <p className="font-bold text-gray-700 mb-2">
              Stay on top of things with always up-to-date reporting features.
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, numquam. Accusantium excepturi quas dolor culpa. At repellat fugit architecto quas doloribus laboriosam dolor minus recusandae? Est inventore molestiae accusamus quidem.
            </p>
          </div>

          <div className="text-left pr-14">
            <div className="flex items-center mb-4">
              <img
                src="/path-to-icon"
                alt="Inventory icon"
                className="h-8 w-8 mr-4"
              />
              <h3 className="text-xl font-semibold">Inventory</h3>
            </div>
            <p className="font-bold text-gray-700 mb-2">
              Never lose track of what's in stock with accurate inventory
              tracking.
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio, itaque porro sed repudiandae dolore aliquid aperiam illum modi incidunt omnis officia magni similique quas excepturi vel sunt nemo temporibus explicabo!
            </p>
          </div>

          <div className="text-left pr-14">
            <div className="flex items-center mb-4">
              <img
                src="/path-to-icon"
                alt="Contacts icon"
                className="h-8 w-8 mr-4"
              />
              <h3 className="text-xl font-semibold">Contacts</h3>
            </div>
            <p className="font-bold text-gray-700 mb-2">
              Organize all of your contacts, service providers, and invoices in
              one place.
            </p>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur sunt laboriosam dolores autem. Dolores, quod molestias! Modi pariatur quisquam eveniet, delectus excepturi repellat officia velit labore! Vel accusamus expedita incidunt?
            </p>
          </div>
        </div>

        
      </section>

      <section id="pricing" className="bg-gray-900 py-20 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-4">
            Simple pricing, for everyone.
          </h2>
          <p className="text-lg text-gray-300 mb-12">
            It doesn't matter what size your business is, our software won't
            work well for you.
          </p>
          <div className="flex flex-col lg:flex-row justify-center items-center gap-8">
            <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-sm">
              <h3 className="text-2xl font-semibold mb-4">Starter</h3>
              <p className="text-5xl font-bold mb-4">$9</p>
              <p className="text-lg mb-6">
                Good for anyone who is self-employed
              </p>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300 mb-6 w-4/5">
                Get started
              </button>
              <ul className="text-left space-y-3">
                <li> Send 10 quotes and invoices</li>
                <li>Connect up to 2 bank accounts</li>
                <li>Track up to 15 expenses per month</li>
                <li>Manual payroll support</li>
                <li>Export up to 3 reports</li>
              </ul>
            </div>

            <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg w-full max-w-sm transform lg:scale-105">
              <h3 className="text-2xl font-semibold mb-4">Small business</h3>
              <p className="text-5xl font-bold mb-4">$15</p>
              <p className="text-lg mb-6">
                Perfect for small/medium sized businesses
              </p>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition duration-300 mb-6 w-4/5">
                Get started
              </button>
              <ul className="text-left space-y-3">
                <li>Send 25 quotes and invoices</li>
                <li>Connect up to 5 bank accounts</li>
                <li>Track up to 50 expenses per month</li>
                <li>Automated payroll support</li>
                <li>Export up to 12 reports</li>
                <li>Bulk reconcile transactions</li>
                <li>Track in multiple currencies</li>
              </ul>
            </div>

            <div className="bg-gray-800 text-white p-8 rounded-xl shadow-lg w-full max-w-sm">
              <h3 className="text-2xl font-semibold mb-4">Enterprise</h3>
              <p className="text-5xl font-bold mb-4">$39</p>
              <p className="text-lg mb-6">
                For even the biggest enterprise companies
              </p>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition duration-300 mb-6 w-4/5">
                Get started
              </button>
              <ul className="text-left space-y-3">
                <li>Send unlimited quotes and invoices</li>
                <li>Connect up to 15 bank accounts</li>
                <li>Track up to 200 expenses per month</li>
                <li>Automated payroll support</li>
                <li>Export up to 25 reports, including PDFs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="bg-gray-100 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-14">
            Loved by businesses worldwide.
          </h2>
          <div className="grid md:grid-cols-3 gap-8 px-12">
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                "FraudDetect makes financial reporting so much easier. I can’t
                imagine going back to manual checks!"
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- PECSA -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                "The AI detection is spot-on. Our business has been able to
                catch potential fraud early and save tons of money."
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- BCP -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                "User-friendly interface and detailed analytics make it easy to
                stay on top of our finances."
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Interbank -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                "FraudDetect makes financial reporting so much easier. I can’t
                imagine going back to manual checks!"
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Walmart -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                "The AI detection is spot-on. Our business has been able to
                catch potential fraud early and save tons of money."
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Alicorp -</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <p>
                "User-friendly interface and detailed analytics make it easy to
                stay on top of our finances."
              </p>
              <p className="mt-4 text-blue-600 font-semibold">- Coca Cola -</p>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit laborum
            dolore, mollitia sint unde velit, quos quaerat eveniet corporis,
            error quasi sequi odit minima earum deserunt dicta fugiat rem illo!
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Cómo funciona la detección de fraude?
              </h3>
              <p className="text-justify pr-8">
                Nuestro sistema utiliza algoritmos de IA y aprendizaje
                automático para detectar patrones inusuales y anomalías en sus
                datos financieros.
              </p>
            </div>
            <div className="">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Puedo actualizar mi plan más tarde?
              </h3>
              <p className="text-justify pr-8">
                Sí, puede actualizar su plan en cualquier momento visitando la
                configuración de su cuenta.
              </p>
            </div>
            <div className="">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Hay una prueba gratuita disponible?
              </h3>
              <p className="text-justify pr-8">
                Sí, ofrecemos una prueba gratuita de 14 días para todos los
                nuevos usuarios.
              </p>
            </div>
            <div className="s">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Qué tan segura es mi información financiera?
              </h3>
              <p className="text-justify pr-8">
                Sus datos están protegidos con protocolos de seguridad y cifrado
                de última generación.
              </p>
            </div>
            <div className="s">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Qué tan segura es mi información financiera?
              </h3>
              <p className="text-justify pr-8">
                Sus datos están protegidos con protocolos de seguridad y cifrado
                de última generación.
              </p>
            </div>
            <div className="s">
              <h3 className="font-semibold mb-4 pr-8">
                ¿Qué tan segura es mi información financiera?
              </h3>
              <p className="text-justify pr-8">
                Sus datos están protegidos con protocolos de seguridad y cifrado
                de última generación.
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
