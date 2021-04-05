import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Column } from '../../src/decorators';

describe('Columns', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should register basic metadata without errors', () => {
    class BasicObject {
      @Column()
      stringColumn: string;

      @Column()
      numberColumn: number;

      @Column()
      booleanColumn: boolean;
    }

    const metadataStorage = getMetadataStorage();
    expect(metadataStorage.findColumnMetadata(BasicObject, 'stringColumn').reflectedType).toEqual(String);
    expect(metadataStorage.findColumnMetadata(BasicObject, 'numberColumn').reflectedType).toEqual(Number);
    expect(metadataStorage.findColumnMetadata(BasicObject, 'booleanColumn').reflectedType).toEqual(Boolean);
  });
});
