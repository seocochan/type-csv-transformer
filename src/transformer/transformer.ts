import { TransformOptions } from './types';
import { isDateConstructable } from './utils';
import { getMetadataStorage } from '../metadata';
import { ClassConstructor } from '../interfaces';

export class Transformer {
  constructor(private readonly options?: TransformOptions) {}

  execute<ClsType, ObjectType extends Record<string, unknown>>(
    cls: ClassConstructor<ClsType>,
    object: ObjectType
  ): ClsType {
    const targetKeys = getMetadataStorage().getColumnProperties(cls);
    const targetInstance = new cls() as Record<string, unknown>;

    for (const targetKey of targetKeys) {
      const columnMetadata = getMetadataStorage().findColumnMetadata(cls, targetKey);
      if (!columnMetadata) {
        continue; // or throw??
      }
      const key = columnMetadata.options?.name || targetKey;
      const targetType = columnMetadata.reflectedType;
      const value = object[key];
      const isNullValue = value == null; // TODO: determine nullish value
      const targetValue = isNullValue
        ? columnMetadata.options?.defaultValue ?? null
        : this.castValue(value, targetType);
      targetInstance[targetKey] = targetValue;
    }
    return targetInstance as ClsType;
  }

  private castValue(value: unknown, type: unknown) {
    switch (type) {
      case String:
        return String(value);
      case Number:
        return Number(value);
      case Boolean:
        // TODO: need ref to this.options, columnMetadata
        return Boolean(value);
      case Date:
        if (!isDateConstructable(value)) {
          throw new Error(`'${typeof value}' type cannot be transformed into date`);
        }
        return new Date(value);
      default:
        throw new Error('Not supported type');
    }
  }
}
