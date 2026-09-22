import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";
function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">

          {/* Company */}
          <div>
            <h3 className="text-2xl font-bold text-[#1495CC] mb-4">
              Rojul Tot
            </h3>

            <p className="text-slate-300">
              Professional construction solutions, machinery rentals,
              architectural drawings, and project management services.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">
              Quick Links
            </h4>

            <div className="flex flex-col gap-2">
              <Link to="/">Home</Link>
              <Link to="/machines">Machines</Link>
              <Link to="/drawings">Drawings</Link>
              <Link to="/projects">Projects</Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4">
              Services
            </h4>

            <div className="flex flex-col gap-2 text-slate-300">
              <span>Machinery Rentals</span>
              <span>Architectural Drawings</span>
              <span>Construction Services</span>
              <span>Project Management</span>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">
              Contact
            </h4>

            <div className="flex items-center gap-2">
              <Phone size={18} />
              <span>+254 722 378 497 </span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Mail size={18} />
              <span>rojultot21@gmail.com</span>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <MapPin size={18} />
              <span>Nairobi, Kenya</span>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-slate-400">
          © {new Date().getFullYear()} Rojul Tot. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;