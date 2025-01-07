document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".stage");
  const scoreDisplay = document.querySelector(".score");

  const gridSize = 20; // Size of each grid cell
  const rows = 20; // Number of rows
  const cols = 20; // Number of columns

  let snake = [{ x: 10, y: 10 }];
  let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  let direction = { x: 0, y: 0 };
  let nextDirection = { x: 0, y: 0 };
  let score = 0;

  // Initialize stage
  stage.style.position = "relative";
  stage.style.width = `${gridSize * cols}px`;
  stage.style.height = `${gridSize * rows}px`;
  stage.style.margin = "0 auto";
  stage.style.display = "grid";
  stage.style.gridTemplateRows = `repeat(${rows}, ${gridSize}px)`;
  stage.style.gridTemplateColumns = `repeat(${cols}, ${gridSize}px)`;
  stage.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
  stage.style.border = "2px solid #fff";
  stage.style.overflow = "hidden";

  // Create grid cells
  for (let i = 0; i < rows * cols; i++) {
      const cell = document.createElement("div");
      cell.style.border = "1px solid rgba(255, 255, 255, 0.1)";
      stage.appendChild(cell);
  }

  // Create snake and food elements
  function createElement(type) {
      const el = document.createElement("div");
      el.style.position = "absolute";
      el.style.width = `${gridSize}px`;
      el.style.height = `${gridSize}px`;
      if (type === "snake") el.style.backgroundColor = "lime";
      if (type === "food") el.style.backgroundColor = "red";
      stage.appendChild(el);
      return el;
  }

  const foodEl = createElement("food");
  const snakeEls = snake.map(() => createElement("snake"));

  // Update positions of snake and food
  function updateElements() {
      // Update snake segments
      snake.forEach((segment, index) => {
          const el = snakeEls[index];
          el.style.left = `${segment.x * gridSize}px`;
          el.style.top = `${segment.y * gridSize}px`;
      });

      // Update food position
      foodEl.style.left = `${food.x * gridSize}px`;
      foodEl.style.top = `${food.y * gridSize}px`;
  }

  // Handle keyboard input
  document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" && direction.y === 0) nextDirection = { x: 0, y: -1 };
      if (e.key === "ArrowDown" && direction.y === 0) nextDirection = { x: 0, y: 1 };
      if (e.key === "ArrowLeft" && direction.x === 0) nextDirection = { x: -1, y: 0 };
      if (e.key === "ArrowRight" && direction.x === 0) nextDirection = { x: 1, y: 0 };
  });

  // Handle touch gestures
  let touchStartX, touchStartY;
  document.addEventListener("touchstart", (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
  });

  document.addEventListener("touchend", (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > Math.abs(dy)) {
          if (dx > 0 && direction.x === 0) nextDirection = { x: 1, y: 0 };
          else if (dx < 0 && direction.x === 0) nextDirection = { x: -1, y: 0 };
      } else {
          if (dy > 0 && direction.y === 0) nextDirection = { x: 0, y: 1 };
          else if (dy < 0 && direction.y === 0) nextDirection = { x: 0, y: -1 };
      }
  });

  // Main game loop
  function gameLoop() {
      direction = nextDirection;

      // Move snake
      const head = {
          x: (snake[0].x + direction.x + cols) % cols,
          y: (snake[0].y + direction.y + rows) % rows,
      };
      snake.unshift(head);

      // Check for collision with food
      if (head.x === food.x && head.y === food.y) {
          score++;
          scoreDisplay.textContent = score;
          food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };

          // Add new snake segment
          const newSegment = createElement("snake");
          snakeEls.push(newSegment);
      } else {
          snake.pop();
      }

      // Check for collision with itself
      if (snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
          alert(`Game Over! Your score: ${score}`);
          resetGame();
      }

      updateElements();
  }

  // Reset the game
  function resetGame() {
      snake.forEach(() => stage.removeChild(snakeEls.pop()));
      snake = [{ x: 10, y: 10 }];
      snakeEls.push(createElement("snake"));
      direction = { x: 0, y: 0 };
      nextDirection = { x: 0, y: 0 };
      score = 0;
      scoreDisplay.textContent = score;
      food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
      updateElements();
  }

  // Start game loop
  setInterval(gameLoop, 150);
});
