// ==UserScript==
// @name        Youtube»Invidious links
// @description Replace youtube links to invidious
// @match       *://www.youtube.com/*
// @match       *://youtu.be/*
// @match       *://www.google.com/*
// @run-at      document-start
// ==/UserScript==

(function(){

  const observer = new MutationObserver((_) => {
    const newHost = "http://127.0.0.1:3333";
    document.querySelectorAll('a[href^="https://www.youtube.com/watch?v="], a[href^="/watch?v="]').forEach((link) => {
      link.href = link.href.replace(/^\w+:\/\/[^\/]*/, newHost);
      console.log(`Updated href to: ${link.href}`);
    });
  });

  observer.observe(document.documentElement, {
    attributes: true,
    childList: true,
    subtree: true,
  });

})()
