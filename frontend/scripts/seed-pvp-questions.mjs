import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { createClient } from "@supabase/supabase-js";

const root = process.cwd();
const envPath = path.join(root, ".env.local");

function parseDotEnv(contents) {
  const lines = contents.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

if (fs.existsSync(envPath)) {
  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const [k, v] of Object.entries(parsed)) {
    if (!process.env[k]) process.env[k] = v;
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.local.example to .env.local and fill it in.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Keep this in sync with src/lib/pvp-questions.ts
const seeds = [
  {
    slug: "pvp-sum-of-digits",
    title: "Sum of Digits",
    description:
      "Given an integer n, return the sum of its digits. Use the absolute value of n.\n\nInput: JSON number (e.g. 123 or -409)\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "123", output: "6" },
      { input: "-409", output: "13" },
    ],
  },
  {
    slug: "pvp-reverse-integer",
    title: "Reverse an Integer",
    description:
      "Reverse the digits of an integer n while keeping its sign. Leading zeros should be removed.\n\nInput: JSON number\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "123", output: "321" },
      { input: "-450", output: "-54" },
    ],
  },
  {
    slug: "pvp-palindrome-number",
    title: "Check Palindrome Number",
    description:
      "Return true if an integer n is a palindrome, else false. Negative numbers are not palindromes.\n\nInput: JSON number\nOutput: boolean",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "121", output: "true" },
      { input: "-121", output: "false" },
    ],
  },
  {
    slug: "pvp-count-vowels",
    title: "Count Vowels",
    description:
      "Count the number of vowels (a,e,i,o,u) in a string. Case-insensitive.\n\nInput: JSON string\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "\"hello\"", output: "2" },
      { input: "\"CODE\"", output: "2" },
    ],
  },
  {
    slug: "pvp-max-of-array",
    title: "Max of Array",
    description:
      "Given an array of integers, return the maximum value.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "[3,7,2,9]", output: "9" },
      { input: "[-5,-2,-9]", output: "-2" },
    ],
  },
  {
    slug: "pvp-second-largest",
    title: "Second Largest Element",
    description:
      "Return the second largest UNIQUE number in an array. The array will contain at least 2 distinct values.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "[5,1,5,3]", output: "3" },
      { input: "[10,9]", output: "9" },
    ],
  },
  {
    slug: "pvp-check-anagram",
    title: "Check Anagram",
    description:
      "Check if two strings are anagrams (case-insensitive). Ignore spaces.\n\nInput: JSON object {\"a\": string, \"b\": string}\nOutput: boolean",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "{\"a\":\"listen\",\"b\":\"silent\"}", output: "true" },
      { input: "{\"a\":\"rat\",\"b\":\"car\"}", output: "false" },
    ],
  },
  {
    slug: "pvp-fibonacci",
    title: "Fibonacci Number",
    description:
      "Return the nth Fibonacci number (0-indexed).\n\nInput: JSON number n\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "6", output: "8" },
      { input: "0", output: "0" },
    ],
  },
  {
    slug: "pvp-count-evens",
    title: "Count Even Numbers",
    description:
      "Count how many even numbers are in an array.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "[1,2,3,4]", output: "2" },
      { input: "[7,9]", output: "0" },
    ],
  },
  {
    slug: "pvp-factorial",
    title: "Factorial",
    description:
      "Return n! for a non-negative integer n.\n\nInput: JSON number n\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "5", output: "120" },
      { input: "0", output: "1" },
    ],
  },
  {
    slug: "pvp-two-sum",
    title: "Two Sum (Classic PvP)",
    description:
      "Return indices [i,j] such that nums[i] + nums[j] == target. Assume exactly one solution exists.\n\nInput: JSON object {\"nums\": number[], \"target\": number}\nOutput: JSON array [i,j]",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "{\"nums\":[2,7,11,15],\"target\":9}", output: "[0,1]" },
      { input: "{\"nums\":[3,2,4],\"target\":6}", output: "[1,2]" },
    ],
  },
  {
    slug: "pvp-remove-duplicates",
    title: "Remove Duplicates",
    description:
      "Remove duplicates from an array while preserving first occurrence order.\n\nInput: JSON array of numbers\nOutput: JSON array of numbers",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "[1,2,2,3]", output: "[1,2,3]" },
      { input: "[4,4,4]", output: "[4]" },
    ],
  },
  {
    slug: "pvp-first-nonrepeating-char",
    title: "First Non-Repeating Character",
    description:
      "Return the first character that does not repeat in a string. If none exists, return -1.\n\nInput: JSON string\nOutput: JSON string (single character) OR number -1",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "\"swiss\"", output: "\"w\"" },
      { input: "\"aabb\"", output: "-1" },
    ],
  },
  {
    slug: "pvp-power-of-two",
    title: "Power of Two",
    description:
      "Return true if n is a power of two, else false.\n\nInput: JSON number\nOutput: boolean",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "16", output: "true" },
      { input: "18", output: "false" },
    ],
  },
  {
    slug: "pvp-missing-number",
    title: "Missing Number",
    description:
      "Array contains numbers from 0..n with one missing. Return the missing number.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "[3,0,1]", output: "2" },
      { input: "[0,1]", output: "2" },
    ],
  },
  {
    slug: "pvp-rotate-array-right",
    title: "Rotate Array Right by K",
    description:
      "Rotate an array to the right by k steps.\n\nInput: JSON object {\"nums\": number[], \"k\": number}\nOutput: JSON array of numbers",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "{\"nums\":[1,2,3,4],\"k\":1}", output: "[4,1,2,3]" },
      { input: "{\"nums\":[1,2,3,4],\"k\":2}", output: "[3,4,1,2]" },
    ],
  },
  {
    slug: "pvp-valid-parentheses",
    title: "Valid Parentheses",
    description:
      "Return true if brackets are balanced. Only characters ()[]{} will be present.\n\nInput: JSON string\nOutput: boolean",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "\"()[]{}\"", output: "true" },
      { input: "\"(]\"", output: "false" },
    ],
  },
  {
    slug: "pvp-gcd",
    title: "GCD of Two Numbers",
    description:
      "Return the greatest common divisor (GCD) of a and b. Assume a and b are non-negative integers.\n\nInput: JSON object {\"a\": number, \"b\": number}\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "{\"a\":12,\"b\":18}", output: "6" },
      { input: "{\"a\":17,\"b\":13}", output: "1" },
    ],
  },
  {
    slug: "pvp-longest-word",
    title: "Longest Word",
    description:
      "Return the longest word in a sentence. If there is a tie, return the first longest. Words are separated by spaces.\n\nInput: JSON string\nOutput: JSON string",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [
      { input: "\"I love competitive coding\"", output: "\"competitive\"" },
      { input: "\"to be or not\"", output: "\"not\"" },
    ],
  },
  {
    slug: "pvp-binary-to-decimal",
    title: "Binary to Decimal",
    description:
      "Convert a binary string to its decimal value.\n\nInput: JSON string (e.g. \"1010\")\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [
      { input: "\"1010\"", output: "10" },
      { input: "\"111\"", output: "7" },
    ],
  },
];

async function main() {
  const rows = seeds.map((q) => ({
    slug: q.slug,
    title: q.title,
    description: q.description,
    difficulty: q.difficulty,
    languages: q.languages,
    testcases: q.testcases,
  }));

  const { error } = await supabase
    .from("practice_questions")
    .upsert(rows, { onConflict: "slug" });

  if (error) {
    console.error("Seed failed", error);
    process.exit(1);
  }

  console.log(`Seeded/updated ${rows.length} PvP questions.`);
}

await main();
