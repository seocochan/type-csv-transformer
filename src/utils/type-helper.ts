export function notNull<T>(value: T): NonNullable<T> {
  if (value == null) {
    throw new Error('Expected that value is defined but found null. Usually, this error should never occur.');
  }
  return value as NonNullable<T>;
}
