import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { formatRelative } from "date-fns";

import "@reach/combobox/styles.css";

import mapStyle from "./mapStyle";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh"
};
const center = {
  lat: 39.766705,
  lng: 30.525631,
};
const options = {
  styles: mapStyle,
  disableDefaultUI: true,
  zoomControl: true,
};

export default function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);

  const onMapClick = React.useCallback((event) => {
    setMarkers((current) => [
      ...current,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        time: new Date(),

      },
    ]);
    //console.log(event.latLng.lat());
  }, []);

  const mapRef = React.useRef();  //retain state without cause re-render
  const mapLoadCall = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error loading map";
  if (!isLoaded) return "Loading map";

  return (
    <div>
      <h1>Feed Me {" "} <span role="img" aria-label="cat">🐱</span> </h1>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        onClick={onMapClick}
      >
        {markers.map((marker) => (
          <Marker key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: '/test-food.png',
              scaledSize: new window.google.maps.Size(50, 50),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(25, 25),
            }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}

        {selected ? (
          <InfoWindow position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <h2>Food is there</h2>
              <p>Dropped at {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}

      </GoogleMap>
    </div>
  );
}
