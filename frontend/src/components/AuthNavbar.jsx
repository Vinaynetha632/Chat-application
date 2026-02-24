import { Link } from "react-router-dom";

function AuthNavbar({ type }) {
  return (
    <div className="w-full flex items-center justify-between px-10 py-4 border-b border-[#1F1B3A]">
      <div className="flex items-center gap-2">
        <span className="text-white font-semibold text-lg">FreeMessage</span>
      </div>

      <div className="flex items-center gap-3 text-sm">
        {type === "login" ? (
          <>
            <span className="text-gray-400">New to FreeMessage?</span>
            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-400">Already have an account?</span>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthNavbar;
