import { Link } from "react-router-dom"
import { useEffect, useState } from "react"

export default function NotFound() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20 animate-float"
            style={{
              width: Math.random() * 100 + 50 + "px",
              height: Math.random() * 100 + 50 + "px",
              background: `rgba(16, 21, 64, ${Math.random() * 0.3})`,
              left: Math.random() * 100 + "%",
              top: Math.random() * 100 + "%",
              animationDelay: Math.random() * 5 + "s",
              animationDuration: Math.random() * 10 + 10 + "s",
            }}
          />
        ))}
      </div>

      {/* Content Container with Parallax Effect */}
      <div
        className="relative z-10 text-center"
        style={{
          transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Image Section with Glow Effect */}
        <div className="relative inline-block mb-8 animate-fade-in-up">
          <div className="absolute inset-0 bg-[rgba(16,21,64,0.2)] blur-3xl rounded-full scale-75 animate-pulse" />
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAABj1BMVEWMUv//////zn8KCgoAAACPVP/Tf3WRVf8ABgD/0oHn4OP/69P/5c4ABwCJTv8AAwD/03e2g1FWNJvZ0csTDxxzLbXUzM318fL/1IJaNqKyfNoQDRaXbmeBTOqhenGHT/c6I2YfFDSFTvI0IFpyQ89rQMFeN6kODBJUMpZlPLh8SeF1RdT/8NdOL4sqG0hoPr1ILIEwHlQVDyEcEy3FoJDv0785AABAJ3IkFz0XECbEc2q1Z1/ahXrTsqKnU01NAACMXlikiYpgHiNyQkR5O9KcaEXpt2k9JGtpLZFxMXZsLXtwNaxzLz+mWkm9bn5vL2aVTTiOR0ReHTi9bVpoK4JmKGSGQDJSBgBsK1dqLHJ3MDKIQT51KiyfX1nywK6FTUnixLHNr5+ykYV6OFZpKE6fVUVcDnSXRDZvM2FiJC53Q1SAT1GMZ2teEX6DVT+GVkuwmZrJu7uqhGm9qKlnLSRqJ6d9SHGGVW16QzG/m5HTomCoc0iKUTnMm2G5iEZXCTqcaC7GlEuXXsrbQLo7AAAQuklEQVR4nO1cC1fbRhY2sQYJ5EGL1wF7sSy/MfID29hgJwbMw0AoJJt2Q9om6S4O6XZDoW1S0t2WkG6zP3zvjJ5+AA5x4kjoyznGkkb36H6+r7kzisvlwIEDBw4cOHDgwIEDBw4cOHDgwMGnBdTTIAXvL8gKQHJKvExXhOTZpDcVmElI7LlDUTolnn/VUkB3GCaXjF5AC0rnOQYgkI9IIHrOSDZGBF3GryUgMm43ZrjwrNRdGRQNM4JbB2bcya4DkSxogj7o834EsHlFYY7BYrfrKMGZGFFYKXSjD+mCmA/9zB8aUU5VlVvo9vOjGQa72yFEupiCqFEn5C3uPSjLMIoqTLcAidIM10EJqF3oHJnXBAmWj7SiGHf7KKpctkOX6LRuJSTM6gdM51AQhBVBRZyyOClsVtDiREdAgR9fCyLCQjIRyDE6KXKH2lpkcmOua2SyDBCSBE5RhLnT+dubOGBJyRZgOI4aCxdjW5MuQlFMr2DMLLAfT4H+Q4yns9TipwuxQsdPr//ybiauXGOzhVhkitzAzcTjRqRFcjyep4LchVhO/oga9B2owii1B55DbGdkRLrnFLRrMCyhnIXwYipUIpqgahc5VgKKa0ozgW4VR0K/bNIeaUxxQgx1Cupe0FkHKKYl2q5lFtJdRzDcShKjOW4a4K7OVaPqSTanZiRctHgRi2Tt1xU6Uyu5XtE0ndI1RUkGT7sJJ1zSpZ2FKkbj1vJZeEEzE6Fr8hSn1es4oicSw0uEvHEyrA7kuGg3QRZCVFeve1kvGyHWSK56esY5/SaZ6+TJmkBZPdOmQT3ZF6EoJlRdIcSqhSu3YOQSSU0wbjytVSgmQcTe5KIqKG49P4q61XAB9RdlAFMwGieudCAZc08B3AVvKq3dFkh6MTk5hb0pLx2q2xtHqj5DkPU4gZrUXJDBBFg90jmBYkSNOJhhZvS8izQOBIYhroJSrYI0uRbkxFXUskqFPDvydnLiYu/oyXrWOBs1Kn4aPjR7UyKM7knW40S3C1VdPQkZnEDNqnIimO2ElTT2qJ1Adnab7yS9TKxEKdZiEZed037dOeW4gNs4QYFCeG6aRo5sOq0n2XAsRk9OcbNpagkRTZBPuVFOx6tkhDsXK1gqNZvqdqWsZyMdnGQZZQ4MQ0x5Z4rTBtK+NpptL+vBOjhOtSNLNQ2QZhYcVqpRydfJiV7ae43IIE1pjSWGGgHKtRW7Uj6/wFHrSiVmrFTpG9W4kKKNEVbUVU2wytqWkZjMpb9k9NpQiyDGSwUhiVGshMYTKy1s6NU46BugyGq6cnk48rrMXsGZus6S3sXHlJOCJginVEGCWVDAQpaip1M3XcliTEs4dH3LZTYBLmwkED0R4wjhR"
            alt="404 Not Found"
            className="max-w-full h-auto md:max-w-lg rounded-2xl shadow-2xl mb-8 relative z-10 animate-bounce-slow hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* 404 Text with Gradient */}
        <div className="relative mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <h1 className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-[#101540] via-[#1a2166] to-[#101540] bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-lg">
            404
          </h1>
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(16,21,64,0.1)] via-[rgba(16,21,64,0.2)] to-[rgba(16,21,64,0.1)] blur-2xl -z-10 animate-pulse" />
        </div>

        {/* Title */}
        <h2
          className="text-3xl md:text-4xl font-semibold text-[#101540] mb-6 animate-fade-in-up"
          style={{ animationDelay: "0.4s" }}
        >
          Oops! Page Not Found
        </h2>

        {/* Description */}
        <p
          className="text-gray-600 text-center max-w-md mb-8 text-lg animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          It looks like you're lost in the digital wilderness. Let's get you back on track!
        </p>

        {/* CTA Button with Enhanced Effects */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2 bg-gradient-to-r from-[#101540] to-[#1a2166] text-white px-8 py-4 rounded-full font-medium hover:shadow-[0_0_30px_rgba(16,21,64,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up relative overflow-hidden"
          style={{ animationDelay: "0.8s" }}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          <svg
            className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <span className="relative z-10">Back to Home</span>
        </Link>

        {/* Additional Info */}
        <div
          className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-500 animate-fade-in-up"
          style={{ animationDelay: "1s" }}
        >
          <Link href="/" className="hover:text-[#101540] transition-colors duration-300 flex items-center gap-1 group">
            <svg
              className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l7.89 5.26a2 2 0 002.22 0L21 8M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/contact"
            className="hover:text-[#101540] transition-colors duration-300 flex items-center gap-1 group"
          >
            <svg
              className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            Contact
          </Link>
          <span className="text-gray-300">|</span>
          <Link
            href="/help"
            className="hover:text-[#101540] transition-colors duration-300 flex items-center gap-1 group"
          >
            <svg
              className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Help
          </Link>
        </div>
      </div>
    </div>
  )
}
