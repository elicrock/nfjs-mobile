const score = document.querySelector('.score'),
      start = document.querySelector('.start'),
      gameArea = document.querySelector('.gameArea'),
      car = document.createElement('div');
      // music = document.createElement('embed'); для подключения музыки

      
const audio = new Audio('./audio.mp3'),
      crash = new Audio('./crash.mp3');
let allow = false;
audio.volume = 0.1;
audio.loop = true;
crash.volume = 0.2;
audio.addEventListener('loadeddata', () => {
  allow = true;
});

// так можно подлкючить музыку другим способом с упправлением
// music.setAttribute('src', './audio.mp3');
// music.setAttribute('type', 'audio/mp3');
// music.classList.add('music');

car.classList.add('car');



start.addEventListener('click', startGame);

document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowRight: false,
  ArrowLeft: false
};

const setting = {
  start: false,
  score: 0,
  speed: 5,
  traffic: 3,
  level: 0
};

function gerQuantityElements(heightElement) {
  return Math.ceil(gameArea.offsetHeight / heightElement) + 1;  
}

function startGame(event) {

  if(event.target.classList.contains('start')) {
    return;
  } 
  if (event.target.classList.contains('easy')) {
    setting.speed = 3;
    setting.traffic = 3;
  }
  if (event.target.classList.contains('medium')) {
    setting.speed = 5;
    setting.traffic = 3;
  }
  if (event.target.classList.contains('hard')) {
    setting.speed = 7;
    setting.traffic = 2;
  }

  start.classList.add('hide');
  gameArea.innerHTML = `
    <div class="buttons-group">
      <div class="buttons-group__right">
        <div class="forward">&#9650;</div>
        <div class="back">&#9660;</div>
      </div>
      <div class="buttons-group__left">
        <div class="left">&#9668;</div>
        <div class="right">&#9658;</div>
      </div>
    </div>`;
  for (let i = 0; i < gerQuantityElements(100); i++) {
    const line = document.createElement('div');
    line.classList.add('line');
    line.style.top = (i * 100) + 'px';
    line.y = i * 100;
    gameArea.appendChild(line);
  }

  for (let i = 0; i < gerQuantityElements(100 * setting.traffic); i++) {
    const enemy = document.createElement('div');
    let enemyImg = Math.floor(Math.random() * 4) + 1;
    enemy.classList.add('enemy');
    enemy.y = -100 * setting.traffic * (i + 1);
    enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
    enemy.style.top = enemy.y + 'px';
    enemy.style.background = `transparent url('./img/enemy${enemyImg}.png') center / cover no-repeat`;
    gameArea.appendChild(enemy);
  }
  
  if (allow) {
    audio.play();
  }
  
  setting.score = 0;
  setting.start = true;
  gameArea.appendChild(car);
  car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2;
  car.style.top = 'auto';
  car.style.bottom = '10px';
  // gameArea.appendChild(music); так тоже можно запустить музыку
  setting.x = car.offsetLeft;
  setting.y = car.offsetTop;
  requestAnimationFrame(playGame);
}

function playGame() {
  
  if (setting.score > 2000 && setting.level === 0) {
    ++setting.speed;
    ++setting.level;
  } else if(setting.score > 3000 && setting.level === 1) {
    ++setting.speed;
    ++setting.level;
  } else if (setting.score > 5000 && setting.level === 2){
    ++setting.speed;
    ++setting.level;
  } else if (setting.score > 10000 && setting.level === 3){
    ++setting.speed;
    ++setting.level;
  } else if (setting.score > 15000 && setting.level === 4){
    ++setting.speed;
    ++setting.level;
  }

  setting.score += setting.speed;
  score.innerHTML = `Score<br>${setting.score}`;
  moveRoad();
  moveEnemy();
  if (keys.ArrowLeft && setting.x > 0) {
    setting.x -= setting.speed;
  }
  if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
    setting.x += setting.speed;
  }
  if (keys.ArrowUp && setting.y > 0) {
    setting.y -= setting.speed;
  }
  if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
    setting.y += setting.speed;
  }
  car.style.left = setting.x + 'px';
  car.style.top = setting.y + 'px';

  if (setting.start) {
    requestAnimationFrame(playGame);
  }
  // else {
  //   music.remove(); для отмены музыки, второй способ
  // }
}

function startRun(event) {
  event.preventDefault();
  if (event.key in keys) {
    keys[event.key] = true;
  }
}

function stopRun(event) {
  event.preventDefault();
  if (event.key in keys) {
    keys[event.key] = false;
  }
}

function moveRoad() {
  let lines = document.querySelectorAll('.line');
  lines.forEach(function(line) {
    line.y += setting.speed;
    line.style.top = line.y + 'px';
    if (line.y >= gameArea.offsetHeight) {
      line.y = -100;
    }
  });
}

function moveEnemy() {
  let enemy = document.querySelectorAll('.enemy');
  enemy.forEach(function(item) {
    let carRect = car.getBoundingClientRect();
    let enemyRect = item.getBoundingClientRect();
    if(carRect.top + 5 <= enemyRect.bottom &&
      carRect.right + 5 >= enemyRect.left &&
      carRect.left + 5 <= enemyRect.right &&
      carRect.bottom + 5 >= enemyRect.top) {
        setting.start = false;
        audio.pause();
        crash.play();

      let topScore = localStorage.getItem('topScore');
      if (topScore < setting.score) {
        localStorage.setItem('topScore', setting.score);
        score.innerHTML = `
        Score<br>
        ${setting.score}<br>
        Congratulations!<br>
        You set a new best score: ${setting.score}
        `;
      } else {
        score.innerHTML = `
        Score<br>
        ${setting.score}<br>
        You best score: ${topScore}
        `;
      }
      
      // console.warn('ДТП');
      start.classList.remove('hide');
      start.style.top = score.offsetHeight;
    }
    item.y += setting.speed / 2;
    item.style.top = item.y + 'px';
    if(item.y >= gameArea.offsetHeight) {
      let enemyImg = Math.floor(Math.random() * 4) + 1;
      item.y = -100 * setting.traffic;
      item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
      item.style.background = `transparent url('./img/enemy${enemyImg}.png') center / cover no-repeat`;
    }
  });
}