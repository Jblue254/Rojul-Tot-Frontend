import { Link } from "react-router-dom";

function CTASection() {
  return (
    <section className="bg-[#1495CC] py-14">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Ready to start your project?
        </h2>

        <p className="text-sm text-blue-50 mb-6">
          Rent the machinery you need, get professional architectural
          drawings, or talk to us about your next build.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="px-6 py-3 text-sm rounded-xl bg-white text-[#1495CC] font-semibold hover:bg-blue-50 transition"
          >
            Get Started
          </Link>

          <Link
            to="/machines"
            className="px-6 py-3 text-sm rounded-xl border-2 border-white text-white font-semibold hover:bg-white hover:text-[#1495CC] transition"
          >
            Explore Machines
          </Link>
        </div>
      </div>
    </section>
  );
}

export default CTASection;