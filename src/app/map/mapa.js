import { useState, useEffect, useRef } from "react"

import styles from "./mapa.module.css"
import { MapContainer, TileLayer, useMap, Marker, Popup, GeoJSON, useMapEvents } from 'react-leaflet'


function FetchGeoJSON({ url }) {
  const [muns, setMun] = useState(null);
  const lastSelectedLayerRef = useRef(null);

  useEffect(() => {
    async function fetchUrl() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch');
        }
        const data = await response.json();
        setMun(data);
      } catch(error) {
        console.error('Error: ', error);
      }
    }
    fetchUrl();
  }, [url]);

  const changeColor = (e) => {
    const layer = e.target;
    if (lastSelectedLayerRef.current) {
      lastSelectedLayerRef.current.setStyle({
        color: 'black',
        fillColor: 'blue'
      });
    }
    layer.setStyle({
      color: 'red', // Define a cor da borda para vermelho
      fillColor: 'orange' // Define a cor de preenchimento para laranja
    });
    lastSelectedLayerRef.current = layer;
  };

  const onEachFeature = (feature, layer) => {
    layer.on('click', () => {
      changeColor({ target: layer });
    });
    layer.bindPopup(layer.feature.properties.name);
  };

  return muns ? <GeoJSON data={muns} onEachFeature={onEachFeature}/> : null;
}


function PinLocation() {
  const [positions, setPositions] = useState([]);
  const [markers, setMarkers] = useState([]);

  const map = useMapEvents({
    click(e) {
      const newPosition = e.latlng;
      setPositions([...positions, newPosition]);
      const newMarker = <Marker key={positions.length} position={newPosition}><Popup>You are here</Popup></Marker>;
      setMarkers([...markers, newMarker]);
    }
  });

  const updateMarkerPosition = (index, newPosition) => {
    const updatedMarkers = markers.map((marker, i) => {
      if (i === index) {
        return React.cloneElement(marker, { position: newPosition });
      }
      return marker;
    });
    setMarkers(updatedMarkers);
  };

  return (
    <>
      {markers}
    </>
  );
}


export default function Mapa() {

  const link_maranhao = 'https://raw.githubusercontent.com/tbrugz/geodata-br/master/geojson/geojs-21-mun.json'
  const latlong = [-4.878816884816333, -45.25363719317331];
  return (
    <MapContainer className={styles.mapacontainer} center={latlong} zoom={6} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
      <FetchGeoJSON url={link_maranhao} />
      <PinLocation />
    </MapContainer>
  )
}
