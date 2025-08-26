import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Clickable Logo/Brand that goes to dashboard */}
          <Link to="/transactions" className="flex-shrink-0">
            <h1 className="text-xl font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer">
              YaYa Wallet
            </h1>
          </Link>

          {/* Right side (empty for now, ready for future features) */}
          <div className="flex items-center space-x-4">
            {/* Placeholder for future user menu, notifications, etc. */}
          </div>
        </div>
      </div>
    </nav>
  );
}