import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-3xl p-8 w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1495CC]">
            Create Account
          </h1>

          <p className="text-gray-600 mt-2">
            Join Rojul Tot today
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Confirm Password
            </label>

            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#1495CC]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1495CC] text-white py-3 rounded-xl hover:bg-[#1185B5] transition"
          >
            Register
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[#1495CC] font-semibold"
          >
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Register;