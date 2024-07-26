import fs from 'node:fs';
import { createCanvas } from 'canvas';
import Chart from 'chart.js/auto';
import PDFDocument from 'pdfkit';

const verbMap = new Map();
const categories = new Array();

Chart.defaults.font.family = 'Helvetica';
Chart.defaults.font.size = 60;
Chart.defaults.color = '#000';

// loads a file that contains the verb mappings into a map
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

// Takes a list of courses and their outcomes and produces an output that 
// is potentially more usable for generating a graph
// Expects input to be of the form
// [
//   {
//     _id: ...
//     code: ...
//     outcomes: [
//       "...",
//       "..."
//     ]
//   },
// ]
// output will have the form
// {
//   courses: [
//     {
//       code: ...
//       analysis: [..., ...] (number for each category)
//     },
//   ],
//   categories: {
//     "categoryName": {
//       count: ...(number of outcomes in this block)
//       courses: [
//         { _id: ..., code: ..., outcomes: ["...", "..."] },
//       ]
//     }
//   }
// }
const analyseCourses = (courseList) => {
  const out = {courses: new Array(), categories: {}};
  for (const c of categories) {
    out.categories[c] = {
      count: 0,
      courses: new Array()
    }; 
  }
  for (const course of courseList) {
    const courseOut = {
      code: course.code,
      analysis: new Array()
    };
    for (let i = 0; i < categories.length; i++) {
      courseOut.analysis.push(0);
    }
    for (const outcome of course.outcomes) {
      const analysis = analyseOutcome(outcome);
      courseOut.analysis[categories.indexOf(analysis)] += 1;
      out.categories[analysis].count += 1;
      const cb = out.categories[analysis].courses.find((x) => x._id == course._id);
      if (cb == undefined) {
        out.categories[analysis].courses.push(
          {
            _id: course._id,
            code: course.code,
            outcomes: [outcome]
          }
        );
      } else {
        cb.outcomes.push(outcome);
      }
    }
    out.courses.push(courseOut);
  }
  console.log(out);
  return out;
};

const makePng = (analysis) => {
  const canvas = createCanvas(2000, 1200);
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
  const data = {}
  data.labels = categories.map((c) => c.toUpperCase());
  data.datasets = new Array();
  for (const c of analysis.courses) {
    data.datasets.push({
      label: c.code,
      data: c.analysis
    });
  }
  console.log(data);
  for (const d of data.datasets) {
    console.log(d.data);
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
          stacked: true,
        },
        y: {
          stacked: true,
        }
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'horizontal bars'
      },
      grid: {
        color: 'black',
        lineWidth: 5
      }
    },
    plugins: [plugin]
  });

  const buffer = canvas.toBuffer('image/png');
  return buffer;
};

const makePDF = (analysis, name) => {
  const headingSize = 24;
  const sub1Size = 20;
  const sub2Size = 16;
  const fontSize = 13;
  const doc = new PDFDocument();
  const dir = './outputs/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  doc.pipe(fs.createWriteStream(dir + name + '.pdf'));
  doc.font('Helvetica')
  doc.fontSize(headingSize);
  doc.text('Analysis', 70, 70);
  doc.image(makePng(analysis), 70, 100, 
    {
      width: 410
    }
  );
  doc.text('Categories', 70, 370);
  for (const c in analysis.categories) {
    const block = analysis.categories[c];
    doc.fontSize(sub1Size);
    doc.moveDown(1);
    doc.text(`${c.toUpperCase()} (${block.count})`);
    for (const course of block.courses) {
      doc.fontSize(sub2Size);
      doc.moveDown(1);
      doc.text(course.code);
      doc.list(course.outcomes);
    }
  }
  doc.end();
};

export default { 
  categories,
  loadFile,
  analyseOutcome,
  analyseCourses,
  makePng,
  makePDF
};
