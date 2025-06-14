// ==UserScript==
// @name        Youtube Hijack Numbers
// @description Don't let 1-9 skip vid position; 1,2 do adjust speed
// @match       *://www.youtube.com/*
// @match       *://youtu.be/*
// @run-at      document-end
// ==/UserScript==

(function(){
  let qs         = (q)        => document.querySelector(q)
  let qsa        = (q)        => [...document.querySelectorAll(q)]
  let firstMatch = (q,p=/()/) => qsa(q).find(e => e.innerText.match(p))
  let clickSeq   = (m,...ms)  => m && (m = firstMatch(...m)) && (m.click(), requestAnimationFrame(() => clickSeq(...ms)))

  getSpeed = () => qs("#movie_player video").playbackRate

  function selectSpeed(speedRx) {
    clickSeq(
      ['.ytp-settings-button'],
      ['.ytp-menuitem', /^Playback speed/],
      ['.ytp-menuitem', speedRx],
      ['.ytp-settings-button'],
    )
    setTimeout(() => qs("#movie_player").focus(), 100)
    setTimeout(() => console.log("youtube-speed: ", getSpeed()), 100)
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
