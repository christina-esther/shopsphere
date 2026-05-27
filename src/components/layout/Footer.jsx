import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube } from "react-icons/fi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker } from "react-icons/hi";

const footerLinks = {
  Shop: [
    { label: "New Arrivals", path: "/products?sort=newest" },
    { label: "Best Sellers", path: "/products?sort=popular" },
    { label: "Flash Sale", path: "/products?flashSale=true" },
    { label: "All Products", path: "/products" },
  ],
  Company: [
    { label: "About Us", path: "/" },
    { label: "Careers", path: "/" },
    { label: "Press", path: "/" },
    { label: "Blog", path: "/" },
  ],
  Support: [
    { label: "Help Center", path: "/" },
    { label: "Track Order", path: "/orders" },
    { label: "Returns", path: "/" },
    { label: "Contact Us", path: "/" },
  ],
  Legal: [
    { label: "Privacy Policy", path: "/" },
    { label: "Terms of Service", path: "/" },
    { label: "Cookie Policy", path: "/" },
    { label: "Refund Policy", path: "/" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-dark-900 text-gray-400 mt-20">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Stay in the loop</h3>
              <p className="text-gray-400">Get exclusive deals, new arrivals, and more.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-72 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 
                           text-white placeholder-gray-500 focus:outline-none focus:border-primary-500 transition-colors"
              />
              <button className="btn-primary whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white text-lg font-black">S</span>
              </div>
              <span className="font-bold text-xl text-white">
                Shop<span className="text-primary-400">Sphere</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              Your premium destination for curated products. Shop smarter, live better.
            </p>
            <div className="flex items-center gap-3">
              {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                >
                  <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2.5">
              {[
                { icon: HiOutlineMail, text: "support@shopsphere.com" },
                { icon: HiOutlinePhone, text: "+91 98765 43210" },
                { icon: HiOutlineLocationMarker, text: "Mumbai, Maharashtra, India" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm">
                  <Icon className="w-4 h-4 text-primary-400 flex-shrink-0" />
                  <span className="text-gray-500">{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-sm text-gray-500 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Visa.svg/512px-Visa.svg.png"
              alt="Visa" className="h-6 opacity-50 hover:opacity-80 transition-opacity"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/800px-Mastercard-logo.svg.png"
              alt="Mastercard" className="h-6 opacity-50 hover:opacity-80 transition-opacity"
            />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/1200px-PayPal.svg.png"
              alt="PayPal" className="h-5 opacity-50 hover:opacity-80 transition-opacity"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
