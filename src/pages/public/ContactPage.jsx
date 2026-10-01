import MainLayout from "../../layouts/MainLayout";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";

function ContactPage() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#1495CC] to-[#0E7AA8] text-white py-28">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="uppercase tracking-[0.25em] text-white/80 font-semibold">
            Get In Touch
          </span>

          <h1 className="text-5xl md:text-6xl font-bold mt-6 mb-6">
            Contact Us
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-white/90">
            Have a project in mind? Need construction services,
            machinery rental, or architectural drawings?
            Our team is ready to help.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-[#1495CC]/10 flex items-center justify-center mx-auto mb-5">
                <Phone size={30} className="text-[#1495CC]" />
              </div>

              <h3 className="font-bold text-xl mb-3">
                Call Us
              </h3>

              <p className="text-gray-600">
                +254 700 000 000
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-[#1495CC]/10 flex items-center justify-center mx-auto mb-5">
                <Mail size={30} className="text-[#1495CC]" />
              </div>

              <h3 className="font-bold text-xl mb-3">
                Email
              </h3>

              <p className="text-gray-600">
                info@rojultot.com
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-[#1495CC]/10 flex items-center justify-center mx-auto mb-5">
                <MapPin size={30} className="text-[#1495CC]" />
              </div>

              <h3 className="font-bold text-xl mb-3">
                Office Location
              </h3>

              <p className="text-gray-600">
                Eldoret, Kenya
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 text-center shadow-sm hover:shadow-xl transition">
              <div className="w-16 h-16 rounded-2xl bg-[#1495CC]/10 flex items-center justify-center mx-auto mb-5">
                <Clock size={30} className="text-[#1495CC]" />
              </div>

              <h3 className="font-bold text-xl mb-3">
                Working Hours
              </h3>

              <p className="text-gray-600">
                Mon - Sat
                <br />
                8:00 AM - 6:00 PM
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-16 items-start">

            {/* Left Content */}

            <div>
              <span className="uppercase tracking-[0.25em] text-[#1495CC] font-semibold">
                Let's Talk
              </span>

              <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
                Send Us A Message
              </h2>

              <p className="text-gray-600 leading-8">
                Whether you're planning a construction project,
                looking for machinery rentals, or interested in
                purchasing professional drawings, we'd love to
                hear from you.
              </p>

              <div className="mt-10 space-y-6">
                <div>
                  <h4 className="font-semibold text-lg">
                    Construction Services
                  </h4>
                  <p className="text-gray-500">
                    Residential, commercial, and industrial projects.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    Machinery Rentals
                  </h4>
                  <p className="text-gray-500">
                    Affordable and reliable equipment for your site.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    Architectural Drawings
                  </h4>
                  <p className="text-gray-500">
                    Professional plans and design solutions.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}

            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl">
              <form className="space-y-6">

                <div className="grid md:grid-cols-2 gap-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1495CC]"
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1495CC]"
                  />
                </div>

                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1495CC]"
                />

                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1495CC]"
                />

                <textarea
                  rows="6"
                  placeholder="Write your message..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-4 focus:outline-none focus:border-[#1495CC]"
                />

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-[#1495CC] text-white py-4 rounded-xl font-semibold hover:bg-[#1185B5] transition"
                >
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Map Section */}

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <div className="text-center mb-12">
            <span className="uppercase tracking-[0.25em] text-[#1495CC] font-semibold">
              Visit Us
            </span>

            <h2 className="text-4xl font-bold mt-4">
              Our Location
            </h2>
          </div>

          <div className="overflow-hidden rounded-3xl shadow-xl">
            <iframe
              title="Google Map"
              src="https://maps.google.com/maps?q=Eldoret&t=&z=13&ie=UTF8&iwloc=&output=embed"
              className="w-full h-[500px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="py-24 bg-[#1495CC] text-white">
        <div className="max-w-5xl mx-auto px-6 text-center">

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready To Start Your Next Project?
          </h2>

          <p className="text-xl text-white/90 mb-10">
            Partner with us for quality construction,
            machinery rental, and professional drawings.
          </p>

          <button className="bg-white text-[#1495CC] px-10 py-4 rounded-xl font-semibold hover:bg-gray-100 transition">
            Request A Quote
          </button>
        </div>
      </section>
    </MainLayout>
  );
}

export default ContactPage;