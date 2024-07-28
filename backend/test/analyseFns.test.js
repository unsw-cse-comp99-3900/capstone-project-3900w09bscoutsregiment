import analyseFns from '../controllers/analyseFns.js';
import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

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
