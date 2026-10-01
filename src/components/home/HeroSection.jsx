import { Link } from "react-router-dom";

const STATS = [
  { value: "500+", label: "Projects" },
  { value: "100+", label: "Machines" },
  { value: "200+", label: "Drawings" },
];

function HeroSection() {
  return (
    <section className="bg-[#F8FAFC] min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Content */}
          <div>
            <span className="inline-block px-3 py-1.5 mb-4 rounded-full bg-blue-100 text-[#1495CC] text-sm font-semibold">
              We Listen. Plan. Build.
            </span>

            <h1 className="text-4xl lg:text-5xl font-extrabold leading-tight text-gray-900 mb-4">
              Building Your
              <span className="text-[#1495CC]"> Vision</span>
              <br />
              With Quality &
              <span className="text-[#1495CC]"> Innovation</span>
            </h1>

            <p className="text-base text-gray-600 max-w-xl mb-6">
              Rojul Tot provides reliable construction machinery,
              professional architectural drawings, and trusted
              construction solutions for residential and commercial projects.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/machines"
                className="px-6 py-3 text-sm rounded-xl bg-[#1495CC] text-white font-semibold hover:bg-[#1185B5] transition"
              >
                Explore Machines
              </Link>

              <Link
                to="/drawings"
                className="px-6 py-3 text-sm rounded-xl border-2 border-[#1495CC] text-[#1495CC] font-semibold hover:bg-[#1495CC] hover:text-white transition"
              >
                View Drawings
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <h3 className="text-2xl font-bold text-[#1495CC]">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div>
            <img
              src="/images/hero-1.jpg"
              alt="Construction Project"
              fetchPriority="high"
              className="w-full aspect-[4/3] object-cover rounded-3xl shadow-2xl"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

export default HeroSection;