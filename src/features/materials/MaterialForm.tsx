import { useState, useEffect } from 'react'

function MaterialForm() {
  return <>
    <Create />
  </>
}

function Create() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target
    const formData = new FormData(form)
    var params = {
      material: {
        name: formData.get("name"),
        supply_type: formData.get("supply_type"),
        color: formData.get("color"),
        stock_quantity: formData.get("stock_quantity"),
        stock_unit: formData.get("stock_unit"),
        length_per_unit_m: formData.get("length_per_unit_m"),
        yarn_weight_class: formData.get("yarn_weight_class")
      }
    }

    async function apiCall() {
      try {
        const response = await fetch("http://localhost:3000/materials", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params)
        });
        if (!response.ok) {
          console.error("Error")
          return
        }
      } catch(e) {
        setErrorMessage(e.message)
      }
    }

    apiCall()
  }

  function ErrorParagraph() {
    if (errorMessage !== null) {
      return <p style={{ color: 'red' }}>{errorMessage}</p>
    } else {
      return <></>
    }
  }

  return <>
    <form onSubmit={handleSubmit}>
      <ErrorParagraph />

      <input type="text" name="name" defaultValue="" />
      <select name="supply_type">
        <option value="yarn">Yarn</option>
        <option value="crochet_thread">Crochet thread</option>
        <option value="sewing_thread">Sewing thread</option>
        <option value="embroidery_floss">Embroidery floss</option>
        <option value="fabric">Fabric</option>
        <option value="elastic">Elastic</option>
        <option value="ribbon">Ribbon</option>
        <option value="cord">Cord</option>
      </select>
      <input type="text" name="color" defaultValue="" placeholder="pink" />
      <input type="number" step="1" min="0" name="stock_quantity" defaultValue="1" />
      <select name="stock_unit">
        <option value="skein">Skein</option>
        <option value="ball">Ball</option>
        <option value="cone">Cone</option>
        <option value="spool">Spool</option>
        <option value="bobbin">Bobbin</option>
        <option value="piece">Piece</option>
        <option value="pair">Pair</option>
        <option value="set">Set</option>
        <option value="pack">Pack</option>
      </select>
      <input type="number" min="0" name="length_per_unit_m" defaultValue="" />
      <select name="yarn_weight_class">
        <option value="lace_0">Lace</option>
        <option value="super_fine_1">Super fine</option>
        <option value="fine_2">Fine</option>
        <option value="light_3">Light</option>
        <option value="medium_4">Medium</option>
        <option value="bulky_5">Bulky</option>
        <option value="super_bulky_6">Super bulky</option>
        <option value="jumbo_7">Jumbo</option>
        <option value="unknown">Unknown</option>
      </select>

      <button type="submit">Create material</button>
    </form>
  </>
}


export default MaterialForm
