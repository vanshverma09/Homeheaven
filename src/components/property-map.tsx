"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { 
  MapPin, 
  GraduationCap, 
  Building2, 
  Landmark, 
  Train, 
  Bus, 
  Utensils, 
  ShoppingBag, 
  Fuel,
  Car,
  Clock,
  Navigation
} from "lucide-react";
import { Button } from "@/components/ui/button";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "1rem"
};

type PlaceType = "school" | "hospital" | "bank" | "subway_station" | "bus_station" | "restaurant" | "shopping_mall" | "gas_station";

interface PlaceInfo {
  name: string;
  vicinity: string;
  type: PlaceType;
  distance?: string;
  duration?: string;
  location?: google.maps.LatLng;
}

const placeTypeMap: Record<PlaceType, { label: string, icon: React.ReactNode }> = {
  school: { label: "Schools", icon: <GraduationCap className="size-4" /> },
  hospital: { label: "Hospitals", icon: <Building2 className="size-4" /> },
  bank: { label: "Banks", icon: <Landmark className="size-4" /> },
  subway_station: { label: "Metro Stations", icon: <Train className="size-4" /> },
  bus_station: { label: "Bus Stands", icon: <Bus className="size-4" /> },
  restaurant: { label: "Restaurants", icon: <Utensils className="size-4" /> },
  shopping_mall: { label: "Shopping Malls", icon: <ShoppingBag className="size-4" /> },
  gas_station: { label: "Petrol Pumps", icon: <Fuel className="size-4" /> }
};

interface PropertyMapProps {
  coordinates: { lat: number, lng: number };
}

export function PropertyMap({ coordinates }: PropertyMapProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
    libraries: ['places'] // Needed for PlacesService
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeType, setActiveType] = useState<PlaceType>("school");
  const [places, setPlaces] = useState<PlaceInfo[]>([]);
  const [loadingPlaces, setLoadingPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceInfo | null>(null);
  const [directionsLink, setDirectionsLink] = useState("");

  const onLoad = useCallback(function callback(map: google.maps.Map) {
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  // Set directions link
  useEffect(() => {
    setDirectionsLink(`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`);
  }, [coordinates]);

  // Fetch places when activeType changes
  useEffect(() => {
    if (!map || !window.google) return;
    
    setLoadingPlaces(true);
    const service = new window.google.maps.places.PlacesService(map);
    
    const request = {
      location: coordinates,
      radius: 3000, // 3km radius
      type: activeType
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        // Take top 5 results
        const topResults = results.slice(0, 5);
        
        // Now calculate distances
        const distanceService = new window.google.maps.DistanceMatrixService();
        
        const destinations = topResults.map(r => r.geometry?.location).filter(Boolean) as google.maps.LatLng[];
        
        if (destinations.length > 0) {
          distanceService.getDistanceMatrix({
            origins: [coordinates],
            destinations: destinations,
            travelMode: window.google.maps.TravelMode.DRIVING,
          }, (response, distStatus) => {
            if (distStatus === window.google.maps.DistanceMatrixStatus.OK && response) {
              const elements = response.rows[0].elements;
              
              const formattedPlaces: PlaceInfo[] = topResults.map((result, idx) => ({
                name: result.name || "Unknown",
                vicinity: result.vicinity || "",
                type: activeType,
                distance: elements[idx]?.status === "OK" ? elements[idx].distance.text : "N/A",
                duration: elements[idx]?.status === "OK" ? elements[idx].duration.text : "N/A",
                location: result.geometry?.location
              }));
              
              setPlaces(formattedPlaces);
            } else {
              // Fallback without distances
              setPlaces(topResults.map(r => ({
                name: r.name || "",
                vicinity: r.vicinity || "",
                type: activeType,
                location: r.geometry?.location
              })));
            }
            setLoadingPlaces(false);
          });
        } else {
          setPlaces([]);
          setLoadingPlaces(false);
        }
      } else {
        setPlaces([]);
        setLoadingPlaces(false);
      }
    });
  }, [map, activeType, coordinates]);


  if (!apiKey) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center justify-between p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-600 dark:text-amber-400">
          <div>
            <h4 className="font-semibold">Google Maps API Key Required</h4>
            <p className="text-sm mt-1">To view the interactive map and nearby places, please add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file.</p>
          </div>
        </div>
        
        {/* Mock Map Area */}
        <div className="w-full h-[400px] bg-muted/30 rounded-2xl border border-border flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMiIgZmlsbD0iIzIyMiIgZmlsbC1vcGFjaXR5PSIwLjEiPjwvY2lyY2xlPgo8L3N2Zz4=')] opacity-50" />
          <div className="text-center z-10 p-6 bg-background/80 backdrop-blur-sm rounded-xl border border-border shadow-lg max-w-sm">
            <MapPin className="size-8 mx-auto text-muted-foreground mb-2" />
            <p className="font-medium text-foreground">Interactive Map Disabled</p>
            <p className="text-sm text-muted-foreground mt-1">
              Coordinates: {coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}
            </p>
            <Button variant="outline" className="mt-4 w-full" render={
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`} target="_blank" rel="noreferrer" />
            }>
              <Navigation className="size-4 mr-2" />
              Get Directions on Google Maps
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) return <div className="w-full h-[400px] animate-pulse bg-muted rounded-2xl" />;

  return (
    <div className="space-y-6">
      {/* Map */}
      <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={coordinates}
          zoom={14}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            mapTypeControl: true, // Allows switching to Satellite
            zoomControl: true,
            streetViewControl: false,
            fullscreenControl: true,
            styles: [
              // Subtle modern styling
              { "featureType": "administrative", "elementType": "all", "stylers": [{ "saturation": "-100" }] },
              { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] },
              { "featureType": "landscape", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] },
              { "featureType": "poi", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": "50" }, { "visibility": "simplified" }] },
              { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-100" }] },
              { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] },
              { "featureType": "road.arterial", "elementType": "all", "stylers": [{ "lightness": "30" }] },
              { "featureType": "road.local", "elementType": "all", "stylers": [{ "lightness": "40" }] },
              { "featureType": "transit", "elementType": "all", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] },
              { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00" }, { "lightness": -25 }, { "saturation": -97 }] },
              { "featureType": "water", "elementType": "labels", "stylers": [{ "lightness": -25 }, { "saturation": -100 }] }
            ]
          }}
        >
          {/* Main Property Marker */}
          <Marker 
            position={coordinates}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              fillColor: '#10b981', // emerald-500
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
              scale: 10,
            }}
          />

          {/* Place Markers */}
          {places.map((place, idx) => place.location && (
            <Marker 
              key={idx}
              position={place.location}
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                fillColor: '#6366f1', // indigo-500
                fillOpacity: 0.8,
                strokeWeight: 2,
                strokeColor: '#ffffff',
                scale: 7,
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}

          {selectedPlace && selectedPlace.location && (
            <InfoWindow
              position={selectedPlace.location}
              onCloseClick={() => setSelectedPlace(null)}
            >
              <div className="p-1 max-w-[200px] text-zinc-900">
                <p className="font-semibold text-sm">{selectedPlace.name}</p>
                {selectedPlace.distance && (
                  <p className="text-xs text-zinc-600 mt-1">{selectedPlace.distance} • {selectedPlace.duration}</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {/* Directions Overlay Button */}
        <div className="absolute top-4 left-4">
          <Button 
            className="bg-white/90 hover:bg-white text-zinc-900 shadow-lg border-0"
            render={<a href={directionsLink} target="_blank" rel="noreferrer" />}
          >
            <Navigation className="size-4 mr-2 text-blue-600" />
            Get Directions
          </Button>
        </div>
      </div>

      {/* Nearby Places Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Explore Neighborhood</h3>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {(Object.keys(placeTypeMap) as PlaceType[]).map((type) => (
            <Button
              key={type}
              variant={activeType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveType(type)}
              className={`rounded-full ${activeType === type ? "bg-emerald-600 hover:bg-emerald-500 text-white" : ""}`}
            >
              <span className="mr-2">{placeTypeMap[type].icon}</span>
              {placeTypeMap[type].label}
            </Button>
          ))}
        </div>

        {/* Results */}
        <div className="bg-muted/30 border border-border rounded-xl p-4 min-h-[200px]">
          {loadingPlaces ? (
            <div className="flex items-center justify-center h-full text-muted-foreground animate-pulse py-10">
              Finding nearby {placeTypeMap[activeType].label.toLowerCase()}...
            </div>
          ) : places.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {places.map((place, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start justify-between p-3 rounded-lg bg-card border border-border shadow-sm hover:border-emerald-500/30 transition-colors"
                >
                  <div className="pr-4">
                    <p className="font-medium text-sm text-foreground line-clamp-1">{place.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{place.vicinity}</p>
                  </div>
                  {(place.distance || place.duration) && (
                    <div className="flex flex-col items-end text-xs whitespace-nowrap shrink-0">
                      {place.distance && (
                        <div className="flex items-center text-emerald-600 dark:text-emerald-400 font-medium">
                          <Car className="size-3 mr-1" /> {place.distance}
                        </div>
                      )}
                      {place.duration && (
                        <div className="flex items-center text-muted-foreground mt-1">
                          <Clock className="size-3 mr-1" /> {place.duration}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-10">
              <MapPin className="size-8 mb-2 opacity-20" />
              <p>No {placeTypeMap[activeType].label.toLowerCase()} found within 3km.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
