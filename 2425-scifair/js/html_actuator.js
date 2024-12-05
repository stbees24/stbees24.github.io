function HTMLActuator() {
  this.tileContainer = document.querySelector(".tile-container");
  this.scoreContainer = document.querySelector(".score-container");
  this.bestContainer = document.querySelector(".best-container");
  this.messageContainer = document.querySelector(".game-message");
  this.rankListContainer = document.querySelector(".rank-list");

  this.score = 0;
  this.rankList = [];
}
  //1
HTMLActuator.prototype.actuate = function (grid, metadata) {
  var self = this;

  window.requestAnimationFrame(function () {
    // if (!metadata.terminated) {
    self.clearContainer(self.tileContainer);
    grid.cells.forEach(function (column) {
      column.forEach(function (cell) {
        if (cell) {
          self.addTile(cell);
        }
      });
    });
    // }

    self.updateScore(metadata.score);
    self.updateBestScore(metadata.bestScore);
    self.updateRankList(metadata.rankList);

    if (metadata.terminated) {
      if (metadata.over) {
        self.message(false); // You lose
      } else if (metadata.won) {
        self.message(true); // You win!
      }
    }
  });
};

// Continues the game (both restart and keep playing)
HTMLActuator.prototype.continueGame = function () {
  this.clearMessage();
};

HTMLActuator.prototype.clearContainer = function (container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
};

HTMLActuator.prototype.addTile = function (tile) {
  var self = this;

  var wrapper = document.createElement("div");
  var inner = document.createElement("div");
  var position = tile.previousPosition || { x: tile.x, y: tile.y };
  var positionClass = this.positionClass(position);

  // We can't use classlist because it somehow glitches when replacing classes
  var classes = ["tile", "tile-" + tile.value, positionClass];

  if (tile.value > 2048) classes.push("tile-super");

  this.applyClasses(wrapper, classes);

  inner.classList.add("tile-inner");
  let line1 = document.createElement("span");
  let line2 = document.createElement("span");
  line1.style.lineHeight = "1.1em";
  line2.style.lineHeight = "1.1em";
  // inner.textContent = tile.value;
  switch (tile.value) {
    case 2:
      line1.textContent = "S";
      line1.style.fontSize = "1.8em";
      break;
    case 4:
      line1.textContent = "SC";
      line1.style.fontSize = "1.8em";
      break;
    case 8:
      line1.textContent = "SCI";
      line1.style.fontSize = "1.8em";
      break;
    case 16:
      line1.textContent = "SCIE";
      line1.style.fontSize = "1.8em";
      break;
    case 32:
      line1.textContent = "SCIEN";
      line1.style.fontSize = "1.1em";
      break;
    case 64:
      line1.textContent = "SCIENC";
      line1.style.fontSize = "1.1em";
      break;
    case 128:
      line1.textContent = "SCIENCE";
      line1.style.fontSize = "1.1em";
      break;
    case 256:
      line1.textContent = "SCIENCE";
      line1.style.fontSize = "1.1em";
      line2.textContent = "F";
      line2.style.fontSize = "1.1em";
      break;
    case 512:
      line1.textContent = "SCIENCE";
      line1.style.fontSize = "1.1em";
      line2.textContent = "FA";
      line2.style.fontSize = "1.1em";
      break;
    case 1024:
      line1.textContent = "SCIENCE";
      line1.style.fontSize = "1.1em";
      line2.textContent = "FAI";
      line2.style.fontSize = "1.1em";
      break;
    case 2048:
      line1.textContent = "SCIENCE";
      line1.style.fontSize = "1.1em";
      line2.textContent = "FAIR";
      line2.style.fontSize = "1.1em";
      break;
    default:
      line1.textContent = "???";
      break;
  }
  inner.appendChild(line1);
  inner.appendChild(line2);

  if (tile.previousPosition) {
    // Make sure that the tile gets rendered in the previous position first
    window.requestAnimationFrame(function () {
      classes[2] = self.positionClass({ x: tile.x, y: tile.y });
      self.applyClasses(wrapper, classes); // Update the position
    });
  } else if (tile.mergedFrom) {
    classes.push("tile-merged");
    this.applyClasses(wrapper, classes);

    // Render the tiles that merged
    tile.mergedFrom.forEach(function (merged) {
      self.addTile(merged);
    });
  } else {
    classes.push("tile-new");
    this.applyClasses(wrapper, classes);
  }

  // Add the inner part of the tile to the wrapper
  wrapper.appendChild(inner);

  // Put the tile on the board
  this.tileContainer.appendChild(wrapper);
};

HTMLActuator.prototype.applyClasses = function (element, classes) {
  element.setAttribute("class", classes.join(" "));
};

HTMLActuator.prototype.normalizePosition = function (position) {
  return { x: position.x + 1, y: position.y + 1 };
};

HTMLActuator.prototype.positionClass = function (position) {
  position = this.normalizePosition(position);
  return "tile-position-" + position.x + "-" + position.y;
};

HTMLActuator.prototype.updateScore = function (score) {
  this.clearContainer(this.scoreContainer);

  var difference = score - this.score;
  this.score = score;

  this.scoreContainer.textContent = this.score;

  if (difference > 0) {
    var addition = document.createElement("div");
    addition.classList.add("score-addition");
    addition.textContent = "+" + difference;

    this.scoreContainer.appendChild(addition);
  }
};

HTMLActuator.prototype.updateBestScore = function (bestScore) {
  this.bestContainer.textContent = bestScore;
};

function getColorFromRank(readableRank) {
  let ret = "black";
  if (readableRank == 1) {
    ret = "gold";
  }
  if (readableRank == 2) {
    ret = "lightgrey";
  }
  if (readableRank == 3) {
    ret = "#936137";
  }
  if (readableRank > 3 && readableRank < 10) {
    ret = "blue";
  }

  return ret;
}

HTMLActuator.prototype.updateRankList = function (rankList) {
  console.log("updating... rankList", rankList);

  for (let i = 0; i < rankList.length; i++) {
    let readableRank = i + 1;
    let exists = false;

    let htmlEleRankItems =
      this.rankListContainer.getElementsByClassName("rank-item");
    for (let ii = 0; ii < htmlEleRankItems.length; ii++) {
      let ele = htmlEleRankItems[ii];
      let playerId = ele.getAttribute("data-playerid");
      // console.log("ee", playerId, rankList[i]);
      if (playerId == rankList[i].id) {
        ele.setAttribute("data-rank", i + 1 + "");
        ele.getElementsByClassName("player-name")[0].textContent =
          rankList[i].score;
        ele.getElementsByClassName("player-rank")[0].textContent =
          "" + (readableRank < 10 ? "0" + readableRank : readableRank);
        ele.getElementsByClassName("player-rank")[0].style.color =
          getColorFromRank(readableRank);
        exists = true;
      }
    }

    if (!exists) {
      let rankItem = document.createElement("div");
      rankItem.classList.add("rank-item");
      rankItem.setAttribute("data-rank", i + 1 + "");
      rankItem.setAttribute("data-playerid", rankList[i].id + "");
      let line1 = document.createElement("div");
      line1.classList.add("line1");
      let playerRank = document.createElement("div");
      playerRank.classList.add("player-rank");
      playerRank.textContent =
        "" + (readableRank < 10 ? "0" + readableRank : readableRank);
      playerRank.style.color = getColorFromRank(readableRank);
      let playerName = document.createElement("div");
      playerName.classList.add("player-name");
      playerName.textContent = rankList[i].score;
      line1.appendChild(playerRank);
      line1.appendChild(playerName);
      let playerScore = document.createElement("div");
      playerScore.classList.add("player-score");
      // playerScore.textContent = rankList[i].score;
      playerScore.textContent = rankList[i].id;

      rankItem.appendChild(line1);
      rankItem.appendChild(playerScore);
      this.rankListContainer.appendChild(rankItem);
    }
  }
};

HTMLActuator.prototype.message = function (won) {
  var type = won ? "game-won" : "game-over";
  var message = won ? "You win!" : "Game over!";

  this.messageContainer.classList.add(type);
  this.messageContainer.getElementsByTagName("p")[0].textContent = message;
};

HTMLActuator.prototype.clearMessage = function () {
  // IE only takes one value to remove at a time.
  this.messageContainer.classList.remove("game-won");
  this.messageContainer.classList.remove("game-over");
};
