import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  image?: string;
  rating: number;
  review: string;
  date: string;
  property?: string;
  verified?: boolean;
}

interface TestimonialsWithSchemaProps {
  testimonials?: Testimonial[];
}

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    role: 'Software Engineer',
    company: 'Tech Corp',
    rating: 5,
    review: 'TrueView Reality helped me find my dream home in Pune. Their professional approach and deep market knowledge made the entire process seamless. Highly recommended!',
    date: '2024-01-15',
    property: '3BHK Apartment in Kharadi',
    verified: true
  },
  {
    id: '2',
    name: 'Priya Patel',
    role: 'Business Owner',
    rating: 5,
    review: 'Excellent service and transparency throughout the property buying process. The team was very responsive and helped us negotiate the best deal. Very satisfied with our purchase.',
    date: '2024-02-10',
    property: 'Villa in Baner',
    verified: true
  },
  {
    id: '3',
    name: 'Amit Kumar',
    role: 'Manager',
    company: 'Finance Ltd',
    rating: 5,
    review: 'Professional team with in-depth knowledge of Pune real estate market. They understood our requirements perfectly and showed us properties that matched our criteria exactly.',
    date: '2024-01-28',
    property: '2BHK Flat in Hadapsar',
    verified: true
  }
];

const TestimonialsWithSchema: React.FC<TestimonialsWithSchemaProps> = ({ 
  testimonials = defaultTestimonials 
}) => {
  // Generate structured data for reviews
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrueView Reality",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": testimonials.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "review": testimonials.map(testimonial => ({
      "@type": "Review",
      "author": {
        "@type": "Person",
        "name": testimonial.name
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": testimonial.rating.toString(),
        "bestRating": "5",
        "worstRating": "1"
      },
      "reviewBody": testimonial.review,
      "datePublished": testimonial.date,
      "publisher": {
        "@type": "Organization",
        "name": "TrueView Reality"
      }
    }))
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(reviewsSchema)}
        </script>
      </Helmet>

      <section className="py-16 bg-gradient-to-br from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">
              Client Testimonials
            </Badge>
            <h2 className="text-4xl font-bold mb-4 text-gradient">
              What Our Clients Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Real experiences from satisfied clients who found their dream properties with TrueView Reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <Card 
                key={testimonial.id} 
                className="card-hover bg-card/50 backdrop-blur-sm border border-border/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-primary/70 flex items-center justify-center text-white font-semibold">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {testimonial.name}
                        </h4>
                        {testimonial.role && (
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                            {testimonial.company && ` at ${testimonial.company}`}
                          </p>
                        )}
                      </div>
                    </div>
                    {testimonial.verified && (
                      <Badge variant="secondary" className="text-xs">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(testimonial.rating)}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({testimonial.rating}/5)
                    </span>
                  </div>

                  <div className="relative mb-4">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <blockquote className="text-muted-foreground leading-relaxed pl-6">
                      "{testimonial.review}"
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-border/50">
                    {testimonial.property && (
                      <p className="text-sm font-medium text-foreground mb-2">
                        Property: {testimonial.property}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {new Date(testimonial.date).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Ready to Join Our Happy Clients?</h3>
                <p className="text-muted-foreground mb-6">
                  Let us help you find your perfect property in Pune. Get expert consultation 
                  and personalized service from our experienced team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-gradient">
                    Start Your Property Search
                  </button>
                  <button className="btn-outline-gradient">
                    Schedule Consultation
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default TestimonialsWithSchema;