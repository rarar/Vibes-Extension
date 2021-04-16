import Sentiment from "sentiment";
import {
  getInnerText
} from "./getInnerText";

const sentiment = new Sentiment();
let scores = [];
let avg = 0;

chrome.tabs.onSelectionChanged.addListener((tabId, changeInfo, tab) => {
  const code = `(${getInnerText.toString()})();`;
  console.log("on onSelectionChanged fired");
  chrome.tabs.executeScript({
      code
    },
    (results) => {
      if (results !== undefined && results[0]) {
        const analyzedText = sentiment.analyze(results[0]);
        console.log(analyzedText.score);
        computeRunningAverage(analyzedText.score);
      }
    }
  );
});

// when new tab gets opened and URL loads
chrome.tabs.onUpdated.addListener(function(tabId, info, tab) {
  const code = `(${getInnerText.toString()})();`;
  // console.log("onUpdated fired " + tab.url + " " + info.status);
  if (info.status === 'complete' && tab.url != "chrome://new-tab-page/") {
    chrome.tabs.executeScript({
        code
      },
      (results) => {
        console.log(results)
        if (results !== undefined && results[0]) {
          const analyzedText = sentiment.analyze(results[0]);
          console.log(analyzedText.score);
          computeRunningAverage(analyzedText.score);
        }
      }
    );
  }
});


function computeRunningAverage(score) {
  scores.push(score);
  avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  console.log("new average is = " + avg);
  let currentVibe = avg;
  chrome.storage.sync.set({
    "currentVibe": currentVibe,
    "score": score
  }, ()=> {
    //alert(currentVibe);
    chrome.tabs.executeScript({
      code: `(${ inContent })()`
    }, ()=> {

    });
  });
}

function inContent() {
  let el = document.body.appendChild(document.createElement('div'));
  el.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background:pink; text-align: center; font-size: 18px; font-family: Helvetica, sans-serif; padding: 16px;';
  el.innerHTML = 'The vibe of this page is chill';
}
