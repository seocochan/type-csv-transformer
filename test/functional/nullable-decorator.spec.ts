import 'reflect-metadata';
import { Column, getMetadataStorage, Nullable, transform } from '../../src';

describe('Nullable decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should throw error when allowNull is set to false', () => {
    class Data {
      @Column({ allowNull: false })
      @Nullable()
      column: string;
    }
    const data = { column: 'null' };
    expect(() => transform(Data, data)).toThrow();
  });

  it('should work when allowNull is set to true or not specified', () => {
    class Data {
      @Column({ allowNull: true })
      @Nullable()
      column1: string;

      @Column()
      @Nullable()
      column2: string;
    }
    const data = { column1: 'null', column2: 'None' };
    expect(transform(Data, data)).toEqual({ column1: null, column2: null });
  });

  it('should work with custom symbols when null symbols are set to transform options', () => {
    class Data {
      @Column()
      @Nullable()
      column1: string;

      @Column()
      @Nullable()
      column2: string;

      @Column()
      @Nullable()
      column3: string;
    }
    const data = { column1: 0, column2: 'NA', column3: 'null' };
    expect(transform(Data, data, { nullSymbols: [0, 'NA'] })).toEqual({
      column1: null,
      column2: null,
      column3: 'null',
    });
  });

  it('should work with custom symbols when null symbols are set to decorator options', () => {
    class Data {
      @Column()
      @Nullable({ symbols: [0, '0'] })
      column1: string;

      @Column()
      @Nullable({ symbols: ['NA', 'N/A'] })
      column2: string;
    }
    [
      { column1: 0, column2: 'NA' },
      { column1: '0', column2: 'N/A' },
    ].forEach(data => {
      expect(transform(Data, data)).toEqual({
        column1: null,
        column2: null,
      });
    });
  });

  it('should return null without type transformation when value itself is null or undefined', () => {
    class Data {
      @Column()
      @Nullable()
      column1: string;

      @Column()
      @Nullable()
      column2: string;
    }
    const data = { column1: null, column2: undefined };
    expect(transform(Data, data)).toEqual({ column1: null, column2: null });
  });

  it('should throw error when symbols are set to null or empty', () => {
    class Data {
      @Column()
      @Nullable({ symbols: [] })
      column: string;
    }
    const data = { column: 'null' };
    expect(() => transform(Data, data, { nullSymbols: null })).toThrow();
  });
});
