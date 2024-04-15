// 테트리스 게일 설정과 규칙 정의
const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  DOWN: 40,
  SPACE: 32, 
  UP: 38
}

const COLORS=[
  'cyan', 'blue','orange','yellow','green','pink','tomato'
]

const SHAPES = [  
  [],
  [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  [[2, 0, 0], 
   [2, 2, 2], 
   [0, 0, 0]],
  [[0, 0, 3],
   [3, 3, 3], 
   [0, 0, 0]],
  [[0,4, 4], [0,4, 4]],
  [[0, 5, 5], [5, 5, 0], [0, 0, 0]],
  [[0, 6, 0], [6, 6, 6], [0, 0, 0]],
  [[7, 7, 0], [0, 7, 7], [0, 0, 0]]
];

const POINTS= {
  SINGLE: 100,DOUBLE: 300, TRIPLE: 500, TETRIS: 800, SOFT_DROP:1, HARD_DROP: 2
}

const LINES_PER_LEVEL = 10;

const LEVEL = {
  0: 800,
  1: 720,
  2: 640,
  3: 560,
  4: 480,
  5: 400,
  6: 320,
  7: 240,
  8: 160,
  9: 160,
  10: 120,
  11: 120,
  12: 100,
  13: 90,
  14: 90,
  15: 70,
  16: 70,
  17: 50,
  18: 50,
  19: 30,
  20: 30,
  // 29+ is 20ms
};

[COLORS, SHAPES, KEY, POINTS, LEVEL].forEach(item => Object.freeze(item));