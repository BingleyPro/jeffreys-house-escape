/*
@title: Jeffrey's House Escape
@author: bingleypro
@tags: [fun]
@addedOn: 2024-06-19
(the date above refers to the 19th of June, 2024)
*/

// Define sprites and their corresponding characters
const player = "p";
const wall = "w";
const door = "d";
const key = "k";
const freeplayPortal = "f";
const progressionPortal = "g";

// Game variables
let score = 0;
let mode = "freeplay"; // default mode
let keysCollected = 0;
let levelSize = 10; // Initial level size
let maxWallsPercentage = 0.3; // Maximum percentage of walls in the level
let currentLevelIndex = 0;
let timerInterval;
let timerSeconds = 0;

// Define sprite bitmaps
setLegend(
  [player, bitmap`
................
......0000000...
.....00.....00..
....00.......0..
....0..0..0..00.
...0.......0..0.
...0..00..00.00.
...00..000...0..
....000.....00..
......0000000...
........0.......
........0.......
........0.......
.......00.......
.......0........
...00000000000..`],
  [wall, bitmap`
LLLLLLLLLLLLLLLL
LL000L00L00L00LL
L0L0L00L00L00L0L
L00L00L00L00L00L
L0L0LL00L00L00LL
LL00LL0L00L00L0L
L00L00L00L00L00L
L0L00L0LL00L00LL
LL00L00LL0L00LLL
L00L00L00L00L00L
L0L00L00L0LL00LL
LL00L00L00LL0L0L
L00L00L00L00L00L
L0L00L00L00L0L0L
LL00L00L00L000LL
LLLLLLLLLLLLLLLL`],
  [door, bitmap`
................
................
....CCCCCCCC....
....CCCCCCCC....
...CCCCCCCCCC...
...CCCCCCCCCC...
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCC6CC..
..CCCCCCCC6C6C..
..CCCCCCCCC6CC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..
..CCCCCCCCCCCC..`],
  [key, bitmap`
................
.......66666....
.......66666....
.......66.......
.......66.......
.......6666.....
.......66.......
.......66.......
.......66.......
.....66666......
....6666666.....
....66...66.....
....66...66.....
....66...66.....
....6666666.....
.....66666......`],
  [freeplayPortal, bitmap`
....66666666....
...6699999966...
..669999999966..
.66999999999966.
6699999999999966
6999999999999996
6999999999999996
6999999999999996
6999999999999996
6999999999999996
6999999999999996
6699999999999966
.66999999999966.
..669999999966..
...6699999966...
....66666666....`],
  [progressionPortal, bitmap`
....55555555....
...5577777755...
..557777777755..
.55777777777755.
5577777777777755
5777777777777775
5777777777777775
5777777777777775
5777777777777775
5777777777777775
5777777777777775
5577777777777755
.55777777777755.
..557777777755..
...5577777755...
....55555555....`]
);

setSolids([player, wall]);

const startLevel = map`
fwwwg
.www.
..p..
wwwww`; // Mode choosing

// Define levels for progression mode
const levels = [
  map`
.kwd.
.www.
.www.
.www.
..p..`,
  map`
...ww
.w.ww
....k
wwdwp`,
  map`
d...w.
www...
w....w
wk....
wpw...`,
  map`
..w...
w.....
..dwww
..k...
..p...
..w.w.`,
  map`
.......w.
pw..w...k
....d...w
.........
..w..w...
w..w.....`,
  map`
..........kw..
.......w....w.
.w............
...w..........
......p..w....
..............
w.............
..w...w.......
.w...........w
....dw.....w..
w........w....
.w............`,
  map`
..w....
.....w.
ww.k...
p..d...
...w...`,
  map`
p.kdw`,
  map`
.w.www.ww.ww
w...w..www..
.w....w.ww..
...........w
.w.......pww
w...w..w....
.w..d.w.ww..
ww....w.w...
w.w....www..
.w.......w..
...k...ww.w.
w..w...w..ww`,
  map`
w.w.w..ww.w.
.........ww.
www..p..w.ww
..w.w..w....
....ww.....w
....wwww...w
..ww...w..w.
wwww.w......
..kw..ww.w..
w..w.....ww.
.w...w..ww..
..w..w...w.d`
];

setMap(startLevel);

// Function to move the player in one direction as far as possible
function movePlayer(direction) {
  let player = getFirst("p");
  let moved = true;

  while (moved) {
    let newX = player.x;
    let newY = player.y;

    if (direction === "up") {
      newY -= 1;
    } else if (direction === "left") {
      newX -= 1;
    } else if (direction === "down") {
      newY += 1;
    } else if (direction === "right") {
      newX += 1;
    }

    // Check boundaries and collision with walls
    if (
      newX < 0 ||
      newY < 0 ||
      newX >= width() ||
      newY >= height() ||
      getTile(newX, newY).some((sprite) => sprite.type === "w")
    ) {
      moved = false;
    } else {
      player.x = newX;
      player.y = newY;

      // Collect keys
      if (
        getTile(newX, newY).some((sprite) => sprite.type === "k")
      ) {
        keysCollected++;
        getTile(newX, newY).forEach((sprite) => {
          if (sprite.type === "k") sprite.remove();
        });
      }
    }
  }
}

// Handle player movement based on input
onInput("w", () => movePlayer("up"));
onInput("a", () => movePlayer("left"));
onInput("s", () => movePlayer("down"));
onInput("d", () => movePlayer("right"));

// Reset player to starting position (i key)
onInput("i", () => {
  setMap(startLevel);
  keysCollected = 0;
  score = 0;
  timerSeconds = 0;
  clearInterval(timerInterval);
  updateScore();
  updateTimer();
});

// After each input, check conditions for level completion or mode change
afterInput(() => {
  // Check for portal tiles to switch modes
  if (tilesWith(freeplayPortal, player).length > 0) {
    // Freeplay mode selected
    mode = "freeplay";
    switchMode();
  } else if (tilesWith(progressionPortal, player).length > 0) {
    // Progression mode selected
    mode = "progression";
    switchMode();
  }

  // Check conditions for completing a level in freeplay mode
  if (mode == "freeplay") {
    if (tilesWith(door, player).length > 0 && tilesWith(key) == 0) {
      score++;
      keysCollected = 0;
      nextLevel();
    }
  }

  if (mode == "progression") {
    if (tilesWith(door, player).length > 0 && tilesWith(key) == 0) {
      score++;
      keysCollected = 0;
      nextLevel();
    }
  }

  updateScore();
});

/* --- FUNCTIONS --- */

// Generate a new level for freeplay mode
function generateLevel(width, height) {
  let newLevel = [];
  for (let y = 0; y < height; y++) {
    newLevel.push(new Array(width).fill("."));
  }

  function randomPosition() {
    return {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
  }

  let playerPos = randomPosition();
  let doorPos = randomPosition();
  let keyPos = randomPosition();

  while (
    playerPos.x === doorPos.x &&
    playerPos.y === doorPos.y &&
    playerPos.x === keyPos.x &&
    playerPos.y === keyPos.y &&
    doorPos.x === keyPos.x &&
    doorPos.y === keyPos.y
  ) {
    doorPos = randomPosition();
    keyPos = randomPosition();
  }

  newLevel[playerPos.y][playerPos.x] = "p";
  newLevel[doorPos.y][doorPos.x] = "d";
  newLevel[keyPos.y][keyPos.x] = "k";

  let wallCount = Math.floor(width * height * maxWallsPercentage);

  for (let i = 0; i < wallCount; i++) {
    let wallPos = randomPosition();
    while (newLevel[wallPos.y][wallPos.x] !== ".") {
      wallPos = randomPosition();
    }
    newLevel[wallPos.y][wallPos.x] = "w";
  }

  return newLevel.map((row) => row.join("")).join("\n");
}

// Check if the current level is solvable
function isLevelSolvable(grid) {
  let player, key, door;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "p") player = { x, y };
      if (grid[y][x] === "k") key = { x, y };
      if (grid[y][x] === "d") door = { x, y };
    }
  }

  if (!player || !key || !door) return false;

  // Check if there's a path from player to key
  if (!bfs(player, key, grid)) return false;

  // Check if there's a path from key to door
  return bfs(key, door, grid);
}

// Breadth-first search for pathfinding
function bfs(start, end, grid) {
  let queue = [start];
  let visited = new Set();
  visited.add(`${start.x},${start.y}`);

  const directions = [
    { x: 0, y: -1 }, // up
    { x: 0, y: 1 }, // down
    { x: -1, y: 0 }, // left
    { x: 1, y: 0 }, // right
  ];

  while (queue.length > 0) {
    let { x, y } = queue.shift();

    if (x === end.x && y === end.y) {
      return true;
    }

    for (let dir of directions) {
      let newX = x;
      let newY = y;

      while (
        newX + dir.x >= 0 &&
        newX + dir.x < grid[0].length &&
        newY + dir.y >= 0 &&
        newY + dir.y < grid.length &&
        grid[newY + dir.y][newX + dir.x] !== "w"
      ) {
        newX += dir.x;
        newY += dir.y;
      }

      if (!visited.has(`${newX},${newY}`)) {
        queue.push({ x: newX, y: newY });
        visited.add(`${newX},${newY}`);
      }
    }
  }

  return false;
}

// Function to update the score display
function updateScore() {
  addText(`Score: ${score}`, { x: 1, y: 1, color: color`5`, id: "scoreDisplay" });
}

// Function to update the timer display
function updateTimer() {
  addText(`Time: ${timerSeconds}s`, { x: 1, y: 2, color: color`5`, id: "timerDisplay" });
}

// Function to switch modes between freeplay and progression
function switchMode() {
  clearInterval(timerInterval);
  if (mode == "freeplay") {
    keysCollected = 0;
    score = 0;
    levelSize += 2; // Increase level size
    maxWallsPercentage += 0.05; // Increase max walls percentage
    timerSeconds = 0;
    timerInterval = setInterval(() => {
      timerSeconds++;
      updateTimer();
    }, 1000);

    // Generate a level!
    let newLevel;
    do {
      newLevel = generateLevel(levelSize, levelSize);
    } while (!isLevelSolvable(newLevel.split("\n").map((row) => row.split(""))));
    setMap(map`${newLevel}`);
  } else if (mode === "progression") {
    currentLevelIndex++;
    if (currentLevelIndex < levels.length) {
      setMap(levels[currentLevelIndex]); // Move to the next progression level
    } else {
      addText("You win!", { x: 4, y: 4, color: color`3` });
    }
  }

  updateScore();
  updateTimer();
}

// Function to move to the next level in freeplay mode
function nextLevel() {
  if (mode == "freeplay") {
    // Generate a level!
    let newLevel;
    do {
      newLevel = generateLevel(levelSize, levelSize); // or any other size
    } while (!isLevelSolvable(newLevel.split("\n").map(row => row.split(''))));
    setMap(map`${newLevel}`);

  } else if (mode == "progression") {
  currentLevelIndex++;
  if (currentLevelIndex < levels.length) {
    setMap(levels[currentLevelIndex])
  } else {
    addText("You win!", { x: 4, y: 4, color: color`3` });
  }
}

// Initialize score and timer displays
updateScore();
updateTimer();
}
