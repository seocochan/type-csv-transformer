import { BoolMetadata, ColumnMetadata, NullableMetadata, TargetMetadataMap } from './types';
import { createTargetMetadataMap } from './utils';
import { ClassConstructor } from '../interfaces';

export class MetadataStorage {
  private columns: TargetMetadataMap<ColumnMetadata> = createTargetMetadataMap();
  private nullables: TargetMetadataMap<NullableMetadata> = createTargetMetadataMap();
  private bools: TargetMetadataMap<BoolMetadata> = createTargetMetadataMap();

  clear(): void {
    this.columns.clear();
    this.nullables.clear();
    this.bools.clear();
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

  addNullableMetadata(metadata: NullableMetadata): void {
    if (!this.nullables.has(metadata.target)) {
      this.nullables.set(metadata.target, new Map());
    }
    const metadataMap = this.nullables.get(metadata.target);
    if (metadataMap) {
      metadataMap.set(metadata.propertyName, metadata);
    }
  }

  addBoolMetadata(metadata: BoolMetadata): void {
    if (!this.bools.has(metadata.target)) {
      this.bools.set(metadata.target, new Map());
    }
    const metadataMap = this.bools.get(metadata.target);
    if (metadataMap) {
      metadataMap.set(metadata.propertyName, metadata);
    }
  }

  findColumnMetadata(target: ClassConstructor, propertyName: string): ColumnMetadata | undefined {
    return this.columns.get(target)?.get(propertyName);
  }

  findNullableMetadata(target: ClassConstructor, propertyName: string): NullableMetadata | undefined {
    return this.nullables.get(target)?.get(propertyName);
  }

  findBoolMetadata(target: ClassConstructor, propertyName: string): BoolMetadata | undefined {
    return this.bools.get(target)?.get(propertyName);
  }

  getColumnProperties(target: ClassConstructor): string[] {
    const metadataMap = this.columns.get(target);
    if (!metadataMap) {
      return [];
    }
    return [...metadataMap.keys()];
  }
}
