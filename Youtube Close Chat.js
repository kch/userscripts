// ==UserScript==
// @name        Youtube Close Live Chat
// @description Automatically clicks close button in chat iframe when it appears. Fine to reopen afterwards.
// @match       *://www.youtube.com/*
// @match       *://youtu.be/*
// @run-at      document-end
// ==/UserScript==

(function() {
  const clicker = e => {
    const close = e.target.contentDocument.querySelector("#close-button button")
    if (!close) return
    close.click();
    obs.disconnect();
    e.target.removeEventListener("load", clicker);
  }

  let obs = new MutationObserver(() => document.querySelector("#chatframe")?.addEventListener("load", clicker))
  obs.observe(document.body, { childList: true, subtree: true });
})();
