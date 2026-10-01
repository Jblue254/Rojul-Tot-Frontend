function AboutSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">

          {/* Image */}
          <div>
          <img
            src="/images/about-us-1.jpg"
            alt="About Us"
            loading="lazy"
            className="rounded-3xl shadow-xl w-full h-96 lg:h-[34rem] object-cover"
          />
          </div>

          {/* Content */}
          <div>
            <span className="uppercase tracking-[0.3em] text-sm text-[#1495CC] font-semibold">
              About Rojul Tot
            </span>

            <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight">
              Building Strong Foundations
              For Every Project
            </h2>

            <p className="mt-5 text-base text-gray-600 leading-7">
              Rojul Tot is dedicated to delivering reliable construction
              machinery, professional architectural drawings, and quality
              construction solutions. We help individuals, businesses, and
              developers turn ideas into successful projects.
            </p>

            <p className="mt-4 text-base text-gray-600 leading-7">
              Our commitment to innovation, safety, and excellence allows us
              to provide dependable services while maintaining the highest
              standards across every project we undertake.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-5 mt-7">
              <div>
                <h3 className="text-2xl font-bold text-[#1495CC]">
                  500+
                </h3>
                <p className="text-sm text-gray-600">Projects Completed</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#1495CC]">
                  100+
                </h3>
                <p className="text-sm text-gray-600">Machines Available</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#1495CC]">
                  200+
                </h3>
                <p className="text-sm text-gray-600">Drawing Plans</p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-[#1495CC]">
                  10+
                </h3>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
            </div>

            <button className="mt-7 px-6 py-3 text-sm bg-[#1495CC] text-white rounded-xl font-semibold hover:bg-[#1185B5] transition">
              Learn More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;