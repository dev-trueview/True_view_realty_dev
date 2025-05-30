
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Home, Star } from "lucide-react";

const AboutUs = () => {
  const stats = [
    { icon: Home, number: "500+", label: "Properties Sold" },
    { icon: Users, number: "1000+", label: "Happy Clients" },
    { icon: Award, number: "15+", label: "Years Experience" },
    { icon: Star, number: "4.9", label: "Client Rating" },
  ];

  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      image: "/placeholder.svg",
      description: "15+ years of real estate experience with a passion for helping families find their perfect home."
    },
    {
      name: "Sarah Johnson",
      role: "Senior Agent",
      image: "/placeholder.svg",
      description: "Specialized in luxury properties with an eye for detail and commitment to excellence."
    },
    {
      name: "Mike Davis",
      role: "Property Consultant",
      image: "/placeholder.svg",
      description: "Expert in residential properties with deep knowledge of local markets and trends."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">About EliteHomes</h1>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              We are a premier real estate agency dedicated to helping you find your perfect home. 
              With years of experience and a commitment to excellence, we make your property dreams come true.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</h3>
                  <p className="text-gray-600">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Our Mission</h2>
            <p className="text-gray-600 text-lg mb-8">
              At EliteHomes, our mission is to provide exceptional real estate services that exceed expectations. 
              We believe that finding the right home is about more than just the property - it's about finding 
              the perfect place where memories are made and dreams are realized.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Integrity</h3>
                <p className="text-gray-600">We conduct business with the highest level of honesty and transparency.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Excellence</h3>
                <p className="text-gray-600">We strive for excellence in every aspect of our service delivery.</p>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Client-First</h3>
                <p className="text-gray-600">Your needs and satisfaction are our top priority in everything we do.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our experienced team of real estate professionals is here to guide you through every step of your property journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;
