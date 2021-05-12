//alert("loaded");
let h1 = document.getElementById("text-vibe");
let current = document.getElementById("score-text");
let average = document.getElementById("avg-text");
let header = document.getElementById("vibe-header");

chrome.storage.sync.get("score", ({ score }) => {
  current.innerHTML = Math.round(score * 1000) / 10;
});

chrome.storage.sync.get("avg", ({ avg }) => {
  average.innerHTML = Math.round(avg * 1000) / 10;
});

chrome.storage.sync.get("text", ({ text }) => {
  h1.innerHTML = text;
});

chrome.storage.sync.get("bg", ({ bg }) => {
  header.style.cssText = "padding: 16px;" + bg;
});

chrome.storage.sync.get("bannerOn", ({ bannerOn }) => {
  if (!bannerOn) {
    document.getElementById("toggle-banner").innerHTML = "Show Banner";
  } else {
    document.getElementById("toggle-banner").innerHTML = "Hide Banner";
  }
});

if (document.getElementById("toggle-banner") != null) {
  document
    .getElementById("toggle-banner")
    .addEventListener("click", (event) => {
      event.preventDefault();
      let toggle = "";
      if (document.getElementById("toggle-banner").innerHTML == "Hide Banner") {
        document.getElementById("toggle-banner").innerHTML = "Show Banner";
        toggle = "hide";
      } else {
        document.getElementById("toggle-banner").innerHTML = "Hide Banner";
        toggle = "show";
      }
      chrome.runtime.sendMessage({
        toggle: toggle,
      });
    });
}

if (document.getElementById("reset") != null) {
  document.getElementById("reset").addEventListener("click", (event) => {
    event.preventDefault();
    average.innerHTML = "0";
    chrome.runtime.sendMessage({
      reset: "reset",
    });
  });
}

if (document.getElementById("learn-more") != null) {
  document.getElementById("learn-more").addEventListener("click", (event) => {
    alert("clicked learn more");
    chrome.tabs.create({
      url: document.getElementById("learn-more").href,
    });
  });
}
