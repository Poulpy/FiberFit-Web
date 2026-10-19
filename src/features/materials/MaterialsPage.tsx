import { useState, useEffect } from 'react'
// import './App.css'
import './materials.types.ts'


function MaterialsPage() {
  const [loading, setLoading] = useState(true)
  const url = "http://localhost:3000/materials";
  const [materials, setMaterials] = useState<Material[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {

      try {
        const reponse = await fetch(url);//mesEntetes });
        if (!reponse.ok) {
          throw new Error(`Statut de réponse : ${reponse.status}`);
        }

        const resultat = await reponse.json();

        setMaterials(resultat)
        setLoading(false)
      } catch (erreur) {
        if (erreur instanceof NetworkError) {
          setError(erreur.message)
          setLoading(false)

        } else {
          setError(erreur.message)
          setLoading(false)

        }
        console.error(erreur.message);
      }
    }
    fetchData();

  }, [url]);

  if (loading) {
    return <p>Chargement...</p>
  }


  if (error != null) {
    return <p style={{ color: "red" }}>{error}</p>
  }


  return (
    <ul>
      {materials.map(material =>
        <li key={material.id}>
          {material.name}, {material.supply_type}, color: {material.color}, stock: {material.stock_quantity}
          <br />
          yarn weight: {material.yarn_weight_class}
        </li>
      )}
     </ul>
    )
}


export default MaterialsPage
