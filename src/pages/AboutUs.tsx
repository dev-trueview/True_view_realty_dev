
import { Card, CardContent } from "@/components/ui/card";
import { Users, Award, Home, TrendingUp, Eye, Target, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const AboutUs = () => {
  const stats = [
    { icon: Home, label: "Properties Sold", value: "2,500+" },
    { icon: Users, label: "Happy Clients", value: "5,000+" },
    { icon: Award, label: "Years Experience", value: "15+" },
    { icon: TrendingUp, label: "Success Rate", value: "98%" },
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "/placeholder.svg",
      bio: "Visionary leader with 15+ years in real estate technology and innovation."
    },
    {
      name: "Marcus Rodriguez",
      role: "Chief Technology Officer",
      image: "/placeholder.svg",
      bio: "Tech expert specializing in AI-powered property analysis and virtual reality tours."
    },
    {
      name: "Emily Watson",
      role: "Head of Client Relations",
      image: "/placeholder.svg",
      bio: "Customer experience specialist dedicated to exceptional client satisfaction."
    },
    {
      name: "David Kim",
      role: "Senior Property Advisor",
      image: "/placeholder.svg",
      bio: "Market analyst with deep knowledge of luxury and commercial properties."
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animated-gradient">
              About TrueView Reality
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing the real estate industry with cutting-edge technology, 
              personalized service, and an unwavering commitment to making your property dreams a reality.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-cyan-500/20 backdrop-blur-sm hover:border-cyan-400/40 transition-all duration-300 transform hover:scale-105 neon-glow">
                <CardContent className="p-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-cyan-500/25">
                    <stat.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
                  <p className="text-gray-300">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-cyan-500/25">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Vision</h3>
                <p className="text-gray-300 leading-relaxed">
                  To create a transparent, technology-driven real estate ecosystem where every transaction 
                  is seamless, informed, and tailored to individual needs.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/25">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Mission</h3>
                <p className="text-gray-300 leading-relaxed">
                  To empower clients with cutting-edge tools, expert guidance, and personalized service 
                  that transforms the real estate experience into an exciting journey.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-pink-500/20 hover:border-pink-400/40 transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/25">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Our Values</h3>
                <p className="text-gray-300 leading-relaxed">
                  Integrity, innovation, and client success drive everything we do. We believe in building 
                  lasting relationships through trust, transparency, and exceptional results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>


      {/* Why Choose Us Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
              Why Choose TrueView Reality?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Analytics",
                description: "Advanced algorithms provide deep market insights and property valuations."
              },
              {
                title: "Virtual Reality Tours",
                description: "Immersive VR experiences let you explore properties from anywhere."
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock assistance with dedicated client success managers."
              },
              {
                title: "Blockchain Security",
                description: "Secure, transparent transactions with cutting-edge blockchain technology."
              },
              {
                title: "Smart Matching",
                description: "Our AI matches you with properties that perfectly fit your criteria."
              },
              {
                title: "Future-Ready",
                description: "Stay ahead with the latest innovations in real estate technology."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 hover-lift">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
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
