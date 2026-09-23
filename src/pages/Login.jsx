import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser, getProfile } from "../api/auth";
import { useAuth } from "../context/AuthContext";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await loginUser({
      email,
      password,
    });

    localStorage.setItem(
      "access",
      response.data.access
    );

    localStorage.setItem(
      "refresh",
      response.data.refresh
    );

    // const profile = await getProfile();

    // setUser(profile.data);

    navigate("/dashboard");
  } catch (error) {
  console.error(error);
  console.log(error.response?.data);
  alert(JSON.stringify(error.response?.data));
}
};



  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1495CC]">
            Welcome Back
          </h1>

          <p className="text-gray-600 mt-2">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1495CC] text-white py-3 rounded-xl hover:bg-[#1185B5] transition"
          >
            Login
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#1495CC] font-semibold"
          >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;