import 'reflect-metadata';
import { getMetadataStorage } from '../../src/metadata';
import { Column, Nullable, Transform } from '../../src/decorators';
import { transform } from '../../src/transformer';

describe('Transformer', () => {
  beforeAll(() => {
    getMetadataStorage().clear();
  });

  it('should transform object to class instance', () => {
    class Cat {
      @Column()
      name: string;

      @Column({ name: 'name' })
      hasName: boolean;

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

      @Column()
      @Nullable()
      isOddEyed: boolean;

      @Column()
      @Transform<number>(value => value / 1000)
      weight: number;
    }

    const cat = {
      name: 'Toma',
      age: 10,
      likes: 'chicken',
      birthday: '2011-12-01',
      hometown: 'NULL',
      isOddEyed: 'no',
      weight: 5600,
    };
    const catInstance = transform(Cat, cat, { nullSymbols: ['NULL'], trueSymbols: ['yes'], falseSymbols: ['no'] });
    expect(catInstance).toBeInstanceOf(Cat);
    expect(catInstance).toEqual({
      name: cat.name,
      hasName: true,
      age: cat.age,
      hasLongHair: false,
      interest: cat.likes,
      birthday: new Date(cat.birthday),
      home: null,
      isOddEyed: false,
      weight: 5.6,
    });
  });
});
