import { BoolSymbol, NullSymbol } from '../interfaces';

export interface TransformOptions {
  nullSymbols?: NullSymbol[] | null;
  trueSymbols?: BoolSymbol[] | null;
  falseSymbols?: BoolSymbol[] | null;
}
