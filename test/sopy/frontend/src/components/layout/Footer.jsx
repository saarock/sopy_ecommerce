import { ShoppingCart, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Link } from "react-router-dom"

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-primary-600 to-primary-400 p-2 rounded-xl text-white shadow-lg group-hover:shadow-primary-500/30 transition-all duration-300">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-primary-500">
                Sopy
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              Elevating your shopping experience with premium quality and unmatched style.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-100 text-zinc-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-zinc-900 mb-4">Shop</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <Link to="/products" className="hover:text-primary-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=Electronics" className="hover:text-primary-600 transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/products?category=Fashion" className="hover:text-primary-600 transition-colors">
                  Fashion
                </Link>
              </li>
              <li>
                <Link to="/products?featured=true" className="hover:text-primary-600 transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-zinc-900 mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-zinc-600">
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-600 transition-colors">
                  Shipping Info
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-zinc-900 mb-4">Contact</h3>
            <ul className="space-y-3 text-sm text-zinc-600">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500" />
                123 Commerce St, Tech City
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-500" />
                support@sopy.com
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-100 mt-12 pt-8 text-sm text-center text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Sopy. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
