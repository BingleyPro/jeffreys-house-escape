/*
@title: jeffrey's house escape
@author: bingleypro
@tags: []
@addedOn: 2024-00-00
*/

const player = "p"
const wall = "w"
const door = "d"

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
..CCCCCCCCCCCC..`]
)

setSolids([player, wall])

let level = 0
const levels = [
  map`
...ww
.w.ww
.....
wwdwp`,
  map`
d...w.
www...
w....w
w.....
wpw...`,
  map`
..w...
w.....
..dwww
......
..p...
..w.w.`,
]

const currentLevel = levels[level];
setMap(levels[level])

setPushables({
  [player]: []
})

// Function to move player until collision or edge of map
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

    // Check for collision with solid objects or map boundaries
    if (newX < 0 || newY < 0 || newX >= width() || newY >= height() || getTile(newX, newY).some(sprite => sprite.type === "w")) {
      moved = false;
    } else {
      player.x = newX;
      player.y = newY;
    }
  }
}

// Set up input controls
onInput("w", () => movePlayer("up"));
onInput("a", () => movePlayer("left"));
onInput("s", () => movePlayer("down"));
onInput("d", () => movePlayer("right"));


afterInput(() => {
  if(tilesWith(door, player).length > 0) {
    level += 1;
    const currentLevel = levels[level];

    if (currentLevel !== undefined) {
      setMap(currentLevel);
    } else {
      addText("you win!", { y: 4, color: color`3` });
    }
  }
})