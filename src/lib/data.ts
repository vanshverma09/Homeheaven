export const navLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Properties", href: "/properties" },
  { name: "Calculators", href: "/calculators" },
  { name: "Contact", href: "/contact" },
];

export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  type: "Sale" | "Rent";
  bedrooms: number;
  bathrooms: number;
  area: string;
  image: string;
  featured: boolean;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Modern Luxury Villa",
    location: "Beverly Hills, CA",
    price: "$2,450,000",
    type: "Sale",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,200 sq ft",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    featured: true,
  },
  {
    id: 2,
    title: "Downtown Penthouse",
    location: "Manhattan, NY",
    price: "$8,500/mo",
    type: "Rent",
    bedrooms: 3,
    bathrooms: 2,
    area: "2,100 sq ft",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    featured: true,
  },
  {
    id: 3,
    title: "Seaside Contemporary Home",
    location: "Malibu, CA",
    price: "$3,800,000",
    type: "Sale",
    bedrooms: 4,
    bathrooms: 3,
    area: "3,500 sq ft",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    featured: true,
  },
  {
    id: 4,
    title: "Urban Studio Loft",
    location: "San Francisco, CA",
    price: "$3,200/mo",
    type: "Rent",
    bedrooms: 1,
    bathrooms: 1,
    area: "850 sq ft",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    featured: true,
  },
  {
    id: 5,
    title: "Mountain View Estate",
    location: "Aspen, CO",
    price: "$5,200,000",
    type: "Sale",
    bedrooms: 6,
    bathrooms: 5,
    area: "6,800 sq ft",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    featured: true,
  },
  {
    id: 6,
    title: "Elegant City Apartment",
    location: "Chicago, IL",
    price: "$4,800/mo",
    type: "Rent",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,400 sq ft",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    featured: true,
  },
];

export const latestProperties: Property[] = [
  {
    id: 7,
    title: "Waterfront Mansion",
    location: "Miami Beach, FL",
    price: "$7,900,000",
    type: "Sale",
    bedrooms: 7,
    bathrooms: 6,
    area: "8,500 sq ft",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
    featured: false,
  },
  {
    id: 8,
    title: "Cozy Suburban Home",
    location: "Austin, TX",
    price: "$650,000",
    type: "Sale",
    bedrooms: 3,
    bathrooms: 2,
    area: "2,200 sq ft",
    image: "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
    featured: false,
  },
  {
    id: 9,
    title: "Luxury Condo Tower",
    location: "Seattle, WA",
    price: "$5,500/mo",
    type: "Rent",
    bedrooms: 2,
    bathrooms: 2,
    area: "1,600 sq ft",
    image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80",
    featured: false,
  },
];

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Homeowner",
    content:
      "HomeHeaven made finding our dream home an absolute breeze. Their team was professional, attentive, and truly understood what we were looking for. Couldn't be happier!",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Property Investor",
    content:
      "As a seasoned investor, I've worked with many agencies. HomeHeaven stands out with their market insights and dedication. They helped me secure three premium properties below market value.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "First-time Buyer",
    content:
      "Being a first-time buyer was intimidating, but the HomeHeaven team guided me through every step. Their transparency and patience made all the difference. Highly recommend!",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    rating: 5,
  },
];

export interface WhyChooseItem {
  icon: string;
  title: string;
  description: string;
}

export const whyChooseUs: WhyChooseItem[] = [
  {
    icon: "shield",
    title: "Trusted Dealers",
    description:
      "We partner only with verified and reputable dealers who have a proven track record in the real estate industry.",
  },
  {
    icon: "check",
    title: "Verified Listings",
    description:
      "Every property on our platform is thoroughly verified to ensure authenticity and accurate information.",
  },
  {
    icon: "tag",
    title: "Best Prices",
    description:
      "Our extensive network and market expertise enable us to offer competitive prices for every property listing.",
  },
  {
    icon: "headphones",
    title: "Expert Support",
    description:
      "Our dedicated team of real estate experts is available 24/7 to assist you throughout your property journey.",
  },
];
