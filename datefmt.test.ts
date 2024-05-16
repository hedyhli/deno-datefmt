import { assertEquals } from "https://deno.land/std@0.205.0/assert/assert_equals.ts";

import { datefmt } from "./mod.ts"

Deno.test("default", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d), "2020-01-19");
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
  assertEquals(datefmt(d, "[]"), "[]");
  assertEquals(datefmt(d, "[[]"), "[");
  assertEquals(datefmt(d, ""), "");
  assertEquals(datefmt(d, "[]]"), "]");
});

Deno.test("Mixed", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "[Mon]. [2nd] [Jan], [2006]"), "Wed. 19th Feb, 2020");
});

Deno.test("Different open/close delims", () => {
  const d = new Date("Wed, 19 Feb 2020 16:00:00 GMT");
  assertEquals(datefmt(d, "<2006| <January|", true, "<|"), "2020 February");
});
