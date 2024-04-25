import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import axios from "axios";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { User } from "../types"; // Make sure this path is correct

// Import marker icon and shadow
import markerIconPng from "leaflet/dist/images/marker-icon.png";
import markerIconShadow from "leaflet/dist/images/marker-shadow.png";

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
  const [users, setUsers] = useState<User[]>([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:5005/api/users/all-users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

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
      {users.map((user) => (
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
