
type SelectOptions = {
  value: string
  label: string
}
type SelectFieldProps = {
  label: string
  name: string
  defaultValue: string
  onChange?: (value: string) => void
  options: SelectOptions[]
}

export default function SelectField(props: SelectFieldProps) {
  return (
    <label>
      {props.label}
      <select name={props.name} defaultValue={props.defaultValue} onChange={(event) => props.onChange?.(event.target.value)}>
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}
