import { NavLink, useParams } from 'react-router-dom';
import { getMaterial } from './materials.api';
import { useEffect, useState } from 'react';
import type { Material } from './materials.types';

function GoBackButton() {
  return <NavLink to="/materials">Back</NavLink>;
}

function ErrorMessage({ message }: { message: string | null }) {
  if (message === null) {
    return <></>;
  } else {
    return <p style={{ color: 'red' }}>{message}</p>;
  }
}

function MaterialInfo({ material }: { material: Material }) {
  return (
    <table>
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Supply type</th>
          <th scope="col">Color</th>
          <th scope="col">Stock quantity</th>
          <th scope="col">Stock unit</th>
          <th scope="col">Length per unit m</th>
          <th scope="col">Yarn weight class</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{material.name}</td>
          <td>{material.supply_type}</td>
          <td>{material.color}</td>
          <td>{material.stock_quantity}</td>
          <td>{material.stock_unit}</td>
          <td>{material.length_per_unit_m}</td>
          <td>{material.yarn_weight_class}</td>
        </tr>
      </tbody>
    </table>
  );
}

function MaterialShow() {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function apiCall() {
      if (!id) return;
      try {
        setMaterial(await getMaterial(id));
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Erreur inconnue');
      }
    }

    apiCall();
  }, [id]);

  if (error !== null) {
    return <ErrorMessage message={error} />;
  }

  if (material === null) {
    return <p>Chargement...</p>;
  }

  return (
    <>
      <ErrorMessage message={error} />
      <b>{material?.name}</b>
      <br />
      <MaterialInfo material={material} />
      <br />
      <GoBackButton />
    </>
  );
}

export default MaterialShow;
