import { ColumnMetadata, TargetMetadataMap } from './types';
import { createTargetMetadataMap } from './utils';
import { ClassConstructor } from '../interfaces';

export class MetadataStorage {
  private columns: TargetMetadataMap<ColumnMetadata> = createTargetMetadataMap();

  clear(): void {
    this.columns.clear();
  }

  addColumnMetadata(metadata: ColumnMetadata): void {
    if (!this.columns.has(metadata.target)) {
      this.columns.set(metadata.target, new Map());
    }
    const metadataMap = this.columns.get(metadata.target);
    if (metadataMap) {
      metadataMap.set(metadata.propertyName, metadata);
    }
  }

  findColumnMetadata(target: ClassConstructor, propertyName: string): ColumnMetadata | undefined {
    return this.columns.get(target)?.get(propertyName);
  }

  getColumnProperties(target: ClassConstructor): string[] {
    const metadataMap = this.columns.get(target);
    if (!metadataMap) {
      return [];
    }
    return [...metadataMap.keys()];
  }
}
