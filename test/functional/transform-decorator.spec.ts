import 'reflect-metadata';
import { Bool, Column, getMetadataStorage, Nullable, Transform, transform } from '../../src';

describe('Transform decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should receive null values those are evaluated before transform function', () => {
    class Data {
      @Column()
      @Transform(value => (value == null ? 'yes' : 'no'))
      column1: string;

      @Column()
      @Nullable()
      @Transform(value => (value == null ? null : value))
      column2: number;
    }
    const data = { column1: 'null', column2: 'null' };
    expect(transform(Data, data)).toEqual({ column1: 'yes', column2: null });
  });

  it('should not perform transform function when default values can be assigned', () => {
    class Data {
      @Column({ defaultValue: 'default' })
      @Transform(() => 'transformed')
      column: string;
    }
    const data1 = { column: 'null' };
    const data2 = { column: 'value' };
    expect(transform(Data, data1)).toEqual({ column: 'default' });
    expect(transform(Data, data2)).toEqual({ column: 'transformed' });
  });

  it('should work but ignore bool decorator when used together', () => {
    class Data {
      @Column()
      @Bool()
      @Transform(value => typeof value)
      column: string;
    }
    const data = { column: 'false' };
    expect(transform(Data, data)).toEqual({ column: 'string' });
  });
});
