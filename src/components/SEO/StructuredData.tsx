import React from 'react';
import { Helmet } from 'react-helmet-async';

export const generateOrganizationSchema = () => ({
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
});

export const generateBreadcrumbSchema = (breadcrumbs: Array<{name: string; url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generatePropertySchema = (property: any) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "name": property.title,
  "description": property.description,
  "url": `https://trueviewreality.com/property/${property.id}`,
  "image": property.images?.map((img: string) => img) || [],
  "price": {
    "@type": "PriceSpecification",
    "price": property.price,
    "priceCurrency": "INR"
  },
  "floorSize": {
    "@type": "QuantitativeValue",
    "value": property.area,
    "unitText": "SQ FT"
  },
  "numberOfBedrooms": property.bedrooms,
  "numberOfBatrooms": property.bathrooms,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": property.location,
    "addressLocality": "Pune",
    "addressRegion": "Maharashtra",
    "addressCountry": "IN"
  },
  "geo": property.coordinates ? {
    "@type": "GeoCoordinates",
    "latitude": property.coordinates.lat,
    "longitude": property.coordinates.lng
  } : undefined,
  "datePosted": property.created_at,
  "availabilityStarts": property.available_from || property.created_at,
  "seller": {
    "@type": "RealEstateAgent",
    "name": "TrueView Reality",
    "telephone": "+91 7620658446",
    "email": "trueviewrealty.in@gmail.com"
  }
});

export const generateFAQSchema = (faqs: Array<{question: string; answer: string}>) => ({
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
});

export const generateLocalBusinessSchema = () => ({
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
});

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
  const getSchemas = () => {
    const schemas = [];

    // Always include organization schema
    schemas.push(generateOrganizationSchema());

    // Add local business schema
    schemas.push(generateLocalBusinessSchema());

    // Add type-specific schemas
    switch (type) {
      case 'RealEstateAgent':
        // Already included above
        break;
      case 'PropertyListing':
        if (data) {
          schemas.push(generatePropertySchema(data));
        }
        break;
      case 'AboutPage':
      case 'ContactPage':
        // Use organization schema which is already included
        break;
      default:
        break;
    }

    // Add breadcrumb schema if provided
    if (breadcrumbs.length > 0) {
      schemas.push(generateBreadcrumbSchema(breadcrumbs));
    }

    // Add FAQ schema if provided
    if (faqs.length > 0) {
      schemas.push(generateFAQSchema(faqs));
    }

    return schemas;
  };

  const schemas = getSchemas();

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