import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const QUICK_LINKS = [
    { to: "/", label: "Home" },
    { to: "/machines", label: "Machines" },
    { to: "/drawings", label: "Drawings" },
    { to: "/projects", label: "Projects" },
    { to: "/contact", label: "Contact" },
];

const SERVICES = [
    "Machinery Rentals",
    "Architectural Drawings",
    "Construction Services",
    "Project Management",
];

const PHONE = "+254 722 378 497";
const EMAIL = "rojultot21@gmail.com";

const linkClasses = "text-slate-300 hover:text-white transition-colors w-fit";

function Footer() {
    return (
        <footer className="bg-gradient-to-r from-[#0F172A] to-[#0B5E85] text-white">
            <div className="max-w-7xl mx-auto px-6 py-10">
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
                    {/* Company */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-3">Rojul Tot</h3>

                        <p className="text-slate-300 leading-relaxed">
                            Professional construction solutions, machinery rentals,
                            architectural drawings, and project management services.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-base mb-3">Quick Links</h4>

                        <div className="flex flex-col gap-1.5">
                            {QUICK_LINKS.map(({ to, label }) => (
                                <Link key={to} to={to} className={linkClasses}>
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="font-semibold text-base mb-3">Services</h4>

                        <div className="flex flex-col gap-1.5 text-slate-300">
                            {SERVICES.map((service) => (
                                <span key={service}>{service}</span>
                            ))}
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-base mb-3">Contact</h4>

                        <div className="space-y-2.5 text-slate-300">
                            <a
                                href={`tel:${PHONE.replace(/\s/g, "")}`}
                                className="flex items-center gap-2.5 hover:text-white transition-colors w-fit"
                            >
                                <Phone size={16} className="text-blue-200" />
                                <span>{PHONE}</span>
                            </a>

                            <a
                                href={`mailto:${EMAIL}`}
                                className="flex items-center gap-2.5 hover:text-white transition-colors w-fit break-all"
                            >
                                <Mail size={16} className="text-blue-200" />
                                <span>{EMAIL}</span>
                            </a>

                            <div className="flex items-center gap-2.5">
                                <MapPin size={16} className="text-blue-200" />
                                <span>Nairobi, Kenya</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-8 pt-4 text-center text-xs text-slate-300">
                    © {new Date().getFullYear()} Rojul Tot. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

export default Footer;