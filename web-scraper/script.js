const fs = require('fs');

let data;

// Open the json file that got called from the finder page
try {
  data = fs.readFileSync(process.argv[2], 'utf8');
} catch (err) {
  console.error(err);
  exit();
}
// make the json an object
const obj = JSON.parse(data);
try {
  // clear the file to prevent appending to a file that's full
  fs.writeFileSync(process.argv[3], '');
} catch (err) {
    console.error(err);
}
// loop through all of the courses from the finder
for (const i in obj.response.results) {
  const res = obj.response.results[i];
  try {
    // extract the course code and term for the file name
    fs.writeFileSync(process.argv[3], res.integrat_coursecode + res.integrat_term.replace(/\s+/g, '') + '\n', {flag: 'a'});
  } catch (err) {
    console.error(err);
  }
  try {
    // extract the primaryURL which takes you to the course information
    fs.writeFileSync(process.argv[3], res.primaryURL + '\n', {flag: 'a'});
  } catch (err) {
    console.error(err);
  }

  // const str_out = 'code: ' + res.integrat_coursecode + ' name: ' + res.integrat_coursename
  //                 + ' term: ' + res.integrat_term + ' year: ' + res.integrat_year + '\n';
  // try {
  //   fs.writeFileSync('./courses2024out.txt', str_out, {flag: 'a'});
  // } catch (err) {
  //   console.error(err);
  // }
  
  // const str_out = 'code: ' + res.integrat_coursecode + ' name: ' + res.integrat_coursename
  //            + ' term: ' + res.integrat_term + ' year: ' + res.integrat_year;
  // console.log(str_out);
}
