import { scaleAt } from "./touch";

test.each([
  {
    x: 0,
    scaleAtX: 0,
    scale: 1,
    result: 0,
  },
  {
    x: 0,
    scaleAtX: 0,
    scale: 2,
    result: 0,
  },
  {
    x: 0,
    scaleAtX: 1,
    scale: 1,
    result: 0,
  },
  {
    x: 0,
    scaleAtX: 1,
    scale: 2,
    result: -1,
  },
  {
    x: 2,
    scaleAtX: 0,
    scale: 3,
    result: 6,
  },
  {
    x: 10,
    scaleAtX: 12,
    scale: 1,
    result: 10,
  },
  {
    x: 10,
    scaleAtX: 12,
    scale: 0.5,
    result: 11,
  },
])("scaleAt should zoom", ({ x, scaleAtX, scale, result }) => {
  expect(scaleAt(x, scaleAtX, scale)).toBe(result);
});

export {};
