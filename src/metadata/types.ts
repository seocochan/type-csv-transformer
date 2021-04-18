import { ClassConstructor } from '../interfaces';
import { ColumnOptions, NullableOptions } from '../decorators/types';

export type TargetMetadataMap<T> = Map<ClassConstructor, Map<string, T>>;

export interface ColumnMetadata {
  target: ClassConstructor;
  propertyName: string;
  reflectedType: unknown;
  options?: ColumnOptions;
}

export interface NullableMetadata {
  target: ClassConstructor;
  propertyName: string;
  options?: NullableOptions;
}
