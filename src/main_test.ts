import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Base route", async () => {
  const res = await fetch("http://localhost:5000/");
  const body = await res.text();
  assertEquals(body, "Hello World!");
});
