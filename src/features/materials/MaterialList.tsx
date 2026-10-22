import { useState, useEffect } from 'react';
import type { Material } from './materials.types.ts';
import { MaterialRow } from './MaterialRow.tsx';
import { supplyTypes } from './materialOptions.ts';

const materialsUrl = 'http://localhost:3000/materials';

function MaterialList() {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const reponse = await fetch(materialsUrl);
        if (!reponse.ok) {
          throw new Error(`Statut de réponse : ${reponse.status}`);
        }

        const resultat = await reponse.json();

        setMaterials(resultat);
        setFilteredMaterials(resultat);
      } catch (erreur) {
        const message = erreur instanceof Error ? erreur.message : 'Erreur réseau';
        setError(message);
        console.error(message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error !== null) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  const searchInput = (
    <input
      type="text"
      onChange={(event) => {
        if (event.target.value === '') {
          setFilteredMaterials(materials);
        } else {
          setFilteredMaterials(materials.filter((m) => m.name.includes(event.target.value)));
        }
      }}
    />
  );

  const supplyTypeSelect = (
    <>
      <select
        onChange={(event) => {
          if (event.target.value == 'all') {
            setFilteredMaterials(materials);
          } else {
            setFilteredMaterials(materials.filter((m) => m.supply_type === event.target.value));
          }
        }}
      >
        <option key="all" value="all">
          All
        </option>
        {supplyTypes.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );

  const deleteErrorMsg = deleteError === null ? '' : <p style={{ color: 'red' }}>{deleteError}</p>;

  const list =
    filteredMaterials.length === 0 ? (
      <p>Aucun résultat</p>
    ) : (
      <ul>
        {filteredMaterials.map((material) => (
          <MaterialRow
            key={material.id}
            material={material}
            onDelete={(id) =>
              setMaterials((currentMaterials) =>
                currentMaterials.filter((material) => material.id !== id),
              )
            }
            onError={(message) => setDeleteError(message)}
          />
        ))}
      </ul>
    );

  return (
    <>
      {searchInput}
      {supplyTypeSelect}
      {deleteErrorMsg}
      {list}
    </>
  );
}

export default MaterialList;
