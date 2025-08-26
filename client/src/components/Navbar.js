import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800">YaYa Wallet</h1>
          </div>

          {/* Navigation Links */}
          <div className="flex space-x-8">
            <Link
              to="/transactions"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                location.pathname === "/transactions" || location.pathname === "/"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              Dashboard
            </Link>
            
            {/* Add more links here in the future */}
          </div>

        </div>
      </div>
    </nav>
  );
}