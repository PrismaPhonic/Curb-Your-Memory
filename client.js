let gameData = {
  score: 0,
  max: 2,
  matched: new Set(),
  clickedCards: new Set()
};

let view = {
  faces: [],
  randomRange: function (end) {
    let randRange = new Set();
    while (randRange.size < end) {
      randRange.add(Math.floor(Math.random() * Math.floor(end)));
    }
    return randRange;
  },
  faceRandom: function () {
    this.faces = [...this.randomRange(8), ...this.randomRange(8)].map(
      e => (e = 'curb' + e.toString() + '.gif'));
  },
  loadFaces: function (faces) {
    document.getElementById('cardgame').innerHTML = '';
    let ids = [],
      j = 0;
    let faceLot = faces.slice();
    while (faceLot.length > 0) {
      let faceRow = document.createElement('div');
      faceRow.setAttribute('class', 'face-row');

      for (let i = 0; i < 4; i++) {
        let face = faceLot.shift();

        let id = face.match(/\d/).toString();
        if (ids.includes(id)) {
          ids.push('match' + id);
        } else {
          ids.push(id);
        }

        let scene = document.createElement('div');
        scene.setAttribute('class', 'scene');

        let cardFront = document.createElement('div');
        cardFront.setAttribute('class', 'card__face card__face--front');

        let cardBack = document.createElement('div');
        cardBack.setAttribute('class', 'card__face card__face--back');
        cardBack.style.backgroundImage = `url('cards/${face}')`;

        let card = document.createElement('div');
        card.setAttribute('class', 'card');

        card.setAttribute('id', ids[j]);
        card.setAttribute('onclick', `activity.flipCard('${ids[j]}')`);

        card.appendChild(cardFront);
        card.appendChild(cardBack);
        scene.appendChild(card);
        faceRow.appendChild(scene);
        j++;
      }
      document.getElementById('cardgame').appendChild(faceRow);
    }
  },
  newGame: function () {
    this.faceRandom();
    this.loadFaces(this.faces);
    gameData.score = 0;
    let scoreHeader = document.getElementById('scoreNum');
    scoreHeader.innerText = gameData.score;
    gameData.max = 2;
  }
};

let activity = {
  flippedCount: function () {
    return document.querySelectorAll('.is-flipped').length;
  },
  flipCard: function (id) {
    if (this.flippedCount() < gameData.max) {
      let card = document.getElementById(id);
      card.classList.toggle('is-flipped');
      this.counter(id);
      if (this.flippedCount() === gameData.max) {
        setTimeout(this.matchCheck, 2000);
      }
    }
  },
  counter: function (id) {
    if (!gameData.clickedCards.has(id)) {
      gameData.score++;
      gameData.clickedCards.add(id);
    }
    let scoreHeader = document.getElementById('scoreNum');
    scoreHeader.innerText = gameData.score;
  },
  matchCheck: function () {
    let nowFlipped = document.querySelectorAll('.is-flipped');
    let newPair =
      (nowFlipped.length > 2)
        ? Array.from(nowFlipped).filter(e => !(gameData.matched.has(e.id)))
        : Array.from(nowFlipped);
    if (!(newPair[0].id.match(/\d/)[0] === newPair[1].id.match(/\d/)[0])) {
      newPair[0].classList.toggle('is-flipped');
      newPair[1].classList.toggle('is-flipped');
    } else {
      gameData.matched.add(newPair[0].id);
      gameData.matched.add(newPair[1].id);
      gameData.max += 2;
    }
  }
}
