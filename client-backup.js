let clickedCards = new Set();
let score = 0;
let max = 2;
//successful matches, protected from flipping back
let matched = new Set();
let newPair;

let view = {
  faces: [];
  randomRange: function (end) {
    let randRange = new Set();
    while (randRange.size < end) {
      randRange.add(Math.floor(Math.random() * Math.floor(end)));
    }
    return randRange;
  },
  faceRandom: function () {
    [this.faces, ...this.randomRange(8), ...this.randomRange(8)].map(
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
        card.setAttribute('onclick', `flipCard('${ids[j]}')`);

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
  }
}

view.newGame();

function flipCard(id) {
  if (flippedCount() < max) {
    let card = document.getElementById(id);
    card.classList.toggle('is-flipped');
    counter(id);
    if (flippedCount() === max) {
      setTimeout(matchCheck, 2000);
    }
  }
}

function flippedCount() {
  return document.querySelectorAll('.is-flipped').length;
}

function counter(id) {
  if (!clickedCards.has(id)) {
    score++;
    clickedCards.add(id);
  }
  let scoreHeader = document.getElementById('scoreNum');
  scoreHeader.innerText = score;
}

function matchCheck() {
  let nowFlipped = document.querySelectorAll('.is-flipped');
  newPair =
    (nowFlipped.length > 2)
      ? Array.from(nowFlipped).filter(e => !(matched.has(e.id)))
      : Array.from(nowFlipped);
  if (!(newPair[0].id.match(/\d/)[0] === newPair[1].id.match(/\d/)[0])) {
    newPair[0].classList.toggle('is-flipped');
    newPair[1].classList.toggle('is-flipped');
  } else {
    matched.add(newPair[0].id);
    matched.add(newPair[1].id);
    max += 2;
  }
}
