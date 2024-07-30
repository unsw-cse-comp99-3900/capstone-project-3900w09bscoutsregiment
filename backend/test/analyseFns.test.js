import analyseFns from '../controllers/analyseFns.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

const getRandomInt = (max) => {
  return Math.floor(Math.random() * max);
};

describe('loadFile function', async () => {
  const emotions = [
    'happy',
    'sad',
  ];
  const words = {};
  words[emotions[0]] = [
    'cheerful',
    'delighted',
    'ecstatic',
    'glad',
    'JOLLY',
    'Joyous',
    'bittersweet',
  ];
  words[emotions[1]] = [
    'melancholy',
    'mournful',
    'blue',
    'cheerless',
    'bittersweet',
  ];
  const emofile = './outputs/emotions.txt';
  let content = '';
  for (const c of emotions) {
    content += '!' + c + '\n';
    for (const w of words[c]) {
      content += w + '\n';
    }
  }
  try {
    fs.writeFileSync(emofile, content);
  } catch (err) {
    assert.fail(err);
    return;
  }
  analyseFns.loadFile(emofile);
  it('should have category none', () => {
    assert.strictEqual(analyseFns.categories.includes('none'), true);
  });
  for (const c of emotions) {
    it(`should have category ${c}`, () => {
      assert.strictEqual(analyseFns.categories.includes(c), true);
    });
    for (const w of words[c]) {
      it (`${w} should map to ${c}`, () => {
        assert.strictEqual(analyseFns.verbMap.get(w.toLowerCase()).includes(c), true);
      });
    }
  }
});

describe('analyseOutcome function', () => {
  const emotions = [
    'happy',
    'sad',
  ];
  const words = {};
  words[emotions[0]] = [
    'cheerful',
    'delighted',
    'ecstatic',
    'glad',
    'JOLLY',
    'Joyous',
    'bittersweet',
  ];
  words[emotions[1]] = [
    'melancholy',
    'mournful',
    'blue',
    'cheerless',
    'bittersweet',
  ];
  const emofile = './outputs/emotions.txt';
  let content = '';
  for (const c of emotions) {
    content += '!' + c + '\n';
    for (const w of words[c]) {
      content += w + '\n';
    }
  }
  try {
    fs.writeFileSync(emofile, content);
  } catch (err) {
    assert.fail(err);
    return;
  }
  analyseFns.loadFile(emofile);
  const happyoutcomes = [
    'i had a cheerful, jolly day',
    'joyous and bittersweet',
    'delighted cheerful melancholy',
    'joyous, jolly, Glad and estaTic outweigh cheerless and blue',
  ];
  const sadoutcomes = [
    'melancholy and mournful',
    'this car is very blue',
    'bittersweet blue',
    'melancholy and mournful over delighted',
  ];
  for (const o of happyoutcomes) {
    it(`"${o}" should be happy`, () => {
      assert.strictEqual(analyseFns.analyseOutcome(o), emotions[0]);
    });
  }
  for (const o of sadoutcomes) {
    it(`"${o}" should be sad`, () => {
      assert.strictEqual(analyseFns.analyseOutcome(o), emotions[1]);
    });
  }
});

describe('getKeywords function', () => {
  const emotions = [
    'happy',
    'sad',
  ];
  const words = {};
  words[emotions[0]] = [
    'cheerful',
    'delighted',
    'ecstatic',
    'glad',
    'JOLLY',
    'Joyous',
    'bittersweet',
  ];
  words[emotions[1]] = [
    'melancholy',
    'mournful',
    'blue',
    'cheerless',
    'bittersweet',
  ];
  const emofile = './outputs/emotions.txt';
  let content = '';
  for (const c of emotions) {
    content += '!' + c + '\n';
    for (const w of words[c]) {
      content += w + '\n';
    }
  }
  try {
    fs.writeFileSync(emofile, content);
  } catch (err) {
    assert.fail(err);
    return;
  }
  analyseFns.loadFile(emofile);
  const otherWords = [
    'this',
    'helped',
    'the',
    'a',
    'boon',
    'day',
    'together',
    'and',
    'tomorrow',
    'there',
    'their',
    'forlorn',
    'seldom',
    'running',
    'swimming',
    'analyse',
    'big',
    'today',
  ];
  for (let i = 0; i < 50; i++) {
    const happyWords = new Array();
    const sadWords = new Array();
    let phrase = '';
    for (let j = 0; j < 15; j++) {
      const num = getRandomInt(10);
      if (num < 2) {
        let w = words[emotions[0]][getRandomInt(words[emotions[0]].length)];
        phrase += ' ' + w.toLowerCase();
        happyWords.push(w.toLowerCase());
        if (words[emotions[1]].includes(w)) {
          sadWords.push(w.toLowerCase());
        }
      } else if (num < 4) {
        let w = words[emotions[1]][getRandomInt(words[emotions[1]].length)];
        phrase += ' ' + w.toLowerCase();
        sadWords.push(w.toLowerCase());
        if (words[emotions[0]].includes(w)) {
          happyWords.push(w.toLowerCase());
        }
      } else {
        phrase += ' ' + otherWords[getRandomInt(otherWords.length)];
      }
    }
    it(`should give ${happyWords} for "${phrase}", and ${emotions[0]}`, () => {
      for (const w of analyseFns.getKeywords(phrase, emotions[0])) {
        assert.strictEqual(happyWords.includes(w), true);
      }
    });
    it(`should give ${sadWords} for "${phrase}", and ${emotions[1]}`, () => {
      for (const w of analyseFns.getKeywords(phrase, emotions[1])) {
        assert.strictEqual(sadWords.includes(w), true);
      }
    });
  }
});
