import fs from 'node:fs';
import { createCanvas } from 'canvas';
import Chart from 'chart.js/auto';
import PDFDocument from 'pdfkit';
import { termToggle } from './termFns.js';

const verbMap = new Map();
const categories = new Array();

Chart.defaults.font.family = 'Helvetica';
Chart.defaults.font.size = 60;
Chart.defaults.color = '#000';

// loads a file that contains the verb mappings into a map
// file should have format
// !category
// verb
// verb
// verb
// !category
// verb
// verb
// ...
const loadFile = (name) => {
  try {
    const data = fs.readFileSync(name, 'utf8');
    const lines = data.split('\n').map((x) => x.trim().toLowerCase());
    var category = '';
    for (const l of lines) {
      if (l == '') {
        // ignore new lines
        continue;
      }
      if (l[0] == '!') {
        // '!' marks a category, so add it to the categories list and set it
        // to be the current category we are mapping to.
        category = l.substring(1);
        categories.push(category);
      } else {
        // If the map doesn't already have the verb add it to the mapping
        // and map it to the current category.
        // Otherwise, if the verb already exists in the mapping push the 
        // current category to the mapping for that verb.
        if (verbMap.has(l)) {
          verbMap.get(l).push(category);
        } else {
          const newArr = new Array();
          newArr.push(category);
          verbMap.set(l, newArr);
        }
      }
    }
    // The 'none' category is a catchall for fallthrough cases
    categories.push('none');
  } catch (err) {
    console.err(err);
  }
};

// takes an outcome and gives the best fitting category based on
// the verb mapping algorithm
const analyseOutcome = (outcome) => {
  const scoreMap = new Map();
  for (const c of categories) {
    scoreMap.set(c, 0);
  }
  // NOTE: x.replace(/\W/g, '') removes all non alphanumeric characters
  const words = outcome.split(' ').map((x) => x.replace(/\W/g, ''));
  for (const w of words) {
    const cs = verbMap.get(w.toLowerCase());
    if (cs == undefined) {
      continue;
    }
    // if we find a mapping for the verb we are looking at
    // we increment the current score for each category the verb maps to.
    for (const c of cs) {
      scoreMap.set(c, scoreMap.get(c) + 1);
    }
  }
  // search for the category with the highest score, ties broken by the 
  // category that appears frist.
  var outCategory = '';
  var highest = 0;
  scoreMap.forEach((v, k, m) => {
    if (v > highest) {
      highest = v;
      outCategory = k;
    }
  });
  // If we did not find any words that have verb mappings, then 
  // fall back to the 'none' category.
  if (highest == 0) {
    return 'none';
  }
  return outCategory;
};

// Returns the keywords that map to the given category in a given 
// course outcome.
const getKeywords = (outcome, category) => {
  const words = outcome.split(' ').map((x) => x.replace(/\W/g, ''));
  const outwords = new Array();
  for (const w of words) {
    const cs = verbMap.get(w.toLowerCase());
    if (cs == undefined) {
      continue;
    }
    // Check if the current verb maps to the provided category
    if (cs.includes(category)) {
      outwords.push(w);
    }
  }
  return outwords;
};

// Takes a list of courses and their outcomes and produces an output that
// is potentially more usable for generating a graph and pdf
// Expects input to be of the form
// [
//   {
//     _id: ...
//     code: ...
//     term: ...
//     year: ...
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
//       term: ...
//       year: ...
//       analysis: [..., ...] (number for each category)
//     },
//   ],
//   categories: {
//     "categoryName": {
//       count: ...(number of outcomes in this block)
//       courses: [
//         {
//           _id: ...,
//           code: ...,
//           term: ...,
//           year: ...,
//           outcomes: ["...", "..."] },
//       ]
//     }
//   }
// }
const analyseCourses = (courseList) => {
  const out = { courses: new Array(), categories: {} };
  for (const c of categories) {
    out.categories[c] = {
      count: 0,
      courses: new Array(),
    };
  }
  for (const course of courseList) {
    const courseOut = {
      code: course.code,
      term: course.term,
      year: course.year,
      analysis: new Array(),
    };
    // Prefil the analysis with zeroes, so that we don't end up 
    // trying to increment undefined
    for (let i = 0; i < categories.length; i++) {
      courseOut.analysis.push(0);
    }
    for (const outcome of course.outcomes) {
      const analysis = analyseOutcome(outcome);
      // Increment count for chart
      courseOut.analysis[categories.indexOf(analysis)] += 1;
      // Increment count for pdf
      out.categories[analysis].count += 1;
      // Find course details in categories section otherwise 
      // add the course
      const cb = out.categories[analysis].courses.find(
        (x) => x._id == course._id,
      );
      if (cb == undefined) {
        out.categories[analysis].courses.push({
          _id: course._id,
          code: course.code,
          term: course.term,
          year: course.year,
          outcomes: [outcome],
        });
      } else {
        cb.outcomes.push(outcome);
      }
    }
    // Add the course to the courses list
    out.courses.push(courseOut);
  }
  return out;
};

// Generates a chart png from the analysis generated in analyseCourses()
const makePng = (analysis) => {
  const canvas = createCanvas(2000, 1200);
  const ctx = canvas.getContext('2d');
  // Important for solid white background
  const plugin = {
    id: 'customCanvasBackgroundImage',
    beforeDraw: (chart) => {
      const ctx = chart.ctx;
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    },
  };
  const data = {};
  // Categories will become the axis labels
  data.labels = categories.map((c) => c.toUpperCase());
  data.datasets = new Array();
  for (const c of analysis.courses) {
    // For each course add it to the dataset and make the name of the set
    // the combination of the course code, term and year
    data.datasets.push({
      label: c.code + ' (' + termToggle(c.term) + ' ' + c.year + ')',
      data: c.analysis,
    });
  }
  new Chart(ctx, {
    type: 'bar',
    data: data,
    // Options generate a horizontally stacked bar chart
    options: {
      indexAxis: 'y',
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'horizontal bars',
      },
      grid: {
        color: 'black',
        lineWidth: 5,
      },
    },
    plugins: [plugin],
  });
  const buffer = canvas.toBuffer('image/png');
  return buffer;
};

// Generates a pdf using the analysis generated in the analyseCourses() function
const makePDF = (analysis) => {
  const headingSize = 24;
  const sub1Size = 20;
  const sub2Size = 16;
  const textSize = 13;
  const doc = new PDFDocument();
  const dir = './outputs/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  doc.font('Helvetica');
  doc.fontSize(headingSize);
  doc.text('Analysis', 70, 70);
  // Add the png image based on the analysis
  doc.image(makePng(analysis), 70, 100, {
    width: 410,
  });
  doc.text('Categories', 70, 370);
  for (const c in analysis.categories) {
    // For each category print a heading with the category name and 
    // number of outcomes in the category
    const block = analysis.categories[c];
    doc.fontSize(sub1Size);
    doc.moveDown(1);
    doc.text(`${c.toUpperCase()} (${block.count})`);
    // For each course with outcomes that map to this category, add a sub heading
    // and print the outcomes as a list
    for (const course of block.courses) {
      doc.fontSize(sub2Size);
      doc.moveDown(1);
      doc.text(
        course.code + ' (' + termToggle(course.term) + ' ' + course.year + ')',
      );
      doc.fontSize(textSize);
      doc.list(course.outcomes);
    }
  }
  doc.end();
  return doc;
};

export default {
  verbMap,
  categories,
  loadFile,
  analyseOutcome,
  getKeywords,
  analyseCourses,
  makePng,
  makePDF,
};
