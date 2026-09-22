import { Link } from "react-router-dom";

function HeroSection() {
  return (
    <section className="bg-[#F8FAFC] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div>
            <span className="inline-block px-4 py-2 mb-6 rounded-full bg-blue-100 text-[#1495CC] font-semibold">
              We Listen. Plan. Build.
            </span>

            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight text-gray-900 mb-6">
              Building Your
              <span className="text-[#1495CC]"> Vision</span>
              <br />
              With Quality &
              <span className="text-[#1495CC]"> Innovation</span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl mb-8">
              Rojul Tot provides reliable construction machinery,
              professional architectural drawings, and trusted
              construction solutions for residential and commercial projects.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/machines"
                className="px-8 py-4 rounded-xl bg-[#1495CC] text-white font-semibold hover:bg-[#1185B5] transition"
              >
                Explore Machines
              </Link>

              <Link
                to="/drawings"
                className="px-8 py-4 rounded-xl border-2 border-[#1495CC] text-[#1495CC] font-semibold hover:bg-[#1495CC] hover:text-white transition"
              >
                View Drawings
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  500+
                </h3>
                <p className="text-gray-600">Projects</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  100+
                </h3>
                <p className="text-gray-600">Machines</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  200+
                </h3>
                <p className="text-gray-600">Drawings</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div>
            <img
              src="/images/hero-1.jpg"
              alt="Construction Project"
              className="w-full rounded-3xl shadow-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;