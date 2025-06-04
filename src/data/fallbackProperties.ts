
// Fallback property data when backend is unavailable
export const fallbackProperties = [
  {
    id: 1,
    image: "/placeholder.svg",
    price: "$750,000 - $850,000",
    location: "Downtown Seattle",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    image: "/placeholder.svg", 
    price: "$1,200,000 - $1,400,000",
    location: "Beverly Hills",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3200,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    image: "/placeholder.svg",
    price: "$450,000 - $550,000",
    location: "Austin Texas",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    image: "/placeholder.svg",
    price: "$2,100,000 - $2,500,000",
    location: "Manhattan NYC",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    image: "/placeholder.svg",
    price: "$650,000 - $750,000",
    location: "San Francisco",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2100,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    image: "/placeholder.svg",
    price: "$900,000 - $1,100,000",
    location: "Miami Beach",
    type: "Condo",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1600,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 7,
    image: "/placeholder.svg",
    price: "$1,800,000 - $2,200,000",
    location: "Los Angeles",
    type: "Villa",
    bedrooms: 6,
    bathrooms: 5,
    sqft: 4500,
    status: 'active' as const,
    created_at: new Date().toISOString()
  },
  {
    id: 8,
    image: "/placeholder.svg",
    price: "$425,000 - $525,000",
    location: "Phoenix",
    type: "Townhouse",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1900,
    status: 'active' as const,
    created_at: new Date().toISOString()
  }
];
