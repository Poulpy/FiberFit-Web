import { NavLink, useParams } from "react-router-dom";
import { getMaterial } from "./materials.api";
import { useEffect, useState } from "react";
import type { Material } from "./materials.types";

function GoBackButton() {
  return <NavLink to="/materials" >
    Back
  </NavLink>
}

function MaterialShow() {
  const { id } = useParams<{ id: string }>();
  const [material, setMaterial] = useState<Material | null>(null)

  useEffect(() => {
    async function apiCall() {
      if (!id) return;
      try {
        setMaterial(await getMaterial(id))

      } catch(event) {

      } finally {

      }

    }

    apiCall()

  }, [id])


  return <>
    <b>{material?.name}</b>
    <br />
    <GoBackButton />
  </>
}

export default MaterialShow;
