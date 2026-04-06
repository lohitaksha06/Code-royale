-- Additional question seed pack for Code Royale
-- Adds 30 problems total:
-- DSA: 5 easy, 5 medium, 5 hard
-- DAA: 5 easy, 5 medium, 5 hard
-- Idempotent by slug via ON CONFLICT.

begin;

alter table public.practice_questions
  add column if not exists difficulty text;

alter table public.practice_questions
  add column if not exists languages text[];

alter table public.practice_questions
  add column if not exists meta jsonb;

update public.practice_questions
set difficulty = coalesce(nullif(difficulty, ''), 'medium')
where difficulty is null or difficulty = '';

update public.practice_questions
set languages = coalesce(languages, array['javascript','python','cpp','java','c'])
where languages is null;

insert into public.practice_questions (
  slug,
  title,
  description,
  difficulty,
  languages,
  testcases,
  meta
)
values
  -- =========================
  -- DSA EASY (5)
  -- =========================
  (
    'extra-dsa-easy-array-sum',
    'Array Sum',
    'Return the sum of all integers in the input array.\nInput: JSON array of numbers\nOutput: number',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[1,2,3,4]","output":"10"},{"input":"[-2,5,-1]","output":"2"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["arrays","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-easy-min-element',
    'Minimum Element',
    'Return the smallest value in a non-empty integer array.\nInput: JSON array of numbers\nOutput: number',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[8,3,7,1]","output":"1"},{"input":"[-5,-1,-9]","output":"-9"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["arrays","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-easy-string-reverse',
    'Reverse String',
    'Return the reverse of the input string.\nInput: JSON string\nOutput: JSON string',
    'easy',
    array['javascript','python','cpp','java'],
    '[{"input":"\"hello\"","output":"\"olleh\""},{"input":"\"abba\"","output":"\"abba\""}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(n)","topics":["strings","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-easy-count-positive',
    'Count Positive Numbers',
    'Count how many values in the array are strictly greater than zero.\nInput: JSON array of numbers\nOutput: number',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[-1,0,2,4,-3]","output":"2"},{"input":"[0,0,0]","output":"0"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["arrays","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-easy-is-sorted',
    'Is Array Sorted',
    'Return true if the integer array is sorted in non-decreasing order.\nInput: JSON array of numbers\nOutput: boolean',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[1,2,2,5]","output":"true"},{"input":"[3,1,2]","output":"false"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["arrays","dsa"]}'::jsonb
  ),

  -- =========================
  -- DSA MEDIUM (5)
  -- =========================
  (
    'extra-dsa-medium-prefix-sum-range',
    'Range Sum Queries',
    'Given nums and queries [l,r], return sum for each range.\nInput: JSON object {"nums":number[],"queries":number[][]}\nOutput: JSON array',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"nums\":[1,2,3,4],\"queries\":[[0,1],[1,3]]}","output":"[3,9]"},{"input":"{\"nums\":[5,-2,7],\"queries\":[[0,2],[2,2]]}","output":"[10,7]"}]'::jsonb,
    '{"timeComplexity":"O(n+q)","spaceComplexity":"O(n)","topics":["prefix-sum","arrays","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-medium-longest-substring-unique',
    'Longest Unique Substring Length',
    'Return the length of the longest substring without repeating characters.\nInput: JSON string\nOutput: number',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"\"abcabcbb\"","output":"3"},{"input":"\"bbbbb\"","output":"1"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(k)","topics":["sliding-window","strings","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-medium-group-anagrams',
    'Group Anagrams',
    'Group strings by anagram class. Sort each group and groups by first item.\nInput: JSON array of strings\nOutput: JSON array of string arrays',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]","output":"[[\"ate\",\"eat\",\"tea\"],[\"bat\"],[\"nat\",\"tan\"]]"},{"input":"[\"\"]","output":"[[\"\"]]"}]'::jsonb,
    '{"timeComplexity":"O(n*k log k)","spaceComplexity":"O(n*k)","topics":["hash-table","strings","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-medium-kth-largest',
    'Kth Largest Element',
    'Return the kth largest value in an unsorted array.\nInput: JSON object {"nums":number[],"k":number}\nOutput: number',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"nums\":[3,2,1,5,6,4],\"k\":2}","output":"5"},{"input":"{\"nums\":[3,2,3,1,2,4,5,5,6],\"k\":4}","output":"4"}]'::jsonb,
    '{"timeComplexity":"O(n log k)","spaceComplexity":"O(k)","topics":["heap","arrays","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-medium-merge-intervals',
    'Merge Intervals',
    'Merge all overlapping intervals.\nInput: JSON array of [start,end]\nOutput: JSON array of merged intervals',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"[[1,3],[2,6],[8,10],[15,18]]","output":"[[1,6],[8,10],[15,18]]"},{"input":"[[1,4],[4,5]]","output":"[[1,5]]"}]'::jsonb,
    '{"timeComplexity":"O(n log n)","spaceComplexity":"O(n)","topics":["sorting","intervals","dsa"]}'::jsonb
  ),

  -- =========================
  -- DSA HARD (5)
  -- =========================
  (
    'extra-dsa-hard-trapping-rain-water',
    'Trapping Rain Water',
    'Given elevation map heights, compute trapped water units.\nInput: JSON array of numbers\nOutput: number',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"[0,1,0,2,1,0,1,3,2,1,2,1]","output":"6"},{"input":"[4,2,0,3,2,5]","output":"9"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["two-pointers","arrays","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-hard-min-window-substring',
    'Minimum Window Substring',
    'Return the shortest substring of s containing all characters of t (with multiplicity).\nInput: JSON object {"s":string,"t":string}\nOutput: JSON string',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"s\":\"ADOBECODEBANC\",\"t\":\"ABC\"}","output":"\"BANC\""},{"input":"{\"s\":\"a\",\"t\":\"aa\"}","output":"\"\""}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(k)","topics":["sliding-window","strings","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-hard-lru-cache-design',
    'LRU Cache Operations',
    'Simulate LRU cache and return outputs for get operations.\nInput: JSON object {"capacity":number,"ops":string[],"args":any[]}\nOutput: JSON array',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"capacity\":2,\"ops\":[\"put\",\"put\",\"get\",\"put\",\"get\",\"put\",\"get\",\"get\",\"get\"],\"args\":[[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]}","output":"[1,-1,-1,3,4]"}]'::jsonb,
    '{"timeComplexity":"O(1) avg/op","spaceComplexity":"O(capacity)","topics":["linked-list","hash-table","design","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-hard-word-ladder-length',
    'Word Ladder Length',
    'Find shortest transformation length from beginWord to endWord by changing one char each step.\nInput: JSON object {"begin":string,"end":string,"list":string[]}\nOutput: number',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"begin\":\"hit\",\"end\":\"cog\",\"list\":[\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]}","output":"5"},{"input":"{\"begin\":\"hit\",\"end\":\"cog\",\"list\":[\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]}","output":"0"}]'::jsonb,
    '{"timeComplexity":"O(N*L*26)","spaceComplexity":"O(N)","topics":["bfs","graphs","dsa"]}'::jsonb
  ),
  (
    'extra-dsa-hard-median-two-sorted-arrays',
    'Median of Two Sorted Arrays',
    'Return median of two sorted arrays in logarithmic time.\nInput: JSON object {"a":number[],"b":number[]}\nOutput: number',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"a\":[1,3],\"b\":[2]}","output":"2"},{"input":"{\"a\":[1,2],\"b\":[3,4]}","output":"2.5"}]'::jsonb,
    '{"timeComplexity":"O(log(min(n,m)))","spaceComplexity":"O(1)","topics":["binary-search","arrays","dsa"]}'::jsonb
  ),

  -- =========================
  -- DAA EASY (5)
  -- =========================
  (
    'extra-daa-easy-binary-search',
    'Binary Search Index',
    'Return index of target in sorted array else -1.\nInput: JSON object {"nums":number[],"target":number}\nOutput: number',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"{\"nums\":[1,3,5,7],\"target\":5}","output":"2"},{"input":"{\"nums\":[1,3,5,7],\"target\":2}","output":"-1"}]'::jsonb,
    '{"timeComplexity":"O(log n)","spaceComplexity":"O(1)","topics":["binary-search","daa"]}'::jsonb
  ),
  (
    'extra-daa-easy-selection-sort-pass',
    'Selection Sort One Pass',
    'Perform one outer pass of selection sort and return resulting array.\nInput: JSON array of numbers\nOutput: JSON array',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[4,1,3,2]","output":"[1,4,3,2]"},{"input":"[1,2,3]","output":"[1,2,3]"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["sorting","daa"]}'::jsonb
  ),
  (
    'extra-daa-easy-insertion-sort',
    'Insertion Sort',
    'Sort the array using insertion sort and return the sorted array.\nInput: JSON array of numbers\nOutput: JSON array',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[5,2,4,6,1,3]","output":"[1,2,3,4,5,6]"},{"input":"[3,3,1]","output":"[1,3,3]"}]'::jsonb,
    '{"timeComplexity":"O(n^2)","spaceComplexity":"O(1)","topics":["sorting","daa"]}'::jsonb
  ),
  (
    'extra-daa-easy-euclid-gcd',
    'Euclid GCD',
    'Compute GCD using Euclidean algorithm.\nInput: JSON object {"a":number,"b":number}\nOutput: number',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"{\"a\":48,\"b\":18}","output":"6"},{"input":"{\"a\":17,\"b\":13}","output":"1"}]'::jsonb,
    '{"timeComplexity":"O(log min(a,b))","spaceComplexity":"O(1)","topics":["number-theory","daa"]}'::jsonb
  ),
  (
    'extra-daa-easy-linear-search-count',
    'Linear Search Count',
    'Count occurrences of target in array.\nInput: JSON object {"nums":number[],"target":number}\nOutput: number',
    'easy',
    array['javascript','python','cpp','java','c'],
    '[{"input":"{\"nums\":[1,2,2,2,3],\"target\":2}","output":"3"},{"input":"{\"nums\":[4,5],\"target\":6}","output":"0"}]'::jsonb,
    '{"timeComplexity":"O(n)","spaceComplexity":"O(1)","topics":["searching","daa"]}'::jsonb
  ),

  -- =========================
  -- DAA MEDIUM (5)
  -- =========================
  (
    'extra-daa-medium-merge-sort',
    'Merge Sort',
    'Sort the given array using merge sort.\nInput: JSON array of numbers\nOutput: JSON array',
    'medium',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[5,1,6,2,3,4]","output":"[1,2,3,4,5,6]"},{"input":"[9,7,5,3]","output":"[3,5,7,9]"}]'::jsonb,
    '{"timeComplexity":"O(n log n)","spaceComplexity":"O(n)","topics":["divide-and-conquer","sorting","daa"]}'::jsonb
  ),
  (
    'extra-daa-medium-quick-sort',
    'Quick Sort',
    'Sort the given array using quick sort and return sorted output.\nInput: JSON array\nOutput: JSON array',
    'medium',
    array['javascript','python','cpp','java','c'],
    '[{"input":"[10,7,8,9,1,5]","output":"[1,5,7,8,9,10]"},{"input":"[3,3,2,1]","output":"[1,2,3,3]"}]'::jsonb,
    '{"timeComplexity":"O(n log n) avg","spaceComplexity":"O(log n)","topics":["divide-and-conquer","sorting","daa"]}'::jsonb
  ),
  (
    'extra-daa-medium-activity-selection',
    'Activity Selection',
    'Choose maximum number of non-overlapping activities by finish time.\nInput: JSON object {"start":number[],"finish":number[]}\nOutput: number',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"start\":[1,3,0,5,8,5],\"finish\":[2,4,6,7,9,9]}","output":"4"},{"input":"{\"start\":[1,2,3],\"finish\":[2,3,4]}","output":"3"}]'::jsonb,
    '{"timeComplexity":"O(n log n)","spaceComplexity":"O(1)","topics":["greedy","daa"]}'::jsonb
  ),
  (
    'extra-daa-medium-coin-change-min',
    'Coin Change Minimum Coins',
    'Find minimum number of coins to make amount, or -1 if impossible.\nInput: JSON object {"coins":number[],"amount":number}\nOutput: number',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"coins\":[1,2,5],\"amount\":11}","output":"3"},{"input":"{\"coins\":[2],\"amount\":3}","output":"-1"}]'::jsonb,
    '{"timeComplexity":"O(n*amount)","spaceComplexity":"O(amount)","topics":["dynamic-programming","daa"]}'::jsonb
  ),
  (
    'extra-daa-medium-knapsack-01',
    '0/1 Knapsack',
    'Maximize value with weight capacity using 0/1 knapsack.\nInput: JSON object {"weights":number[],"values":number[],"capacity":number}\nOutput: number',
    'medium',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"weights\":[1,3,4,5],\"values\":[1,4,5,7],\"capacity\":7}","output":"9"},{"input":"{\"weights\":[2,3,4],\"values\":[4,5,6],\"capacity\":5}","output":"9"}]'::jsonb,
    '{"timeComplexity":"O(n*W)","spaceComplexity":"O(n*W)","topics":["dynamic-programming","daa"]}'::jsonb
  ),

  -- =========================
  -- DAA HARD (5)
  -- =========================
  (
    'extra-daa-hard-dijkstra-shortest-path',
    'Dijkstra Shortest Path',
    'Find shortest distance from source to all nodes in weighted graph with non-negative weights.\nInput: JSON object {"n":number,"edges":number[][],"src":number}\nOutput: JSON array',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"n\":5,\"edges\":[[0,1,2],[0,2,4],[1,2,1],[1,3,7],[2,4,3],[3,4,1]],\"src\":0}","output":"[0,2,3,8,6]"}]'::jsonb,
    '{"timeComplexity":"O((V+E) log V)","spaceComplexity":"O(V+E)","topics":["graphs","shortest-path","daa"]}'::jsonb
  ),
  (
    'extra-daa-hard-floyd-warshall',
    'Floyd Warshall APSP',
    'Compute all-pairs shortest paths matrix. Use 1000000000 as INF sentinel.\nInput: JSON matrix\nOutput: JSON matrix',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"[[0,3,1000000000],[2,0,1000000000],[1000000000,7,0]]","output":"[[0,3,1000000000],[2,0,1000000000],[9,7,0]]"}]'::jsonb,
    '{"timeComplexity":"O(n^3)","spaceComplexity":"O(1) extra","topics":["graphs","dynamic-programming","daa"]}'::jsonb
  ),
  (
    'extra-daa-hard-matrix-chain-multiplication',
    'Matrix Chain Multiplication Cost',
    'Given dimensions array p where matrix i has size p[i-1] x p[i], return minimum scalar multiplications.\nInput: JSON array\nOutput: number',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"[40,20,30,10,30]","output":"26000"},{"input":"[10,20,30,40,30]","output":"30000"}]'::jsonb,
    '{"timeComplexity":"O(n^3)","spaceComplexity":"O(n^2)","topics":["dynamic-programming","daa"]}'::jsonb
  ),
  (
    'extra-daa-hard-n-queens-count',
    'N Queens Count Solutions',
    'Return number of valid N-Queens arrangements for n.\nInput: JSON number\nOutput: number',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"4","output":"2"},{"input":"5","output":"10"}]'::jsonb,
    '{"timeComplexity":"O(n!) approx","spaceComplexity":"O(n)","topics":["backtracking","daa"]}'::jsonb
  ),
  (
    'extra-daa-hard-max-flow-edmonds-karp',
    'Max Flow (Edmonds Karp)',
    'Compute maximum flow from source to sink using Edmonds-Karp.\nInput: JSON object {"n":number,"edges":number[][],"s":number,"t":number}\nOutput: number',
    'hard',
    array['javascript','python','cpp','java'],
    '[{"input":"{\"n\":6,\"edges\":[[0,1,16],[0,2,13],[1,2,10],[2,1,4],[1,3,12],[2,4,14],[3,2,9],[4,3,7],[3,5,20],[4,5,4]],\"s\":0,\"t\":5}","output":"23"}]'::jsonb,
    '{"timeComplexity":"O(V*E^2)","spaceComplexity":"O(V^2)","topics":["graphs","network-flow","daa"]}'::jsonb
  )
on conflict (slug) do update
set
  title = excluded.title,
  description = excluded.description,
  difficulty = excluded.difficulty,
  languages = excluded.languages,
  testcases = excluded.testcases,
  meta = excluded.meta;

commit;
