import { useEffect, useState } from "react";
import ButterflyCard from "../components/ButterflyCard";
import "./list.css";
import SearchBar from "../components/SearchBar";
import Map from "../components/Map";
import { getAllButterflies } from "../services/ButterflyServices";

const List = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("Todas");
  const [selectedThreat, setSelectedThreat] = useState("Todas");
  const [butterflies, setButterflies] = useState([]);

  useEffect(() => {
    const fetchButterflyData = async () => {
      try {
        const bfData = await getAllButterflies();
        setButterflies(bfData);
        console.log("Mariposas: ", bfData);
        
        // 🔧 Debug: Verifica la estructura de las coordenadas
        console.log("Primera mariposa coordenadas:", bfData[0]?.coordinates);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchButterflyData();
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRegion("Todas");
    setSelectedThreat("Todas");
  };

  // Lógica de filtrado
  const filteredButterflies = butterflies.filter((butterfly) => {
    // Filtro por región
    const regionMatch =
      selectedRegion === "Todas" || butterfly.region === selectedRegion;

    // Filtro por texto de búsqueda (insensible a mayúsculas)
    const searchMatch = butterfly.commonName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const threatMatch =
      selectedThreat === "Todas" || butterfly.threatLevel === selectedThreat;

    return regionMatch && searchMatch && threatMatch;
  });

  return (
    <>
      <div className="listPage">
        <SearchBar
          onSearchChange={setSearchTerm}
          onRegionChange={setSelectedRegion}
          onThreatChange={setSelectedThreat}
          onClearAll={handleClearFilters}
        />
        
        <div style={{ margin: "20px 0" }}>
          <Map butterflies={filteredButterflies} />
        </div>

        <div className="butterfly-list-container">
          {filteredButterflies.map((butterfly) => (
            <ButterflyCard
              key={butterfly._id} // 🔧 Cambiado de butterfly.id a butterfly._id para MongoDB
              butterfly={butterfly}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default List;