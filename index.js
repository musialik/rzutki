const formComponent = document.querySelector('[data-component="gameSetupForm"]')
const form = formComponent.querySelector('form');
const interfaceComponent = document.querySelector('[data-component="gameInterface"');

let gameSettings = {
  playerCount: 2,
  legCount: 3,
  setCount: 2
}

// Display defaults

document.querySelectorAll('[data-game-setting]').forEach(el => {
  el.textContent = `(${gameSettings[el.dataset.gameSetting]})`;
})

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
})

// Functions

function changeGameSetting(name, value) {
  gameSettings[name] = value;
  document.querySelectorAll('[data-game-setting]').forEach(el => {
    el.textContent = `(${gameSettings[el.dataset.gameSetting]})`;
  });

  if (name === "playerCount") {
    resetPlayerNameInputs();
    renderPlayerNameInputs();
  }
}

function renderPlayerNameInputs() {
  const playerNameFormTemplate = form.querySelector("[data-form-template]");
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
