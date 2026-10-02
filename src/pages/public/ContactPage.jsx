import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
} from "lucide-react";

import MainLayout from "../../layouts/MainLayout";
import { submitContactMessage } from "../../api/contact";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      await submitContactMessage(formData);

      setSuccess(true);

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (error) {
      console.error(error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-r from-[#1495CC] to-[#0E7AA8] text-white py-24">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-5xl font-bold mb-6">
              Contact Us
            </h1>

            <p className="text-xl max-w-3xl mx-auto text-blue-100">
              Have a question about machinery rentals,
              construction projects, architectural drawings,
              or general inquiries? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl shadow-sm p-8">
                <h2 className="text-2xl font-bold mb-6">
                  Get In Touch
                </h2>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="bg-[#1495CC]/10 p-3 rounded-xl">
                      <Phone
                        size={22}
                        className="text-[#1495CC]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Phone
                      </p>
                      <p className="text-gray-600">
                        +254 700 000 000
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-[#1495CC]/10 p-3 rounded-xl">
                      <Mail
                        size={22}
                        className="text-[#1495CC]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Email
                      </p>
                      <p className="text-gray-600">
                        info@rojultot.com
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-[#1495CC]/10 p-3 rounded-xl">
                      <MapPin
                        size={22}
                        className="text-[#1495CC]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Location
                      </p>
                      <p className="text-gray-600">
                        Eldoret, Kenya
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="bg-[#1495CC]/10 p-3 rounded-xl">
                      <Clock
                        size={22}
                        className="text-[#1495CC]"
                      />
                    </div>

                    <div>
                      <p className="font-semibold">
                        Working Hours
                      </p>
                      <p className="text-gray-600">
                        Mon - Sat: 8:00 AM - 6:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#1495CC] text-white rounded-3xl p-8">
                <h3 className="text-2xl font-bold mb-3">
                  Need Machinery?
                </h3>

                <p className="text-blue-100">
                  Browse our machinery rentals and
                  construction equipment available for
                  hire across Kenya.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-sm p-8 md:p-10">
                <h2 className="text-3xl font-bold mb-8">
                  Send Us A Message
                </h2>

                {success && (
                  <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                    <CheckCircle
                      size={22}
                      className="text-green-600"
                    />
                    <span className="text-green-700">
                      Your message has been sent
                      successfully.
                    </span>
                  </div>
                )}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2">
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1495CC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Email Address
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1495CC] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-medium mb-2">
                        Phone Number
                      </label>

                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1495CC] outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-2">
                        Subject
                      </label>

                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1495CC] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium mb-2">
                      Message
                    </label>

                    <textarea
                      rows="6"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#1495CC] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#1495CC] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#0E7AA8] transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send size={20} />
                    {submitting
                      ? "Sending..."
                      : "Send Message"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
}

export default ContactPage;