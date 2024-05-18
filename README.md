# datefmt

[![Checks](https://github.com/hedyhli/deno-datefmt/actions/workflows/deno.yml/badge.svg)](https://github.com/hedyhli/deno-datefmt/actions/workflows/deno.yml)
![deno-coverage]()

```js
import datefmt from "https://deno.land/x/datefmt/mod.ts"

datefmt(new Date(1999, 5, 4), "[JAN]. [2nd], [2006]")
=> "MAR. 4th, 1999"
```

- Similar to Golang's date(time) formats, but delimiters around format
  specifiers are required. This makes formatting less ambiguous.
- 'nth' day formats are supported
- All forms of capitalization and zero-padding are both supported.

The default delimiters are `[]`.

Delimiters can optionally be the same character.

```js
// Use single quote for both start and end delim
datefmt(date, "'2006' 'January'", true, "'")

// Use < for start, and | for the end delim.
datefmt(date, "<2006| <January|", true, "<|")
```

## API

Default arguments

```js
datefmt(
  // Required arguments
  date,  // Date object

  // Optional arguments' default values:
  "[2006]-[01]-[02]", // Format
  true,  // whether to use UTC
  "[]"   // Delimiters -- either one or two characters.
)
```

Only string within the delimiters are treated as format specifiers. Anything
else is copied as-is.

Edge cases, where `delim = "[]"`:
- `A[]B` => `"A[]B"`
- `A[[]B` => `"A[B"`
- `A[]]B` => `"A]B"`

If delimiters are the same character, where `delim = "."`:
- `A.B` => `A.B`
- `A..B` => `A..B`
- `A...B` => `A.B`

## Supported format specifiers

The standard date used is `Monday, January 2nd 03:04:05 PM 2006`

Tip for memorising: `01/02 03:04:05 2006 (PM) (Monday)`

Date
- 2006, 06, 6
- 01, 1
- Jan, jan, JAN, January, january, JANUARY
- 02, 2
- 2nd, 2ND

Day
- Mon, mon, MON, Monday, monday, MONDAY

Time
- PM, Pm, pm
- 3, 03
- 15 (24-hour time)
- 4, 04
- 5, 05
