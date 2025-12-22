import { useState } from "react";
import userService from "../../services/userService";
import { toast } from "react-toastify";

const Footer = () => {
  const [hoveredSocial, setHoveredSocial] = useState(null);

  const subscribe = async (e) => {
    try {
      const wrapper = e.target.closest("div");
      const input = wrapper.querySelector("input");
      const email = input.value;

      const response = await userService.subscribe(email);

      if (response?.message) {
        toast.success(response.message);
      }

      input.value = "";
    } catch (error) {
      toast.error(error.message);
      input.value = "";

    }
  };

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 via-white to-gray-50 border-t border-gray-200 overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[rgba(16,21,64,0.05)] rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[rgba(16,21,64,0.08)] rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute top-40 right-1/4 w-24 h-24 bg-[rgba(16,21,64,0.06)] rounded-full blur-2xl animate-float-slow" />
      </div>

      {/* Decorative top accent with shimmer */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#101540] to-transparent opacity-50">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section with enhanced styling */}
          <div className="space-y-6 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#101540] to-[#1a2260] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-white font-bold text-lg">IS</span>
              </div>
              <h3 className="text-xl font-bold text-[#101540] group-hover:text-[#1a2260] transition-colors duration-300">
                Inventory System
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Modern inventory management solution for businesses of all sizes.
              Streamline your operations with powerful tools.
            </p>
            {/* Newsletter signup */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Stay Updated
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[rgba(16,21,64,0.2)] focus:border-[#101540] transition-all duration-300"
                />
                <button
                  onClick={subscribe}
                  className="px-4 py-2 bg-[#101540] text-white text-sm font-medium rounded-lg hover:bg-[#1a2260] transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links with hover animations */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold text-[#101540] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#101540] rounded-full" />
              Product
            </h4>
            <ul className="space-y-3">
              {[
                "Features",
                "Pricing",
                "Documentation",
                "API",
                "Integrations",
              ].map((item, index) => (
                <li
                  key={item}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="opacity-0 animate-fade-in-up"
                >
                  <a
                    href="#"
                    className="group/link text-sm text-gray-600 hover:text-[#101540] transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-0 h-0.5 bg-[#101540] group-hover/link:w-4 transition-all duration-300" />
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                      {item}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company with hover animations */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold text-[#101540] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#101540] rounded-full" />
              Company
            </h4>
            <ul className="space-y-3">
              {["About", "Blog", "Careers", "Contact", "Partners"].map(
                (item, index) => (
                  <li
                    key={item}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="opacity-0 animate-fade-in-up"
                  >
                    <a
                      href={item === "Contact" ? "/support" : "#"}
                      className="group/link text-sm text-gray-600 hover:text-[#101540] transition-all duration-300 flex items-center gap-2"
                    >
                      <span className="w-0 h-0.5 bg-[#101540] group-hover/link:w-4 transition-all duration-300" />
                      <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                        {item}
                      </span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Legal with hover animations */}
          <div className="space-y-5">
            <h4 className="text-sm font-bold text-[#101540] uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-4 bg-[#101540] rounded-full" />
              Legal
            </h4>
            <ul className="space-y-3">
              {[
                "Privacy",
                "Terms",
                "Cookie Policy",
                "Licenses",
                "Security",
              ].map((item, index) => (
                <li
                  key={item}
                  style={{ animationDelay: `${index * 50}ms` }}
                  className="opacity-0 animate-fade-in-up"
                >
                  <a
                    href="#"
                    className="group/link text-sm text-gray-600 hover:text-[#101540] transition-all duration-300 flex items-center gap-2"
                  >
                    <span className="w-0 h-0.5 bg-[#101540] group-hover/link:w-4 transition-all duration-300" />
                    <span className="group-hover/link:translate-x-1 transition-transform duration-300">
                      {item}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider with animation */}
        <div className="relative mb-8">
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          <div className="absolute inset-0 h-px bg-gradient-to-r from-transparent via-[#101540] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Bottom Bar with enhanced design */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="text-[#101540]">©</span>
              {new Date().getFullYear()} Inventory System.
              <span className="hidden sm:inline">All rights reserved.</span>
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>All systems operational</span>
            </div>
          </div>

          {/* Social Links with enhanced animations */}
          <div className="flex items-center gap-3">
            {[
              {
                name: "twitter",
                icon: (
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                ),
              },
              {
                name: "github",
                icon: (
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                ),
              },
              {
                name: "linkedin",
                icon: (
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                ),
              },
            ].map(({ name, icon }) => (
              <a
                key={name}
                href="#"
                onMouseEnter={() => setHoveredSocial(name)}
                onMouseLeave={() => setHoveredSocial(null)}
                className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 text-gray-600 hover:from-[#101540] hover:to-[#1a2260] hover:text-white transition-all duration-300 hover:scale-110 hover:-rotate-6 group/social shadow-sm hover:shadow-lg"
              >
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover/social:scale-110"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  {icon}
                </svg>
                {hoveredSocial === name && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-[#101540] text-white text-xs rounded capitalize whitespace-nowrap opacity-0 animate-fade-in">
                    {name}
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>

        {/* Additional info bar */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-500">
            <span className="hover:text-[#101540] cursor-pointer transition-colors duration-300">
              Made with love
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="hover:text-[#101540] cursor-pointer transition-colors duration-300">
              Version 2.0.1
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="hover:text-[#101540] cursor-pointer transition-colors duration-300">
              Status
            </span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="hover:text-[#101540] cursor-pointer transition-colors duration-300">
              Changelog
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
