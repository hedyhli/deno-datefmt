# datefmt

```js
import datefmt from "https://deno.land/x/datefmt/mod.ts"
```

- Similar to Golang's date(time) foramts, but delimiters around format
  specifiers are required. This makes formatting less ambiguous.
- n-th date formats are supported
- Capitalization and full-uppercasing are both supported

The default delimiters are `[]`. Delimiters can either be open + close, or a
single one:

```js
// Use single quote for both start and end delim
datefmt(date, "'2006' 'January'", true, "'")

// Use < for start, and | for the end delim.
datefmt(date, "<2006| <January|", true, "<|")
```

The default format is `[2006]-[01]-[02]`.

```js
datefmt(
  new Date(),
  "[Mon]. [2nd] [Jan], [2006]",
  true,  // use UTC?
  "[]"   // Delimiters -- either one or two characters.
)
```

Only string within the delimiters are treated as format specifiers. Anything
else is copied as-is.

Edge cases, where `delim = "[]"`:
- `A[]B` => `"A[]B"`
- `A[[]B` => `"A[B"`
- `A[]]B` => `"A]B"`
