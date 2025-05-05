import { useState, useEffect } from "react";
import {
  Plane,
  MapPin,
  Globe,
  Luggage,
  Hotel,
  Camera,
  Calendar,
} from "lucide-react";

const Loader = () => {
  const [activeIcon, setActiveIcon] = useState(0);

  const icons = [
    <Plane size={28} className="text-teal-200" />,
    <Hotel size={28} className="text-teal-200" />,
    <Luggage size={28} className="text-teal-200" />,
    <MapPin size={28} className="text-teal-200" />,
    <Camera size={28} className="text-teal-200" />,
    <Calendar size={28} className="text-teal-200" />,
    <Globe size={28} className="text-teal-200" />,
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % icons.length);
    }, 800);

    return () => clearInterval(interval);
  }, [icons.length]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto mt-8 p-6 rounded-2xl shadow-lg backdrop-blur-lg bg-white/10 border border-white/20">
      {/* Main plane icon */}
      <div className="mb-8 relative">
        <Plane
          size={60}
          className="text-teal-400"
          style={{
            transform: "rotate(-45deg)",
            animation: "float 2s infinite ease-in-out",
          }}
        />
        <div className="absolute -bottom-1 left-1/2 w-16 h-2 bg-gray-900 rounded-full transform -translate-x-1/2 animate-pulse"></div>
      </div>

      {/* Message */}
      <h2 className="text-2xl font-medium text-teal-200 mb-4">
        Your trip is planning with AI...
      </h2>

      {/* Icons row */}
      <div className="flex justify-center gap-4 flex-wrap max-w-md">
        {icons.map((icon, idx) => (
          <div
            key={idx}
            className={`p-2 transition-all duration-300 ${
              idx === activeIcon ? "bg-teal-500 scale-125" : "opacity-40"
            } rounded-lg`}
          >
            {icon}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(-45deg);
          }
          50% {
            transform: translateY(-10px) rotate(-45deg);
          }
        }
      `}</style>
    </div>
  );
};
export default Loader;
