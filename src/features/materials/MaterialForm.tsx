import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import SelectField from '../../components/SelectField.tsx'
import { yarnWeightClasses, stockUnits, supplyTypes } from './materialOptions.ts'

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

function SubmitButton({ loading }: { loading: boolean }) {
  return loading ? (
    <button type="submit" disabled>
      Chargement...
    </button>
  ) : (
    <button type="submit">Create material</button>
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
      setRequestError(
        error instanceof Error
          ? error.message
          : 'Impossible de contacter le serveur',
      )
    } finally {
      setLoading(false)
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

      <SelectField label="Supply type" name="supply_type" defaultValue="yarn" onChange={ setSupplyType } options={supplyTypes} />

      <label>
        Color
        <input type="text" name="color" defaultValue="" placeholder="pink" />
      </label>
      <label>
        Stock quantity
        <input type="number" step="1" min="0" name="stock_quantity" defaultValue="1" />
      </label>

      <SelectField label="Stock unit" name="stock_unit" defaultValue="skein" options={stockUnits} />

      <label>
        Length per unit m
        <input type="number" min="0" name="length_per_unit_m" defaultValue="" />
      </label>


      {supplyType === 'yarn' && <SelectField label="Yarn weight class" name="yarn_weight_class" defaultValue="lace_0" options={yarnWeightClasses} />}


      <SubmitButton loading={loading} />
    </form>
  )
}

export default MaterialForm
