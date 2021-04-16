let vibeText = document.getElementById("vibeText");
let scoreText = document.getElementById("scoreText");

chrome.storage.sync.get("currentVibe", ({ currentVibe }) =>{
  vibeText.innerHTML = Math.round(currentVibe);
});

chrome.storage.sync.get("score", ({ score }) =>{
  scoreText.innerHTML = Math.round(score);
});
