import { ClassConstructor } from '../interfaces';
import { ColumnOptions } from '../decorators/types';

export type TargetMetadataMap<T> = Map<ClassConstructor, Map<string, T>>;

export interface ColumnMetadata {
  target: ClassConstructor;
  propertyName: string;
  reflectedType: unknown;
  options?: ColumnOptions;
}
