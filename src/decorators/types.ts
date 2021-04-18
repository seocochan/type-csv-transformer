import { NullSymbol } from '../interfaces';

export interface ColumnOptions {
  name?: string;
  allowNull?: boolean; // default: false
  defaultValue?: unknown;
}

export interface NullableOptions {
  symbols?: NullSymbol[];
}
