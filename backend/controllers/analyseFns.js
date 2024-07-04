import fs from 'node:fs';

const verbMap = new Map();
const categories = new Array();

const loadFile = (name) => {
  try {
    const data = fs.readFileSync(name, 'utf8');
    const lines = data.split('\n').map((x) => x.trim());
    var category = '';
    for (const l of lines) {
      if (l == '') {
        continue;
      }
      if (l[0] == '!') {
        category = l.substring(1);
        categories.push(category);
      } else {
        if (verbMap.has(l)) {
          verbMap.get(l).push(category);
        } else {
          const newArr = new Array();
          newArr.push(category);
          verbMap.set(l, newArr);
        }
      }
    }
    console.log(verbMap);
  } catch (err) {
    console.err(err);
  };
};

const analyseOutcome = (outcome) => {
  const scoreMap = new Map();
  for (const c of categories) {
    scoreMap.set(c, 0);
  }
  const words = outcome.split(' ').map((x) => x.replace(/\W/g, ''));
  for (const w of words) {
    const cs = verbMap.get(w.toLowerCase());
    if (cs == undefined) {
      continue;
    }
    for (const c of cs) {
      // console.log(w + ' category: ' + c);
      scoreMap.set(c, scoreMap.get(c) + 1);
    }
  }
  var outCategory = '';
  var highest = 0;
  scoreMap.forEach((v, k, m) => {
    if (v > highest) {
      highest = v;
      outCategory = k;
    }
  });
  if (highest == 0) {
    return undefined;
  }
  return outCategory;
  // console.log(scoreMap);
};

export default {loadFile, analyseOutcome};
