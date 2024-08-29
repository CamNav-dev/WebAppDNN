import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="bg-blue-900 h-screen w-60 flex flex-col justify-between text-white">
      <div>
        {/* Logo */}
        <div className="px-8 py-6">
          <h1 className="text-3xl font-bold">PECSA</h1>
        </div>
        
        {/* Menu Items */}
        <nav className="px-8 mt-10">
          <Link to="/dashboard" className="block py-2.5 px-4 rounded hover:bg-blue-800">
            Dashboard
          </Link>
          <Link to="/profile" className="block py-2.5 px-4 rounded hover:bg-blue-800">
            Perfil
          </Link>
        </nav>
      </div>

      {/* Help */}
      <div className="px-8 py-6">
        <Link to="/help" className="flex items-center py-2.5 px-4 rounded hover:bg-blue-800">
        Help
        </Link>
      </div>
    </div>
  );
}
