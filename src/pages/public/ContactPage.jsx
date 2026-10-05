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

const EMPTY_FORM = {
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
};

const INFO_ITEMS = [
    { icon: Phone, label: "Phone", value: "+254 700 000 000" },
    { icon: Mail, label: "Email", value: "info@rojultot.com" },
    { icon: MapPin, label: "Location", value: "Eldoret, Kenya" },
    { icon: Clock, label: "Working Hours", value: "Mon - Sat: 8:00 AM - 6:00 PM" },
];

const inputClasses =
    "w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition-colors focus:border-[#1495CC] focus:ring-2 focus:ring-[#1495CC]/30";

function Field({ label, id, children }) {
    return (
        <div>
            <label htmlFor={id} className="block font-medium text-gray-900 mb-2">
                {label}
            </label>
            {children}
        </div>
    );
}

function ContactPage() {
    const [formData, setFormData] = useState(EMPTY_FORM);
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
            setFormData(EMPTY_FORM);

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
            <div className="bg-[#F8FAFC] min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-[#0F172A] to-[#1495CC] text-white py-16">
                    <div className="max-w-7xl mx-auto px-6 text-center">
                        <span className="uppercase tracking-[0.25em] text-sm text-blue-200 font-semibold">
                            Contact
                        </span>

                        <h1 className="text-3xl md:text-4xl font-bold mt-4 mb-4">
                            Contact Us
                        </h1>

                        <p className="max-w-3xl mx-auto text-sm md:text-base text-blue-100">
                            Have a question about machinery rentals, construction projects,
                            architectural drawings, or general inquiries? We'd love to hear
                            from you.
                        </p>
                    </div>
                </section>

                {/* Content */}
                <section className="max-w-7xl mx-auto px-6 py-20">
                    <div className="grid lg:grid-cols-3 gap-10">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Get In Touch
                                </h2>

                                <div className="space-y-6">
                                    {INFO_ITEMS.map(({ icon: Icon, label, value }) => (
                                        <div key={label} className="flex gap-4">
                                            <div className="bg-[#1495CC]/10 p-3 rounded-xl h-fit">
                                                <Icon size={22} className="text-[#1495CC]" />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-gray-900">{label}</p>
                                                <p className="text-gray-600">{value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-[#1495CC] text-white rounded-3xl p-8">
                                <h3 className="text-2xl font-bold mb-3">Need Machinery?</h3>

                                <p className="text-blue-100">
                                    Browse our machinery rentals and construction equipment
                                    available for hire across Kenya.
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                                    Send Us A Message
                                </h2>

                                {success && (
                                    <div
                                        role="status"
                                        className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
                                    >
                                        <CheckCircle size={22} className="text-green-600" />
                                        <span className="text-green-700">
                                            Your message has been sent successfully.
                                        </span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Field label="Full Name" id="name">
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                autoComplete="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                                className={inputClasses}
                                            />
                                        </Field>

                                        <Field label="Email Address" id="email">
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                autoComplete="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className={inputClasses}
                                            />
                                        </Field>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Field label="Phone Number" id="phone">
                                            <input
                                                id="phone"
                                                type="tel"
                                                name="phone"
                                                autoComplete="tel"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                className={inputClasses}
                                            />
                                        </Field>

                                        <Field label="Subject" id="subject">
                                            <input
                                                id="subject"
                                                type="text"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleChange}
                                                required
                                                className={inputClasses}
                                            />
                                        </Field>
                                    </div>

                                    <Field label="Message" id="message">
                                        <textarea
                                            id="message"
                                            rows="6"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            className={`${inputClasses} resize-none`}
                                        />
                                    </Field>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="bg-[#1495CC] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#0E7AA8] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1495CC]/50 focus-visible:ring-offset-2"
                                    >
                                        <Send size={20} />
                                        {submitting ? "Sending..." : "Send Message"}
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