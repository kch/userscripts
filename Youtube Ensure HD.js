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

  let qs         = (q)       => document.querySelector(q)
  let qsa        = (q)       => [...document.querySelectorAll(q)]
  let firstMatch = (q,p)     => qsa(q).filter(e => e.innerText.match(p))[0]
  let clickSeq   = (m,...ms) => m && (m = firstMatch(...m)) && (m.click(), setTimeout(clickSeq(...ms), 250))

  let intervalID = setInterval(()=> {
    if (!qs("#movie_player")) return // no player

      // console.log("youtube-hd: ...1")
    if (qs(adSelector)) return                  // don't try anything during ads
      // console.log("youtube-hd: ...2")
    if (!qs(buttonWithoutBadgeSelector)) return // don't try if we can't find a settings button without a badge (ie not present somehow, or has badge)
      // console.log("youtube-hd: ...3")

    console.log("youtube-hd: Resetting youtube to HD")

    clickSeq(
      ['.ytp-settings-button', /()/],
      ['.ytp-menuitem',        /^Quality/],
      ['.ytp-menuitem',        /^(1440p|1080p|720p)(?! Premium)/],
      ['.ytp-settings-button', /()/])
      // ['.ytp-menuitem',        /^(4320p|2160p|1440p|1080p|720p)(?! Premium)/])

    // check that we got the hd badge or else give up, probably not hd video
    setTimeout(()=> {
      if (qs(buttonWithBadgeSelector)) return
      clearInterval(intervalID)
      console.log("youtube-hd: HD content not set, aborting further attempts")
    }, 600)

  }, 1000)

})()

// setInterval(function() {
//   let qs         = a => document.querySelector(a)
//   let qsa        = a => Array.from(document.querySelectorAll(a))
//   let firstMatch = (q,p) => qsa(q).filter(e => e.innerText.match(p))[0]
//   if (qs('.ytp-settings-button') && !qs('.ytp-settings-button.ytp-hd-quality-badge')) {
//     qs('.ytp-settings-button').click()
//     setTimeout(()=> firstMatch('.ytp-menuitem', /^Quality/).click(), 400)
//     setTimeout(()=> firstMatch('.ytp-menuitem', /^1080p/  ).click(), 800)
//   }
// }, 1000)
// setInterval(function() {
//   if (document.querySelector('.ytp-settings-button') && !document.querySelector('.ytp-settings-button.ytp-hd-quality-badge')) {
//     document.querySelector('.ytp-settings-button').click()
//     setTimeout(()=> Array.from(document.querySelectorAll('.ytp-menuitem')).filter(e => e.innerText.match(/^Quality/))[0].click(), 400)
//     setTimeout(()=> Array.from(document.querySelectorAll('.ytp-menuitem')).filter(e => e.innerText.match(/^1080p/))[0].click(), 800)
//   }
// }, 1000)
// https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
// new MutationObserver(function(ms){console.log([...ms[0].addedNodes].map(n=>n.innerText))}).observe($('.ytp-settings-menu'), { childList: true, subtree: true });
// hover emejis over controls
