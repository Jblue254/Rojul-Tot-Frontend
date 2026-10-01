import { Link } from "react-router-dom";
import { Wrench, DraftingCompass, Building2, ArrowRight } from "lucide-react";

const SERVICES = [
  {
    title: "Machinery Rentals",
    description:
      "Access reliable construction machinery for projects of any size.",
    icon: Wrench,
    to: "/machines",
  },
  {
    title: "Architectural Drawings",
    description:
      "Professional building plans and architectural designs.",
    icon: DraftingCompass,
    to: "/drawings",
  },
  {
    title: "Construction Services",
    description:
      "Expert construction solutions from planning to completion.",
    icon: Building2,
    to: "/projects",
  },
];

function ServicesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="uppercase tracking-[0.25em] text-sm text-[#1495CC] font-semibold">
            What We Do
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-3">
            Our Services
          </h2>

          <p className="text-sm text-gray-600">
            Comprehensive construction and engineering solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {SERVICES.map(({ title, description, icon: Icon, to }) => (
            <Link
              key={title}
              to={to}
              className="group block bg-white rounded-2xl shadow-lg p-6 hover:-translate-y-2 transition duration-300"
            >
              <Icon className="w-10 h-10 text-[#1495CC] mb-4" />

              <h3 className="text-lg font-bold mb-2">{title}</h3>

              <p className="text-sm text-gray-600 mb-3">{description}</p>

              <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#1495CC] group-hover:underline">
                Learn more
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;