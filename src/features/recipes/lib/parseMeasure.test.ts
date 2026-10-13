import { describe, expect, it } from "vitest";
import { formatQuantity, parseMeasure, scaleMeasure } from "./parseMeasure";

describe("parseMeasure", () => {
  it.each([
    ["2", 2, ""],
    ["2 cups", 2, " cups"],
    ["200g", 200, "g"],
    ["1.5 kg", 1.5, " kg"],
    [".5 tsp", 0.5, " tsp"],
    ["1/2 cup", 0.5, " cup"],
    ["1 1/2 tbsp", 1.5, " tbsp"],
    ["½ tsp", 0.5, " tsp"],
    ["1½ kg", 1.5, " kg"],
    ["3 x 7.5cm", 3, " x 7.5cm"],
  ])("reads %j as %d with suffix %j", (raw, amount, suffix) => {
    expect(parseMeasure(raw)).toEqual({
      kind: "quantity",
      amount,
      maxAmount: null,
      suffix,
    });
  });

  it("reads ranges", () => {
    expect(parseMeasure("4 - 6 cloves")).toEqual({
      kind: "quantity",
      amount: 4,
      maxAmount: 6,
      suffix: " cloves",
    });
    expect(parseMeasure("2 to 3 tbsp")).toMatchObject({ amount: 2, maxAmount: 3 });
  });

  it("doesn't read a hyphenated size as the end of a range", () => {
    expect(parseMeasure("1 – 14-ounce can")).toMatchObject({
      amount: 1,
      maxAmount: null,
      suffix: " – 14-ounce can",
    });
  });

  it.each(["", "   ", "pinch", "to taste", "Juice of 1/2", "Garnish"])(
    "returns %j as text",
    (raw) => {
      expect(parseMeasure(raw)).toEqual({ kind: "text", text: raw.trim() });
    },
  );

  it("treats a zero amount as text", () => {
    expect(parseMeasure("0 cups")).toEqual({ kind: "text", text: "0 cups" });
  });
});

describe("formatQuantity", () => {
  it.each([
    [2, "2"],
    [0.5, "1/2"],
    [0.25, "1/4"],
    [0.75, "3/4"],
    [1 / 3, "1/3"],
    [2 / 3, "2/3"],
    [1.5, "1 1/2"],
    [2.125, "2 1/8"],
    [1.99, "2"],
    [1.4, "1.4"],
    [0.1, "0.1"],
    [333.3333, "333 1/3"],
  ])("formats %d as %j", (value, expected) => {
    expect(formatQuantity(value)).toBe(expected);
  });
});

describe("scaleMeasure", () => {
  it("scales simple quantities and keeps the unit", () => {
    expect(scaleMeasure("200g", 1.5)).toBe("300g");
    expect(scaleMeasure("2 cups", 2)).toBe("4 cups");
  });

  it("scales mixed fractions into fractions", () => {
    expect(scaleMeasure("1 1/2 cups", 0.5)).toBe("3/4 cups");
    expect(scaleMeasure("1/3 cup", 2)).toBe("2/3 cup");
  });

  it("scales both ends of a range", () => {
    expect(scaleMeasure("4-6 cloves", 0.5)).toBe("2-3 cloves");
  });

  it("returns unparseable measures as written", () => {
    expect(scaleMeasure("to taste", 3)).toBe("to taste");
    expect(scaleMeasure("Juice of 1", 2)).toBe("Juice of 1");
  });

  it("returns the original text when the factor is 1", () => {
    expect(scaleMeasure("½ tsp", 1)).toBe("½ tsp");
  });
});
