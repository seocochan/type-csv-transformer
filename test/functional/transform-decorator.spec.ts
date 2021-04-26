import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Bool, Column, Transform } from '../../src/decorators';
import { transform } from '../../src/transformer';

describe('Transform decorator', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should receive null values those are evaluated before transform function', () => {
    class Data {
      @Column()
      @Transform(value => (value == null ? 'yes' : 'no'))
      column: string;
    }
    const data = { column: 'null' };
    expect(transform(Data, data)).toEqual({ column: 'yes' });
  });

  it('should not perform transform function when default values can be assigned', () => {
    class Data {
      @Column({ defaultValue: 'default' })
      @Transform(_value => 'transformed')
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
