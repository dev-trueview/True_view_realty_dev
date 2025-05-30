
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PropertyCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const soldProperties = [
    {
      id: 1,
      image: "/placeholder.svg",
      title: "Luxury Penthouse",
      location: "Manhattan, NYC",
      price: "$3.2M",
      description: "Recently sold premium penthouse with stunning city views"
    },
    {
      id: 2,
      image: "/placeholder.svg",
      title: "Modern Villa",
      location: "Beverly Hills, CA",
      price: "$2.8M",
      description: "Beautiful modern villa with pool and garden"
    },
    {
      id: 3,
      image: "/placeholder.svg",
      title: "Waterfront Condo",
      location: "Miami Beach, FL",
      price: "$1.5M",
      description: "Stunning waterfront property with private beach access"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % soldProperties.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [soldProperties.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % soldProperties.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + soldProperties.length) % soldProperties.length);
  };

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {soldProperties.map((property, index) => (
        <div
          key={property.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div
            className="w-full h-full bg-cover bg-center relative"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${property.image})`
            }}
          >
            {/* SOLD OUT Stamp */}
            <div className="absolute top-6 right-6">
              <Badge className="bg-red-600 text-white text-lg px-4 py-2 rotate-12 shadow-lg">
                SOLD OUT
              </Badge>
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white max-w-2xl px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {property.title}
                </h1>
                <p className="text-xl md:text-2xl mb-2">{property.location}</p>
                <p className="text-lg md:text-xl mb-4">{property.description}</p>
                <div className="text-2xl md:text-3xl font-bold text-green-400">
                  {property.price}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 border-white/30 text-white hover:bg-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {soldProperties.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default PropertyCarousel;
