class Board {
  constructor(ctx, ctxNext) {
    this.ctx = ctx;
    this.ctxNext = ctxNext;
    this.init();
  }

  init() {
    ctx.canvas.width = COLS * BLOCK_SIZE;
    ctx.canvas.height = ROWS * BLOCK_SIZE;

    ctx.scale(BLOCK_SIZE, BLOCK_SIZE)
  }


  reset() {
    this.grid = this.getEmptyBoard();
    this.piece = new Piece(this.ctx);
    this.piece.setStartingPosition();
    this.getNewPiece();
  }

  getNewPiece() {
    const { width, height } = this.ctxNext.canvas;
    this.next = new Piece(this.ctxNext);
    this.ctxNext.clearRect(0, 0, width, height);
    this.next.draw();
  }

  getEmptyBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }
  isInsideWalls(x,y) {
    return x>=0 && x<COLS && y<= ROWS;
  }

  notOccupied(x, y) {
    return this.grid[y] && (this.grid[y][x] === 0);
  }

  valid(p) {
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        let x = p.x + dx;
        let y = p.y + dy;
        return value === 0 || (this.isInsideWalls(x, y) && this.notOccupied(x,y))
      });
    });
  }


  rotate(piece) {
    let p = JSON.parse(JSON.stringify(piece));

    for(let y=0; y<p.shape.length; ++y) {
      for (let x=0; x<y; ++x) {
        [p.shape[x][y], p.shape[y][x]] =  [p.shape[y][x], p.shape[x][y]]
      }
    }
    p.shape.forEach((row) => row.reverse());
    return p;
  }

  drop() {
    let p = moves[KEY.DOWN](this.piece);
    if (board.valid(p)) {
      this.piece.move(p);
    } else {
      this.freeze();
      this.clearLines();

      this.piece = this.next;
      this.piece.ctx = this.ctx;
      this.piece.setStartingPosition();
      this.getNewPiece();
    }
    return true;
  }

  draw() {
    this.piece.draw();
    this.drawBoard();
  }

  animate() {
    this.piece.draw();
    requestAnimationFrame(this.animate.bind(this))
  }



freeze() {
  this.piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
          this.grid[y + this.piece.y][x + this.piece.x] = value;
        }
      });
    });
  }

  drawBoard() {
    this.grid.forEach((row, y) => {
      row.forEach((value,x) => {
        if(value >0) {
          this.ctx.fillStyle = COLORS[value];
          this.ctx.fillRect(x,y,1,1);
        }
      })
    })
  }

  clearLines() {
    let lines = 0;
    this.grid.forEach((row, y)=> {
      if(row.every(value => value>0)){
        lines++;
        this.grid.splice(y,1)
        this.grid.unshift(Array(COLS).fill(0))
      }
    });
    if(lines>0) {
      account.score += this.getLineClearPoints(lines)
      account.lines += lines;

      if (account.lines >= LINES_PER_LEVEL) {
        // Goto next level
        account.level++;

        // Remove lines so we start working for the next level
        account.lines -= LINES_PER_LEVEL;

        // Increase speed of game
        time.level = LEVEL[account.level];
      }
    }
  }

  getLineClearPoints(lines) {
    return lines === 1? POINTS.SINGLE:
     lines === 2? POINTS.DOUBLE:
     lines === 3? POINTS.TRIPLE:
     lines === 4? POINTS.TETRIS:
     0
  }
}