const { stdout, stdin } = process;
stdin.setEncoding("utf8");
stdin.setRawMode("true");
let snake = [
  {
    dir: 1,
    x: 3,
    y: 1
  },
  {
    dir: 1,
    x: 2,
    y: 1
  },
  {
    dir: 1,
    x: 1,
    y: 1
  }
];

const expectedKeyStrokes = ["w", "d", "s", "a"];
let snakeFood = { x: 20, y: 20 };
let score = 0;

const generateSnakeFood = function() {
  snakeFood.x = Math.floor(Math.random() * 100) + 1;
  snakeFood.y = Math.floor(Math.random() * 29) + 1;
  return snakeFood;
};

const isItRunOverItself = function() {
  for (part in snake) {
    if (part == 0) continue;
    if (snake[0].x == snake[part].x && snake[0].y == snake[part].y) {
      return true;
    }
  }
  return false;
};

const crashedWall = function() {
  const maxWidth = process.stdout.columns;
  const maxHeight = process.stdout.rows;
  return (
    snake[0].x < 0 ||
    snake[0].y < 0 ||
    snake[0].x >= maxWidth ||
    snake[0].y >= maxHeight
  );
};

const changeDirection = function(direction) {
  snake[0].dir = direction;
  moveToNewDirection();
  for (let part = snake.length - 1; part >= 0; part--) {
    if (snake[part].dir != (snake[part - 1] || snake[part]).dir) {
      snake[part].dir = snake[part - 1].dir;
    }
  }
};

const getNewTailCord = function() {
  let newTail = {};
  const existingDir = snake[snake.length - 1].dir;
  const newTailPos = snake.length - 1;

  if (existingDir == 0) {
    newTail.x = snake[newTailPos].x;
    newTail.y = snake[newTailPos].y + 1;
  }
  if (existingDir == 1) {
    newTail.x = snake[newTailPos].x - 1;
    newTail.y = snake[newTailPos].y;
  }
  if (existingDir == 2) {
    newTail.x = snake[newTailPos].x;
    newTail.y = snake[newTailPos].y - 1;
  }
  if (existingDir == 3) {
    newTail.x = snake[newTailPos].x + 1;
    newTail.y = snake[newTailPos].y;
  }
  return newTail;
};

const moveToNewDirection = function() {
  for (part in snake) {
    if (snake[part].dir == 0) {
      snake[part].y--;
    }
    if (snake[part].dir == 1) {
      snake[part].x++;
    }
    if (snake[part].dir == 2) {
      snake[part].y++;
    }
    if (snake[part].dir == 3) {
      snake[part].x--;
    }
  }
};

const printWholeSnake = function() {
  snake.forEach(partOf => {
    stdout.cursorTo(partOf.x, partOf.y);
    stdout.write("o");
  });
};

const printExistingEnvironment = function() {
  const keyStroke = ["w", "d", "s", "a"];
  const headDir = snake[0].dir;
  moveSnake(keyStroke[headDir]);
};

const increaseSnakeLength = function(newTail) {
  const newTailInfo = {
    dir: snake[snake.length - 1].dir,
    x: newTail.x,
    y: newTail.y
  };
  snake.push(newTailInfo);
};

const moveSnake = function(data) {
  console.clear();
  const moveDirection = expectedKeyStrokes.indexOf(data);
  stdout.cursorTo(snake.x, snake.y);
  changeDirection(moveDirection);
  printWholeSnake();
  if (crashedWall() || isItRunOverItself() || data == "q") process.exit();
  if (snake[0].x == snakeFood.x && snake[0].y == snakeFood.y) {
    score++;
    snakeFood = generateSnakeFood();
    increaseSnakeLength(getNewTailCord());
  }
  stdout.cursorTo(snakeFood.x, snakeFood.y);
  console.log("*");
  process.stderr.write("\x1B[?25l");
};

const main = function() {
  stdin.on("data", moveSnake);
  setInterval(printExistingEnvironment, 300);
  process.on("exit", () => {
    process.stderr.write("\x1B[?25h");
    console.clear();
    console.log("GAME OVER!!!!YOUR SCORE is: ", score);
  });
};
main();
