import { NullableOptions } from './types';
import { getMetadataStorage } from '../metadata';
import { ClassConstructor } from '../interfaces';

export function Nullable(options?: NullableOptions): PropertyDecorator {
  return function (target, propertyName): void {
    getMetadataStorage().addNullableMetadata({
      target: target.constructor as ClassConstructor,
      propertyName: propertyName as string,
      options,
    });
  };
}
