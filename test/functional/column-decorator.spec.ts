import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Column } from '../../src/decorators';

describe('Column decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should register reflected types', () => {
    class BasicObject {
      @Column()
      stringColumn: string;

      @Column()
      numberColumn: number;

      @Column()
      booleanColumn: boolean;

      @Column()
      dateColumn: Date;
    }

    const metadataStorage = getMetadataStorage();
    expect(metadataStorage.findColumnMetadata(BasicObject, 'stringColumn').reflectedType).toEqual(String);
    expect(metadataStorage.findColumnMetadata(BasicObject, 'numberColumn').reflectedType).toEqual(Number);
    expect(metadataStorage.findColumnMetadata(BasicObject, 'booleanColumn').reflectedType).toEqual(Boolean);
    expect(metadataStorage.findColumnMetadata(BasicObject, 'dateColumn').reflectedType).toEqual(Date);
  });
});
