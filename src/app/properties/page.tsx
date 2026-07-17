"use client";

import { useReducer, useMemo, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building2,
  Home,
  LandPlot,
  Tractor,
  CheckCircle2,
  Car, Trees, ArrowUpFromLine, Dumbbell, Waves
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  allListingProperties,
  cities,
  propertyCategories,
  bedroomOptions,
  type ListingProperty,
  type PropertyCategory,
  type FurnishingStatus,
  type ConstructionStatus
} from "@/lib/properties-data";

const ITEMS_PER_PAGE = 9;

type SortOption = "newest" | "price-low" | "price-high";

const categoryIcons: Record<PropertyCategory, React.ComponentType<{ className?: string }>> = {
  Residential: Home,
  Commercial: Building2,
  Plot: LandPlot,
  "Agricultural Land": Tractor,
};

// ──────────────────────────────────────
// Filter State Management
// ──────────────────────────────────────
interface FilterState {
  searchQuery: string;
  selectedCity: string;
  selectedCategory: string;
  selectedBedrooms: string;
  priceRange: number[];
  furnishing: string[];
  constructionStatus: string[];
  amenities: {
    parking: boolean;
    garden: boolean;
    lift: boolean;
    gym: boolean;
    swimmingPool: boolean;
  };
}

type FilterAction =
  | { type: "SET_SEARCH"; payload: string }
  | { type: "SET_CITY"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_BEDROOMS"; payload: string }
  | { type: "SET_PRICE"; payload: number[] }
  | { type: "TOGGLE_FURNISHING"; payload: string }
  | { type: "TOGGLE_CONSTRUCTION"; payload: string }
  | { type: "TOGGLE_AMENITY"; payload: keyof FilterState["amenities"] }
  | { type: "CLEAR_ALL" };

const initialFilterState: FilterState = {
  searchQuery: "",
  selectedCity: "all",
  selectedCategory: "all",
  selectedBedrooms: "any",
  priceRange: [0, 10000000],
  furnishing: [],
  constructionStatus: [],
  amenities: {
    parking: false,
    garden: false,
    lift: false,
    gym: false,
    swimmingPool: false,
  },
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, searchQuery: action.payload };
    case "SET_CITY":
      return { ...state, selectedCity: action.payload };
    case "SET_CATEGORY":
      return { ...state, selectedCategory: action.payload };
    case "SET_BEDROOMS":
      return { ...state, selectedBedrooms: action.payload };
    case "SET_PRICE":
      return { ...state, priceRange: action.payload };
    case "TOGGLE_FURNISHING":
      return {
        ...state,
        furnishing: state.furnishing.includes(action.payload)
          ? state.furnishing.filter((f) => f !== action.payload)
          : [...state.furnishing, action.payload],
      };
    case "TOGGLE_CONSTRUCTION":
      return {
        ...state,
        constructionStatus: state.constructionStatus.includes(action.payload)
          ? state.constructionStatus.filter((c) => c !== action.payload)
          : [...state.constructionStatus, action.payload],
      };
    case "TOGGLE_AMENITY":
      return {
        ...state,
        amenities: {
          ...state.amenities,
          [action.payload]: !state.amenities[action.payload],
        },
      };
    case "CLEAR_ALL":
      return initialFilterState;
    default:
      return state;
  }
}

// ──────────────────────────────────────
// Property Card
// ──────────────────────────────────────
function PropertyCard({ property, index }: { property: ListingProperty; index: number }) {
  return (
    <Link href={`/properties/${property.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true, margin: "-50px" }}
        className="group relative bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500"
      >
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge
              className={`px-2.5 py-1 text-xs font-semibold rounded-full border-0 ${
                property.type === "Sale" ? "bg-emerald-500 text-white" : "bg-violet-500 text-white"
              }`}
            >
              For {property.type}
            </Badge>
            <Badge className="px-2.5 py-1 text-xs font-medium rounded-full border-0 bg-black/40 backdrop-blur-sm text-white">
              {property.category}
            </Badge>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-3 right-3 size-8 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white hover:bg-white/40 transition-colors duration-200 cursor-pointer"
            onClick={(e) => e.preventDefault()}
          >
            <Heart className="size-3.5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
            {property.priceLabel}
          </p>

          <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-200 line-clamp-1">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
            <MapPin className="size-3.5 text-emerald-500 shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Features */}
          <div className="flex items-center gap-3 pt-3 border-t border-border text-sm text-muted-foreground">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="size-3.5" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="size-3.5" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Maximize className="size-3.5" />
              <span>{property.area}</span>
            </div>
          </div>

          {/* View Details */}
          <Button
            variant="outline"
            className="w-full mt-2 rounded-xl border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 cursor-pointer"
          >
            View Details
          </Button>
        </div>
      </motion.div>
    </Link>
  );
}

// ──────────────────────────────────────
// Filter Sidebar
// ──────────────────────────────────────
function FilterSidebar({
  state,
  dispatch,
  activeFilterCount,
}: {
  state: FilterState;
  dispatch: React.Dispatch<FilterAction>;
  activeFilterCount: number;
}) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <SlidersHorizontal className="size-5 text-emerald-500" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full border-0">
              {activeFilterCount}
            </Badge>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: "CLEAR_ALL" })}
            className="text-sm text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <X className="size-3.5 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Search Area / Title</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={state.searchQuery}
            onChange={(e) => dispatch({ type: "SET_SEARCH", payload: e.target.value })}
            className="pl-9 rounded-xl bg-muted/50 border-border"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">City</label>
        <Select value={state.selectedCity} onValueChange={(v) => dispatch({ type: "SET_CITY", payload: v || "all" })}>
          <SelectTrigger className="rounded-xl bg-muted/50 cursor-pointer">
            <SelectValue placeholder="All Cities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Cities</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city} value={city}>{city}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Property Type */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Property Type</label>
        <div className="grid grid-cols-2 gap-2">
          {propertyCategories.map((cat) => {
            const Icon = categoryIcons[cat];
            const isActive = state.selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => dispatch({ type: "SET_CATEGORY", payload: isActive ? "all" : cat })}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-3.5" />
                {cat === "Agricultural Land" ? "Agri Land" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Bedrooms</label>
        <Select value={state.selectedBedrooms} onValueChange={(v) => dispatch({ type: "SET_BEDROOMS", payload: v || "any" })}>
          <SelectTrigger className="rounded-xl bg-muted/50 cursor-pointer">
            <SelectValue placeholder="Any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any</SelectItem>
            {bedroomOptions.map((num) => (
              <SelectItem key={num} value={String(num)}>{num}+ Bedrooms</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-foreground">Price Range</label>
        <Slider
          value={state.priceRange}
          onValueChange={(v) => dispatch({ type: "SET_PRICE", payload: v as number[] })}
          max={10000000}
          min={0}
          step={50000}
          className="w-full"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${(state.priceRange[0] ?? 0).toLocaleString()}</span>
          <span>${(state.priceRange[1] ?? 10000000).toLocaleString()}</span>
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* Advanced Filters */}
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground">Advanced Filters</h4>

        {/* Furnishing */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Furnishing</label>
          <div className="flex flex-wrap gap-2">
            {["Furnished", "Semi Furnished", "Unfurnished"].map((opt) => (
              <button
                key={opt}
                onClick={() => dispatch({ type: "TOGGLE_FURNISHING", payload: opt })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                  state.furnishing.includes(opt) 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" 
                    : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {state.furnishing.includes(opt) && <CheckCircle2 className="size-3.5" />}
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Construction Status */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Construction Status</label>
          <div className="flex flex-wrap gap-2">
            {["Ready To Move", "Under Construction"].map((opt) => (
              <button
                key={opt}
                onClick={() => dispatch({ type: "TOGGLE_CONSTRUCTION", payload: opt })}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer border ${
                  state.constructionStatus.includes(opt) 
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" 
                    : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                }`}
              >
                {state.constructionStatus.includes(opt) && <CheckCircle2 className="size-3.5" />}
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amenities</label>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(state.amenities) as Array<keyof FilterState["amenities"]>).map((amenity) => {
              const icons = {
                parking: <Car className="size-3.5 mr-2" />,
                garden: <Trees className="size-3.5 mr-2" />,
                lift: <ArrowUpFromLine className="size-3.5 mr-2" />,
                gym: <Dumbbell className="size-3.5 mr-2" />,
                swimmingPool: <Waves className="size-3.5 mr-2" />
              };
              
              const isSelected = state.amenities[amenity];
              
              return (
                <button
                  key={amenity}
                  onClick={() => dispatch({ type: "TOGGLE_AMENITY", payload: amenity })}
                  className={`flex items-center px-3 py-2 rounded-xl text-xs font-medium transition-colors cursor-pointer border ${
                    isSelected
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400" 
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {icons[amenity]}
                  {amenity.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────
// Pagination
// ──────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pages = useMemo(() => {
    const p: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) p.push(i);
    } else {
      p.push(1);
      if (currentPage > 3) p.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) p.push(i);
      if (currentPage < totalPages - 2) p.push("...");
      p.push(totalPages);
    }
    return p;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex items-center justify-center gap-2 pt-10"
    >
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="rounded-xl cursor-pointer"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, idx) =>
        page === "..." ? (
          <span key={`dots-${idx}`} className="px-2 text-muted-foreground text-sm">...</span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            onClick={() => onPageChange(page)}
            className={`rounded-xl size-10 cursor-pointer ${
              currentPage === page ? "bg-emerald-600 hover:bg-emerald-500 text-white border-0" : ""
            }`}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="rounded-xl cursor-pointer"
      >
        <ChevronRight className="size-4" />
      </Button>
    </motion.div>
  );
}

// ──────────────────────────────────────
// Main Page Component
// ──────────────────────────────────────
export default function PropertiesPage() {
  const [state, dispatch] = useReducer(filterReducer, initialFilterState);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (state.searchQuery.trim()) count++;
    if (state.selectedCity !== "all") count++;
    if (state.selectedCategory !== "all") count++;
    if (state.selectedBedrooms !== "any") count++;
    if (state.priceRange[0] > 0 || (state.priceRange[1] ?? 10000000) < 10000000) count++;
    if (state.furnishing.length > 0) count++;
    if (state.constructionStatus.length > 0) count++;
    Object.values(state.amenities).forEach(val => { if (val) count++; });
    return count;
  }, [state]);

  // Reset page when filters change
  const dispatchWithReset = useCallback((action: FilterAction) => {
    dispatch(action);
    setCurrentPage(1);
  }, []);

  // Filter + Sort logic
  const filteredProperties = useMemo(() => {
    let result = [...allListingProperties];

    // Search (Title or Area/Location)
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      );
    }

    // Basic Filters
    if (state.selectedCity !== "all") result = result.filter((p) => p.city === state.selectedCity);
    if (state.selectedCategory !== "all") result = result.filter((p) => p.category === state.selectedCategory);
    if (state.selectedBedrooms !== "any") {
      const min = parseInt(state.selectedBedrooms);
      result = result.filter((p) => p.bedrooms >= min);
    }
    result = result.filter((p) => p.price >= (state.priceRange[0] ?? 0) && p.price <= (state.priceRange[1] ?? 10000000));

    // Advanced Filters
    if (state.furnishing.length > 0) {
      result = result.filter(p => state.furnishing.includes(p.furnishing));
    }
    if (state.constructionStatus.length > 0) {
      result = result.filter(p => state.constructionStatus.includes(p.constructionStatus));
    }
    
    // Amenities (Must have all selected amenities)
    const activeAmenities = Object.entries(state.amenities)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => key as keyof typeof state.amenities);
      
    if (activeAmenities.length > 0) {
      result = result.filter(p => activeAmenities.every(amenity => p.amenities[amenity]));
    }

    // Sort
    switch (sortBy) {
      case "price-low": result.sort((a, b) => a.price - b.price); break;
      case "price-high": result.sort((a, b) => b.price - a.price); break;
      case "newest": result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
    }

    return result;
  }, [state, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 lg:pt-24 pb-16 bg-background">
        {/* Page Header */}
        <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 py-16 sm:py-20">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -right-20 size-60 border border-white/10 rounded-full"
          />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                Find Your <span className="text-emerald-200">Perfect Home</span>
              </h1>
              <p className="text-white/70 max-w-xl mx-auto text-lg">
                Use our advanced search to find exactly what you are looking for.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="sticky top-28 p-6 bg-card rounded-2xl border border-border shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto custom-scrollbar">
                <FilterSidebar
                  state={state}
                  dispatch={dispatchWithReset}
                  activeFilterCount={activeFilterCount}
                />
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredProperties.length}</span> properties
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {/* Mobile Filter Toggle */}
                  <Button
                    variant="outline"
                    onClick={() => setShowMobileFilters(true)}
                    className="lg:hidden rounded-xl cursor-pointer"
                  >
                    <SlidersHorizontal className="size-4 mr-2" />
                    Filters
                    {activeFilterCount > 0 && (
                      <Badge className="ml-2 bg-emerald-500 text-white text-xs px-1.5 py-0 rounded-full border-0">
                        {activeFilterCount}
                      </Badge>
                    )}
                  </Button>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={(v) => setSortBy((v || "newest") as SortOption)}>
                    <SelectTrigger className="w-full sm:w-48 rounded-xl cursor-pointer">
                      <ArrowUpDown className="size-4 mr-2 text-muted-foreground" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Property Grid */}
              {paginatedProperties.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                      {paginatedProperties.map((property, index) => (
                        <PropertyCard key={property.id} property={property} index={index} />
                      ))}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
              ) : (
                /* Empty State */
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20 bg-card rounded-2xl border border-border mt-4">
                  <div className="inline-flex items-center justify-center size-20 rounded-full bg-muted mb-6">
                    <Search className="size-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    Try adjusting your filters, removing some amenities, or expanding your search criteria.
                  </p>
                  <Button onClick={() => dispatch({ type: "CLEAR_ALL" })} className="rounded-full bg-emerald-600 hover:bg-emerald-500 text-white border-0 cursor-pointer">
                    Clear All Filters
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <AnimatePresence>
          {showMobileFilters && (
            <>
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowMobileFilters(false)}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] bg-background border-r border-border shadow-2xl lg:hidden overflow-y-auto"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-foreground">Filters</h2>
                    <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)} className="cursor-pointer">
                      <X className="size-5" />
                    </Button>
                  </div>

                  <FilterSidebar state={state} dispatch={dispatchWithReset} activeFilterCount={activeFilterCount} />

                  <Button onClick={() => setShowMobileFilters(false)} className="w-full mt-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border-0 cursor-pointer sticky bottom-6">
                    Show {filteredProperties.length} Results
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
