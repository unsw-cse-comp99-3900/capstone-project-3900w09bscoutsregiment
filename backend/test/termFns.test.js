import { termEq, termToggle, termIsSmall } from '../controllers/termFns.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';

const shorts = [
  'T1',
  'T2',
  'T3',
  'S1',
  'S2',
  'H1',
  'H2',
  'H3',
  'H4',
  'H5',
  'H6',
];

const longs = [
  'Term 1',
  'Term 2',
  'Term 3',
  'Semester 1',
  'Semester 2',
  'Hexamester 1',
  'Hexamester 2',
  'Hexamester 3',
  'Hexamester 4',
  'Hexamester 5',
  'Hexamester 6',
];

describe('termEq function', () => {
  for (let i = 0; i < shorts.length; i++) {
    it(`Should be equal for ${shorts[i]} = ${shorts[i]}`, () => {
      assert.strictEqual(termEq(shorts[i], shorts[i]), true);
    });
    it(`Should be equal for ${shorts[i]} = ${longs[i]}`, () => {
      assert.strictEqual(termEq(shorts[i], shorts[i]), true);
    });
    it(`Should be equal for ${longs[i]} = ${shorts[i]}`, () => {
      assert.strictEqual(termEq(shorts[i], shorts[i]), true);
    });
    it(`Should be equal for ${longs[i]} = ${longs[i]}`, () => {
      assert.strictEqual(termEq(shorts[i], shorts[i]), true);
    });
    for (let j = i + 1; j < shorts.length; j++) {
      it(`Should be unequal for ${shorts[i]} = ${shorts[j]}`, () => {
        assert.strictEqual(termEq(shorts[i], shorts[j]), false);
      });
      it(`Should be unequal for ${shorts[i]} = ${longs[j]}`, () => {
        assert.strictEqual(termEq(shorts[i], shorts[j]), false);
      });
      it(`Should be unequal for ${longs[i]} = ${shorts[j]}`, () => {
        assert.strictEqual(termEq(shorts[i], shorts[j]), false);
      });
      it(`Should be unequal for ${longs[i]} = ${longs[j]}`, () => {
        assert.strictEqual(termEq(shorts[i], shorts[j]), false);
      });
    }
  }
});

describe('termToggle function', () => {
  for (let i = 0; i < shorts.length; i++) {
    it(`should turn short (${shorts[i]}) into long (${longs[i]})`, () => {
      assert.strictEqual(termToggle(shorts[i]), longs[i]);
    })
    it(`should turn long (${longs[i]}) into short (${shorts[i]})`, () => {
      assert.strictEqual(termToggle(longs[i]), shorts[i]);
    })
  }
});

describe('termIsSmall function', () => {
  const fakes = [
    'He1',
    'T5',
    'H0',
    'h7',
    't2',
    'Summer',
    'S3'
  ];
  for (let i = 0; i < shorts.length; i++) {
    it(`should be true for ${shorts[i]}`, () => {
      assert.strictEqual(termIsSmall(shorts[i]), true);
    });
    it(`should be false for ${longs[i]}`, () => {
      assert.strictEqual(termIsSmall(longs[i]), false);
    });
  }
  for (let i = 0; i < fakes.length; i++) {
    it(`should be false for ${fakes[i]}`, () => {
      assert.strictEqual(termIsSmall(fakes[i]), false);
    });
  }
});
