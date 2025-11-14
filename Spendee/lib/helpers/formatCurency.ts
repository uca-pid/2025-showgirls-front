export function formatCurrency(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 0,
) {
  return new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: minimumFractionDigits,
    maximumFractionDigits: maximumFractionDigits,
  }).format(value)
}
