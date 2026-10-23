import { NavLink } from 'react-router-dom';
import type { Material } from './materials.types';
import { deleteMaterial } from './materials.api';
import { useState } from 'react';

type MaterialRowProps = {
  material: Material;
  onDelete: (id: number) => void;
  onError: (message: string) => void;
};

function DeleteButton(props: MaterialRowProps) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <button
      disabled={loading}
      onClick={() => {
        setLoading(true);
        if (window.confirm(`Supprimer ${props.material.name} ?`)) {
          async function handleDelete() {
            try {
              await deleteMaterial(props.material.id);

              props.onDelete(props.material.id);
            } catch (error) {
              props.onError(error instanceof Error ? error.message : 'Erreur inconnue');
            } finally {
              setLoading(false);
            }
          }

          handleDelete();
        } else {
          setLoading(false);
        }
      }}
    >
      {loading ? 'Chargement...' : 'Supprimer'}
    </button>
  );
}

function Show({id}: {id: number}) {
  return <NavLink className="mx-5" to={`/materials/${id}`} end>
    Show
  </NavLink>
}

export function MaterialRow(props: MaterialRowProps) {
  return (
    <li>
      {props.material.name}, {props.material.supply_type}, color: {props.material.color}, stock:{' '}
      {props.material.stock_quantity}
      <br />
      yarn weight: {props.material.yarn_weight_class}
      <NavLink to={`/materials/${props.material.id}/edit`} end>
        Edit
      </NavLink>
      <Show id={props.material.id} />
      <DeleteButton material={props.material} onDelete={props.onDelete} onError={props.onError} />
    </li>
  );
}
