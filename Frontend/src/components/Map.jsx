import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const CLOUD_NAME = "da3higfux";
const CLOUDINARY_URL_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

const MapComponent = ({ butterflies }) => {
  
  // 🔧 Función para validar si las coordenadas son válidas para tu esquema MongoDB
  const hasValidCoordinates = (butterfly) => {
    const coords = butterfly.coordinates;
    
    // Verifica que exista el objeto coordinates y que tenga latitude y longitude válidas
    if (coords && 
        coords.latitude !== null && coords.longitude !== null && 
        coords.latitude !== undefined && coords.longitude !== undefined &&
        !isNaN(coords.latitude) && !isNaN(coords.longitude) &&
        coords.latitude !== 0 && coords.longitude !== 0) { // Excluye coordenadas (0,0) por defecto
      return { lat: parseFloat(coords.latitude), lng: parseFloat(coords.longitude) };
    }
    
    return null;
  };

  // 🔧 Filtramos solo las mariposas que tienen coordenadas válidas
  const validButterflies = butterflies.filter(butterfly => {
    const coords = hasValidCoordinates(butterfly);
    if (!coords) {
      console.warn(`Mariposa ${butterfly.commonName || butterfly.id} no tiene coordenadas válidas:`, butterfly);
      return false;
    }
    return true;
  });

  console.log(`Mostrando ${validButterflies.length} de ${butterflies.length} mariposas en el mapa`);

  return (
    <MapContainer 
      center={[-25.2744, 133.7751]} 
      zoom={4} 
      style={{ height: '500px', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {validButterflies.map(butterfly => {
        const coordinates = hasValidCoordinates(butterfly);
        
        const TRANSFORMATIONS = "e_background_removal,w_250,h_250,c_pad,b_transparent,f_auto,q_auto";
        const TRANSFORMATIONS2 = "e_background_removal,w_100,h_100,c_pad,b_transparent,f_auto,q_auto";

        const imageUrl = `${CLOUDINARY_URL_BASE}/${TRANSFORMATIONS}/${butterfly.publicId}.png`;
        const imageUrl2 = `${CLOUDINARY_URL_BASE}/${TRANSFORMATIONS2}/${butterfly.publicId}.png`;
        
        const customIcon = new L.Icon({
          iconUrl: imageUrl,
          iconSize: [50, 50],
        });

        return (
          <Marker 
            key={butterfly._id || butterfly.id} // Usa _id para MongoDB
            position={[coordinates.lat, coordinates.lng]}
            icon={customIcon}
          >
            <Popup>
              <img src={imageUrl2} alt={butterfly.commonName} /><br/>
              <strong>{butterfly.commonName}</strong><br/>
              <em>{butterfly.scientificName}</em>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default MapComponent;