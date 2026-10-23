import { NavLink, useParams } from "react-router-dom";
import { getMaterial } from "./materials.api";
import { useEffect, useState } from "react";
import type { Material } from "./materials.types";

function GoBackButton() {
  return <NavLink to="/materials" >
    Back
  </NavLink>
}

function ErrorMessage({message}: {message: string | null}) {
  if (message === null) {
    return <></>
  } else {
    return <p style={{color: 'red' }}>{message}</p>
  }
}

function MaterialShow() {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function apiCall() {
      if (!id) return;
      try {
        setMaterial(await getMaterial(id))
      } catch(error) {
        setError(error instanceof Error ? error.message : "Erreur inconnue")
      } finally {
      }
    }

    apiCall()

  }, [id])




  return <>
    <ErrorMessage message={error} />
    <b>{material?.name}</b>
    <br />
    <GoBackButton />
  </>
}

export default MaterialShow;
