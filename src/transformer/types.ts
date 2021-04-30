import { BoolSymbol, NullSymbol } from '../interfaces';

export interface TransformerOptions {
  nullSymbols?: NullSymbol[] | null;
  trueSymbols?: BoolSymbol[] | null;
  falseSymbols?: BoolSymbol[] | null;
}
