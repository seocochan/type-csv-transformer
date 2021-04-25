import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Bool, Column } from '../../src/decorators';
import { transform } from '../../src/transformer';

describe('Bool decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should work with default symbols', () => {
    class Data {
      @Column()
      @Bool()
      column1: boolean;

      @Column()
      @Bool()
      column2: boolean;

      @Column()
      @Bool()
      column3: boolean;
    }

    const data1 = { column1: 'true', column2: 'True', column3: 1 };
    expect(transform(Data, data1)).toEqual({
      column1: true,
      column2: true,
      column3: true,
    });
    const data2 = { column1: 'false', column2: 'False', column3: 0 };
    expect(transform(Data, data2)).toEqual({
      column1: false,
      column2: false,
      column3: false,
    });
  });

  it('should work with custom symbols when bool symbols are set to transform options', () => {
    class Data {
      @Column()
      @Bool()
      column1: boolean;

      @Column()
      @Bool()
      column2: boolean;
    }
    const data = { column1: 'yes', column2: 'no' };
    expect(transform(Data, data, { trueSymbols: ['yes'], falseSymbols: ['no'] })).toEqual({
      column1: true,
      column2: false,
    });
  });

  it('should work with custom symbols when bool symbols are set to decorator options', () => {
    class Data {
      @Column()
      @Bool({ trueSymbols: ['yes'] })
      column1: boolean;

      @Column()
      @Bool({ falseSymbols: ['no'] })
      column2: boolean;
    }
    const data = { column1: 'yes', column2: 'no' };
    expect(transform(Data, data)).toEqual({
      column1: true,
      column2: false,
    });
  });

  it('should return boolean values when value itself is true or false', () => {
    class Data {
      @Column()
      @Bool()
      column1: boolean;

      @Column()
      @Bool()
      column2: boolean;
    }
    const data = { column1: true, column2: false };
    expect(transform(Data, data)).toEqual({ column1: true, column2: false });
  });

  it('should throw error when symbols are set to null or empty', () => {
    class Data {
      @Column()
      @Bool({ trueSymbols: [], falseSymbols: [] })
      column: boolean;
    }
    const data = { column: 'true' };
    expect(() => transform(Data, data, { trueSymbols: null, falseSymbols: null })).toThrow();
  });
});
