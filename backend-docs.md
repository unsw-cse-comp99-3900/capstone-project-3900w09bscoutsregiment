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

# `analyseFns` file

The file contains functions that can perform analysis relation operations on 
courses and their outcomes.

## `loadFile` method

The `loadFile` method reads a file of a specific format and produces an internal 
mapping from keywords to categories.

### Parameters

- `name` the name of the file to be read.

### Input File

The expected input is a newline separated file. Categories are denoted by `!` at 
the start of the line and each following line is assigned to the category. For 
example in the following example file

```
!understand
add
approximate
compare
extrapolate
!apply
acquire
change
calculate
compare
illustrate
```

the verbs add, approximate, compare and extrapolate are mapped to understand,
and the verbs acquire, change, calculate, compare and illustrate are mapped to apply.
Of note is that the verb compare here maps to both categories, and this can be used
for analysing outcomes. The internal map looks like the following

```
{
    'add' => ['understand'],
    'approximate' => ['understand'],
    'compare' => ['understand', 'apply'],
    'exprapolate' => ['understand'],
    'acquire' => ['apply'],
    'change' => ['apply'],
    'calculate' => ['apply'],
    'illustrate' => ['apply'],
}
```

## `analyseOutcome` method

The `analyseOutcome` method takes one outcome and attempts to find the best 
category to place it in.

### Parameters

- `outcome` a string that holds the outcome to be analysied.

### Algorithm

First the method creates a map, which maps each possible category to a running 
count, for example

```
{
    'understand' => 0,
    'apply' => 0
}
```

The method then splits the outcome by spaces and removes special characters. Each 
word is then tested in the stored mapping, if there is no mapping it moves to
the next word. Otherwise, each category that the word maps to has its running 
count incremented. For example, if we encountered the word 'add' which mapped to
'understand' we would have the following map

```
{
    'understand' => 1,
    'apply' => 0
}
```

Then if we found the word 'compare' which maps to understand and apply our map would
become 

```
{
    'understand' => 2,
    'apply' => 1
}
```

Once all the words have been scanned, the method picks the category with the highest
count, or first in case of a tie, to be the final output category.

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
