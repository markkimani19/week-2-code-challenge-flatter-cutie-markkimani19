const baseUrl = 'http://localhost:3000/characters';

document.addEventListener('DOMContentLoaded', function () {
  const characterBar = document.getElementById('character-bar');
  const nameElement = document.getElementById('name');
  const imageElement = document.getElementById('image');
  const voteCountElement = document.getElementById('vote-count');
  const votesForm = document.getElementById('votes-form');
  const resetButton = document.getElementById('reset-btn');
  const characterForm = document.getElementById('character-form');

  fetch(baseUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (characters) {
      characters.forEach(function (character) {
        const span = document.createElement('span');
        span.textContent = character.name;

        span.addEventListener('click', function () {
          nameElement.textContent = character.name;
          imageElement.src = character.image;
          imageElement.alt = character.name;
          voteCountElement.textContent = character.votes;

          votesForm.onsubmit = function (event) {
            event.preventDefault();
            const votesInput = document.getElementById('votes');
            const additionalVotes = parseInt(votesInput.value) || 0;
            character.votes += additionalVotes;
            voteCountElement.textContent = character.votes;
            votesInput.value = '';

            fetch(`${baseUrl}/${character.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ votes: character.votes })
            });
          };

          resetButton.onclick = function () {
            character.votes = 0;
            voteCountElement.textContent = character.votes;

            fetch(`${baseUrl}/${character.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ votes: 0 })
            });
          };
        });

        characterBar.appendChild(span);
      });
    });
  characterForm.onsubmit = function (event) {
    event.preventDefault();
    const nameInput = document.getElementById('name');
    const imageUrlInput = document.getElementById('image-url');

    const newCharacter = {
      name: nameInput.value,
      image: imageUrlInput.value,
      votes: 0
    };

    fetch(baseUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCharacter)
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (savedCharacter) {
        const span = document.createElement('span');
        span.textContent = savedCharacter.name;

        span.addEventListener('click', function () {
          nameElement.textContent = savedCharacter.name;
          imageElement.src = savedCharacter.image;
          imageElement.alt = savedCharacter.name;
          voteCountElement.textContent = savedCharacter.votes;
        });

        characterBar.appendChild(span);

        nameElement.textContent = savedCharacter.name;
        imageElement.src = savedCharacter.image;
        imageElement.alt = savedCharacter.name;
        voteCountElement.textContent = savedCharacter.votes;
      });

    nameInput.value = '';
    imageUrlInput.value = '';
  };
});