import 'reflect-metadata';
import { Bool, Column, getMetadataStorage, transform } from '../../src';

describe('Bool decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should work with default symbols whether bool decorators are used or not', () => {
    class Data {
      @Column()
      @Bool()
      column1: boolean;

      @Column()
      @Bool()
      column2: boolean;

      @Column()
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
    class Data1 {
      @Column()
      @Bool({ trueSymbols: [] })
      column: boolean;
    }
    const data1 = { column: 'true' };
    expect(() => transform(Data1, data1, { trueSymbols: null })).toThrow();

    class Data2 {
      @Column()
      @Bool({ falseSymbols: [] })
      column: boolean;
    }
    const data2 = { column: 'false' };
    expect(() => transform(Data2, data2, { falseSymbols: null })).toThrow();
  });

  it('should throw error when there are identical values on true/false symbols', () => {
    class Data {
      @Column()
      @Bool({ trueSymbols: ['uwu'] })
      column: boolean;
    }
    const data = { column: 'uwu' };
    expect(() => transform(Data, data, { falseSymbols: ['uwu'] })).toThrow();
  });
});
