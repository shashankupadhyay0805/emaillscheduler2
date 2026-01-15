import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Login() {
  const navigate = useNavigate();

  const loginWithGoogle = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-[420px] rounded-xl bg-white p-10 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Login
        </h1>

        <button
          onClick={loginWithGoogle}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-md bg-green-50 py-3 text-sm font-medium text-gray-700 transition hover:bg-green-100"
        >
          {/* Google SVG Icon */}
          <svg className="h-5 w-5" viewBox="0 0 48 48">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.2 1.53 7.62 2.8l5.56-5.56C33.78 3.86 29.24 2 24 2 14.73 2 6.91 7.38 3.36 15.11l6.91 5.36C12.09 13.09 17.55 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.5 24.5c0-1.64-.15-3.21-.43-4.72H24v9.04h12.7c-.55 2.96-2.2 5.47-4.7 7.16l7.23 5.61C43.91 37.36 46.5 31.44 46.5 24.5z"
            />
            <path
              fill="#FBBC05"
              d="M10.27 28.47a14.5 14.5 0 010-8.94l-6.91-5.36a23.93 23.93 0 000 19.66l6.91-5.36z"
            />
            <path
              fill="#34A853"
              d="M24 46c6.48 0 11.92-2.14 15.89-5.81l-7.23-5.61c-2.01 1.35-4.58 2.14-8.66 2.14-6.45 0-11.91-3.59-13.73-8.97l-6.91 5.36C6.91 40.62 14.73 46 24 46z"
            />
          </svg>
            Login with Google
          </button>

        {/* Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <p className="text-xs text-gray-400">or sign up through email</p>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email ID"
          className="mb-3 w-full rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          className="mb-5 w-full rounded-md bg-gray-100 px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-green-400"
        />

        {/* Login Button */}
        <button
          className="w-full rounded-md bg-green-500 py-3 text-sm font-semibold text-white transition hover:bg-green-600"
          onClick={() => alert("Email login UI only")}
        >
          Login
        </button>
      </div>
    </div>
  );
}
