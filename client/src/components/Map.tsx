import React, { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Import marker icon and shadow
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";
import { AuthContext } from "../context/AuthContext";

// Set up the custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: markerIconPng,
  shadowUrl: markerIconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = () => {
  const { users } = useContext(AuthContext);

  return (
    <MapContainer
      center={[52.52, 13.405]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="Map data &amp;copy; OpenStreetMap contributors"
      />
      {users &&
        users.map((user) => (
          <Marker
            key={user._id}
            position={[user.latitude, user.longitude]}
            icon={customMarkerIcon} // Use the custom marker icon
          >
            <Popup>
              <div>
                <strong>{user.username}</strong>
                {user.userImg && user.userImg[0] && (
                  <img
                    src={user.userImg[0]}
                    alt={user.username}
                    style={{ width: "100px", height: "auto" }}
                  />
                )}
                <p>{user.bio}</p>
              </div>
            </Popup>
          </Marker>
        ))}
    </MapContainer>
  );
};

export default Map;
