import "./ButterflyCard.css";
import Button from "./Button";
import { deleteButterfly } from '../services/ButterflyServices';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

const CLOUD_NAME = "da3higfux";
const CLOUDINARY_URL_BASE = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

const TRANSFORMATIONS =
  "e_background_removal,w_250,h_250,c_pad,b_transparent,f_auto,q_auto";

const ButterflyCard = ({ butterfly, setLoading }) => {
  const navigate = useNavigate();

  // Construimos la URL completa de la imagen en Cloudinary
  const imageUrl = `${CLOUDINARY_URL_BASE}/${TRANSFORMATIONS}/${butterfly.publicId}.png`;

  const handleEdit = () => {
    // 🔧 Cambiado de butterfly.id a butterfly._id para MongoDB
    navigate(`/editbutterfly/${butterfly._id}`);
  };

  const handleView = () => {
    // 🔧 Cambiado de butterfly.id a butterfly._id para MongoDB
    navigate(`/butterflydetail/${butterfly._id}`); // También cambié la ruta para que coincida con tu router
  };

  return (
    <div className="card">
      <img src={imageUrl} alt={`Imagen de ${butterfly.commonName}`} />
      <h2 className="card-title">{butterfly.commonName}</h2>
      <h3 className="card-subtitle">{butterfly.scientificName}</h3>
      <p className="card-description">{butterfly.description}</p>

      <Button 
        tooltip="Cargar información de la mariposa" 
        title="Ver Ficha" 
        action={handleView} 
      />

      <Button
        tooltip="Actualizar Información Mariposa"
        title="Editar"
        action={handleEdit}
      />

      <Button
        tooltip="Eliminar esta Mariposa"
        title="Eliminar"
        action={async () => {
          const confirmation = await Swal.fire({
            title: '¿Estás seguro?',
            text: 'Esta acción eliminará la mariposa.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#e63946',
            cancelButtonColor: '#7d8388ff',
          });
          if (confirmation.isConfirmed) {
            // 🔧 Cambiado de butterfly.id a butterfly._id para MongoDB
            await deleteButterfly(butterfly._id);
            Swal.fire('La mariposa fue eliminada correctamente.').then(() => setLoading(true));
          }
        }}
      />
    </div>
  );
};

export default ButterflyCard;