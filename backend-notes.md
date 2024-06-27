# Course Search Interface

## Getting a list of courses

Currently done by querying `/courses?search=foo&year=2024&term=T2`, this should 
search for `foo` as a substring of either the course title or code, alongside the 
year and term restrictions.

# Terms

We want to be able to track terms, but terms are more complicated than 
a number from 1 to 3. For now I think we could use the following set of 
strings (borrowed from the unsw course outline finder):

- Semester 1
- Semester 2
- Term 1
- Term 2
- Term 3
- Hexamester 1
- Hexamester 2
- Hexamester 3
- Hexamester 4
- Hexamester 5
- Hexamester 6
- Summer
