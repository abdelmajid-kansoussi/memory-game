const cards = document.querySelectorAll(".card");
const movesLabel = document.querySelector(".moves-label");
const timerLabel = document.querySelector(".timer-label");
const btnPlay = document.querySelector(".btn-play");
const overlay = document.querySelector(".overlay");
const result = document.querySelector(".result");

const NUMBER_OF_CARDS = 30;
let firstCard, secondCard;
let hasFlippedCard = false;
let lockBoard = false;
let timerCounting = false;
let moves = 0;
let time = 0;
let flippedCards = 0;
let gameOver = false;

const startTimer = function () {
  if (timerCounting) return;
  timerCounting = true;

  const timerId = setInterval(() => {
    time++;
    let seconds = time % 60;
    let minutes = Math.floor(time / 60);
    let hours = Math.floor(time / 3600);
    seconds = String(seconds).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    hours = String(hours).padStart(2, "0");
    timerLabel.textContent = `${hours} : ${minutes} : ${seconds}`;
    if (gameOver) clearInterval(timerId);
  }, 1000);
};

const flipCard = function () {
  startTimer();

  if (lockBoard || firstCard == this) return;

  if (hasFlippedCard) {
    secondCard = this;
    secondCard.classList.add("flip");
    hasFlippedCard = false;
    movesLabel.textContent = `Moves: ${++moves}`;
    checkMatch();
  } else {
    firstCard = this;
    firstCard.classList.add("flip");
    hasFlippedCard = true;
  }
};

const checkMatch = function () {
  const isMatch = firstCard.dataset.food == secondCard.dataset.food;
  if (isMatch) {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    flippedCards += 2;
    if (flippedCards == NUMBER_OF_CARDS) endGame();
  } else {
    lockBoard = true;
    setTimeout(() => unflipCards(), 1000);
  }
};

const unflipCards = function () {
  firstCard.classList.remove("flip");
  secondCard.classList.remove("flip");
  lockBoard = false;
};

const shuffleCards = function () {
  cards.forEach((card) => {
    const random = Math.floor(Math.random() * NUMBER_OF_CARDS);
    card.style.order = random;
  });
};

const startGame = function (event) {
  firstCard = null;
  secondCard = null;
  hasFlippedCard = false;
  lockBoard = false;
  timerCounting = false;
  gameOver = false;
  moves = 0;
  time = 0;
  flippedCards = 0;
  overlay.classList.add("hidden");
  btnPlay.classList.add("hidden");
  result.classList.add("hidden");
  movesLabel.textContent = "Moves: 0";
  timerLabel.textContent = "00 : 00 : 00";
  shuffleCards();
  cards.forEach((card) => card.classList.remove("flip"));
  cards.forEach((card) => card.addEventListener("click", flipCard));
};

const endGame = function () {
  gameOver = true;
  setTimeout(() => {
    overlay.classList.remove("hidden");
    result.classList.remove("hidden");
    result.addEventListener("click", startGame);
  }, 1000);
};

btnPlay.addEventListener("click", startGame);
