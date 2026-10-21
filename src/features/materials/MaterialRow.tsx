import { NavLink } from 'react-router-dom'
import type { Material } from './materials.types'

type MaterialRowProps = {
  material: Material
}

export function MaterialRow(props: MaterialRowProps) {
  return <li key={props.material.id}>
        {props.material.name}, {props.material.supply_type}, color: {props.material.color}, stock: {props.material.stock_quantity}
        <br />
        yarn weight: {props.material.yarn_weight_class}

    <NavLink to={`/materials/${props.material.id}/edit`} end>
      Edit
    </NavLink>
  </li>
}
