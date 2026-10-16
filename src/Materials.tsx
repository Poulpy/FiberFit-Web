import { useState, useEffect } from 'react'
import './App.css'

type Material = {
  id: number
  name: string
  material_type: string
}

function App() {
  const [loading, setLoading] = useState(true)
  const url = "http://localhost:3000/materials";
  const [materials, setMaterials] = useState<Material[]>([])
  const [error, setError] = useState(null)

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
        console.error(erreur.message);
        setError(erreur.message)
        setLoading(false)
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
          {material.name}, {material.material_type}
        </li>
      )}
     </ul>
    )
}


export default App
