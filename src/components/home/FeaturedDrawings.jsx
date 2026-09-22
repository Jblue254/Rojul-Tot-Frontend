function FeaturedDrawings() {
  const drawings = [
    {
      id: 1,
      title: "Modern 3 Bedroom House",
      image: "/images/drawing1.jpg",
      price: "KSh 40,000",
    },
    {
      id: 2,
      title: "Apartment Flats Plan",
      image: "/images/drawing2.jpg",
      price: "KSh 50,000",
    },
    {
      id: 3,
      title: "Commercial Building Plan",
      image: "/images/drawing3.jpg",
      price: "KSh 65,000",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            Featured Drawings
          </h2>

          <button className="text-[#1495CC] font-semibold">
            View All →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {drawings.map((drawing) => (
            <div
              key={drawing.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition"
            >
              <img
                src={drawing.image}
                alt={drawing.title}
                className="w-full h-60 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-3">
                  {drawing.title}
                </h3>

                <p className="text-[#1495CC] font-semibold mb-4">
                  {drawing.price}
                </p>

                <button className="w-full bg-[#1495CC] text-white py-3 rounded-lg hover:bg-[#1185B5]">
                  View Drawing
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedDrawings;