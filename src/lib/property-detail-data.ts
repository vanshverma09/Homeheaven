import { allListingProperties, type ListingProperty } from "./properties-data";

// ──────────────────────────────────────
// Extended detail data for each property
// ──────────────────────────────────────

export interface PropertyDetail extends Omit<ListingProperty, "amenities"> {
  images: string[];
  description: string;
  status: "Available" | "Under Offer" | "Sold" | "Rented";
  amenities: string[];
  yearBuilt: number;
  dealer: {
    name: string;
    phone: string;
    whatsapp: string;
    company: string;
    avatar: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

const galleryImages: Record<number, string[]> = {
  1: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
    "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
  ],
  2: [
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&q=80",
  ],
  3: [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
    "https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=1200&q=80",
    "https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=1200&q=80",
  ],
};

const defaultGallery = [
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&q=80",
];

const descriptions: Record<string, string> = {
  Residential:
    "This stunning property offers the perfect blend of modern luxury and comfortable living. Featuring an open-concept floor plan with floor-to-ceiling windows that flood every room with natural light. The gourmet kitchen is equipped with premium stainless steel appliances, quartz countertops, and a spacious island perfect for entertaining. The primary suite boasts a spa-like bathroom with a soaking tub, dual vanities, and a walk-in closet. The outdoor living space includes a beautifully landscaped garden and a covered patio ideal for year-round enjoyment. Located in a prime neighborhood with easy access to top-rated schools, shopping, dining, and major transportation routes.",
  Commercial:
    "A premium commercial space designed for modern businesses seeking a prestigious address. The property features a contemporary open layout with high ceilings, abundant natural light, and state-of-the-art infrastructure. Equipped with advanced HVAC systems, high-speed fiber optic connectivity, and smart building management. The space includes dedicated parking, ADA-compliant facilities, and flexible floor plans that can be customized to suit your business needs. Situated in a bustling commercial corridor with high foot traffic, excellent visibility, and proximity to major transportation hubs, restaurants, and amenities.",
  Plot:
    "A prime piece of land in a highly sought-after location, perfect for building your dream project. The plot features excellent topography with gentle elevation changes, mature trees along the perimeter, and underground utilities already in place. Zoning permits allow for residential or mixed-use development. The lot is situated in an area experiencing rapid growth and appreciation, making it an excellent investment opportunity. Surrounded by established neighborhoods, quality infrastructure, and within the boundaries of top-rated school districts.",
  "Agricultural Land":
    "An exceptional agricultural property with rich, fertile soil ideal for farming, ranching, or vineyard development. The land features rolling terrain with natural water sources, established irrigation infrastructure, and excellent drainage. Multiple access points provide convenient entry from county roads. The property includes fencing along the perimeter, several outbuildings, and potential for a homestead. Surrounded by active agricultural operations and located near major markets, processing facilities, and supply chains. An outstanding opportunity for established farmers or investors looking to enter the agricultural sector.",
};

const residentialAmenities = ["Parking", "Garden", "Lift", "Gym", "Swimming Pool", "Security", "Power Backup", "Club House"];
const commercialAmenities = ["Parking", "Lift", "Security", "Power Backup", "Conference Room", "Cafeteria", "High-Speed Internet", "24/7 Access"];
const plotAmenities = ["Gated Community", "Street Lighting", "Water Connection", "Electricity", "Wide Roads", "Park Nearby"];
const agriAmenities = ["Water Source", "Fencing", "Road Access", "Electricity", "Storage Shed", "Irrigation System"];

const dealers = [
  {
    name: "Robert Mitchell",
    phone: "+1 (555) 234-5678",
    whatsapp: "+15552345678",
    company: "Mitchell Realty Group",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
  },
  {
    name: "Jessica Adams",
    phone: "+1 (555) 345-6789",
    whatsapp: "+15553456789",
    company: "Adams & Co. Properties",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
  },
  {
    name: "David Park",
    phone: "+1 (555) 456-7890",
    whatsapp: "+15554567890",
    company: "Park Estates International",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  },
];

const statuses: Array<"Available" | "Under Offer" | "Sold" | "Rented"> = [
  "Available", "Available", "Available", "Under Offer", "Available",
  "Available", "Available", "Available", "Available", "Available",
];

function getAmenities(category: string): string[] {
  switch (category) {
    case "Residential": return residentialAmenities;
    case "Commercial": return commercialAmenities;
    case "Plot": return plotAmenities;
    case "Agricultural Land": return agriAmenities;
    default: return residentialAmenities;
  }
}

export function getPropertyDetail(id: number): PropertyDetail | null {
  const base = allListingProperties.find((p) => p.id === id);
  if (!base) return null;

  const images = galleryImages[id] || [
    base.image.replace("w=800", "w=1200"),
    ...defaultGallery,
  ];

  // Generate some semi-random but consistent coordinates based on ID
  // Center roughly around US (37.0902, -95.7129)
  const baseLat = 37.0902 + (id % 10) - 5;
  const baseLng = -95.7129 + (id % 20) - 10;

  return {
    ...base,
    images,
    description: descriptions[base.category] || descriptions["Residential"],
    status: statuses[id % statuses.length] ?? "Available",
    amenities: getAmenities(base.category),
    yearBuilt: base.category === "Plot" || base.category === "Agricultural Land" ? 0 : 2018 + (id % 8),
    dealer: dealers[id % dealers.length]!,
    coordinates: {
      lat: baseLat,
      lng: baseLng,
    }
  };
}

export function getSimilarProperties(id: number, limit = 3): ListingProperty[] {
  const current = allListingProperties.find((p) => p.id === id);
  if (!current) return [];

  return allListingProperties
    .filter((p) => p.id !== id && (p.category === current.category || p.city === current.city))
    .slice(0, limit);
}
