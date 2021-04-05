import { MetadataStorage } from './metadata-storage';

export function getMetadataStorage(): MetadataStorage {
  return global.TypeCSVTransformerMetadataStorage || (global.TypeCSVTransformerMetadataStorage = new MetadataStorage());
}
