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

  let qs         = (q)        => document.querySelector(q)
  let qsa        = (q)        => [...document.querySelectorAll(q)]
  let firstMatch = (q,p=/()/) => qsa(q).find(e => e.innerText.match(p))
  let clickSeq   = (m,...ms)  => m && (m = firstMatch(...m)) && (m.click(), requestAnimationFrame(() => clickSeq(...ms)))

  let intervalID = setInterval(()=> {
    if (!qs("#movie_player")) return            // no player
    if (qs(adSelector)) return                  // don't try anything during ads
    if (!qs(buttonWithoutBadgeSelector)) return // don't try if we can't find a settings button without a badge (ie not present somehow, or has badge)

    console.log("youtube-hd: Resetting youtube to HD")

    clickSeq(
      ['.ytp-settings-button'],
      ['.ytp-menuitem', /^Quality/],
      ['.ytp-menuitem', /^(1440p|1080p|720p)(?! Premium)/], // Keep the top quality you want in front: /^(4320p|2160p|1440p|1080p|720p)(?! Premium)/
    )

    // just appending the area-expanded selector to the clickSeq doesn't work bc it only gets this attr
    // after menu animation ends, so not consistently there in time
    setTimeout(() => {
      clickSeq([".ytp-settings-button[aria-expanded='true']"])
      qs("#movie_player").focus()
    }, 500)

    // check that we got the hd badge or else give up, probably not hd video
    setTimeout(()=> {
      if (qs(buttonWithBadgeSelector)) return
      clearInterval(intervalID)
      console.log("youtube-hd: HD content not set, aborting further attempts")
    }, 600)

  }, 1000)

})()

// at some pointed I wanted to try using MutationObserver to check if youtube auto switches quality, but polling been fine so far
// https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
// new MutationObserver(function(ms){console.log([...ms[0].addedNodes].map(n=>n.innerText))}).observe($('.ytp-settings-menu'), { childList: true, subtree: true });
