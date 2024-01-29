const canvas = document.getElementById('board') ;
const ctx= canvas.getContext('2d');
const canvasNext = document.getElementById('next');
const ctxNext = canvasNext.getContext('2d');  


let board = new Board(ctx, ctxNext);

let time = null;
let requestId = null;

let accountValues ={
  score: 0, lines: 0, level: 0
}


function play() {
  // play 버튼을 누르면 트리거
  board.reset();

  if (requestId) {
    cancelAnimationFrame(requestId);
  };
  
  animate();
}

const moves = {
  [KEY.LEFT]:  p => ({ ...p, x: p.x - 1 }),
  [KEY.RIGHT]: p => ({ ...p, x: p.x + 1 }),
  [KEY.DOWN]:    p => ({ ...p, y: p.y + 1 }),
  [KEY.SPACE] : p=> ({...p, y: p.y+1}),
  [KEY.UP] : p => board.rotate(p)
};

initNext();
function initNext () {
  ctxNext.canvas.width= 4*BLOCK_SIZE;
  ctxNext.canvas.height = 4* BLOCK_SIZE;
  ctxNext.scale(BLOCK_SIZE, BLOCK_SIZE)
}

// const p = this.moves[event](this.piece);

document.addEventListener('keydown', event => {
  if(moves[event.keyCode]) {
    event.preventDefault();

    let p = moves[event.keyCode](board.piece);
    
    if(event.keyCode ===KEY.SPACE) {
      while(board.valid(p)){
        account.score += POINTS.HARD_DROP;
        board.piece.move(p);
        p=moves[KEY.DOWN](board.piece)
      }
      board.piece.hardDrop();
    } 
    else {
      if(board.valid(p)) {
        board.piece.move(p);
        if(event.keyCode === KEY.DOWN) {
          account.score += POINTS.SOFT_DROP
        }
      }
    }
  }
})

time = {start: 0, elapsed: 0, level: 800}

function animate(now=0) {
  time.elapsed = now - time.start;
  
  if(time.elapsed > time.level) {
    time.start = now;
    board.drop();
  }

  // 새로운 상태로 그리기 전에 보드를 지운다.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); 
  
  board.draw();  
  requestId = requestAnimationFrame(animate);
}

function updateAccount(key, value) {
  let element = document.getElementById(key);
  if(element) {
    element.textContent= value
  }
}

let account = new Proxy(accountValues, {
  set: (target, key, value) => {
    target[key] = value;
    updateAccount(key, value);
    return true;
  }
})

function gameOver() {
  cancelAnimationFrame(requestId);

  ctx.fillStyle = 'black';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'red';
  ctx.fillText('GAME OVER', 1.8, 4);
}

function resetGame() {
  account.score=0;
  account.lines=0;
  account.level=0;
  board.reset();
  time = {start: performance.now(),elapsed:0, level: LEVEL[account.level]}
}


function showHighScores() {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const highScoreList = document.getElementById('highScores');

  highScoreList.innerHTML = highScores
    .map((score) => `<li>${score.score} - ${score.name}`)
    .join('');
}

function checkHighScore(score) {
  const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
  const lowestScore = highScores[NO_OF_HIGH_SCORES - 1]?.score ?? 0;

  if (score > lowestScore) {
    const name = prompt('You got a highscore! Enter name:');
    const newScore = { score, name };
    saveHighScore(newScore, highScores);
    showHighScores();
  }
}

function saveHighScore(score, highScores) {
  highScores.push(score);
  highScores.sort((a, b) => b.score - a.score);
  highScores.splice(NO_OF_HIGH_SCORES);

  localStorage.setItem('highScores', JSON.stringify(highScores));
}