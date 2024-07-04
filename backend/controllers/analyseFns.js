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
    categories.push('none');
    // console.log(verbMap);
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
    return 'none';
  }
  return outCategory;
  // console.log(scoreMap);
};

// Expects input to be of the form
// [
//   {
//     _id: ...
//     code: ...
//     colour: ...
//     outcomes: [
//       "...",
//       "..."
//     ]
//   },
// ]
// output will have the form
// {
//   "categoryName": [
//     {
//       colour: ...(hexadecimal)
//       width: ...(percentage of full length bar)
//       courses: [
//         { _id: ..., code: ..., outcomes: ["...", "..."] },
//       ]
//     }
//   ]
// }
const analyseCourses = (courseList) => {
  const out = new Array();
  for (const c of categories) {
    out[c] = new Array(); 
  }
  for (const course of courseList) {
    for (const outcome of course.outcomes) {
      const analysis = analyseOutcome(outcome);
      const colourBlock = out[analysis].find((x) => x.colour == course.colour);
      if (colourBlock == undefined) {
        out[analysis].push(
          {
            colour: course.colour,
            width: 0,
            courses: [{_id: course._id, code: course.code, outcomes: [outcome]}]}
        );
        continue;
      }
      const innerCourse = colourBlock.courses.find((x) => x._id == course._id);
      if (innerCourse == undefined) {
        colourBlock.courses.push(
          {_id: course._id, code: course.code, outcomes: [outcome]}
        );
        continue;
      }
      innerCourse.outcomes.push(outcome);
    }
  }
  return out;
};

export default {loadFile, analyseOutcome, analyseCourses};
