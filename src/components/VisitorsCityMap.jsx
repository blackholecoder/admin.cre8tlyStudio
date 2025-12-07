import React, { useEffect, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import { geocodeCity } from "../utils/geocodeCity";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

export default function VisitorsCityMap({ visitors }) {
  const [points, setPoints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(3);

  useEffect(() => {
    async function processVisitors() {
      const results = [];

      for (const v of visitors) {
        const coords = await geocodeCity(v.city, v.region, v.country);
        if (!coords) continue;

        results.push({
          ...v,
          ...coords,
        });
      }

      setPoints(results);
      console.log("FINAL POINTS:", results);
    }

    processVisitors();
  }, [visitors]);

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow">
      <h2 className="text-xl font-semibold text-white mb-4">
        Visitors by City
      </h2>

      <div className="w-full h-[500px] rounded-lg overflow-hidden">
        <Map
          reuseMaps
          mapLib={maplibregl}
          initialViewState={{
            longitude: -95,
            latitude: 40,
            zoom: 3,
          }}
          projection={{ name: "mercator" }} // ← THE FIX
          onZoom={(e) => setZoom(e.viewState.zoom)}
          onClick={() => setSelected(null)} 
          mapStyle={MAP_STYLE}
          style={{ width: "100%", height: "100%" }}
        >
          {points.map((p, i) => (
            <Marker
              key={i}
              longitude={p.lng}
              latitude={p.lat}
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelected(p);
              }}
            >
              <div
                style={{
                  width: `${6 + p.total * 2}px`,
                  height: `${6 + p.total * 2}px`,
                  backgroundColor: "rgba(16,185,129,0.85)",
                  borderRadius: "50%",
                  border: "1px solid #0f5132",
                  cursor: "pointer",
                  transform: "translate(-50%, -50%)",
                }}
              />
            </Marker>
          ))}

          {selected && (
            <Popup
              longitude={selected.lng}
              latitude={selected.lat}
              anchor="top"
              closeButton={true}
              closeOnClick={false}
              focusAfterOpen={false} // ← THE IMPORTANT FIX
              offset={10}
              onClose={() => setSelected(null)}
            >
              <div className="text-black text-sm">
                <strong>{selected.city}</strong>
                <br />
                {selected.region}, {selected.country}
                <br />
                <b>{selected.total} visits</b>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  );
}
