import { useState, useEffect } from 'react';
import type { Material } from './materials.types.ts';
import { MaterialRow } from './MaterialRow.tsx';
import { supplyTypes } from './materialOptions.ts';

const materialsUrl = 'http://localhost:3000/materials';

function MaterialList() {
  const [loading, setLoading] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [supplyTypeInput, setSupplyTypeInput] = useState<string>("all");

  function search(search: string | null = null, supplyType: string | null = null): Material[] {
    if (search !== null) {
      setSearchText(search)
    } else { search = searchText }

    if (supplyType !== null) {
      setSupplyTypeInput(supplyType)
    } else { supplyType = supplyTypeInput }

    let filtered = materials

    if (search === '') {
    } else {
      filtered = materials.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
    }

    if (supplyType == 'all') {
    } else {
      filtered = filtered.filter((m) => m.supply_type === supplyType);
    }

    return filtered
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const reponse = await fetch(materialsUrl);
        if (!reponse.ok) {
          throw new Error(`Statut de réponse : ${reponse.status}`);
        }

        const resultat = await reponse.json();

        setMaterials(resultat);
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
        search(event.target.value, supplyTypeInput)
      }}
    />
  );

  const supplyTypeSelect = (
    <>
      <select
        onChange={(event) => {
          search(searchText, event.target.value)
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
    search().length === 0 ? (
      <p>Aucun résultat</p>
    ) : (
      <ul>
        {search().map((material) => (
          <MaterialRow
            key={material.id}
            material={material}
            onDelete={(id) => {
              setMaterials((currentMaterials) =>
                currentMaterials.filter((material) => material.id !== id),
              )
              // setFilteredMaterials((currentMaterials) =>
              //   currentMaterials.filter((material) => material.id !== id),
              // )
              }}
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
