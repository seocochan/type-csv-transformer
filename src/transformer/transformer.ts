import { TransformOptions } from './types';
import { isBoolSymbolCompatible, isDateConstructable, isNullSymbolCompatible } from './utils';
import { getMetadataStorage } from '../metadata';
import { BoolSymbol, ClassConstructor, NullSymbol } from '../interfaces';
import { notNull } from '../utils';

export class Transformer {
  private readonly nullSymbols: NullSymbol[] | null = ['null', 'None', ''];
  private readonly trueSymbols: BoolSymbol[] | null = ['true', 'True', 1];
  private readonly falseSymbols: BoolSymbol[] | null = ['false', 'False', 0];

  constructor(private readonly options?: TransformOptions) {
    this.nullSymbols = options?.nullSymbols !== undefined ? options.nullSymbols : this.nullSymbols;
    this.trueSymbols = options?.trueSymbols !== undefined ? options.trueSymbols : this.trueSymbols;
    this.falseSymbols = options?.falseSymbols !== undefined ? options.falseSymbols : this.falseSymbols;
  }

  execute<ClsType, ObjectType extends Record<string, unknown>>(
    cls: ClassConstructor<ClsType>,
    object: ObjectType
  ): ClsType {
    const targetKeys = getMetadataStorage().getColumnProperties(cls);
    const targetInstance = new cls() as Record<string, unknown>;

    for (const targetKey of targetKeys) {
      const columnMetadata = notNull(getMetadataStorage().findColumnMetadata(cls, targetKey));
      const key = columnMetadata.options?.name || targetKey;
      const value = object[key];

      /* determine value is null */
      const nullableMetadata = getMetadataStorage().findNullableMetadata(cls, targetKey);
      if (nullableMetadata && columnMetadata.options?.allowNull === false) {
        throw new Error('@Nullable cannot be used with ColumnOptions.allowNull=false');
      }
      const allowNull = !!(columnMetadata.options?.allowNull ?? nullableMetadata);
      const nullSymbols = nullableMetadata?.options?.symbols ?? this.nullSymbols;
      if (!nullSymbols || nullSymbols.length === 0) {
        throw new Error('No null symbols found. Please set valid symbols');
      }
      const isNullValue = value == null ? true : isNullSymbolCompatible(value) ? nullSymbols.includes(value) : false;

      /* determine final value */
      let targetValue: unknown;
      const transformMetadata = getMetadataStorage().findTransformMetadata(cls, targetKey);
      if (isNullValue) {
        if (columnMetadata.options?.defaultValue != null) {
          targetValue = columnMetadata.options?.defaultValue;
        } else if (transformMetadata) {
          targetValue = transformMetadata.transformFunction(null);
        } else {
          targetValue = null;
        }
      } else {
        if (transformMetadata) {
          targetValue = transformMetadata.transformFunction(value);
        } else {
          targetValue = this.castValue(value, cls, targetKey);
        }
      }

      if (!allowNull && targetValue === null) {
        throw new Error(`Column '${targetKey}' cannot be set to null. Use @Nullable or set allowNull=true if needed`);
      }
      targetInstance[targetKey] = targetValue;
    }
    return targetInstance as ClsType;
  }

  private castValue(value: unknown, cls: ClassConstructor, key: string) {
    const columnMetadata = notNull(getMetadataStorage().findColumnMetadata(cls, key));
    const type = columnMetadata.reflectedType;
    switch (type) {
      case String:
        return String(value);
      case Number:
        return Number(value);
      case Boolean: {
        const boolMetadata = getMetadataStorage().findBoolMetadata(cls, key);
        const trueSymbols = boolMetadata?.options?.trueSymbols ?? this.trueSymbols;
        if (!trueSymbols || trueSymbols.length === 0) {
          throw new Error('No true symbols found. Please set valid symbols');
        }
        const falseSymbols = boolMetadata?.options?.falseSymbols ?? this.falseSymbols;
        if (!falseSymbols || falseSymbols.length === 0) {
          throw new Error('No false symbols found. Please set valid symbols');
        }
        const isTrueValue = value === true ? true : isBoolSymbolCompatible(value) ? trueSymbols.includes(value) : false;
        const isFalseValue =
          value === false ? true : isBoolSymbolCompatible(value) ? falseSymbols.includes(value) : false;
        if (isTrueValue && isFalseValue) {
          throw new Error(
            'Cannot determine bool value using given symbols. Maybe there are duplicated symbols in true/false symbols'
          );
        }
        if (isTrueValue) {
          return true;
        }
        if (isFalseValue) {
          return false;
        }
        return Boolean(value);
      }
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
