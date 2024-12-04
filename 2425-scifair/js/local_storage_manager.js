window.fakeStorage = {
  _data: {},

  setItem: function (id, val) {
    return (this._data[id] = String(val));
  },

  getItem: function (id) {
    return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
  },

  removeItem: function (id) {
    return delete this._data[id];
  },

  clear: function () {
    return (this._data = {});
  },
};

function LocalStorageManager() {
  this.bestScoreKey = "bestScore";
  this.gameStateKey = "gameState";
  this.rankListKey = "rankList";

  var supported = this.localStorageSupported();
  this.storage = supported ? window.localStorage : window.fakeStorage;
}

LocalStorageManager.prototype.localStorageSupported = function () {
  var testKey = "test";

  try {
    var storage = window.localStorage;
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
};

// Best score getters/setters
LocalStorageManager.prototype.getBestScore = function () {
  return this.storage.getItem(this.bestScoreKey) || 0;
};

LocalStorageManager.prototype.setBestScore = function (score) {
  this.storage.setItem(this.bestScoreKey, score);
};

// Game state getters/setters and clearing
LocalStorageManager.prototype.getGameState = function () {
  var stateJSON = this.storage.getItem(this.gameStateKey);
  return stateJSON ? JSON.parse(stateJSON) : null;
};

LocalStorageManager.prototype.setGameState = function (gameState) {
  this.storage.setItem(this.gameStateKey, JSON.stringify(gameState));
};

LocalStorageManager.prototype.clearGameState = function () {
  this.storage.removeItem(this.gameStateKey);
};

// ---

LocalStorageManager.prototype.setRankList = function (playerId, playerScore) {
  let jsonstr = this.storage.getItem(this.rankListKey);
  let rlist = jsonstr ? JSON.parse(jsonstr) : [];
  if (rlist.length > 30) {
    rlist = [];
  }
  let idx = -1;
  for (let i = 0; i < rlist.length; i++) {
    if (rlist[i].id === playerId) {
      idx = i;
      break;
    }
  }
  if (idx === -1) rlist.push({ id: playerId, score: playerScore });
  else rlist[idx].score = playerScore;

  rlist.sort((a, b) => b.score - a.score);

  this.storage.setItem(this.rankListKey, JSON.stringify(rlist));
};

LocalStorageManager.prototype.getRankList = function () {
  var jsonstr = this.storage.getItem(this.rankListKey);
  return jsonstr ? JSON.parse(jsonstr) : null;
};

LocalStorageManager.prototype.clearRankList = function () {
  this.storage.removeItem(this.rankListKey);
};
