import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

Deno.test("Base route", async () => {
    const res = await fetch("http://localhost:3000/");
    const body = await res.text();
    assertEquals(body, "Hello World!");
});
