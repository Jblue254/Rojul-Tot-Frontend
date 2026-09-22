import {Wrench,DraftingCompass,Building2} from "lucide-react";


function ServicesSection() {
const Icon = services.icon;

<Icon className="w-12 h-12 text-[#1495CC] mb-6" />
const services = [
  {
    title: "Machinery Rentals",
    description:
      "Access reliable construction machinery for projects of any size.",
    icon: Wrench,
  },
  {
    title: "Architectural Drawings",
    description:
      "Professional building plans and architectural designs.",
    icon: DraftingCompass,
  },
  {
    title: "Construction Services",
    description:
      "Expert construction solutions from planning to completion.",
    icon: Building2,
  },
];


  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-4">
          Our Services
        </h2>

        <p className="text-center text-gray-600 mb-16">
          Comprehensive construction and engineering solutions.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-8 hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 bg-blue-100 rounded-xl mb-6"></div>

              <h3 className="text-xl font-bold mb-4">
                {service.title}
              </h3>

              <p className="text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;