// ==UserScript==
// @name        Odysee disable autoplay
// @description Disable autoplay in Odysee
// @match       *://odysee.com/*
// @run-at      document-idle
// ==/UserScript==

(function(){

  const autplaySelector = '.vjs-button--autoplay-next'

  let qs = (q) => document.querySelector(q)
  let off = () => {
    let ap = qs(autplaySelector)
    if (ap && (ap.ariaChecked == "true")) ap.click()
  }

  off()
  let node = document.body
  let mo   = new MutationObserver(off)
  mo.observe(node, { subtree: true, childList: true })

})()
