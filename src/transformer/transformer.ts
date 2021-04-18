import { TransformOptions } from './types';
import { isDateConstructable, isNullSymbolCompatible } from './utils';
import { getMetadataStorage } from '../metadata';
import { ClassConstructor, NullSymbol } from '../interfaces';

export class Transformer {
  private readonly nullSymbols: NullSymbol[] | null = ['null', 'None', ''];

  constructor(private readonly options?: TransformOptions) {
    this.nullSymbols = options?.nullSymbols !== undefined ? options.nullSymbols : this.nullSymbols;
  }

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

      const nullableMetadata = getMetadataStorage().findNullableMetadata(cls, targetKey);
      if (nullableMetadata && columnMetadata.options?.allowNull === false) {
        throw new Error('@Nullable cannot be used with ColumnOptions.allowNull=false');
      }
      const allowNull = !!(columnMetadata.options?.allowNull ?? nullableMetadata);
      const nullSymbols = nullableMetadata?.options?.symbols ?? this.nullSymbols;
      if (!nullSymbols || nullSymbols.length === 0) {
        throw new Error('No null symbols found. Please set valid symbols');
      }
      const isNullValue = isNullSymbolCompatible(value) ? nullSymbols.includes(value) : false;

      const targetValue = isNullValue
        ? columnMetadata.options?.defaultValue ?? null
        : this.castValue(value, targetType);
      if (!allowNull && targetValue === null) {
        throw new Error(`Column '${targetKey}' cannot be set to null. Use @Nullable or set allowNull=true if needed`);
      }
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
