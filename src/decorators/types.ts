import { BoolSymbol, NullSymbol } from '../interfaces';

export interface ColumnOptions {
  name?: string;
  allowNull?: boolean; // default: false
  defaultValue?: unknown;
}

export interface NullableOptions {
  symbols?: NullSymbol[];
}

export interface BoolOptions {
  trueSymbols?: BoolSymbol[];
  falseSymbols?: BoolSymbol[];
}

export type TransformFunction<ValueType = any> = (value: ValueType) => unknown;
