// ==UserScript==
// @name        Odysee hide ads
// @description Hide ads in odysee lists
// @match       *://odysee.com/*
// @run-at      document-idle
// ==/UserScript==

(function(){

  let qs  = (q) => document.querySelector(q)
  let qsa = (q) => [...document.querySelectorAll(q)]
  let ads = '.card.claim-preview--premium-plus'
  let rem = ()  => { qsa(ads).forEach(x => x.remove()) }

  // let node = qs('section.claim-grid:has(>li.card)');
  let node = document.body
  let mo   = new MutationObserver(rem)
  mo.observe(node, { subtree: true, childList: true })

})()
