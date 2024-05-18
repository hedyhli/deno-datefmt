import { assertEquals } from "std/assert/assert_equals.ts";
import { assertThrows } from "std/assert/mod.ts";

import { datefmt } from "./mod.ts"

Deno.test("default", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d), "2020-02-19");
});

Deno.test("Capitalized + short", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[Mon]"), "Wed");
  assertEquals(datefmt(d, "[mon]"), "wed");
});

Deno.test("nth", () => {
  let d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[2nd]"), "19th");
  d = new Date("Sat, 01 Feb 2020 15:00:00 GMT");
  assertEquals(datefmt(d, "[2nd]"), "1st");
  d = new Date("Sun, 02 Feb 2020 15:00:00 GMT");
  assertEquals(datefmt(d, "[2nd]"), "2nd");
  d = new Date("Mon, 03 Feb 2020 15:00:00 GMT");
  assertEquals(datefmt(d, "[2nd]"), "3rd");
  d = new Date("Tue, 04 Feb 2020 15:00:00 GMT");
  assertEquals(datefmt(d, "[2nd]"), "4th");
  d = new Date("Tue, 04 Feb 2020 15:00:00 GMT");
  assertEquals(datefmt(d, "[2ND]"), "4TH");
});

Deno.test("0hour", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[3]"), "4");
  assertEquals(datefmt(d, "[03]"), "04");
  assertEquals(datefmt(d, "[15]"), "16");
});

Deno.test("am", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[pm]"), "pm");
  assertEquals(datefmt(d, "[Pm]"), "Pm");
  assertEquals(datefmt(d, "[PM]"), "PM");
});

Deno.test("delim", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "{2006} [{Mon}]", true, "{}"), "2020 [Wed]");
  assertEquals(datefmt(d, "'2006' ['Mon']", true, "'"), "2020 [Wed]");
});

Deno.test("Special cases", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "{}"), "{}");
  assertEquals(datefmt(d, "[[]"), "[");
  assertEquals(datefmt(d, ""), "");
  assertEquals(datefmt(d, "[]"), "[]");
  assertEquals(datefmt(d, "A[]B"), "A[]B");
  assertEquals(datefmt(d, "A[]]B"), "A]B");
  assertEquals(datefmt(d, "A[[] [mon]"), "A[ wed");

  assertEquals(datefmt(d, "A.B", true, "."), "A.B");
  assertEquals(datefmt(d, "A..B", true, "."), "A..B");
  assertEquals(datefmt(d, "A...B", true, "."), "A.B");
});

Deno.test("Mixed", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[Mon]. [2nd] [JAN], [2006]"), "Wed. 19th FEB, 2020");
});

Deno.test("Different open/close delims", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "<2006| <January|", true, "<|"), "2020 February");
});

Deno.test("Capitalization", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[Mon] [mon] [MON] [Monday] [monday] [MONDAY]"), "Wed wed WED Wednesday wednesday WEDNESDAY");
  assertEquals(datefmt(d, "[jan] [Jan] [JAN] [january] [January] [JANUARY]"), "feb Feb FEB february February FEBRUARY");
  assertEquals(datefmt(d, "[pm] [Pm] [PM]"), "pm Pm PM");
});

Deno.test("Coverage", () => {
  const d = new Date("Wed, 9 Feb 2002 16:40:03 GMT");
  assertEquals(datefmt(d, "[6] [06]"), "2 02");
  assertEquals(datefmt(d, "[2006] [1] [2]"), "2002 2 9");
  assertEquals(datefmt(d, "[1] [2] [01] [02]"), "2 9 02 09");
  assertEquals(datefmt(d, "[2nd] [2ND]"), "9th 9TH");
  assertEquals(datefmt(d, "[3] [03] [15]"), "4 04 16");
  assertEquals(datefmt(d, "[4] [04] [5] [05]"), "40 40 3 03");
});

Deno.test("no 0 padding", () => {
  const d = new Date("Wed, 19 Nov 2020 10:40:33 GMT");
  assertEquals(datefmt(d, "[6] [06]"), "20 20");
  assertEquals(datefmt(d, "[1] [01] [2] [02]"), "11 11 19 19");
  assertEquals(datefmt(d, "[3] [03] [4] [04] [5] [05]"), "10 10 40 40 33 33");
  assertEquals(datefmt(d, "[pm]"), "am");
});

Deno.test("invalid format", () => {
  const d = new Date("Wed, 19 Nov 2020 10:40:33 GMT");
  assertThrows(() => datefmt(d, "[foobar]"), Error, "Unknown date format replacement 'foobar'");

  assertThrows(() => datefmt(d, "[foobar]", true, ""), Error, "'delim' argument must either have one or two characters.");
  assertThrows(() => datefmt(d, "[foobar]", true, "123"), Error, "'delim' argument must either have one or two characters.");
});

Deno.test("utc", () => {
  const d = new Date("Wed, 19 Nov 2020 10:40:33 GMT");
  // const tz = d.getTimezoneOffset() / 60
  assertEquals(datefmt(d, "[04]", false), "40");
  let expectedHour = d.getHours() % 12;
  assertEquals(datefmt(d, "[3]", false), `${expectedHour}`);
  expectedHour = d.getHours();
  assertEquals(datefmt(d, "[15]", false), `${expectedHour}`);
});
