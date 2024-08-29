import React from "react";
import Sidebar from "../components/Sidebar";  
import FileUpload from "../components/FileUpload"; 
import { useSelector } from 'react-redux';

export default function Dashboard() {
  const { currentUser } = useSelector(state => state.user);

  console.log("Current User State:", currentUser);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <section className="bg-gray-100 py-12 px-8 flex-1">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
              {currentUser && (
                <div className="text-right">
                  <p className="text-lg font-semibold">{currentUser.username}</p>
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Usuarios totales</h2>
                <p className="text-4xl font-bold">1,234</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Sesiones activas</h2>
                <p className="text-4xl font-bold">567</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">Archivos subidos</h2>
                <p className="text-4xl font-bold">$3,678</p>
              </div>
              <div className="p-6 bg-white rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-semibold mb-4">New Signups</h2>
                <p className="text-4xl font-bold">89</p>
              </div>
            </div>
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-4">Cargar estados financieros</h2>
              <FileUpload />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
