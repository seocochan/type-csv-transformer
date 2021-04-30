import 'reflect-metadata';
import { Column, getMetadataStorage, transform } from '../../src';

describe('Column decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should register reflected types', () => {
    class Data {
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
    expect(metadataStorage.findColumnMetadata(Data, 'stringColumn').reflectedType).toEqual(String);
    expect(metadataStorage.findColumnMetadata(Data, 'numberColumn').reflectedType).toEqual(Number);
    expect(metadataStorage.findColumnMetadata(Data, 'booleanColumn').reflectedType).toEqual(Boolean);
    expect(metadataStorage.findColumnMetadata(Data, 'dateColumn').reflectedType).toEqual(Date);
  });

  it('should not accept null value when allowNull is not specified', () => {
    class Data {
      @Column()
      column: string;
    }
    const data = { column: 'null' };
    expect(() => transform(Data, data)).toThrow();
  });

  it('should not accept null value when allowNull is set to false', () => {
    class Data {
      @Column({ allowNull: false })
      column: string;
    }
    const data = { column: 'null' };
    expect(() => transform(Data, data)).toThrow();
  });

  it('should accept null value when allowNull is set to true', () => {
    class Data {
      @Column({ allowNull: true })
      column: string;
    }
    const data = { column: 'null' };
    expect(transform(Data, data)).toEqual({ column: null });
  });
});
