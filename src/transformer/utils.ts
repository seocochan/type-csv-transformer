import { NullSymbol } from '../interfaces';

export function isDateConstructable(value: unknown): value is string | number {
  return ['string', 'number'].includes(typeof value);
}

export function isNullSymbolCompatible(value: unknown): value is NullSymbol {
  return ['string', 'number'].includes(typeof value);
}

export function isBoolSymbolCompatible(value: unknown): value is NullSymbol {
  return ['string', 'number'].includes(typeof value);
}
