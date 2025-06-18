// ==UserScript==
// @name        Twitter Video Speed Keys
// @description Sets video speed on twitter's playing video with 1,2 keys
// @match       *://x.com/*
// ==/UserScript==

(function(){
  document.addEventListener("keydown", e => {
    if (!/^[12]$/.test(e.key)) return
    const vid = [...document.querySelectorAll("video")].find(v => !v.paused)
    if (!vid) return
    e.preventDefault()
    e.stopPropagation()
    vid.playbackRate = e.key
  }, true)

})()
