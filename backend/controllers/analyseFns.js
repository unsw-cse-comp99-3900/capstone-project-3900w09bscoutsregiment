import fs from 'node:fs';
import { createCanvas } from 'canvas';
import Chart from 'chart.js/auto';

const verbMap = new Map();
const categories = new Array();

// loads a file that contains the verb mappings into a map
const loadFile = (name) => {
  try {
    const data = fs.readFileSync(name, 'utf8');
    const lines = data.split('\n').map((x) => x.trim().toLowerCase());
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

// takes an outcome and gives the best fitting category based on 
// the verb mapping algorithm
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

const getKeywords = (outcome, category) => {
  const words = outcome.split(' ').map((x) => x.replace(/\W/g, ''));
  const outwords = new Array();
  for (const w of words) {
    const cs = verbMap.get(w.toLowerCase());
    if (cs == undefined) {
      continue;
    }
    if (cs.includes(category)) {
      outwords.push(w);
    }
  }
  return outwords;
};

// Takes a list of courses and their outcomes and produces an output that 
// is potentially more usable for generating a graph
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
//       count: ...(number of outcomes in this block)
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
            count: 1,
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
      colourBlock.count += 1;
      innerCourse.outcomes.push(outcome);
    }
  }
  return out;
};

// generates a png from an analysis and outputs it to a file
const makePng = (analysis, name) => {
  const canvas = createCanvas(1000, 1000);
  const ctx = canvas.getContext('2d');
  const plugin = {
    id: 'customCanvasBackgroundImage',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }
  };
  const data = {}; 
  data.labels = categories;
  data.datasets = new Array();
  for (const [i, c] of categories.entries()) {
    const blocks = analysis[c];
    for (const b of blocks) {
      const existingSet = data.datasets.find((x) => x.backgroundColor == b.colour)
      if (existingSet == undefined) {
        var label = '';
        var values = new Array();
        for (const course of b.courses) {
          label += course.code + ' ';
        }
        var j = 0;
        while (j < i) {
          values.push(0);
          j++;
        }
        values.push(b.count);
        data.datasets.push({label: label, data: values, backgroundColor: b.colour});
      } else {
        var labelBits = existingSet.label.split(' ');
        for (const course of b.courses) {
          if (!labelBits.includes(course.code)) {
            existingSet.label += course.code + ' ';
          }
        }
        var j = existingSet.data.length;
        while (j < i) {
          existingSet.data.push(0);
          j++;
        }
        existingSet.data.push(b.count);
      }
    }
  }

  new Chart(ctx, {
    type: 'bar',
    data: data,
    // data: {
    //   labels: [1, 2, 3, 4, 5],
    //   datasets: [{
    //     label: 'data',
    //     data: [4, 2, 1, 0, 3],
    //     backgroundColor: 'lightblue'
    //   },
    //   {
    //     label: 'data2',
    //     data: [2, 0, 3, 2, 2],
    //     backgroundColor: 'lightgreen'
    //   }]
    // },
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true
        },
        y: {
          stacked: true
        }
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'horizontal bars'
      }
    },
    plugins: [plugin]
  });

  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(name, buffer);
};

export default {
  verbMap,
  categories,
  loadFile,
  analyseOutcome,
  getKeywords,
  analyseCourses,
  makePng
};
