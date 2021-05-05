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
- **Automatically converts** nullish or boolean-ish values. (e.g. `'null'`, `'true'`)
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

> This library is still in early stage. If this behavior does not fit into your use cases, feel free to [open an issue](https://github.com/seocochan/type-csv-transformer/issues/new)!

## API Reference

### Decorators

#### `@Column(options?)`

`@Column` must be specified on every class properties you want to convert,
otherwise transformer will ignore those properties.

`ColumnOptions`:

| Property                 | Default | Description                                                                         |
|--------------------------|:-------:|-------------------------------------------------------------------------------------|
| `name?: string`          |    -    | Specifies origin object's key. Used when it's not identical to class property name. |
| `allowNull?: boolean`    | `false` | If set to false or by default, it will throw error when null values are given.      |
| `defaultValue?: unknown` |    -    | Sets default value to assign when evaluation lead to null values.                    |

#### `@Nullable(options?)`

Specifying `@Nullable` works like set `ColumnOptions.allowNull=true`.
(_You cannot use this decorator when `ColumnOptions.allowNull=false`._)

And it provides extra options to set nullish conversion symbols.

`NullableOptions`:

| Property                            | Default | Description                                                                                                                 |
|-------------------------------------|:-------:|-----------------------------------------------------------------------------------------------------------------------------|
| `symbols?: Array<string \| number>` |    -    | Sets nullish symbols. Overrides default symbols and global `transform()` behavior. Values cannot be null or empty array. |

#### `@Bool(options?)`

`@Bool` is utility decorator that can transform boolean-ish values

`BoolOptions`:

| Property                                 | Default | Description                                                                                                                                          |
|------------------------------------------|:-------:|------------------------------------------------------------------------------------------------------------------------------------------------------|
| `trueSymbols?: Array<string \| number>`  |    -    | Sets boolean-ish symbols that matches to `true`. Overrides default symbols and global `transform()` behavior. Values cannot be null or empty array.  |
| `falseSymbols?: Array<string \| number>` |    -    | Sets boolean-ish symbols that matches to `false`. Overrides default symbols and global `transform()` behavior. Values cannot be null or empty array. |

#### `@Transform(transformFunction)`

It provides custom transform method. Used when behaviors of `@Nullable` or `@Bool` does not work as expected or to handle other complex cases.

- `transformFunction: (value: any) => unknown`

There are some caveats when mixing other methods with `@Transform`.

- `@Bool` will be ignored when used together.
- `@Transform` will be ignored when transform leads to `defaultValue` of `@Column`.

### Methods

#### `transform(cls, object, options?)`

Transforms object into class instance. 
Also provides extra options to control its behavior.

`TransformerOptions`:

| Property                                         |         Default         | Description                                       |
|--------------------------------------------------|:-----------------------:|---------------------------------------------------|
| `nullSymbols?: Array<string \| number> \| null`  | `['null', 'None', '']`  | Sets nullish symbols.                             |
| `trueSymbols?: Array<string \| number> \| null`  | `['true', 'True', 1]`   | Sets boolean-ish symbols that matches to `true`.  |
| `falseSymbols?: Array<string \| number> \| null` | `['false', 'False', 0]` | Sets boolean-ish symbols that matches to `false`. |

## Inspirations

At first, I was trying to handle CSVs with [`class-transformer`](https://github.com/typestack/class-transformer). That attemp actually works but there're many extra codes and some unwanted behaviors. So I created the `type-csv-transformer`.

Still this library's concepts and implementations are inspired by [`class-transformer`](https://github.com/typestack/class-transformer) a lot, but there're some differences.

`type-csv-transformer`

- concentrates on more specific problems.
- provides many utilities to handle CSV easily.
- has much smaller bundle size.

## Contributing

1. Fork this repository
1. Create new feature branch
1. Write your codes and commit
1. Make all tests and linter rules pass
1. Push and make pull request
