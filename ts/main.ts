interface Category {
  checkFor: string;
  val: string | number;
  imgPath: string;
  text: string;
}

interface CategorySet {
  topCategories: Category[];
  leftCategories: Category[];
}

const categorySets: Record<string, CategorySet> = {
  '1': {
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
  '2': {
    topCategories: [
      {
        checkFor: 'race',
        val: 'Spellcaster',
        imgPath: './images/spellcaster.png',
        text: 'Spellcaster',
      },
      {
        checkFor: 'atk',
        val: 2400,
        imgPath: './images/ATK.png',
        text: '2400 ATK',
      },
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
      {
        checkFor: 'level',
        val: 7,
        imgPath: './images/levelstar.png',
        text: 'Level 7',
      },
      {
        checkFor: 'frameType',
        val: 'synchro',
        imgPath: './images/synchro.png',
        text: 'Synchro',
      },
    ],
  },
  '3': {
    topCategories: [
      {
        checkFor: 'frameType',
        val: 'effect',
        imgPath: './images/effect.png',
        text: 'Effect',
      },
      {
        checkFor: 'frameType',
        val: 'normal',
        imgPath: './images/normal.png',
        text: 'Normal',
      },
      {
        checkFor: 'race',
        val: 'Dragon',
        imgPath: './images/dragon.png',
        text: 'Dragon',
      },
    ],
    leftCategories: [
      {
        checkFor: 'attribute',
        val: 'LIGHT',
        imgPath: './images/LIGHT.png',
        text: 'LIGHT',
      },
      {
        checkFor: 'level',
        val: 7,
        imgPath: './images/levelstar.png',
        text: 'Level 7',
      },
      {
        checkFor: 'atk',
        val: 2400,
        imgPath: './images/ATK.png',
        text: '2400 ATK',
      },
    ],
  },
};

const $gridIDLabel = document.querySelector('.grid-ID-label') as HTMLDivElement;
if (!$gridIDLabel) throw new Error('.grid-ID-label query failed!');

let currentGridId: number = 3;
const gridSize: number = 3;

let numCorrect: number = 0;
let guesses: number = 0;
let completedSquares: number = 0;
let currentMonsters: string[] = [];

$gridIDLabel.textContent = `#${currentGridId.toString()}`;

const $topCategories = document.querySelectorAll(
  '.top-cat',
) as NodeListOf<HTMLDivElement>;
if (!$topCategories) throw new Error('.top-cat query failed!');
const $leftCategories = document.querySelectorAll(
  '.left-cat',
) as NodeListOf<HTMLDivElement>;
if (!$leftCategories) throw new Error('left-cat query failed!');

function renderGridCategories(gridID: number): void {
  for (let i = 0; i < gridSize; i++) {
    const imgContainerTop: HTMLDivElement = document.createElement('div');
    imgContainerTop.classList.add('w-1/2', 'h-1/2', 'flex', 'justify-center');
    const catImgTop: HTMLImageElement = document.createElement('img');
    catImgTop.setAttribute(
      'src',
      categorySets[gridID].topCategories[i].imgPath,
    );
    imgContainerTop.appendChild(catImgTop);
    $topCategories[i].appendChild(imgContainerTop);
    const catText: HTMLHeadingElement = document.createElement('h1');
    catText.textContent = categorySets[gridID].topCategories[i].text;
    $topCategories[i].appendChild(catText);

    const imgContainerLeft: HTMLDivElement = document.createElement('div');
    imgContainerLeft.classList.add('w-1/2', 'h-1/2', 'flex', 'justify-center');
    const catImgLeft: HTMLImageElement = document.createElement('img');
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

const $gridContainer = document.querySelector(
  '.grid-container',
) as HTMLDivElement;
if (!$gridContainer) throw new Error('.grid-container query failed!');
const $modal = document.querySelector('.modal') as HTMLDialogElement;
if (!$modal) throw new Error('.modal query failed!');
const $input = document.querySelector('input') as HTMLInputElement;
if (!$input) throw new Error('input query failed');

$gridContainer.addEventListener('click', function (event: Event) {
  const element = event.target as HTMLElement;
  if (
    element.classList.contains('game-square') &&
    !element.classList.contains('correct') &&
    !element.classList.contains('wrong')
  ) {
    $modal.show();
    element.classList.add('bg-yellow-500', 'selected-sq');
  }
});

$modal.addEventListener('click', function (event: Event) {
  const element = event.target as HTMLElement;
  const $selectedSq = document.querySelector('.selected-sq') as HTMLDivElement;
  if (!$selectedSq) throw new Error('.selected-sq query failed!');

  if (element.tagName !== 'BUTTON' && element.tagName !== 'INPUT') {
    clearSelectedSqResetModal($selectedSq);
  }
});

const $form = document.querySelector('form') as HTMLFormElement;
if (!$form) throw new Error('form query failed!');

$form.addEventListener('submit', function (event: Event) {
  event.preventDefault();
  const $selectedSq = document.querySelector('.selected-sq') as HTMLDivElement;
  if (!$selectedSq) throw new Error('.selected-sq query failed!');
  const usrInput: string = $input.value;

  fetchData(usrInput);
});

interface MiscInfo {
  downvotes: number;
  formats: string[];
  has_effect: number;
  konami_id: number;
  md_rarity: string;
  ocg_date: string;
  tcg_date: string;
  treated_as: string;
  upvotes: number;
  views: number;
  viewsweek: number;
}

interface ImageURLObj {
  id: number;
  image_url: string;
  image_url_small: string;
  image_url_cropped: string;
}

interface PricesObj {
  cardmarket_price: string;
  tcgplayer_price: string;
  ebay_price: string;
  amazon_price: string;
  coolstuffinc_price: string;
}

interface SetsObj {
  set_name: string;
  set_code: string;
  set_rarity: string;
  set_rarity_code: string;
  set_price: string;
}

interface Data {
  archetype: string;
  atk: number;
  attribute: string;
  card_images: ImageURLObj[];
  card_prices: PricesObj[];
  card_sets: SetsObj[];
  desc: string;
  frameType: string;
  id: number;
  linkmarkers: string[];
  linkval: number;
  misc_info: MiscInfo[];
  name: string;
  race: string;
  type: string;
  ygoprodeck_url: string;
}
interface Card {
  data: Data[];
}

async function fetchData(usrInput: string): Promise<void> {
  try {
    const $selectedSq = document.querySelector(
      '.selected-sq',
    ) as HTMLDivElement;
    if (!$selectedSq) throw new Error('.selected-sq query failed!');

    const rowCatNdxStr: string = $selectedSq
      .getAttribute('id')
      ?.charAt(4) as string;
    const rowCatNdx: number = parseInt(rowCatNdxStr);
    const rowCatCheckFor = categorySets[currentGridId].leftCategories[rowCatNdx]
      .checkFor as keyof Data;
    const rowCatVal: number | string =
      categorySets[currentGridId].leftCategories[rowCatNdx].val;

    const colCatNdxStr: string = $selectedSq
      .getAttribute('id')
      ?.charAt(6) as string;
    const colCatNdx: number = parseInt(colCatNdxStr);
    const colCatCheckFor = categorySets[currentGridId].topCategories[colCatNdx]
      .checkFor as keyof Data;
    const colCatVal: number | string =
      categorySets[currentGridId].topCategories[colCatNdx].val;

    const apiUrl: string =
      'https://db.ygoprodeck.com/api/v7/cardinfo.php?name=' +
      usrInput.replace(/\s/g, '%20');
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const card = (await response.json()) as Card;
    const cardData: Data = card.data[0];

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
      currentMonsters.push(cardData.name.toLowerCase());

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

const $statsModal = document.querySelector('.stats') as HTMLDialogElement;
if (!$statsModal) throw new Error('.stats query failed!');
const $statsButton = document.querySelector('.stats-button');
if (!$statsButton) throw new Error('.stats-button query failed!');
const $statsHeading = document.querySelector(
  '.stats-heading',
) as HTMLHeadingElement;
if (!$statsHeading) throw new Error('.stats-heading query failed');

$statsButton.addEventListener('click', function () {
  setStatsText();
  $statsModal.show();
});

$statsModal.addEventListener('click', function (event: Event) {
  const element = event.target as HTMLElement;

  if (!element.classList.contains('main-content')) {
    $statsModal.close();
  }
});

const $guessesTxt = document.querySelector(
  '.guesses-text',
) as HTMLHeadingElement;
if (!$guessesTxt) throw new Error('.guesses-text query failed!');
const $correctTxt = document.querySelector(
  '.correct-text',
) as HTMLHeadingElement;
if (!$correctTxt) throw new Error('.correct-text query failed!');
const $accuracyTxt = document.querySelector(
  '.accuracy-text',
) as HTMLHeadingElement;
if (!$accuracyTxt) throw new Error('.accuracy-text query failed!');
setStatsText();

function setStatsText(): void {
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

function clearSelectedSqResetModal(sq: HTMLDivElement): void {
  sq.classList.remove('bg-yellow-500', 'selected-sq');
  $input.value = '';
  $modal.close();
}

const $gameSquares = document.querySelectorAll(
  '.game-square',
) as NodeListOf<HTMLDivElement>;
if (!$gameSquares) throw new Error('.game-square query failed!');
const $clearButton = document.querySelector('.clear-button');
if (!$clearButton) throw new Error('.clear button query failed!');

$clearButton.addEventListener('click', function () {
  clearGrid();
});

function clearGrid(): void {
  guesses = 0;
  numCorrect = 0;
  completedSquares = 0;
  currentMonsters = [];
  setStatsText();
  $statsHeading.textContent = 'Stats';

  for (let i = 0; i < $gameSquares.length; i++) {
    const element = $gameSquares[i] as HTMLElement;
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

const $switcher = document.querySelector('.switcher-square') as HTMLDivElement;
if (!$switcher) throw new Error('.switcher-square query failed!');
const $categoryModal = document.querySelector(
  '.grid-cats',
) as HTMLDialogElement;
if (!$categoryModal) throw new Error('.grid-cats query failed!');
const $gridSetsContainer = document.querySelector(
  '.grid-sets-container',
) as HTMLDivElement;
if (!$gridContainer) throw new Error('.grid-sets-container query failed!');

$switcher.addEventListener('click', function (): void {
  $categoryModal.show();
});

function renderRow(dataGridId: number): HTMLDivElement {
  const gridRow = document.createElement('div');
  gridRow.classList.add(
    'flex',
    'py-1',
    'ml-2',
    'rounded-xl',
    'hover:bg-yellow-200',
    'main-content',
    'select-grid',
  );
  // create row
  if (currentGridId === dataGridId) {
    gridRow.classList.add('bg-yellow-500', 'selected-grid-cat-row');
    gridRow.classList.remove('hover:bg-yellow-200');
  }

  const imgContainer = document.createElement('div');
  imgContainer.classList.add('w-1/12', 'main-content');
  const puzzImg = document.createElement('img');
  puzzImg.setAttribute('src', './images/puzzle.png');
  puzzImg.classList.add('main-content');
  imgContainer.appendChild(puzzImg);
  // create image container containing image

  const gridRowTxt = document.createElement('h1');
  gridRowTxt.textContent = `Grid #${dataGridId}`;
  gridRowTxt.classList.add('main-content');

  gridRow.appendChild(imgContainer);
  gridRow.appendChild(gridRowTxt);

  return gridRow;
}

for (const categorySet in categorySets) {
  const gridCatRow = renderRow(parseInt(categorySet));
  gridCatRow.setAttribute('data-grid-ID', categorySet);
  $gridSetsContainer.appendChild(gridCatRow);
}

$categoryModal.addEventListener('click', function (event: Event): void {
  const element = event.target as HTMLElement;
  const closestCatRow = element.closest('.select-grid') as HTMLElement;

  const $selectedRow = document.querySelector(
    '.selected-grid-cat-row',
  ) as HTMLDivElement;
  if (!$selectedRow) throw new Error('.selected-grid-cat-row query failed!');

  if (
    !element.classList.contains('main-content') ||
    closestCatRow.classList.contains('selected-grid-cat-row')
  ) {
    $categoryModal.close();
  } else if (
    element.tagName === 'IMG' ||
    element.tagName === 'H1' ||
    element.tagName === 'DIV'
  ) {
    const closestGridId = closestCatRow.getAttribute('data-grid-ID');
    if (!closestGridId) throw new Error('No grid ID found');

    newGridCategories(parseInt(closestGridId));

    $selectedRow.classList.remove('bg-yellow-500', 'selected-grid-cat-row');
    $selectedRow.classList.add('hover:bg-yellow-200');

    closestCatRow.classList.add('selected-grid-cat-row', 'bg-yellow-500');
    closestCatRow.classList.remove('hover:bg-yellow-200');
    $categoryModal.close();
  }
});

function newGridCategories(newGridId: number): void {
  clearGrid();
  currentGridId = newGridId;
  $gridIDLabel.textContent = '#' + currentGridId.toString();

  for (let i = 0; i < gridSize; i++) {
    const topCatElement = $topCategories[i] as HTMLElement;
    const leftCatElement = $leftCategories[i] as HTMLElement;
    while (topCatElement.firstChild) {
      topCatElement.removeChild(topCatElement.firstChild);
    }
    while (leftCatElement.firstChild) {
      leftCatElement.removeChild(leftCatElement.firstChild);
    }
  }

  renderGridCategories(newGridId);
}
