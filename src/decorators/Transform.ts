import { TransformFunction } from './types';
import { getMetadataStorage } from '../metadata';
import { ClassConstructor } from '../interfaces';

export function Transform<ValueType = any>(transformFunction: TransformFunction<ValueType>): PropertyDecorator {
  return function (target, propertyName): void {
    getMetadataStorage().addTransformMetadata({
      target: target.constructor as ClassConstructor,
      propertyName: propertyName as string,
      transformFunction,
    });
  };
}
