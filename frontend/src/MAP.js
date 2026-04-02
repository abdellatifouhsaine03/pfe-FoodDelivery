import React, { useEffect, useRef, useState } from "react";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";

const MapComponent = () => {
  const mapElement = useRef(null);
  const mapRef = useRef(null);
  const currentMarker = useRef(null); // Ref to track the current marker
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  
  const apiKey = "kwXh64lDPLoKwmMPk8tkwy6KeJXUSfOZ"; 
  const casablancaCoords = { lon: -7.5898, lat: 33.5731 }; // Default biasing

  useEffect(() => {
    mapRef.current = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [casablancaCoords.lon, casablancaCoords.lat], 
      zoom: 12,
    });

    return () => mapRef.current.remove();
  }, []);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      // Use fuzzySearch with typeahead and lat/lon biasing
      const url = `https://api.tomtom.com/search/2/fuzzySearch/${encodeURIComponent(value)}.json?` + 
                  `key=${apiKey}&` +
                  `typeahead=true&` + // Better for autocomplete
                  `limit=5&` +
                  `lon=${casablancaCoords.lon}&lat=${casablancaCoords.lat}&` + // Bias results to Casablanca
                  `radius=20000`; // Search within 20km radius preferred

      try {
        const res = await fetch(url);
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item) => {
    const { position } = item;
    if (mapRef.current && position) {
      // 1. Clear previous marker if it exists
      if (currentMarker.current) {
        currentMarker.current.remove();
      }

      // 2. Smoothly fly to the location
      mapRef.current.flyTo({
        center: [position.lon, position.lat],
        zoom: 16,
        speed: 1.5,
      });

      // 3. Create and store new marker
      currentMarker.current = new tt.Marker()
        .setLngLat([position.lon, position.lat])
        .setPopup(new tt.Popup({ offset: 35 }).setHTML(`<b>${item.address.freeformAddress}</b>`))
        .addTo(mapRef.current);
      
      currentMarker.current.togglePopup();
    }

    setSuggestions([]);
    setQuery(item.address.freeformAddress); // Set input to the full address
  };

  return (
    <div style={{ position: "relative" }}>
      <div style={{ position: "absolute", top: 20, left: 20, zIndex: 999 }}>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search (e.g. Lycee Abdelkhalek Torres)"
          style={{ 
            padding: "12px", 
            width: "350px", 
            borderRadius: "4px", 
            border: "1px solid #ccc",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
        />
        {suggestions.length > 0 && (
          <ul style={{
            listStyle: "none",
            padding: "0",
            margin: "5px 0 0 0",
            background: "white",
            border: "1px solid #ccc",
            width: "350px",
            maxHeight: "250px",
            overflowY: "auto",
            borderRadius: "4px"
          }}>
            {suggestions.map((item, idx) => (
              <li
                key={idx}
                onClick={() => handleSelectSuggestion(item)}
                style={{ 
                  padding: "10px", 
                  cursor: "pointer", 
                  borderBottom: "1px solid #eee",
                  fontSize: "14px"
                }}
                onMouseEnter={(e) => e.target.style.background = "#f0f0f0"}
                onMouseLeave={(e) => e.target.style.background = "white"}
              >
                <strong>{item.poi ? item.poi.name : ""}</strong>
                <div style={{ color: "#666", fontSize: "12px" }}>
                   {item.address.freeformAddress}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div ref={mapElement} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default MapComponent;