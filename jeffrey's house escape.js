/*
@title: jeffrey's house escape
@author: bingleypro
@tags: []
@addedOn: 2024-00-00
*/

const player = "p"
const wall = "w"
const door = "d"
const box = "b"
const key = "k"
const locked_door = "l"

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
  [box, bitmap`
9999999999999999
99............99
999...........99
9.99.........9.9
9...99.......9.9
9....99....99..9
9.....99..99...9
9......999.....9
9.......99.....9
9.......999....9
9......9..99...9
9.....9....9...9
9....9......9..9
9..99.......99.9
999..........999
9999999999999999`],
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
  [locked_door, bitmap`
................
................
......CCC.......
......CCCC......
..6666CCCCC.....
...6666CCCCLL...
...C6666CCLLL...
...CCC636LLLC...
...CCCC3333LC...
...CCC3336666...
...CCLLL36666...
...CLLLCCC666...
...CLLCCCCC66...
...LLLCCCCCC6...
...LLCCCCCCCC...
...LCCCCCCCCC...`]
)

setSolids([player, wall])

let level = 0
const levels = [
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
...w...`
]

let hasKey = false;

const currentLevel = levels[level];
setMap(levels[level]);

setPushables({
  [player]: [box]
});

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

    if (newX < 0 || newY < 0 || newX >= width() || newY >= height() || getTile(newX, newY).some(sprite => sprite.type === "w" || sprite.type === "l")) {
      moved = false;
    } else {
      player.x = newX;
      player.y = newY;
      
      // Collect key if present
      if (getTile(newX, newY).some(sprite => sprite.type === "k")) {
        hasKey = true;
        getTile(newX, newY).forEach(sprite => {
          if (sprite.type === "k") sprite.remove();
        });
      }
    }
  }
}

onInput("w", () => movePlayer("up"));
onInput("a", () => movePlayer("left"));
onInput("s", () => movePlayer("down"));
onInput("d", () => movePlayer("right"));

afterInput(() => {
  if (tilesWith(door, player).length > 0 && hasKey) {
    level += 1;
    const currentLevel = levels[level];
    hasKey = false;

    if (currentLevel !== undefined) {
      setMap(currentLevel);
    } else {
      addText("you win!", { y: 4, color: color`3` });
    }
  }
});
