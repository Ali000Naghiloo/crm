import { Spin } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  // useMapEvent,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import icon from "../assets/icons/marker.png";

const RecenterAutomatically = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng]);
  return null;
};

// position = [lat, lng]
export default function Map({ position, setPosition }) {
  const [showMapIfOnline, setShowMapIfOnline] = useState(false);

  const LocateOnClick = () => {
    useMapEvents({
      click(e) {
        setPosition([e.latlng.lat, e.latlng.lng]);
      },
    });

    const Icon = new L.icon({
      iconUrl: icon,
      iconSize: [30, 30],
    });

    return position.length !== 0 ? (
      <Marker position={{ lat: position[0], lng: position[1] }} icon={Icon}>
        <Popup className="">موقعیت انتخاب شده</Popup>
      </Marker>
    ) : null;
  };

  useEffect(() => {
    if (navigator.onLine) {
      setShowMapIfOnline(true);
    } else {
      toast("از اتصال به اینترنت مطمئن شوید");
      setShowMapIfOnline(false);
    }
  }, [navigator.onLine]);

  useEffect(() => {}, []);

  return (
    <div className="z-0">
      {showMapIfOnline ? (
        <MapContainer
          className="rounded-lg h-[250px]"
          center={position}
          zoom={10}
          scrollWheelZoom={true}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocateOnClick />
          <RecenterAutomatically lat={position[0]} lng={position[1]} />
        </MapContainer>
      ) : (
        <div className="w-full flex justify-center items-center p-2">
          <span>
            <Spin />
          </span>
        </div>
      )}
    </div>
  );
}
