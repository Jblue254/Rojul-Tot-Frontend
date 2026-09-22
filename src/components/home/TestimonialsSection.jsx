function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "John Mwangi",
      role: "Property Developer",
      comment:
        "Rojul Tot delivered quality work on time and provided reliable machinery throughout our project.",
    },
    {
      id: 2,
      name: "Mary Wanjiku",
      role: "Home Owner",
      comment:
        "The architectural drawings were professional and easy to work with. Highly recommended.",
    },
    {
      id: 3,
      name: "David Otieno",
      role: "Contractor",
      comment:
        "Excellent customer service and well-maintained machinery. We will definitely work together again.",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            What Our Clients Say
          </h2>

          <p className="text-gray-600">
            Trusted by homeowners, contractors, and developers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#F8FAFC] p-8 rounded-2xl shadow-lg"
            >
              <p className="text-gray-600 mb-6 italic">
                "{testimonial.comment}"
              </p>

              <h4 className="font-bold text-lg">
                {testimonial.name}
              </h4>

              <p className="text-[#1495CC]">
                {testimonial.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;