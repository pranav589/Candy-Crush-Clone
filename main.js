const grid = document.querySelector(".grid");
const width = 8;
const scoreDisplay = document.getElementById("score");

let score = 0;
const squares = [];

const backgroundSound = new Audio();
const three = new Audio();
const four = new Audio();

backgroundSound.src = "assets/Candy Crush Soundtrack3.mp3";
three.src = "assets/Delicious.mp3";
four.src = "assets/Divine.mp3";

const startGame = function () {
  //grabbing the button
  const playBtn = document.querySelector(".intro button");

  //grabbing the starting page
  const introScreen = document.querySelector(".intro");

  //grabbing the second page after clicking button
  const play = document.querySelector(".play");

  //events to the button
  playBtn.addEventListener("click", function () {
    introScreen.classList.add("fadeOut");
    play.classList.add("fadeIn");
    moveDown();
    checkRowForFour();
    checkColForFour();
    checkRowForThree();
    checkColForThree();
    backgroundSound.play();
    backgroundSound.addEventListener(
      "ended",
      function () {
        this.currentTime = 0;
        this.play();
      },
      false
    );
  });
};

startGame();

const candies = [
  "url(assets/blue-candy.png)",
  "url(assets/green-candy.png)",
  "url(assets/orange-candy.png)",
  "url(assets/purple-candy.png)",
  "url(assets/red-candy.png)",
  "url(assets/yellow-candy.png)",
];

function createBoard() {
  for (let i = 0; i < width * width; i++) {
    const square = document.createElement("div");
    let randomCandy = Math.floor(Math.random() * candies.length);
    square.setAttribute("draggable", true);
    square.setAttribute("id", i);
    square.style.backgroundImage = candies[randomCandy];
    grid.appendChild(square);
    squares.push(square);
  }
}

createBoard();

let candyBeingDragged;
let sqaureIdBeingDragged;
let candyBeingReplaced;
let sqaureIdBeingReplaced;

squares.forEach((square) => square.addEventListener("dragstart", dragStart));
squares.forEach((square) => square.addEventListener("dragend", dragEnd));
squares.forEach((square) => square.addEventListener("dragover", dragOver));
squares.forEach((square) => square.addEventListener("dragenter", dragEnter));
squares.forEach((square) => square.addEventListener("dragleave", dragLeave));
squares.forEach((square) => square.addEventListener("drop", dragDrop));

function dragStart() {
  candyBeingDragged = this.style.backgroundImage;
  sqaureIdBeingDragged = parseInt(this.id);
  // console.log(candyBeingDragged)
  // console.log(this.id,'dragStart')
}

function dragEnd() {
  // console.log(this.id,'dragEnd')
  let validMoves = [
    sqaureIdBeingDragged - 1,
    sqaureIdBeingDragged - width,
    sqaureIdBeingDragged + 1,
    sqaureIdBeingDragged + width,
  ];

  let validMove = validMoves.includes(sqaureIdBeingReplaced);

  if (sqaureIdBeingReplaced && validMove) {
    sqaureIdBeingReplaced = null;
  } else if (sqaureIdBeingReplaced && !validMove) {
    squares[sqaureIdBeingReplaced].style.backgroundImage = candyBeingReplaced;
    squares[sqaureIdBeingDragged].style.backgroundImage = candyBeingDragged;
  } else {
    squares[sqaureIdBeingDragged].style.backgroundImage = candyBeingDragged;
  }

  // console.log(this.id,'dragEnter')
}

function dragOver(e) {
  e.preventDefault();
  // console.log(this.id,'dragOver')
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave() {
  // console.log(this.id,'dragLeave')
}

function dragDrop() {
  candyBeingReplaced = this.style.backgroundImage;
  sqaureIdBeingReplaced = parseInt(this.id);
  this.style.backgroundImage = candyBeingDragged;
  squares[sqaureIdBeingDragged].style.backgroundImage = candyBeingReplaced;
  // console.log(this.id,'dragDrop')
}

function moveDown() {
  for (let i = 0; i < 55; i++) {
    if (squares[i + width].style.backgroundImage === "") {
      squares[i + width].style.backgroundImage =
        squares[i].style.backgroundImage;
      squares[i].style.backgroundImage = "";
      const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
      const isFirstRow = firstRow.includes(i);
      if (isFirstRow && squares[i].style.backgroundImage === "") {
        let randomCandy = Math.floor(Math.random() * candies.length);
        squares[i].style.backgroundImage = candies[randomCandy];
      }
    }
  }
}

// moveDown()

function checkRowForFour() {
  for (i = 0; i < 60; i++) {
    let rowOfFour = [i, i + 1, i + 2, i + 3];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === "";

    const notValid = [
      5,
      6,
      7,
      13,
      14,
      15,
      21,
      22,
      23,
      29,
      30,
      31,
      37,
      38,
      39,
      45,
      46,
      47,
      53,
      54,
      55,
    ];
    if (notValid.includes(i)) continue;

    if (
      rowOfFour.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 4;
      scoreDisplay.innerHTML = score;
      restart();
      rowOfFour.forEach((index) => {
        squares[index].style.backgroundImage = "";
        four.play();
      });
    }
  }
}
// checkRowForFour()

function checkColForFour() {
  for (i = 0; i < 39; i++) {
    let colOfFour = [i, i + width, i + width * 2, i + width * 3];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === "";

    if (
      colOfFour.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 4;
      scoreDisplay.innerHTML = score;
      restart();
      colOfFour.forEach((index) => {
        squares[index].style.backgroundImage = "";
        three.play();
      });
    }
  }
}
// checkColForFour()

function checkRowForThree() {
  for (i = 0; i < 61; i++) {
    let rowOfThree = [i, i + 1, i + 2];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === "";

    const notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
    if (notValid.includes(i)) continue;

    if (
      rowOfThree.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      restart();
      rowOfThree.forEach((index) => {
        squares[index].style.backgroundImage = "";
        four.play();
      });
    }
  }
}
// checkRowForThree()

function checkColForThree() {
  for (i = 0; i < 47; i++) {
    let colOfThree = [i, i + width, i + width * 2];
    let decidedColor = squares[i].style.backgroundImage;
    const isBlank = squares[i].style.backgroundImage === "";

    if (
      colOfThree.every(
        (index) =>
          squares[index].style.backgroundImage === decidedColor && !isBlank
      )
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      restart();
      colOfThree.forEach((index) => {
        squares[index].style.backgroundImage = "";
        three.play();
      });
    }
  }
}
// checkColForThree()

function restart() {
  if (score > 500) {
    alert("You Won!!!");
    console.log("won");
    location.reload();
  }
}

window.setInterval(function () {
  checkRowForThree();
  checkColForThree();
  checkRowForFour();
  checkColForFour();
  moveDown();
}, 100);
