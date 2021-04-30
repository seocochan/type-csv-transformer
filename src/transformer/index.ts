import { Transformer } from './transformer';
import { TransformerOptions } from './types';
import { ClassConstructor } from '../interfaces';

export function transform<ClsType, ObjectType extends Record<string, unknown>>(
  cls: ClassConstructor<ClsType>,
  object: ObjectType,
  options?: TransformerOptions
): ClsType {
  return new Transformer(options).execute(cls, object);
}

export * from './types';
