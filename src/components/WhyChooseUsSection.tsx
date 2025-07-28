
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Users, DollarSign, Shield, Clock, Award } from "lucide-react";

const WhyChooseUsSection = () => {
  const features = [
    {
      icon: CheckCircle,
      title: "Verified Listings",
      description: "All our properties are thoroughly verified and authenticated before listing."
    },
    {
      icon: Users,
      title: "Expert Agents",
      description: "Our experienced agents provide personalized service and market expertise."
    },
    {
      icon: DollarSign,
      title: "Easy Financing",
      description: "We help you secure the best financing options for your dream home."
    },
    {
      icon: Shield,
      title: "Secure Transactions",
      description: "Your transactions are protected with our secure and transparent process."
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock customer support for all your real estate needs."
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized for excellence in real estate services and customer satisfaction."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose TrueView Reality?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
