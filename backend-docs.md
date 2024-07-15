# `/api/course` Interface

All of the following URLs are created by prepending `/api/course`, for example
the `/list` below is accessed via the URL `/api/course/list`.

## GET `/:code/:year/:term`

> NOTE: this interface might change to use the database ID for a course

Takes the unique combination of course code, year and term and provides the
full details for the associated course. The parameters are passed through the 
URL for example to access COMP1511, from the year 2024 in term 1 you would 
send a request to `/api/course/COMP1511/2024/T1`.

### Response Format

```
{
  _id: 24 character hexadecimal string,
  title: string (e.g. 'Financial Accounting Fundamentals'),
  code: string (e.g. 'ACCT2511'),
  year: number (e.g. 2024),
  term: string (e.g. 'Term 1'),
  outcomes: [
    string (e.g. Define, identify, and classify economic transactions into components),
    ...
  ]
}
```

## GET `/all`

This URL provides a list of all of the courses in the database, it can be filtered 
with any of three query string options.

- `search` takes a string that is used to match course titles and codes and returns
  only matching courses.
- `term` takes a term and filters the list for courses in that term,
  e.g. T1 or T2.
- `year` takes a year and filters the list for courses that run in that year.

### Response Format

```
[
  {
    _id: 24 character hexadecimal string,
    title: string (e.g. 'Financial Accounting Fundamentals'),
    code: string (e.g. 'ACCT2511'),
    year: number (e.g. 2024),
    term: string (e.g. 'Term 1'),
  },
  ... 
]
```

## GET `/list`

> NOTE: might not need to return colour as it might not be used

> NOTE: might change `courseId` to `_id` for consistency

> NOTE: might make this return all the course outcomes to avoid additional 
> web requests

This URL provides the list of courses that have been added to the current user's 
account. It provides the basic information for each course along with whether 
the user has favorited this course and what colour it has been assigned. It also
provides the analysis of the course outcomes in the form of each taxonomical category
paired with the number of outcomes that fall into the category.

### Response Format

```
[
  {
    courseId: 24 character hexadecimal string,
    title: string (e.g. 'Financial Accounting Fundamentals'),
    code: string (e.g. 'ACCT2511'),
    year: number (e.g. 2024),
    term: string (e.g. 'Term 1'),
    favorite: boolean,
    colour: hexadecimal colour (e.g. '#a3f334'),
    info: [
      {
        category: string (e.g. 'understand')
        value: number (e.g. 2)
      },
      ...
    ]
  },
  ...
]
```

## POST `/add` and `/delete`

These URLs are used to add or delete courses from the current user's account.
The body of the request contains the `courseId` that is to be added.

## POST `/favorite` and `/unfavorite`

These URLs are used to record the favorite status of a course in the user's 
account. The body of the request provides the `courseId` that is to be favorited.

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
