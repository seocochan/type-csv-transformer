<h1 align="center">type-csv-transformer</h1>

<p align="center">
CSV-friendly, declarative and type-safe object to class transformer.
</p>

<p align="center">
  <a href="https://github.com/seocochan/type-csv-transformer/actions/workflows/continuous-integration-workflow.yml?query=branch:main">
    <img src="https://img.shields.io/github/workflow/status/seocochan/type-csv-transformer/CI/main.svg?style=flat-square" alt="build status" height="18">
  </a>
  <a href="https://codecov.io/gh/seocochan/type-csv-transformer?branch=main">
    <img src="https://img.shields.io/codecov/c/gh/seocochan/type-csv-transformer.svg?style=flat-square" alt="codecov" height="18">
  </a>
  <a href="https://www.npmjs.com/package/type-csv-transformer">
    <img src="https://img.shields.io/npm/v/type-csv-transformer.svg?style=flat-square" alt="npm version" height="18">
  </a>
</p>

## Features

- **Decorator** and **class** based declarative transformations.
- **Automatically converts** nullish or boolean-ish string values. (e.g. `'null'`, `'true'`)
- Works as **middleware**, following CSV parser you're using (like [`node-csv`](https://csv.js.org/))
- **Customizable**, define your own conversion rules or custom transform methods.
- **Tested**, with high code coverage.

## Installation

`reflect-metadata` package is required since we're highly rely on type reflection.

```
npm install type-csv-transformer reflect-metadata
# or
yarn add type-csv-transformer reflect-metadata
```

And be sure to `reflect-metadata` is imported before using `type-csv-transformer`

```typescript
import "reflect-metadata";
```

Last, a little `tsconfig.json` tweak is needed.

```
{
    "compilerOptions": {
        ...
        "emitDecoratorMetadata": true,
        "experimentalDecorators": true,
        ...
    }
}
```

## Usage

### Simple

```typescript
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
  @Bool()
  isOddEyed: boolean;
}

const cat = {
  name: 'Toma',
  age: 10,
  likes: 'chicken',
  birthday: '2011-12-01',
  hometown: 'null',
  isOddEyed: 'false',
};
const catInstance = transform(Cat, cat);

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
});
```

### Advanced

```typescript
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
  @Bool()
  isOddEyed: boolean;
  
  @Column()
  @Transform<number>(value => value / 1000) // convert grams to kilograms
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
// this time, we're setting custom symbols
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
```

> This library is still in early stage. If these behavior does not fit into your use cases, feel free to [open an issue](https://github.com/seocochan/type-csv-transformer/issues/new)!

## API Reference

> TODO

## Inspirations

At first, I was trying to handle CSVs with [`class-transformer`](https://github.com/typestack/class-transformer). That attemp actually works but there're many extra codes and some unwanted behaviors. So I created the `type-csv-transformer`.

Still this library's concepts and implementations are inspired by [`class-transformer`](https://github.com/typestack/class-transformer) a lot, but there're some differences.

`type-csv-transformer`

- concentrates on more specific problems.
- provides many utilities to handle CSV easly.
- has much smaller bundle size.

## Contributing

1. Fork this repository
1. Create new feature branch
1. Write your codes and commit
1. Make all tests and linter rules pass
1. Push and make pull request
