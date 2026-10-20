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

  function SupplyTypePicker() {
    const supplyTypes = [
      {value: "yarn", label: "Yarn"},
      {value: "crochet_thread", label: "Crochet thread"},
      {value: "sewing_thread", label: "Sewing thread"},
      {value: "embroidery_floss", label: "Embroidery floss"},
      {value: "fabric", label: "Fabric"},
      {value: "elastic", label: "Elastic"},
      {value: "ribbon", label: "Ribbon"},
      {value: "cord", label: "Cord"}
    ]

    const options = supplyTypes.map( (supplyType) =>
      <option key={supplyType.value} value={supplyType.value}>{supplyType.label}</option>
    )

    return (
      <select name="supply_type">
        {options}
      </select>
    )
  }

  function StockUnitPicker() {
    const stockUnits = [
      {value: "skein", label: "Skein"},
      {value: "ball", label: "Ball"},
      {value: "cone", label: "Cone"},
      {value: "spool", label: "Spool floss"},
      {value: "bobbin", label: "Bobbin"},
      {value: "piece", label: "Piece"},
      {value: "pair", label: "Pair"},
      {value: "set", label: "Set"},
      {value: "pack", label: "Pack"}
    ]

    const options = stockUnits.map( (stockUnit) =>
      <option key={stockUnit.value} value={stockUnit.value}>{stockUnit.label}</option>
    )

    return (
      <select name="stock_unit">
        {options}
      </select>
    )
  }

  function YarnWeightClassPicker() {
    const yarnWeightClasses = [
      {value: "lace_0", label: "Lace"},
      {value: "super_fine_1", label: "Super fine"},
      {value: "fine_2", label: "Fine"},
      {value: "light_3", label: "Light"},
      {value: "medium_4", label: "Medium"},
      {value: "bulky_5", label: "Bulky"},
      {value: "super_bulky_6", label: "Super bulky"},
      {value: "jumbo_7", label: "Jumbo"},
      {value: "unknown", label: "Unknown"}
    ]

    const options = yarnWeightClasses.map( (yarnWeightClass) =>
      <option key={yarnWeightClass.value} value={yarnWeightClass.value}>{yarnWeightClass.label}</option>
    )

    return (
      <select name="yarn_weight_class">
        {options}
      </select>
    )
  }

  return <>
  <form onSubmit={handleSubmit}>
    <ErrorParagraph />

    <input type="text" name="name" defaultValue="" />

    <SupplyTypePicker />

    <input type="text" name="color" defaultValue="" placeholder="pink" />
    <input type="number" step="1" min="0" name="stock_quantity" defaultValue="1" />
    <StockUnitPicker />
    <input type="number" min="0" name="length_per_unit_m" defaultValue="" />
    <YarnWeightClassPicker />

    <button type="submit">Create material</button>
  </form>
  </>
}


export default MaterialForm
