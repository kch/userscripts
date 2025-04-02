// ==UserScript==
// @name        Youtube disable autoplay next
// @description Keep autoplay next disabled
// @match       *://www.youtube.com/watch*
// @match       *://youtu.be/watch*
// @run-at      document-end
// ==/UserScript==

(function(){

  const autplaySelector = ".ytp-autonav-toggle-button"

  let qs = (q) => document.querySelector(q)
  let off = () => {
    let ap = qs(autplaySelector)
    if (ap && (ap.ariaChecked == "true")) ap.click()
  }

  off()
  let node = document.body
  let mo   = new MutationObserver(off)
  mo.observe(node, { subtree: true, childList: true })
  setTimeout(() => { mo.disconnect(); off = ()=>{}}, 5000)

})()
