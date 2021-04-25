import Sentiment from "sentiment";
import {
  getInnerText
} from "./getInnerText";

const sentiment = new Sentiment();
let scores = [];
let avg = 0;
let el;
let bannerOn = true;

chrome.tabs.onSelectionChanged.addListener((tabId, changeInfo, tab) => {

  const code = `(${getInnerText.toString()})();`;
    chrome.tabs.executeScript({
        code
      },
      (results) => {
        if (results !== undefined && results[0]) {
          const analyzedText = sentiment.analyze(results[0]);
          console.log(analyzedText.comparative);
          computeRunningAverage(analyzedText.comparative);
        }
      }
    );

});

// when new tab gets opened and URL loads
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  const code = `(${getInnerText.toString()})();`;
  if (info.status === 'complete' && !tab.url.includes("chrome://")) {
    chrome.tabs.executeScript({
        code
      },
      (results) => {
        console.log(results)
        if (results !== undefined && results[0]) {
          const analyzedText = sentiment.analyze(results[0]);
          console.log(analyzedText.comparative);
          computeRunningAverage(analyzedText.comparative);
        }
      }
    );
  }
});


function computeRunningAverage(score) {
  scores.push(score);
  avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  chrome.storage.sync.set({
    "avg": avg,
    "score": score,
    "bannerOn": bannerOn
  }, () => {
    chrome.tabs.executeScript({
      code: `(${ inContent.toString() })(${score}, ${avg}, ${bannerOn})`
    }, () => {});
  });
}

function inContent(score, avg, bannerOn) {

  if (document.contains(document.getElementById("vibes-banner"))) {
    document.getElementById("vibes-banner").remove();
  }
  let text = "";
  let bg = "";
  if (score >= 1) {
    text = "This page is a positive gift to humanity 😇";
    // Very Blue
    bg = 'background: #0575e6; background: -webkit-linear-gradient(to right, #0575e6, #021b79); background: linear-gradient(to right, #0575e6, #021b79);'
  } else if (score < 1 && score >= 0.5) {
    text = "This page is pure bliss 💫";
    // Very Blue
    bg = 'background: #0575e6; background: -webkit-linear-gradient(to right, #0575e6, #021b79); background: linear-gradient(to right, #0575e6, #021b79);'
  } else if (score < 0.5 && score >= .15) {
    text = "Total upper. Keep reading! ✨";
    // Amin
    bg = 'background: #8E2DE2; background: -webkit-linear-gradient(to right, #4A00E0, #8E2DE2);background: linear-gradient(to right, #4A00E0, #8E2DE2);'
  } else if (score < .15 && score >= .1) {
    text = "This page is soooo nice! ⭐️";
    // Amin
    bg = 'background: #8E2DE2; background: -webkit-linear-gradient(to right, #4A00E0, #8E2DE2);background: linear-gradient(to right, #4A00E0, #8E2DE2);'
  } else if (score < .1 && score >= 0.075) {
    text = "Alright, alright! Pretty good vibes all around 🤙";
    // Moon Purple
    bg = 'background: #4e54c8;background: -webkit-linear-gradient(to right, #8f94fb, #4e54c8);background: linear-gradient(to right, #8f94fb, #4e54c8);'
  } else if (score < 0.075 && score >= 0.05) {
    text = "This page is chill 😎";
    // Moon Purple
    bg = 'background: #4e54c8;background: -webkit-linear-gradient(to right, #8f94fb, #4e54c8);background: linear-gradient(to right, #8f94fb, #4e54c8);'
  } else if (score < 0.05 && score >= 0.025) {
    text = "Not too shabby. You're slightly better than neutral 😏";
    // Sublime Vivid
    bg = 'background: #FC466B;background: -webkit-linear-gradient(to right, #3F5EFB, #FC466B);background: linear-gradient(to right, #3F5EFB, #FC466B);'
  } else if (score < 0.025 && score > -0.025) {
    text = "You're in neutral territory. How's the weather? Maybe spend some time outdoors 🌲";
    // Sublime Vivid
    bg = 'background: #FC466B;background: -webkit-linear-gradient(to right, #3F5EFB, #FC466B);background: linear-gradient(to right, #3F5EFB, #FC466B);'
  } else {
    text = "Meh.";
    // Wiretap
    bg = 'background: #8A2387; background: -webkit-linear-gradient(to right, #F27121, #E94057, #8A2387); background: linear-gradient(to right, #F27121, #E94057, #8A2387);'
  }

  chrome.storage.sync.set({
    "bg": bg,
    "text": text
  }, () => {});

  el = document.body.appendChild(document.createElement('div'));
  el.setAttribute('id', 'vibes-banner');
  let visibility = "";
  if (!bannerOn) {
    visibility = "visibility: hidden;";
  } else {
    visibility = "visibility: visible;";
  }
  el.style.cssText = 'z-index: 99999999; position:fixed; bottom:0; left:0; right:0;' + bg + 'color: rgba(255, 255, 255, 0.98); text-align: center; font-size: 14px; font-family: Helvetica, sans-serif; padding: 12px ;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;' + visibility;
  el.innerHTML = text;
}

chrome.runtime.onMessage.addListener((request, sender, response) => {
  if (request.toggle=="hide") {
    bannerOn = false;
    chrome.tabs.executeScript(null, {
      code: `document.getElementById('vibes-banner').remove();`
    }, () => {});
  } else if (request.toggle=="show") {
    bannerOn = true;
    chrome.tabs.executeScript({
      code: `(${ inContent.toString() })(${scores.slice(-1)[0] }, ${avg}, ${bannerOn})`
    }, () => {});
  } else if (request.reset=="reset"){
    avg = 0;
    scores = scores.slice(-1);
    chrome.storage.sync.set({
      "avg": avg
    }, () => {});
  }

  chrome.storage.sync.set({
    "bannerOn": bannerOn
  }, ()=> {});
});
