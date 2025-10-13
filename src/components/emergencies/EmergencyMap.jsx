import React, { useEffect, useRef } from 'react';
import { MapPin, Navigation, Users, Clock } from 'lucide-react';

const EmergencyMap = ({ emergency, responders, onResponderSelect }) => {
  const mapRef = useRef(null);

  // This would integrate with your map service (Google Maps, Mapbox, etc.)
  useEffect(() => {
    if (emergency && emergency.initial_latitude && emergency.initial_longitude) {
      initializeMap();
    }
  }, [emergency, responders]);

  const initializeMap = () => {
    // Initialize your map here
    // This is a placeholder for map initialization
    console.log('Initializing map with:', {
      emergency: emergency,
      responders: responders
    });
  };

  const getResponderIcon = (type) => {
    switch (type) {
      case 'police': return '👮';
      case 'medical': return '🚑';
      case 'ngo': return '🛡️';
      case 'volunteer': return '👤';
      default: return '📍';
    }
  };

  if (!emergency?.initial_latitude || !emergency?.initial_longitude) {
    return (
      <div className="card p-6 text-center">
        <MapPin className="h-12 w-12 text-on-surface-variant mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-on-surface mb-2">Location Not Available</h3>
        <p className="text-on-surface-variant">
          Emergency location data is not available for mapping.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Map Container */}
      <div className="card p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-on-surface flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>Emergency Location Map</span>
          </h3>
          <div className="flex items-center space-x-2 text-sm text-on-surface-variant">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Emergency</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Responders</span>
            </div>
          </div>
        </div>
        
        <div 
          ref={mapRef}
          className="w-full h-96 bg-surface-variant rounded-lg flex items-center justify-center"
        >
          <div className="text-center">
            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-2" />
            <p className="text-on-surface font-medium">Emergency Location</p>
            <p className="text-on-surface-variant text-sm">
              {emergency.initial_latitude}, {emergency.initial_longitude}
            </p>
            <p className="text-on-surface-variant text-sm mt-2">
              Map integration would show here with real coordinates
            </p>
          </div>
        </div>
      </div>

      {/* Responders List */}
      {responders && responders.length > 0 && (
        <div className="card p-4">
          <h3 className="font-semibold text-on-surface mb-3 flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Nearby Responders</span>
          </h3>
          <div className="space-y-3">
            {responders.map((responder) => (
              <div
                key={responder.id}
                className="flex items-center justify-between p-3 bg-surface-variant rounded-lg hover:bg-surface transition-colors cursor-pointer"
                onClick={() => onResponderSelect && onResponderSelect(responder)}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">
                    {getResponderIcon(responder.responder_type)}
                  </div>
                  <div>
                    <div className="font-medium text-on-surface">{responder.name}</div>
                    <div className="text-sm text-on-surface-variant capitalize">
                      {responder.responder_type} • {responder.distance_km} km away
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-sm text-on-surface">
                    <Clock className="h-3 w-3" />
                    <span>{responder.eta_minutes} min</span>
                  </div>
                  <div className="text-xs text-on-surface-variant">
                    ETA
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmergencyMap;