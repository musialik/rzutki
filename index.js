const formComponent = document.querySelector('[data-component="gameSetupForm"]')
const form = formComponent.querySelector('form');
const interfaceComponent = document.querySelector('[data-component="gameInterface"');

// templates
const playerRowTemplate = document.querySelector('[data-template="playerRow"]');
const playerNameFormTemplate = form.querySelector("[data-template]");

let gameSettings = {
  playerCount: 2,
  legCount: 3,
  setCount: 2,
  playerName0: "Michał",
  playerName1: "Łukasz"
}

let gameState = {
  roundNumber: 1,
  players: [],
  currentPlayer: 0,
  throwsLeft: 3
}

// Display defaults

renderGameSettings();

form.querySelector('[name="playerCount"]').value = gameSettings.playerCount
form.querySelector('[name="legCount"]').value = gameSettings.legCount
form.querySelector('[name="setCount"]').value = gameSettings.setCount

// Setup form

form.addEventListener('change', e => {
  if (e.target.name) {
    changeGameSetting(e.target.name, e.target.value);
  } else {
    console.error("Input must have a name!", e.target);
  }
});

renderPlayerNameInputs();

const submitButton = form.querySelector('button[type="submit"]');
form.addEventListener('submit', e => {
  e.preventDefault();
  formComponent.classList.add("d-none");
  interfaceComponent.classList.remove("d-none");
  startGame();
  renderGameState();
})

// Setup game controls

interfaceComponent.querySelectorAll('[data-score]').forEach(el => {
  el.addEventListener('click', e => {
    processThrow(el.dataset);
    renderGameState();
  })
})

// Functions

function changeGameSetting(name, value) {
  gameSettings[name] = value;
  renderGameSettings();

  if (name === "playerCount") {
    resetPlayerNameInputs();
    renderPlayerNameInputs();
  }
}

function renderGameSettings() {
  document.querySelectorAll('[data-game-setting]').forEach(el => {
    el.textContent = gameSettings[el.dataset.gameSetting];
  });
}

function renderPlayerNameInputs() {
  for (let playerNumber = gameSettings.playerCount - 1; playerNumber >= 0; playerNumber--) {
    const playerInput = playerNameFormTemplate.cloneNode(true);
    playerInput.querySelector('input').name = `playerName${playerNumber}`;
    if (gameSettings[`playerName${playerNumber}`]) {
      playerInput.querySelector('input').value = gameSettings[`playerName${playerNumber}`];
    }
    playerInput.classList.remove("d-none");
    playerNameFormTemplate.after(playerInput);
  }
}

function resetPlayerNameInputs() {
  form.querySelectorAll('[name^="playerName"]').forEach(el => {
    el.parentElement.removeChild(el);
  });
}

function renderGameState() {
  interfaceComponent.querySelector('table tbody').innerHTML = "";
  document.querySelectorAll('[data-game-state]').forEach(el => {
    el.textContent = gameState[el.dataset.gameState];
  });

  for (let playerNumber = 0; playerNumber < gameSettings.playerCount; playerNumber++) {
    const playerRow = playerRowTemplate.cloneNode(true);
    const playerState = gameState.players[playerNumber];
    if (gameState.currentPlayer === playerNumber) {
      playerRow.querySelector('[data-template-value="name"]').textContent = `${playerState.name} ${"*".repeat(gameState.throwsLeft)}`;
    } else {
      playerRow.querySelector('[data-template-value="name"]').textContent = playerState.name;
    }
    playerRow.querySelector('[data-template-value="sets"]').textContent = playerState.sets;
    playerRow.querySelector('[data-template-value="legs"]').textContent = playerState.legs;
    playerRow.querySelector('[data-template-value="points"]').textContent = playerState.points;
    playerRow.classList.remove('d-none');
    if (gameState.currentPlayer !== playerNumber) {
      playerRow.classList.remove('table-primary');
    }
    interfaceComponent.querySelector('table tbody').appendChild(playerRow);
  }
}

function startGame() {
  for (let playerNumber = 0; playerNumber < gameSettings.playerCount; playerNumber++) {
    gameState.players.push({
      name: gameSettings[`playerName${playerNumber}`],
      sets: 0,
      legs: 0,
      points: 501
    })
  }
}

function processThrow(dataset) {
  let { score, scoreMultiplier } = dataset;
  const player = gameState.players[gameState.currentPlayer];

  gameState.throwsLeft -= 1;

  if (score !== "miss") {
    score = Number(score);
    scoreMultiplier = Number(scoreMultiplier) || 1;
    totalScore = score * scoreMultiplier;

    if (player.points - totalScore >= 0) {
      player.points -= totalScore;
    } else {
      gameState.throwsLeft = 0;
    }
  }

  if (player.points === 0) {
    finishLeg();

    if (player.legs === gameSettings.legCount) {
      finishSet();
      
      if (player.sets === gameSettings.setCount) {
        finishGame();
      }
    } else {
      finishRound();
    }
  } else if (gameState.throwsLeft === 0) {
    finishRound();
  }
}

function finishLeg() {
  const player = gameState.players[gameState.currentPlayer];
  player.legs += 1;
  gameState.players.forEach(player => player.points = 501);
}

function finishRound() {
  gameState.throwsLeft = 3;
  gameState.currentPlayer += 1;
  if (gameState.currentPlayer > gameSettings.playerCount - 1) {
    gameState.currentPlayer = 0;
  }
}

function finishSet() {
  const player = gameState.players[gameState.currentPlayer];
  player.sets += 1;
  player.legs = 0;
}

function finishGame() {
  const player = gameState.players[gameState.currentPlayer];
  interfaceComponent.classList.add('d-none');
  document.querySelector('body').innerHTML = `<h1>The winner is ${player.name}</h1>`
}