'use strict';
const categorySets = {
  1: {
    topCategories: [
      {
        checkFor: 'level',
        val: 4,
        imgPath: './images/levelstar.png',
        text: 'Level 4',
      },
      {
        checkFor: 'atk',
        val: 1800,
        imgPath: './images/ATK.png',
        text: '1800 ATK',
      },
      {
        checkFor: 'def',
        val: 2500,
        imgPath: './images/DEF.png',
        text: '2500 DEF',
      },
    ],
    leftCategories: [
      {
        checkFor: 'attribute',
        val: 'WATER',
        imgPath: './images/WATER.png',
        text: 'WATER',
      },
      {
        checkFor: 'frameType',
        val: 'normal',
        imgPath: './images/normal.png',
        text: 'Normal',
      },
      {
        checkFor: 'race',
        val: 'Warrior',
        imgPath: './images/warrior.png',
        text: 'Warrior',
      },
    ],
  },
  2: {
    topCategories: [
      {
        checkFor: 'race',
        val: 'Spellcaster',
        imgPath: './images/spellcaster.png',
        text: 'Spellcaster',
      },
      { checkFor: 'ATK', val: 1800, imgPath: './images', text: '1800 ATK' },
      {
        checkFor: 'atk',
        val: 2800,
        imgPath: './images/ATK.png',
        text: '2800 ATK',
      },
    ],
    leftCategories: [
      {
        checkFor: 'attribute',
        val: 'FIRE',
        imgPath: './images/FIRE.png',
        text: 'FIRE',
      },
      { checkFor: 'level', val: 7, imgPath: './images', text: 'Level 7' },
      {
        checkFor: 'frameType',
        val: 'synchro',
        imgPath: './images/synchro.png',
        text: 'Synchro',
      },
    ],
  },
};
const currentGridId = 1;
const gridSize = 3;
let numCorrect = 0;
let guesses = 0;
let completedSquares = 0;
const $topCategories = document.querySelectorAll('.top-cat');
if (!$topCategories) throw new Error('.top-cat query failed!');
const $leftCategories = document.querySelectorAll('.left-cat');
if (!$leftCategories) throw new Error('left-cat query failed!');
function renderGridCategories(gridID) {
  for (let i = 0; i < gridSize; i++) {
    const imgContainerTop = document.createElement('div');
    imgContainerTop.classList.add('w-1/2', 'h-1/2', 'flex', 'justify-center');
    const catImgTop = document.createElement('img');
    catImgTop.setAttribute(
      'src',
      categorySets[gridID].topCategories[i].imgPath,
    );
    imgContainerTop.appendChild(catImgTop);
    $topCategories[i].appendChild(imgContainerTop);
    const catText = document.createElement('h1');
    catText.textContent = categorySets[gridID].topCategories[i].text;
    $topCategories[i].appendChild(catText);
    const imgContainerLeft = document.createElement('div');
    imgContainerLeft.classList.add('w-1/2', 'h-1/2', 'flex', 'justify-center');
    const catImgLeft = document.createElement('img');
    catImgLeft.setAttribute(
      'src',
      categorySets[gridID].leftCategories[i].imgPath,
    );
    imgContainerLeft.appendChild(catImgLeft);
    $leftCategories[i].appendChild(imgContainerLeft);
    const catTextLeft = document.createElement('h1');
    catTextLeft.textContent = categorySets[gridID].leftCategories[i].text;
    $leftCategories[i].appendChild(catTextLeft);
  }
} // function that renders Grid Categories based on what number Grid
renderGridCategories(currentGridId);
const $gridContainer = document.querySelector('.grid-container');
if (!$gridContainer) throw new Error('.grid-container query failed!');
const $modal = document.querySelector('.modal');
if (!$modal) throw new Error('.modal query failed!');
const $input = document.querySelector('input');
if (!$input) throw new Error('input query failed');
$gridContainer.addEventListener('click', function (event) {
  const element = event.target;
  if (
    element.classList.contains('game-square') &&
    !element.classList.contains('correct') &&
    !element.classList.contains('wrong')
  ) {
    $modal.show();
    element.classList.add('bg-yellow-500', 'selected-sq');
  }
});
$modal.addEventListener('click', function (event) {
  const element = event.target;
  const $selectedSq = document.querySelector('.selected-sq');
  if (!$selectedSq) throw new Error('.selected-sq query failed!');
  if (element.tagName !== 'BUTTON' && element.tagName !== 'INPUT') {
    clearSelectedSqResetModal($selectedSq);
  }
});
const $form = document.querySelector('form');
if (!$form) throw new Error('form query failed!');
$form.addEventListener('submit', function (event) {
  event.preventDefault();
  const $selectedSq = document.querySelector('.selected-sq');
  if (!$selectedSq) throw new Error('.selected-sq query failed!');
  const usrInput = $input.value;
  fetchData(usrInput);
});
async function fetchData(usrInput) {
  try {
    const $selectedSq = document.querySelector('.selected-sq');
    if (!$selectedSq) throw new Error('.selected-sq query failed!');
    const rowCatNdxStr = $selectedSq.getAttribute('id')?.charAt(4);
    const rowCatNdx = parseInt(rowCatNdxStr);
    const rowCatCheckFor =
      categorySets[currentGridId].leftCategories[rowCatNdx].checkFor;
    const rowCatVal = categorySets[currentGridId].leftCategories[rowCatNdx].val;
    const colCatNdxStr = $selectedSq.getAttribute('id')?.charAt(6);
    const colCatNdx = parseInt(colCatNdxStr);
    const colCatCheckFor =
      categorySets[currentGridId].topCategories[colCatNdx].checkFor;
    const colCatVal = categorySets[currentGridId].topCategories[colCatNdx].val;
    const apiUrl =
      'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' +
      usrInput.replace(/\s/g, '%20');
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const card = await response.json();
    const cardData = card.data[0];
    if (
      cardData[rowCatCheckFor] === rowCatVal &&
      cardData[colCatCheckFor] === colCatVal
    ) {
      const monsterImgContainer = document.createElement('div');
      monsterImgContainer.classList.add(
        'h-11/12',
        'w-11/12',
        'flex',
        'justify-center',
      );
      const monsterImg = document.createElement('img');
      monsterImg.setAttribute('src', cardData.card_images[0].image_url_cropped);
      monsterImgContainer.appendChild(monsterImg);
      $selectedSq.appendChild(monsterImgContainer);
      $selectedSq.classList.add('bg-green-500', 'correct');
      $selectedSq.classList.remove('hover:bg-yellow-100');
      numCorrect++;
      guesses++;
      completedSquares++;
      clearSelectedSqResetModal($selectedSq);
    } else {
      guesses++;
      completedSquares++;
      $selectedSq.classList.add('bg-red-500', 'wrong');
      $selectedSq.classList.remove('hover:bg-yellow-100');
      clearSelectedSqResetModal($selectedSq);
    }
    if (completedSquares === gridSize * gridSize && $statsModal) {
      setStatsText();
      $statsModal.show();
    }
  } catch (error) {
    console.error('Error: ', error);
  }
}
const $statsModal = document.querySelector('.stats');
if (!$statsModal) throw new Error('.stats query failed!');
const $statsButton = document.querySelector('.stats-button');
if (!$statsButton) throw new Error('.stats-button query failed!');
const $statsHeading = document.querySelector('.stats-heading');
if (!$statsHeading) throw new Error('.stats-heading query failed');
$statsButton.addEventListener('click', function () {
  setStatsText();
  $statsModal.show();
});
$statsModal.addEventListener('click', function (event) {
  const element = event.target;
  if (!element.classList.contains('main-content')) {
    $statsModal.close();
  }
});
const $guessesTxt = document.querySelector('.guesses-text');
if (!$guessesTxt) throw new Error('.guesses-text query failed!');
const $correctTxt = document.querySelector('.correct-text');
if (!$correctTxt) throw new Error('.correct-text query failed!');
const $accuracyTxt = document.querySelector('.accuracy-text');
if (!$accuracyTxt) throw new Error('.accuracy-text query failed!');
setStatsText();
function setStatsText() {
  $guessesTxt.textContent = guesses.toString();
  $correctTxt.textContent = numCorrect.toString();
  if (!(numCorrect / guesses)) {
    $accuracyTxt.textContent = '0%';
  } else {
    $accuracyTxt.textContent =
      Math.floor((numCorrect / guesses) * 100).toString() + '%';
  }
  if (completedSquares === gridSize * gridSize && $statsModal) {
    if (numCorrect / guesses === 1) {
      $statsHeading.textContent = 'Perfect!';
    } else if (numCorrect / guesses >= 0.66) {
      $statsHeading.textContent = 'Nice Work!';
    } else if (numCorrect / guesses === 0) {
      $statsHeading.textContent = 'Bad Luck!';
    } else {
      $statsHeading.textContent = 'Room To Improve!';
    }
  }
}
function clearSelectedSqResetModal(sq) {
  sq.classList.remove('bg-yellow-500', 'selected-sq');
  $input.value = '';
  $modal.close();
}
const $gameSquares = document.querySelectorAll('.game-square');
if (!$gameSquares) throw new Error('.game-square query failed!');
const $clearButton = document.querySelector('.clear-button');
if (!$clearButton) throw new Error('.clear button query failed!');
$clearButton.addEventListener('click', function () {
  clearGrid();
});
function clearGrid() {
  guesses = 0;
  numCorrect = 0;
  completedSquares = 0;
  setStatsText();
  $statsHeading.textContent = 'Stats';
  for (let i = 0; i < $gameSquares.length; i++) {
    const element = $gameSquares[i];
    $gameSquares[i].classList.remove(
      'bg-green-500',
      'bg-red-500',
      'wrong',
      'correct',
    );
    $gameSquares[i].classList.add('hover:bg-yellow-100');
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }
}
