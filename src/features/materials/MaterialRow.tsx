import { NavLink } from 'react-router-dom'
import type { Material } from './materials.types'
import { deleteMaterial } from './materials.api'

type MaterialRowProps = {
  material: Material,
  onDelete: (id: number) => void
}

export function MaterialRow(props: MaterialRowProps) {

  return <li>
        {props.material.name}, {props.material.supply_type}, color: {props.material.color}, stock: {props.material.stock_quantity}
        <br />
        yarn weight: {props.material.yarn_weight_class}

    <NavLink to={`/materials/${props.material.id}/edit`} end>
      Edit
    </NavLink>

    <button onClick={() => {
        if (window.confirm("Supprimer cet élément ?")) {
          async function handleDelete() {
            try {
              await deleteMaterial(props.material.id)

              props.onDelete(props.material.id)
            } catch(error) {
              console.error(error instanceof Error ? error.message : "Erreur inconnue")
            }
          }

          handleDelete()
        }
      }}>Supprimer</button>
  </li>
}
