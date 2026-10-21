import { NavLink } from 'react-router-dom'
import { useState, useEffect } from 'react'
import type { Material } from './materials.types.ts'

const materialsUrl = 'http://localhost:3000/materials'

type MaterialRowProps = {
  material: Material
}

function MaterialList() {
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState<Material[]>([])
  const [error, setError] = useState<string | null>(null)

  function MaterialRow(props: MaterialRowProps) {
    return <li key={props.material.id}>
          {props.material.name}, {props.material.supply_type}, color: {props.material.color}, stock: {props.material.stock_quantity}
          <br />
          yarn weight: {props.material.yarn_weight_class}

      <NavLink to={`/materials/edit/${props.material.id}`} end>
        Edit
      </NavLink>
    </li>
  }

  useEffect(() => {
    async function fetchData() {

      try {
        const reponse = await fetch(materialsUrl)
        if (!reponse.ok) {
          throw new Error(`Statut de réponse : ${reponse.status}`);
        }

        const resultat = await reponse.json();

        setMaterials(resultat)
      } catch (erreur) {
        const message = erreur instanceof Error ? erreur.message : 'Erreur réseau'
        setError(message)
        console.error(message)
      } finally {
        setLoading(false)
      }
    }
    fetchData();

  }, [])

  if (loading) {
    return <p>Chargement...</p>
  }


  if (error != null) {
    return <p style={{ color: "red" }}>{error}</p>
  }


  return (
    <ul>
      {materials.map(material =>
        <MaterialRow key={material.id} material={material}/>
      )}
     </ul>
    )
}

export default MaterialList
