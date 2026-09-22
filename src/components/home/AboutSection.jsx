// import aboutImage from "../../assets/about.jpg"; // change to your image

function AboutSection() {
  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* Image */}
          <div>
            <img
              src={aboutImage}
              alt="Rojul Tot Construction"
              className="rounded-3xl shadow-xl w-full"
            />
          </div>

          {/* Content */}
          <div>
            <span className="uppercase tracking-[0.3em] text-[#1495CC] font-semibold">
              About Rojul Tot
            </span>

            <h2 className="mt-4 text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Building Strong Foundations
              For Every Project
            </h2>

            <p className="mt-8 text-lg text-gray-600 leading-8">
              Rojul Tot is dedicated to delivering reliable construction
              machinery, professional architectural drawings, and quality
              construction solutions. We help individuals, businesses, and
              developers turn ideas into successful projects.
            </p>

            <p className="mt-6 text-lg text-gray-600 leading-8">
              Our commitment to innovation, safety, and excellence allows us
              to provide dependable services while maintaining the highest
              standards across every project we undertake.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-10">
              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  500+
                </h3>
                <p className="text-gray-600">Projects Completed</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  100+
                </h3>
                <p className="text-gray-600">Machines Available</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  200+
                </h3>
                <p className="text-gray-600">Drawing Plans</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1495CC]">
                  10+
                </h3>
                <p className="text-gray-600">Years Experience</p>
              </div>
            </div>

            <button className="mt-10 px-8 py-4 bg-[#1495CC] text-white rounded-xl font-semibold hover:bg-[#1185B5] transition">
              Learn More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;