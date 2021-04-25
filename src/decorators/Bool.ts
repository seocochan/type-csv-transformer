import { BoolOptions } from './types';
import { getMetadataStorage } from '../metadata';
import { ClassConstructor } from '../interfaces';

export function Bool(options?: BoolOptions): PropertyDecorator {
  return function (target, propertyName): void {
    getMetadataStorage().addBoolMetadata({
      target: target.constructor as ClassConstructor,
      propertyName: propertyName as string,
      options,
    });
  };
}
