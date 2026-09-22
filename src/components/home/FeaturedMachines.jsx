function FeaturedMachines() {
  const machines = [
    {
      id: 1,
      name: "Excavator",
      image: "/images/excavator.jpg",
      price: "KSh 15,000/day",
    },
    {
      id: 2,
      name: "Bulldozer",
      image: "/images/bulldozer.jpg",
      price: "KSh 20,000/day",
    },
    {
      id: 3,
      name: "Loader",
      image: "/images/loader.jpg",
      price: "KSh 12,000/day",
    },
  ];

  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold">
            Featured Machines
          </h2>

          <button className="text-[#1495CC] font-semibold">
            View All →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {machines.map((machine) => (
            <div
              key={machine.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:-translate-y-2 transition"
            >
              <img
                src={machine.image}
                alt={machine.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  {machine.name}
                </h3>

                <p className="text-[#1495CC] font-semibold mb-4">
                  {machine.price}
                </p>

                <button className="w-full bg-[#1495CC] text-white py-3 rounded-lg hover:bg-[#1185B5]">
                  Rent Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedMachines;