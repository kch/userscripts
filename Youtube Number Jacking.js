// ==UserScript==
// @name        Youtube Hijack Numbers
// @description Don't let 1-9 skip vid position; 1,2 do adjust speed
// @match       *://www.youtube.com/*
// @match       *://youtu.be/*
// @run-at      document-end
// ==/UserScript==

(async function(){
  let qs       = (q)              => document.querySelector(q)
  let qsa      = (q)              => [...document.querySelectorAll(q)]
  let qsMatch  = (q, p = /()/)    => qsa(q).find(e => e.innerText.match(p))
  let sleep    = (ms)             => new Promise(r => setTimeout(r, ms))
  let delay    = async (fn, ms)   => (await sleep(ms), fn())
  let retry    = async (fn, t, w) => fn() || t > 1 && await delay(() => retry(fn, t - 1, w), w)
  let clickSeq = async (x, ...xs) => x && (x = await retry(() => qsMatch(...x), 5, 20)) && (x.click(), await clickSeq(...xs))


  function mkSpeedDiv() {
    let speedDiv = qs('#userscripts-show-speed');
    if (speedDiv) return speedDiv;

    const moviePlayer = qs('#movie_player');
    if (!moviePlayer) return null;

    speedDiv = document.createElement('div');
    speedDiv.id             = 'userscripts-show-speed';
    speedDiv.dataset.layer  = '4';
    speedDiv.hidden         = true;
    speedDiv.innerHTML      = `<div class="ytp-bezel-text-wrapper"><div class="ytp-bezel-text"></div></div>`;
    moviePlayer.appendChild(speedDiv);

    return speedDiv;
  }

  function showSpeed(speed) {
    const speedDiv = mkSpeedDiv();
    if (!speedDiv) return;
    speedDiv.querySelector('.ytp-bezel-text').textContent = speed + 'x';
    speedDiv.hidden = false;
    clearTimeout(speedDiv.hideTimeout);
    speedDiv.hideTimeout = setTimeout(() => speedDiv.hidden = true, 900);
  }

  getSpeed = () => qs("#movie_player video").playbackRate

  async function selectSpeed(speedRx) {
    await clickSeq(
      ['.ytp-settings-button'],
      ['.ytp-menuitem', /^Playback speed/],
      ['.ytp-menuitem', speedRx],
      ['.ytp-settings-button'],
    )
    setTimeout(() => qs("#movie_player").focus(), 100)
    setTimeout(() => showSpeed(getSpeed()), 100)
    setTimeout(() => console.log("uyt-speed: ", getSpeed()), 100)
  }

  document.addEventListener("keydown", e => {
    if (!qs("#movie_player")) return          // no player
    if (e.target.tagName === "INPUT") return  // allow typing in search, etc
    if (!/^[1-9]$/.test(e.key)) return
    e.preventDefault()
    e.stopPropagation()
    switch(e.key) {
      case "1": selectSpeed(/^Normal/); break
      case "2": selectSpeed(new RegExp(`^${getSpeed() == 2 ? 1.75 : 2}`)); break
    }
  }, true)

})()
