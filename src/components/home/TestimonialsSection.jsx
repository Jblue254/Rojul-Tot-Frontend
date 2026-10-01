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

  const getInitials = (name) =>
    name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="uppercase tracking-[0.25em] text-sm text-[#1495CC] font-semibold">
            Testimonials
          </span>

          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-3">
            What Our Clients Say
          </h2>

          <p className="text-sm text-gray-600">
            Trusted by homeowners, contractors, and developers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-[#F8FAFC] p-6 rounded-2xl shadow-lg"
            >
              <p className="text-sm text-gray-600 mb-4 italic">
                &ldquo;{testimonial.comment}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full bg-[#1495CC] text-white text-sm flex items-center justify-center font-bold shrink-0"
                  aria-hidden="true"
                >
                  {getInitials(testimonial.name)}
                </div>

                <div>
                  <h4 className="font-bold text-base">
                    {testimonial.name}
                  </h4>

                  <p className="text-sm text-[#1495CC]">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;