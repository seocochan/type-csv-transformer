import { ColumnOptions } from './types';
import { getMetadataStorage } from '../metadata';
import { ClassConstructor } from '../interfaces';

export function Column(options?: ColumnOptions): PropertyDecorator {
  return function (target, propertyName): void {
    getMetadataStorage().addColumnMetadata({
      target: target.constructor as ClassConstructor,
      propertyName: propertyName as string,
      reflectedType: Reflect.getMetadata('design:type', target, propertyName),
      options,
    });
  };
}
