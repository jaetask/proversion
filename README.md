# Proversion
> Upgrade versionable objects via immer produce

[![NPM Version][npm-image]][npm-url]

## Install

```bash
npm i -S proversion
```
> prerequisite `immer 6.0.0`

## Usage
Provides a simple method to upgrade objects according to version rules.

## Example
> A simple upgrade of an object from version 1 to version 2.

```javascript
const upgrades = proversion();
upgrades.add(2, (draft) => {
  draft.myAddedParam = true;
});

const original = { version: 1 };
const { applied, result } = upgrades.upgrade(original);

// Applied is an array of applied upgrades
console.log("applied", applied);
applied [ 2 ]

// result is the upgraded object
console.log("result", result);
result { version: 2, myAddedParam: true }
```
<sub>Note: Original is untouched thanks to [Immer][immer-url]</sub>

## Example 2
> Multiple upgrades

```javascript
const upgrades = proversion();
upgrades.add(2, (draft) => {
  draft.myAddedParam = true;
});
upgrades.add(3, (draft) => {
  draft.myAddedParam = false;
  draft.hi = 'There';
});
upgrades.add(4, (draft) => {
  draft.hi = 'Not today';
});
upgrades.add(5, (draft) => {
  draft.hi = draft.hi.toLowerCase();
});
upgrades.add(6, (draft) => {
  draft.hi = draft.hi.replace(/ /g, '_');
});

const original = { version: 1 };
const { applied, result } = upgrades.upgrade(original);

// Applied is an array of applied upgrades
console.log("applied", applied);
applied [ 2, 3, 4, 5, 6 ]

// result is the upgraded object
console.log("result", result);
result { version: 6, myAddedParam: false, hi: 'not_today' }
```


But notice what happens if we pass in a version 3 object.

```javascript
const original = { version: 3, myAddedParam: false, hi: 'There' };
const { applied, result } = upgrades.upgrade(original);

// Applied is an array of applied upgrades
console.log("applied", applied);
applied [ 4, 5, 6 ]

// result is the upgraded object
console.log("result", result);
result { version: 6, myAddedParam: false, hi: 'not_today' }
```

we get the same result, but the version 1->2 and 2->3 upgrades are ignored.

# Immer
> Why use immer produce?

- Safe mutation of objects without affecting original
- Clean mutation API via `draft` object
- Converters are pure functions
- `Immer` is well maintained and has excellent [documentation][immer-url]




## License

[MIT](http://vjpr.mit-license.org)

[npm-image]: https://img.shields.io/npm/v/proversion.svg
[npm-url]: https://npmjs.org/package/proversion
[immer-url]: https://immerjs.github.io/immer/docs/introduction