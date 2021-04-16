function setVibeBanner(avg, currentScore) {
  const el = document.body.appendChild(document.createElement('div'));
  el.style.cssText = 'position:fixed; bottom:0; left:0; right:0; background:pink; text-align: center; font-size: 18px; font-family: Helvetica, sans-serif; padding: 16px;';
  el.innerHTML = 'The vibe of this page is chill 😎';
}

export { setVibeBanner };
