import { Transformer } from './transformer';
import { TransformOptions } from './types';
import { ClassConstructor } from '../interfaces';

export function transform<ClsType, ObjectType extends Record<string, unknown>>(
  cls: ClassConstructor<ClsType>,
  object: ObjectType,
  options?: TransformOptions
): ClsType {
  return new Transformer(options).execute(cls, object);
}
