
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import useUser from "../../hooks/useUser"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const { user } = useUser()
  const isAuthenticated = !!user

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium tracking-wide animate-fade-in">
            New Collection Fall/Winter 2025
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-balance animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="block text-primary">Elevate Your</span>
            <span className="block bg-gradient-to-r from-primary via-purple-900 to-primary bg-clip-text text-transparent">Lifestyle with Sopy.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-muted-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover a curated selection of premium products designed for the modern connoisseur.
            Experience seamless shopping with next-gen speed and exclusive access.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {isAuthenticated ? (
              <Link to="/products" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25">
                Shop Now
              </Link>
            ) : (
              <>
                <Link to="/register" className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold hover:opacity-90 transition-all shadow-lg hover:shadow-primary/25">
                  Start Shopping
                </Link>
                <Link to="/login" className="px-8 py-4 bg-white border border-input text-foreground rounded-full font-semibold hover:bg-gray-50 transition-all">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Abstract Product Showcase */}
        <div className="mt-20 relative max-w-6xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <div className="relative rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-white/20">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
            {/* Placeholder for Hero Image */}
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-white/20 text-9xl font-bold select-none">
              SOPY
            </div>
            {/* Could be a real image if we had one */}
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
              alt="Fashion Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-80 hover:scale-105 transition-transform duration-1000"
            />

            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 text-white text-left">
              <p className="text-sm font-medium uppercase tracking-wider mb-2 text-white/80">Featured</p>
              <h3 className="text-3xl font-bold">The Minimalist Series</h3>
              <p className="max-w-md text-white/80 mt-2 text-sm md:text-base">
                Clean lines, monochromatic tones, and premium materials.
                Redefining essential luxury.
              </p>
            </div>
          </div>

          {/* Float Elements */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary rounded-full blur-3xl opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-primary rounded-full blur-3xl opacity-20 pointer-events-none"></div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-24 bg-secondary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Curated Categories</h2>
            <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Men's Premium", img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=2148&auto=format&fit=crop" },
              { title: "Women's Luxe", img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2071&auto=format&fit=crop" },
              { title: "Accessories", img: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=2070&auto=format&fit=crop" }
            ].map((cat, i) => (
              <div key={i} className="group relative h-96 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-bold">{cat.title}</h3>
                  <span className="inline-block mt-2 text-sm font-medium border-b border-white pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">Explore Collection</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / Footer Teaser */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Inner Circle</h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Subscribe to receive early access to new drops, exclusive styling tips, and member-only accolades.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-secondary backdrop-blur-sm"
            />
            <button className="px-8 py-4 bg-secondary text-secondary-foreground font-bold rounded-full hover:bg-white hover:text-primary transition-colors shadow-lg">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  )
}
