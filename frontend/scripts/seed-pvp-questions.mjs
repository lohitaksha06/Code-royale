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

// ─── Keep in sync with src/lib/pvp-questions.ts ───
// 50 curated questions: ~20 easy, ~18 medium, ~12 hard
const seeds = [
  // ──────────────── EASY ────────────────
  {
    slug: "pvp-sum-of-digits",
    title: "Sum of Digits",
    description: "Given an integer n, return the sum of its digits. Use the absolute value of n.\n\nInput: JSON number (e.g. 123 or -409)\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "123", output: "6" }, { input: "-409", output: "13" }],
    meta: { timeComplexity: "O(log n)", spaceComplexity: "O(1)", topics: ["math"] },
  },
  {
    slug: "pvp-reverse-integer",
    title: "Reverse an Integer",
    description: "Reverse the digits of an integer n while keeping its sign. Leading zeros should be removed.\n\nInput: JSON number\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "123", output: "321" }, { input: "-450", output: "-54" }],
    meta: { timeComplexity: "O(log n)", spaceComplexity: "O(1)", topics: ["math"] },
  },
  {
    slug: "pvp-palindrome-number",
    title: "Check Palindrome Number",
    description: "Return true if an integer n is a palindrome, else false. Negative numbers are not palindromes.\n\nInput: JSON number\nOutput: boolean",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "121", output: "true" }, { input: "-121", output: "false" }],
    meta: { timeComplexity: "O(log n)", spaceComplexity: "O(1)", topics: ["math"] },
  },
  {
    slug: "pvp-count-vowels",
    title: "Count Vowels",
    description: "Count the number of vowels (a,e,i,o,u) in a string. Case-insensitive.\n\nInput: JSON string\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"hello"', output: "2" }, { input: '"CODE"', output: "2" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["strings"] },
  },
  {
    slug: "pvp-max-of-array",
    title: "Max of Array",
    description: "Given an array of integers, return the maximum value.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[3,7,2,9]", output: "9" }, { input: "[-5,-2,-9]", output: "-2" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["arrays"] },
  },
  {
    slug: "pvp-second-largest",
    title: "Second Largest Element",
    description: "Return the second largest UNIQUE number in an array. The array will contain at least 2 distinct values.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[5,1,5,3]", output: "3" }, { input: "[10,9]", output: "9" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["arrays"] },
  },
  {
    slug: "pvp-fibonacci",
    title: "Fibonacci Number",
    description: "Return the nth Fibonacci number (0-indexed).\n\nInput: JSON number n\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "6", output: "8" }, { input: "0", output: "0" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["math", "dynamic-programming"] },
  },
  {
    slug: "pvp-count-evens",
    title: "Count Even Numbers",
    description: "Count how many even numbers are in an array.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[1,2,3,4]", output: "2" }, { input: "[7,9]", output: "0" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["arrays"] },
  },
  {
    slug: "pvp-factorial",
    title: "Factorial",
    description: "Return n! for a non-negative integer n.\n\nInput: JSON number n\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "5", output: "120" }, { input: "0", output: "1" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["math"] },
  },
  {
    slug: "pvp-remove-duplicates",
    title: "Remove Duplicates",
    description: "Remove duplicates from an array while preserving first occurrence order.\n\nInput: JSON array of numbers\nOutput: JSON array of numbers",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: "[1,2,2,3]", output: "[1,2,3]" }, { input: "[4,4,4]", output: "[4]" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["arrays", "hash-table"] },
  },
  {
    slug: "pvp-power-of-two",
    title: "Power of Two",
    description: "Return true if n is a power of two, else false.\n\nInput: JSON number\nOutput: boolean",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "16", output: "true" }, { input: "18", output: "false" }],
    meta: { timeComplexity: "O(1)", spaceComplexity: "O(1)", topics: ["bit-manipulation"] },
  },
  {
    slug: "pvp-gcd",
    title: "GCD of Two Numbers",
    description: 'Return the greatest common divisor (GCD) of a and b. Assume a and b are non-negative integers.\n\nInput: JSON object {"a": number, "b": number}\nOutput: number',
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: '{"a":12,"b":18}', output: "6" }, { input: '{"a":17,"b":13}', output: "1" }],
    meta: { timeComplexity: "O(log min(a,b))", spaceComplexity: "O(1)", topics: ["math"] },
  },
  {
    slug: "pvp-longest-word",
    title: "Longest Word",
    description: "Return the longest word in a sentence. If there is a tie, return the first longest. Words are separated by spaces.\n\nInput: JSON string\nOutput: JSON string",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"I love competitive coding"', output: '"competitive"' }, { input: '"to be or not"', output: '"not"' }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["strings"] },
  },
  {
    slug: "pvp-binary-to-decimal",
    title: "Binary to Decimal",
    description: 'Convert a binary string to its decimal value.\n\nInput: JSON string (e.g. "1010")\nOutput: number',
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: '"1010"', output: "10" }, { input: '"111"', output: "7" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["math", "bit-manipulation"] },
  },
  {
    slug: "pvp-title-case",
    title: "Title Case a Sentence",
    description: "Convert a sentence to title case — capitalize the first letter of each word, lowercase the rest. Words are separated by spaces.\n\nInput: JSON string\nOutput: JSON string",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"hello world"', output: '"Hello World"' }, { input: '"jAVAsCRIPT is FUN"', output: '"Javascript Is Fun"' }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["strings"] },
  },
  {
    slug: "pvp-array-intersection",
    title: "Array Intersection",
    description: 'Return the intersection of two arrays (elements present in both). Each element in the result should appear as many times as it shows in both arrays. Order does not matter — sort the result ascending.\n\nInput: JSON object {"a": number[], "b": number[]}\nOutput: JSON array of numbers (sorted ascending)',
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"a":[1,2,2,1],"b":[2,2]}', output: "[2,2]" }, { input: '{"a":[4,9,5],"b":[9,4,9,8,4]}', output: "[4,9]" }],
    meta: { timeComplexity: "O(n+m)", spaceComplexity: "O(min(n,m))", topics: ["arrays", "hash-table"] },
  },
  {
    slug: "pvp-single-number",
    title: "Single Number",
    description: "Every element in the array appears twice except for one. Find that single element.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[2,2,1]", output: "1" }, { input: "[4,1,2,1,2]", output: "4" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["bit-manipulation"] },
  },
  {
    slug: "pvp-roman-to-integer",
    title: "Roman to Integer",
    description: "Convert a roman numeral string to an integer. Valid symbols: I(1) V(5) X(10) L(50) C(100) D(500) M(1000). Input is guaranteed to be a valid roman numeral in range [1, 3999].\n\nInput: JSON string\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"III"', output: "3" }, { input: '"MCMXCIV"', output: "1994" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["math", "strings"] },
  },
  {
    slug: "pvp-merge-sorted-arrays",
    title: "Merge Two Sorted Arrays",
    description: 'Merge two sorted arrays into one sorted array.\n\nInput: JSON object {"a": number[], "b": number[]}\nOutput: JSON array of numbers',
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: '{"a":[1,3,5],"b":[2,4,6]}', output: "[1,2,3,4,5,6]" }, { input: '{"a":[],"b":[1]}', output: "[1]" }],
    meta: { timeComplexity: "O(n+m)", spaceComplexity: "O(n+m)", topics: ["arrays", "two-pointers"] },
  },
  {
    slug: "pvp-climbing-stairs",
    title: "Climbing Stairs",
    description: "You can climb 1 or 2 steps at a time. How many distinct ways can you reach the top of n stairs?\n\nInput: JSON number n (1 <= n <= 45)\nOutput: number",
    difficulty: "easy",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "3", output: "3" }, { input: "5", output: "8" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["dynamic-programming"] },
  },

  // ──────────────── MEDIUM ────────────────
  {
    slug: "pvp-check-anagram",
    title: "Check Anagram",
    description: 'Check if two strings are anagrams (case-insensitive). Ignore spaces.\n\nInput: JSON object {"a": string, "b": string}\nOutput: boolean',
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"a":"listen","b":"silent"}', output: "true" }, { input: '{"a":"rat","b":"car"}', output: "false" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["strings", "hash-table"] },
  },
  {
    slug: "pvp-two-sum",
    title: "Two Sum (Classic PvP)",
    description: 'Return indices [i,j] such that nums[i] + nums[j] == target. Assume exactly one solution exists.\n\nInput: JSON object {"nums": number[], "target": number}\nOutput: JSON array [i,j]',
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: '{"nums":[2,7,11,15],"target":9}', output: "[0,1]" }, { input: '{"nums":[3,2,4],"target":6}', output: "[1,2]" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["arrays", "hash-table"] },
  },
  {
    slug: "pvp-first-nonrepeating-char",
    title: "First Non-Repeating Character",
    description: "Return the first character that does not repeat in a string. If none exists, return -1.\n\nInput: JSON string\nOutput: JSON string (single character) OR number -1",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"swiss"', output: '"w"' }, { input: '"aabb"', output: "-1" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["strings", "hash-table"] },
  },
  {
    slug: "pvp-missing-number",
    title: "Missing Number",
    description: "Array contains numbers from 0..n with one missing. Return the missing number.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[3,0,1]", output: "2" }, { input: "[0,1]", output: "2" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["math", "bit-manipulation"] },
  },
  {
    slug: "pvp-rotate-array-right",
    title: "Rotate Array Right by K",
    description: 'Rotate an array to the right by k steps.\n\nInput: JSON object {"nums": number[], "k": number}\nOutput: JSON array of numbers',
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"nums":[1,2,3,4],"k":1}', output: "[4,1,2,3]" }, { input: '{"nums":[1,2,3,4],"k":2}', output: "[3,4,1,2]" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["arrays"] },
  },
  {
    slug: "pvp-valid-parentheses",
    title: "Valid Parentheses",
    description: "Return true if brackets are balanced. Only characters ()[]{} will be present.\n\nInput: JSON string\nOutput: boolean",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"()[]{}\"', output: "true" }, { input: '"(]"', output: "false" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["stack"] },
  },
  {
    slug: "pvp-longest-substring-no-repeat",
    title: "Longest Substring Without Repeating Characters",
    description: "Return the length of the longest substring without repeating characters.\n\nInput: JSON string\nOutput: number",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"abcabcbb"', output: "3" }, { input: '"bbbbb"', output: "1" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(min(n,m))", topics: ["sliding-window", "hash-table"] },
  },
  {
    slug: "pvp-group-anagrams",
    title: "Group Anagrams",
    description: "Group an array of strings so that anagrams are together. Return a sorted array of sorted groups (sort each group alphabetically, then sort groups by their first element).\n\nInput: JSON array of strings\nOutput: JSON array of arrays of strings",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '["eat","tea","tan","ate","nat","bat"]', output: '[["ate","eat","tea"],["bat"],["nat","tan"]]' }, { input: '[""]', output: '[[""]]' }],
    meta: { timeComplexity: "O(n * k log k)", spaceComplexity: "O(n * k)", topics: ["strings", "hash-table", "sorting"] },
  },
  {
    slug: "pvp-product-except-self",
    title: "Product of Array Except Self",
    description: "Return an array where each element is the product of all other elements. Do NOT use division.\n\nInput: JSON array of numbers\nOutput: JSON array of numbers",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: "[1,2,3,4]", output: "[24,12,8,6]" }, { input: "[-1,1,0,-3,3]", output: "[0,0,9,0,0]" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["arrays", "prefix-sum"] },
  },
  {
    slug: "pvp-container-with-most-water",
    title: "Container With Most Water",
    description: "Given an array of heights, find two lines that together with the x-axis form a container that holds the most water. Return the maximum area.\n\nInput: JSON array of numbers (heights)\nOutput: number",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[1,8,6,2,5,4,8,3,7]", output: "49" }, { input: "[1,1]", output: "1" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["two-pointers", "greedy"] },
  },
  {
    slug: "pvp-3sum",
    title: "Three Sum",
    description: "Find all unique triplets in the array that sum to zero. Return them sorted, with each triplet sorted ascending.\n\nInput: JSON array of numbers\nOutput: JSON array of arrays (sorted triplets, sorted lexicographically)",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: "[-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }, { input: "[0,0,0]", output: "[[0,0,0]]" }],
    meta: { timeComplexity: "O(n^2)", spaceComplexity: "O(n)", topics: ["arrays", "two-pointers", "sorting"] },
  },
  {
    slug: "pvp-max-subarray-sum",
    title: "Maximum Subarray Sum",
    description: "Find the contiguous subarray with the largest sum and return that sum (Kadane's algorithm).\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6" }, { input: "[1]", output: "1" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["arrays", "dynamic-programming"] },
  },
  {
    slug: "pvp-coin-change",
    title: "Coin Change",
    description: 'Given an array of coin denominations and an amount, return the fewest number of coins needed to make up that amount. Return -1 if it cannot be made.\n\nInput: JSON object {"coins": number[], "amount": number}\nOutput: number',
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"coins":[1,5,10,25],"amount":30}', output: "2" }, { input: '{"coins":[2],"amount":3}', output: "-1" }],
    meta: { timeComplexity: "O(n * amount)", spaceComplexity: "O(amount)", topics: ["dynamic-programming"] },
  },
  {
    slug: "pvp-binary-search",
    title: "Binary Search",
    description: 'Given a sorted array and a target, return the index of target. If not found, return -1.\n\nInput: JSON object {"nums": number[], "target": number}\nOutput: number',
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: '{"nums":[-1,0,3,5,9,12],"target":9}', output: "4" }, { input: '{"nums":[-1,0,3,5,9,12],"target":2}', output: "-1" }],
    meta: { timeComplexity: "O(log n)", spaceComplexity: "O(1)", topics: ["binary-search"] },
  },
  {
    slug: "pvp-spiral-matrix",
    title: "Spiral Matrix",
    description: "Return all elements of an m x n matrix in spiral order.\n\nInput: JSON 2D array of numbers\nOutput: JSON array of numbers",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: "[[1,2,3],[4,5,6],[7,8,9]]", output: "[1,2,3,6,9,8,7,4,5]" }, { input: "[[1,2],[3,4]]", output: "[1,2,4,3]" }],
    meta: { timeComplexity: "O(m*n)", spaceComplexity: "O(1)", topics: ["arrays", "matrix", "simulation"] },
  },
  {
    slug: "pvp-string-compression",
    title: "String Compression",
    description: "Compress a string by replacing consecutive duplicate characters with the character followed by the count. If the count is 1, do not include it.\n\nInput: JSON string\nOutput: JSON string",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"aabcccccaaa"', output: '"a2bc5a3"' }, { input: '"abc"', output: '"abc"' }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["strings"] },
  },
  {
    slug: "pvp-top-k-frequent",
    title: "Top K Frequent Elements",
    description: 'Return the k most frequent elements in an array. Return them sorted in descending order of frequency; break ties by value ascending.\n\nInput: JSON object {"nums": number[], "k": number}\nOutput: JSON array of numbers',
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"nums":[1,1,1,2,2,3],"k":2}', output: "[1,2]" }, { input: '{"nums":[1],"k":1}', output: "[1]" }],
    meta: { timeComplexity: "O(n log k)", spaceComplexity: "O(n)", topics: ["hash-table", "sorting", "heap"] },
  },
  {
    slug: "pvp-longest-palindrome-substring",
    title: "Longest Palindromic Substring",
    description: "Return the longest palindromic substring. If there are multiple of the same length, return the first one found (leftmost).\n\nInput: JSON string\nOutput: JSON string",
    difficulty: "medium",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"babad"', output: '"bab"' }, { input: '"cbbd"', output: '"bb"' }],
    meta: { timeComplexity: "O(n^2)", spaceComplexity: "O(1)", topics: ["strings", "dynamic-programming"] },
  },

  // ──────────────── HARD ────────────────
  {
    slug: "pvp-merge-intervals",
    title: "Merge Intervals",
    description: "Given an array of intervals [start, end], merge all overlapping intervals and return the result sorted by start.\n\nInput: JSON array of [number, number] pairs\nOutput: JSON array of [number, number] pairs",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: "[[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }, { input: "[[1,4],[4,5]]", output: "[[1,5]]" }],
    meta: { timeComplexity: "O(n log n)", spaceComplexity: "O(n)", topics: ["arrays", "sorting"] },
  },
  {
    slug: "pvp-trapping-rain-water",
    title: "Trapping Rain Water",
    description: "Given an array of non-negative integers representing an elevation map where each bar has width 1, compute how much water it can trap after raining.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }, { input: "[4,2,0,3,2,5]", output: "9" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["two-pointers", "stack", "dynamic-programming"] },
  },
  {
    slug: "pvp-longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    description: "Return the length of the longest strictly increasing subsequence.\n\nInput: JSON array of numbers\nOutput: number",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[10,9,2,5,3,7,101,18]", output: "4" }, { input: "[0,1,0,3,2,3]", output: "4" }],
    meta: { timeComplexity: "O(n log n)", spaceComplexity: "O(n)", topics: ["dynamic-programming", "binary-search"] },
  },
  {
    slug: "pvp-word-break",
    title: "Word Break",
    description: 'Given a string s and a dictionary of words, return true if s can be segmented into space-separated sequence of dictionary words.\n\nInput: JSON object {"s": string, "wordDict": string[]}\nOutput: boolean',
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"s":"leetcode","wordDict":["leet","code"]}', output: "true" }, { input: '{"s":"catsandog","wordDict":["cats","dog","sand","and","cat"]}', output: "false" }],
    meta: { timeComplexity: "O(n^2)", spaceComplexity: "O(n)", topics: ["dynamic-programming", "strings"] },
  },
  {
    slug: "pvp-median-two-sorted",
    title: "Median of Two Sorted Arrays",
    description: 'Find the median of two sorted arrays. The overall run time complexity should be O(log(m+n)).\n\nInput: JSON object {"nums1": number[], "nums2": number[]}\nOutput: number (can be float)',
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"nums1":[1,3],"nums2":[2]}', output: "2" }, { input: '{"nums1":[1,2],"nums2":[3,4]}', output: "2.5" }],
    meta: { timeComplexity: "O(log(m+n))", spaceComplexity: "O(1)", topics: ["binary-search", "divide-and-conquer"] },
  },
  {
    slug: "pvp-minimum-window-substring",
    title: "Minimum Window Substring",
    description: 'Given strings s and t, return the minimum window substring of s that contains all characters of t (including duplicates). If no such window exists, return an empty string.\n\nInput: JSON object {"s": string, "t": string}\nOutput: JSON string',
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"s":"ADOBECODEBANC","t":"ABC"}', output: '"BANC"' }, { input: '{"s":"a","t":"aa"}', output: '""' }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["sliding-window", "hash-table"] },
  },
  {
    slug: "pvp-serialize-deserialize-bt",
    title: "Encode & Decode Strings",
    description: "Design an algorithm to encode a list of strings to a single string and decode it back. Implement both functions. Your output should be the decoded result of the encoded input — i.e. the same as the input.\n\nInput: JSON array of strings\nOutput: JSON array of strings (identical to input)",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '["hello","world"]', output: '["hello","world"]' }, { input: '["we","say",":","yes"]', output: '["we","say",":","yes"]' }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(n)", topics: ["strings", "design"] },
  },
  {
    slug: "pvp-max-profit-cooldown",
    title: "Best Time to Buy and Sell Stock with Cooldown",
    description: "Given an array of prices, find the maximum profit. After selling you must wait one day before buying again (cooldown). You may complete as many transactions as you like.\n\nInput: JSON array of numbers (prices)\nOutput: number",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: "[1,2,3,0,2]", output: "3" }, { input: "[1]", output: "0" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["dynamic-programming"] },
  },
  {
    slug: "pvp-task-scheduler",
    title: "Task Scheduler",
    description: 'Given a list of tasks (characters) and a cooldown interval n, return the minimum number of intervals the CPU needs to finish all tasks. Idle slots are allowed.\n\nInput: JSON object {"tasks": string[], "n": number}\nOutput: number',
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '{"tasks":["A","A","A","B","B","B"],"n":2}', output: "8" }, { input: '{"tasks":["A","A","A","B","B","B"],"n":0}', output: "6" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["greedy", "math", "heap"] },
  },
  {
    slug: "pvp-kth-largest-element",
    title: "Kth Largest Element in an Array",
    description: 'Return the kth largest element in an unsorted array. Note that it is the kth largest element in sorted order, not the kth distinct element.\n\nInput: JSON object {"nums": number[], "k": number}\nOutput: number',
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: '{"nums":[3,2,1,5,6,4],"k":2}', output: "5" }, { input: '{"nums":[3,2,3,1,2,4,5,5,6],"k":4}', output: "4" }],
    meta: { timeComplexity: "O(n) average", spaceComplexity: "O(1)", topics: ["sorting", "heap", "divide-and-conquer"] },
  },
  {
    slug: "pvp-decode-ways",
    title: "Decode Ways",
    description: "A message encoded with 'A'=1, 'B'=2, ..., 'Z'=26. Given a string of digits, return the total number of ways to decode it. Leading zeros are invalid.\n\nInput: JSON string of digits\nOutput: number",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java"],
    testcases: [{ input: '"226"', output: "3" }, { input: '"06"', output: "0" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["dynamic-programming", "strings"] },
  },
  {
    slug: "pvp-jump-game",
    title: "Jump Game",
    description: "Given an array of non-negative integers where each element represents your maximum jump length from that position, determine if you can reach the last index starting from index 0.\n\nInput: JSON array of numbers\nOutput: boolean",
    difficulty: "hard",
    languages: ["javascript", "python", "cpp", "java", "c"],
    testcases: [{ input: "[2,3,1,1,4]", output: "true" }, { input: "[3,2,1,0,4]", output: "false" }],
    meta: { timeComplexity: "O(n)", spaceComplexity: "O(1)", topics: ["greedy", "dynamic-programming"] },
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
    meta: q.meta || null,
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
