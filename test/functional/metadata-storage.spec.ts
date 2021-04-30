import 'reflect-metadata';
import { Column, getMetadataStorage } from '../../src';

describe('MetadataStorage', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should return decorated properties of target class', () => {
    class BasicObject {
      @Column()
      column1: string;

      @Column()
      column2: number;

      @Column()
      column3: boolean;

      skippedColumn: boolean;
    }

    const metadataStorage = getMetadataStorage();
    expect(metadataStorage.getColumnProperties(BasicObject)).toEqual(['column1', 'column2', 'column3']);
  });

  it('should return undefined when given property have no metadata', () => {
    class Data {
      column: string;
    }
    expect(getMetadataStorage().findColumnMetadata(Data, 'column')).toBeUndefined();
  });
});
