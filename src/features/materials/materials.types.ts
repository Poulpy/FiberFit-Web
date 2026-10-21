export type Material = {
  id: number
  name: string
  supply_type: string,
  color: string,
  stock_quantity: number,
  stock_unit: string,
  length_per_unit_m: number | null,
  yarn_weight_class: string | null
}

export type MaterialProps = {
  material: Material | null
}
