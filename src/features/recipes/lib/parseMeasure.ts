export type Measure =
  | {
      kind: "quantity";
      amount: number;
      /** Upper bound for ranges like "4-6 cloves", otherwise null. */
      maxAmount: number | null;
      /** Everything after the number, including its leading space ("g", " cups"). */
      suffix: string;
    }
  | { kind: "text"; text: string };

const UNICODE_FRACTIONS: Record<string, string> = {
  "¼": "1/4",
  "½": "1/2",
  "¾": "3/4",
  "⅓": "1/3",
  "⅔": "2/3",
  "⅛": "1/8",
};

// "1 1/2", "1/2", "1.5" or "2"
const NUMBER = String.raw`\d+\s+\d+/\d+|\d+/\d+|\d*\.\d+|\d+`;
const MEASURE_PATTERN = new RegExp(
  // The range's upper bound must not run into another number or a hyphenated
  // word, so "1 – 14-ounce can" is read as 1 × "14-ounce can", not 1 to 14.
  String.raw`^(${NUMBER})(?:\s*(?:-|–|to)\s*(${NUMBER})(?![\d/.-]))?(.*)$`,
  "i",
);

function replaceUnicodeFractions(text: string): string {
  return text.replace(
    /(\d?)\s*([¼½¾⅓⅔⅛])/g,
    (_, whole: string, fraction: string) =>
      `${whole ? `${whole} ` : ""}${UNICODE_FRACTIONS[fraction]}`,
  );
}

function toNumber(token: string): number {
  const [whole, fraction] = token.includes(" ")
    ? token.split(/\s+/)
    : token.includes("/")
      ? ["0", token]
      : [token, undefined];
  if (!fraction) return Number(whole);
  const [numerator, denominator] = fraction.split("/").map(Number);
  return Number(whole) + numerator / denominator;
}

/**
 * Reads the leading quantity from a free-text measure such as "1 1/2 cups",
 * "200g", "½ tsp" or "4-6 cloves". Anything without a leading number
 * ("pinch", "to taste", "Juice of 1") is returned as text.
 */
export function parseMeasure(raw: string): Measure {
  const text = raw.trim();
  const match = MEASURE_PATTERN.exec(replaceUnicodeFractions(text));
  if (!match) return { kind: "text", text };

  const [, amountToken, maxToken, suffix] = match;
  const amount = toNumber(amountToken);
  const maxAmount = maxToken ? toNumber(maxToken) : null;
  if (!Number.isFinite(amount) || amount <= 0) return { kind: "text", text };

  return { kind: "quantity", amount, maxAmount, suffix };
}

const FRACTIONS: [value: number, label: string][] = [
  [1 / 8, "1/8"],
  [1 / 4, "1/4"],
  [1 / 3, "1/3"],
  [1 / 2, "1/2"],
  [2 / 3, "2/3"],
  [3 / 4, "3/4"],
];
const FRACTION_TOLERANCE = 0.02;

/**
 * Formats a quantity for cooks: common fractions where they fit
 * ("1 1/2", "3/4"), otherwise at most two decimals ("1.25", "300").
 */
export function formatQuantity(value: number): string {
  const whole = Math.floor(value);
  const remainder = value - whole;

  if (remainder < FRACTION_TOLERANCE) return String(whole);
  if (1 - remainder < FRACTION_TOLERANCE) return String(whole + 1);

  const fraction = FRACTIONS.find(
    ([fractionValue]) => Math.abs(remainder - fractionValue) < FRACTION_TOLERANCE,
  );
  if (fraction) return whole > 0 ? `${whole} ${fraction[1]}` : fraction[1];

  return String(Math.round(value * 100) / 100);
}

/**
 * Multiplies the quantity in a measure by `factor`. Measures that can't be
 * parsed are returned exactly as written.
 */
export function scaleMeasure(raw: string, factor: number): string {
  const measure = parseMeasure(raw);
  if (measure.kind === "text" || factor === 1) return raw.trim();

  const amount = formatQuantity(measure.amount * factor);
  const range =
    measure.maxAmount === null
      ? amount
      : `${amount}-${formatQuantity(measure.maxAmount * factor)}`;
  return `${range}${measure.suffix}`;
}
