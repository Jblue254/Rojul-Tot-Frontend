function ProjectsSection() {
  const projects = [
    {
      id: 1,
      title: "Residential Estate Development",
      location: "Nairobi",
      image: "/images/project1.jpg",
    },
    {
      id: 2,
      title: "Commercial Office Complex",
      location: "Mombasa",
      image: "/images/project2.jpg",
    },
    {
      id: 3,
      title: "Modern Apartment Block",
      location: "Kisumu",
      image: "/images/project3.jpg",
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl font-bold mb-4">
            Our Projects
          </h2>

          <p className="text-gray-600">
            Some of our completed and ongoing construction projects.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg"
            >
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {project.title}
                </h3>

                <p className="text-gray-600">
                  {project.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProjectsSection;