import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Column } from '../../src/decorators';

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
});
