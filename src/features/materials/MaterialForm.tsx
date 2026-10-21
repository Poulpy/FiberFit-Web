import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'

type ValidationErrors = Record<string, string[]>

type ErrorMessagesProps = {
  requestError: string | null
  validationErrors: ValidationErrors | null
}

function MaterialForm() {
  return <Create />
}

function ErrorMessages({ requestError, validationErrors }: ErrorMessagesProps) {
  if (requestError !== null) {
    return <p style={{ color: 'red' }}>{requestError}</p>
  }

  if (validationErrors !== null) {
    return (
      <ul style={{ color: 'red' }}>
        {Object.entries(validationErrors).flatMap(([field, messages]) =>
          messages.map((message) => (
            <li key={`${field}-${message}`}>
              {field}: {message}
            </li>
          )),
        )}
      </ul>
    )
  }

  return null
}

type SupplyTypePickerProps = {
  value: string
  onChange: (value: string) => void
}

function SubmitButton({ loading }: { loading: boolean }) {
  return loading ? (
    <button type="submit" disabled>
      Chargement...
    </button>
  ) : (
    <button type="submit">Create material</button>
  )
}

function SupplyTypePicker({ value, onChange }: SupplyTypePickerProps) {
  const supplyTypes = [
    { value: 'yarn', label: 'Yarn' },
    { value: 'crochet_thread', label: 'Crochet thread' },
    { value: 'sewing_thread', label: 'Sewing thread' },
    { value: 'embroidery_floss', label: 'Embroidery floss' },
    { value: 'fabric', label: 'Fabric' },
    { value: 'elastic', label: 'Elastic' },
    { value: 'ribbon', label: 'Ribbon' },
    { value: 'cord', label: 'Cord' },
  ]

  return (
    <select
      name="supply_type"
      value={value}
      onChange={(event) => onChange(event.target.value)}
    >
      {supplyTypes.map((supplyType) => (
        <option key={supplyType.value} value={supplyType.value}>
          {supplyType.label}
        </option>
      ))}
    </select>
  )
}

function StockUnitPicker() {
  const stockUnits = [
    { value: 'skein', label: 'Skein' },
    { value: 'ball', label: 'Ball' },
    { value: 'cone', label: 'Cone' },
    { value: 'spool', label: 'Spool' },
    { value: 'bobbin', label: 'Bobbin' },
    { value: 'piece', label: 'Piece' },
    { value: 'pair', label: 'Pair' },
    { value: 'set', label: 'Set' },
    { value: 'pack', label: 'Pack' },
  ]

  return (
    <select name="stock_unit" defaultValue="skein">
      {stockUnits.map((stockUnit) => (
        <option key={stockUnit.value} value={stockUnit.value}>
          {stockUnit.label}
        </option>
      ))}
    </select>
  )
}

function YarnWeightClassPicker() {
  const yarnWeightClasses = [
    { value: 'lace_0', label: 'Lace' },
    { value: 'super_fine_1', label: 'Super fine' },
    { value: 'fine_2', label: 'Fine' },
    { value: 'light_3', label: 'Light' },
    { value: 'medium_4', label: 'Medium' },
    { value: 'bulky_5', label: 'Bulky' },
    { value: 'super_bulky_6', label: 'Super bulky' },
    { value: 'jumbo_7', label: 'Jumbo' },
    { value: 'unknown', label: 'Unknown' },
  ]

  return (
    <label>
      Yarn weight class
      <select name="yarn_weight_class" defaultValue="lace_0">
        {yarnWeightClasses.map((yarnWeightClass) => (
          <option key={yarnWeightClass.value} value={yarnWeightClass.value}>
            {yarnWeightClass.label}
          </option>
        ))}
      </select>
    </label>
  )
}


function Create() {
  const navigate = useNavigate()
  const [supplyType, setSupplyType] = useState('yarn')
  const [requestError, setRequestError] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<ValidationErrors | null>(null)
  const [loading, setLoading] = useState(false)


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRequestError(null)
    setValidationErrors(null)
    setLoading(true)

    const formData = new FormData(event.currentTarget)
    const params = {
      material: {
        name: formData.get('name'),
        supply_type: formData.get('supply_type'),
        color: formData.get('color'),
        stock_quantity: formData.get('stock_quantity'),
        stock_unit: formData.get('stock_unit'),
        length_per_unit_m: formData.get('length_per_unit_m'),
        yarn_weight_class: formData.get('yarn_weight_class'),
      },
    }

    try {
      const response = await fetch('http://localhost:3000/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(params),
      })

      const body = await response.json()

      setLoading(false)
      if (!response.ok) {
        if (response.status === 422) {
          setValidationErrors(body as ValidationErrors)
          return
        }

        throw new Error(`Erreur serveur : ${response.status}`)
      }

      navigate('/materials', {
        state: { message: 'Matériau créé avec succès' },
      })
    } catch (error) {
      setLoading(false)
      setRequestError(
        error instanceof Error
          ? error.message
          : 'Impossible de contacter le serveur',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <ErrorMessages
        requestError={requestError}
        validationErrors={validationErrors}
      />

      <label>Name
        <input type="text" name="name" defaultValue="" />
      </label>

      <label>
        Supply type
        <SupplyTypePicker value={supplyType} onChange={setSupplyType} />
      </label>

      <label>
        Color
        <input type="text" name="color" defaultValue="" placeholder="pink" />
      </label>
      <label>
        Stock quantity
        <input type="number" step="1" min="0" name="stock_quantity" defaultValue="1" />
      </label>

      <label>
        Stock unit
        <StockUnitPicker />
      </label>

      <label>
        Length per unit m
        <input type="number" min="0" name="length_per_unit_m" defaultValue="" />
      </label>


      {supplyType === "yarn" && <YarnWeightClassPicker />}


      <SubmitButton loading={loading} />
    </form>
  )
}

export default MaterialForm
