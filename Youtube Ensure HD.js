// ==UserScript==
// @name        Youtube ensure HD
// @description Sets youtube player to highest resolution if drops from an HD res
// @match       *://www.youtube.com/*
// @match       *://youtu.be/*
// ==/UserScript==

(function(){

  const adSelector                 = '.ytp-ad-player-overlay'
  const buttonWithBadgeSelector    = '.ytp-settings-button:is(.ytp-hd-quality-badge,.ytp-4k-quality-badge,.ytp-8k-quality-badge)'
  const buttonWithoutBadgeSelector = '.ytp-settings-button:not(.ytp-hd-quality-badge):not(.ytp-4k-quality-badge):not(.ytp-8k-quality-badge)'

  let qs       = (q)              => document.querySelector(q)
  let qsa      = (q)              => [...document.querySelectorAll(q)]
  let qsMatch  = (q, p = /()/)    => qsa(q).find(e => e.innerText.match(p))
  let sleep    = (ms)             => new Promise(r => setTimeout(r, ms))
  let delay    = async (ƒ, ms)    => (await sleep(ms), ƒ())
  let retry    = async (ƒ, t, w)  => ƒ() || t > 1 && await delay(() => retry(ƒ, t - 1, w), w)
  let clickSeq = async (x, ...xs) => x && (x = await retry(() => qsMatch(...x), 5, 20)) && (x.click(), await clickSeq(...xs))

  console.log("uyt-hd: starting…")
  setInterval(async ()=> {
    let video = qs("#movie_player video")
    if (!video) return                          // no player
    if (video.paused) return                    // not playing
    if (qs(adSelector)) return                  // don't try anything during ads
    if (!qs(buttonWithoutBadgeSelector)) return // don't try if we can't find a settings button without a badge (ie not present somehow, or has badge)

    console.log("uyt-hd: Resetting youtube to HD")

    clickSeq(
      ['.ytp-settings-button'],
      ['.ytp-menuitem', /^Quality/],
      ['.ytp-menuitem', /^(1440p|1080p|720p)(?! Premium)/], // Keep the top quality you want in front: /^(4320p|2160p|1440p|1080p|720p)(?! Premium)/
      [".ytp-settings-button[aria-expanded='true']"], // close menu
    )

    setTimeout(() => qs("#movie_player").focus(), 100)
  }, 1000)

})()

// at some pointed I wanted to try using MutationObserver to check if youtube auto switches quality, but polling been fine so far
// https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
// new MutationObserver(function(ms){console.log([...ms[0].addedNodes].map(n=>n.innerText))}).observe($('.ytp-settings-menu'), { childList: true, subtree: true });
