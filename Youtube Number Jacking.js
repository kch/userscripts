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
  let delay    = async (ƒ, ms)    => (await sleep(ms), ƒ())
  let retry    = async (ƒ, t, w)  => ƒ() || t > 1 && await delay(() => retry(ƒ, t - 1, w), w)
  let clickSeq = async (x, ...xs) => x && (x = await retry(() => qsMatch(...x), 5, 20)) && (x.click(), await clickSeq(...xs))

  function mkSpeedDiv() {
    let speedDiv = qs('#userscripts-show-speed');
    if (speedDiv) return speedDiv;

    const moviePlayer = qs('#movie_player');
    if (!moviePlayer) return null;

    const el = (tag, props, ...children) => {
      const {dataset, ...rest} = props;
      const elem = Object.assign(document.createElement(tag), rest);
      if (dataset) Object.assign(elem.dataset, dataset);
      elem.append(...children);
      return elem;
    };

    speedDiv = el("div", {id: "userscripts-show-speed", hidden: true, dataset: {layer: "4"}},
      el("div", {className: "ytp-bezel-text-wrapper"},
        el("div", {className: "ytp-bezel-text"})
      )
    );

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

  async function selectSpeed(speedRx, speed) {
    await clickSeq(
      ['.ytp-settings-button'],
      ['.ytp-menuitem', /^Playback speed/],
      ['.ytp-menuitem', speedRx],
      ['.ytp-settings-button'],
    )
    setTimeout(() => qs("#movie_player").focus(), 100)
    setTimeout(() => showSpeed(getSpeed()), 100)
    setTimeout(() => console.log("uyt-speed: ", getSpeed()), 100)
    // handle shorts too
    const shorts = qs(".ytd-shorts video")
    if (!shorts || shorts.paused) return
    shorts.playbackRate = speed
  }

  document.addEventListener("keydown", e => {
    if (!qs("#movie_player")) return          // no player
    if (e.target.tagName === "INPUT") return  // allow typing in search, etc
    if (!/^[1-9]$/.test(e.key)) return
    e.preventDefault()
    e.stopPropagation()
    switch(e.key) {
      case "1": selectSpeed(/^Normal/, 1); break
      case "2": const s = getSpeed() == 2 ? 1.75 : 2; selectSpeed(new RegExp(`^${s}`), s); break
    }
  }, true)

})()
