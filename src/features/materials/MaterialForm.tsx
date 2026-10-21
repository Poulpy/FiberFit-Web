import { useState, type FormEvent, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'
import SelectField from '../../components/SelectField.tsx'
import { yarnWeightClasses, stockUnits, supplyTypes } from './materialOptions.ts'
import type { Material, MaterialProps } from './materials.types.ts'

type ValidationErrors = Record<string, string[]>

type ErrorMessagesProps = {
  requestError: string | null
  validationErrors: ValidationErrors | null
}

function MaterialForm() {
  const { id } = useParams<{ id: string }>()
  const [material, setMaterial] = useState<Material | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id === undefined) {
      return
    }
    setError(null)
    setMaterial(null)

    async function apiCall() {
      try {
        const response = await fetch(`http://localhost:3000/materials/${id}`)
        if (response.ok) {
          setMaterial(await response.json() as Material)
        } else {
          setError(`Erreur serveur: ${response.status}`)
        }
      } catch(e) {
        if (e instanceof Error) {
          setError(e.message)
        } else {
          setError("Erreur inconnue")
        }
      }
    }

    apiCall()
  }, [id])

  if (error !== null) {
    return <p style={{ color: 'red' }}>{error}</p>
  }
  if (id !== undefined && material === null) {
    return <p>Chargement...</p>
  }



  return <Form material={material} />
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

function SubmitButton({ loading, isEdit }: { loading: boolean, isEdit: boolean }) {
  return loading ? (
    <button type="submit" disabled>
      Chargement...
    </button>
  ) : (
    isEdit ? (
      <button type="submit">Save</button>
    ) : (
      <button type="submit">Create material</button>
    )
  )
}


function Form({ material }: MaterialProps) {
  const navigate = useNavigate()
  const [supplyType, setSupplyType] = useState(material?.supply_type ?? 'yarn')
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

    const url = material === null ? 'http://localhost:3000/materials' : `http://localhost:3000/materials/${material.id}`
    try {
      const response = await fetch(url, {
        method: material === null ? 'POST' : 'PATCH',
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
        state: { message: material === null ? 'Matériau créé avec succès' : 'Matériau mis à jour avec succès' },
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
        <input type="text" name="name" defaultValue={material?.name ?? ""} />
      </label>

      <SelectField label="Supply type" name="supply_type" defaultValue={supplyType} onChange={ setSupplyType } options={supplyTypes} />

      <label>
        Color
        <input type="text" name="color" defaultValue={material?.color ?? ""} placeholder="pink" />
      </label>
      <label>
        Stock quantity
        <input type="number" step="1" min="0" name="stock_quantity" defaultValue={material?.stock_quantity ?? 1} />
      </label>

      <SelectField label="Stock unit" name="stock_unit" defaultValue={material?.stock_unit ?? "skein"} options={stockUnits} />

      <label>
        Length per unit m
        <input type="number" min="0" name="length_per_unit_m" defaultValue={material?.length_per_unit_m ?? ""} />
      </label>


      {supplyType === 'yarn' && <SelectField label="Yarn weight class" name="yarn_weight_class" defaultValue={material?.yarn_weight_class ?? "lace_0"} options={yarnWeightClasses} />}


      <SubmitButton loading={loading} isEdit={material !== null} />
    </form>
  )
}

export default MaterialForm
