const fs = require('fs');

let data;

try {
  data = fs.readFileSync(process.argv[2], 'utf8');
} catch (err) {
  console.error(err);
  exit();
}
const obj = JSON.parse(data);
const first = obj.response.results[0].integrat_coursecode;
try {
  fs.writeFileSync(process.argv[3], '');
} catch (err) {
    console.error(err);
}
for (const i in obj.response.results) {
  const res = obj.response.results[i];
  try {
    fs.writeFileSync(process.argv[3], res.integrat_coursecode + res.integrat_term.replace(/\s+/g, '') + '\n', {flag: 'a'});
  } catch (err) {
    console.error(err);
  }
  try {
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
