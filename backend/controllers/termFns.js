const termMap = new Map();

// create a mapping from long names to short names.
termMap.set('T1', 'Term 1');
termMap.set('T2', 'Term 2');
termMap.set('T3', 'Term 3');
termMap.set('S1', 'Semester 1');
termMap.set('S2', 'Semester 2');
termMap.set('H1', 'Hexamester 1');
termMap.set('H2', 'Hexamester 2');
termMap.set('H3', 'Hexamester 3');
termMap.set('H4', 'Hexamester 4');
termMap.set('H5', 'Hexamester 5');
termMap.set('H6', 'Hexamester 6');
termMap.set('Term 1', 'T1');
termMap.set('Term 2', 'T2');
termMap.set('Term 3', 'T3');
termMap.set('Semester 1', 'S1');
termMap.set('Semester 2', 'S2');
termMap.set('Hexamester 1', 'H1');
termMap.set('Hexamester 2', 'H1');
termMap.set('Hexamester 3', 'H1');
termMap.set('Hexamester 4', 'H1');
termMap.set('Hexamester 5', 'H1');
termMap.set('Hexamester 6', 'H1');
termMap.set('Summer', 'Summer');

// checks if two terms are equal regardless of being long or sort form
export const termEq = (t1, t2) => {
  if (!termMap.has(t1) || !termMap.has(t2)) {
    return false;
  }
  if (t1 == t2) {
    return true;
  }
  if (t1 == termMap.get(t2)) {
    return true;
  }
  return false;
};

// swaps a term from one to the other
export const termToggle = (term) => {
  return termMap.get(term);
};

// checks that a term is valid and in small form
export const termIsSmall = (term) => {
  return term.length == 2 && termMap.has(term);
};
