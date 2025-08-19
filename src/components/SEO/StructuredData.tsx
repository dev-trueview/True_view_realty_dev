import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type: 'RealEstateAgent' | 'AboutPage' | 'ContactPage' | 'PropertyListing';
  data?: any;
  breadcrumbs?: Array<{name: string; url: string}>;
  faqs?: Array<{question: string; answer: string}>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ 
  type, 
  data, 
  breadcrumbs = [], 
  faqs = [] 
}) => {
  // Organization Schema
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "name": "TrueView Reality",
    "description": "Premium real estate services in Pune, specializing in luxury residential and commercial properties",
    "url": "https://trueviewreality.com",
    "logo": "https://trueviewreality.com/favicon.png",
    "image": "https://trueviewreality.com/favicon.png",
    "telephone": "+91 7620658446",
    "email": "trueviewrealty.in@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Trueviewrealty office",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.5204",
      "longitude": "73.8567"
    },
    "openingHours": [
      "Mo-Fr 09:00-19:00",
      "Sa 10:00-17:00"
    ],
    "areaServed": {
      "@type": "City",
      "name": "Pune"
    },
    "serviceType": "Real Estate Services",
    "sameAs": [
      "https://www.facebook.com/truviewreality",
      "https://www.instagram.com/truviewreality",
      "https://www.linkedin.com/company/truviewreality"
    ]
  };

  // Local Business Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://trueviewreality.com/#organization",
    "name": "TrueView Reality",
    "description": "Premium real estate services in Pune",
    "url": "https://trueviewreality.com",
    "telephone": "+91 7620658446",
    "email": "trueviewrealty.in@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Trueviewrealty office",
      "addressLocality": "Pune",
      "addressRegion": "Maharashtra",
      "postalCode": "411001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "18.5204",
      "longitude": "73.8567"
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        "opens": "09:00",
        "closes": "19:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "10:00",
        "closes": "17:00"
      }
    ],
    "priceRange": "$$$$",
    "image": "https://trueviewreality.com/favicon.png",
    "logo": "https://trueviewreality.com/favicon.png"
  };

  const schemas: any[] = [organizationSchema, localBusinessSchema];

  // Add breadcrumb schema if provided
  if (breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": crumb.name,
        "item": crumb.url
      }))
    };
    schemas.push(breadcrumbSchema);
  }

  // Add FAQ schema if provided
  if (faqs.length > 0) {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    schemas.push(faqSchema);
  }

  // Add property schema if type is PropertyListing and data is provided
  if (type === 'PropertyListing' && data) {
    const propertySchema = {
      "@context": "https://schema.org",
      "@type": "RealEstateListing",
      "name": data.title,
      "description": data.description,
      "url": `https://trueviewreality.com/property/${data.id}`,
      "image": data.images || [],
      "price": {
        "@type": "PriceSpecification",
        "price": data.price,
        "priceCurrency": "INR"
      },
      "floorSize": {
        "@type": "QuantitativeValue",
        "value": data.area,
        "unitText": "SQ FT"
      },
      "numberOfBedrooms": data.bedrooms,
      "numberOfBatrooms": data.bathrooms,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": data.location,
        "addressLocality": "Pune",
        "addressRegion": "Maharashtra",
        "addressCountry": "IN"
      },
      "datePosted": data.created_at,
      "availabilityStarts": data.available_from || data.created_at,
      "seller": {
        "@type": "RealEstateAgent",
        "name": "TrueView Reality",
        "telephone": "+91 7620658446",
        "email": "trueviewrealty.in@gmail.com"
      }
    };
    schemas.push(propertySchema);
  }

  return (
    <Helmet>
      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default StructuredData;