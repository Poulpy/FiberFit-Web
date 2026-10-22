import { useState, useEffect } from 'react'
import type { Material } from './materials.types.ts'
import { MaterialRow } from './MaterialRow.tsx'
const materialsUrl = 'http://localhost:3000/materials'

function MaterialList() {
  const [loading, setLoading] = useState(true)
  const [materials, setMaterials] = useState<Material[]>([])
  const [error, setError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)


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


  if (error !== null) {
    return <p style={{ color: "red" }}>{error}</p>
  }

  const deleteErrorMsg = (
    deleteError === null ? "" : <p style={{ color: "red" }}>{deleteError}</p>
  )

  const list = (<ul>
        {materials.map(material =>
          <MaterialRow key={material.id} material={material} onDelete={id =>
            setMaterials(currentMaterials =>
              currentMaterials.filter(material => material.id !== id),
          )} onError={ message =>
            setDeleteError(message)
          } />
        )}
       </ul>)


  return (
    <>
      {deleteErrorMsg}
      {list}
    </>
  )
}

export default MaterialList
