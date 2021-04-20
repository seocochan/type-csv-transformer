import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Column, Nullable } from '../../src/decorators';
import { transform } from '../../src/transformer';

describe('Transformer', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should transform object to class instance', () => {
    class Cat {
      @Column()
      name: string;

      @Column()
      age: number;

      @Column({ defaultValue: false })
      hasLongHair: boolean;

      @Column({ name: 'likes' })
      interest: string;

      @Column()
      birthday: Date;

      @Column({ name: 'hometown' })
      @Nullable()
      home: string | null;
    }

    const cat = { name: 'Toma', age: 10, likes: 'chicken', birthday: '2011-12-01', hometown: 'NULL' };
    const catInstance = transform(Cat, cat, { nullSymbols: ['NULL'] });
    expect(catInstance).toBeInstanceOf(Cat);
    expect(catInstance).toEqual({
      name: cat.name,
      age: cat.age,
      hasLongHair: false,
      interest: cat.likes,
      birthday: new Date(cat.birthday),
      home: null,
    });
  });
});
