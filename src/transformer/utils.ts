export function isDateConstructable(value: unknown): value is string | number {
  return ['string', 'number'].includes(typeof value);
}
