// ==UserScript==
// @name        Youtube Close Live Chat
// @description Automatically clicks close button in chat iframe when it appears
// @match       *://www.youtube.com/*
// @match       *://youtu.be/*
// @run-at      document-end
// ==/UserScript==

// Generic utility: find elements now or watch for them later
// Prevents duplicate callbacks on same element
function findOrWatch(selector, context = document, callback) {
  let seen = new Set();

  const check = () => {
    context.querySelectorAll(selector).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      callback(el);
    });
  };

  // Check existing elements first
  check();

  // Use correct context for iframe documents
  const observer = new MutationObserver(check);
  observer.observe(context.body || context, { childList: true, subtree: true });

  return observer;
}

// Find the chat iframe and monitor its changing content
let hasClicked = false;
let mainObserver = findOrWatch("#chatframe", document, (iframe) => {
  if (hasClicked) return;

  console.log("uyt-chat Found chatframe:", iframe);

  let lastDoc = null;
  let frameObserver = null;
  let iframeObserver = null;

  // Click close button and cleanup
    const clickClose = (btn, source = "") => {
      if (hasClicked) return;
      console.log(`uyt-chat ${source}clicking close button`);
      btn.click();
      hasClicked = true;
      if (frameObserver) frameObserver.disconnect();
      if (iframeObserver) iframeObserver.disconnect();
      if (mainObserver) mainObserver.disconnect();
      console.log("uyt-chat All observers disconnected");
    };

  // Handle iframe document changes (navigation, content replacement)
  const watchFrameContent = (source = "direct") => {
    if (hasClicked) return;

    try {
      const frameDoc = iframe.contentDocument;
      if (!frameDoc || frameDoc === lastDoc) return;

      lastDoc = frameDoc;
      console.log(`uyt-chat New frame document detected via ${source}`);

      // Clean up previous observer since document changed
      if (frameObserver) frameObserver.disconnect();

      // Try immediate click or watch for button
      const closeBtn = frameDoc.querySelector("#close-button button");
      if (closeBtn) {
        clickClose(closeBtn, "");
        return;
      }

      // Button not found yet, watch for it to appear
      frameObserver = findOrWatch("#close-button button", frameDoc, (btn) => {
        clickClose(btn, "Found and ");
      });

    } catch (e) {
      console.log("uyt-chat Frame access error:", e.message);
    }
  };

  // Initial check and setup listeners for frame content changes
  watchFrameContent("initial");
  iframe.addEventListener("load", () => watchFrameContent("load"));

  // Also watch for src attribute changes (programmatic navigation)
  iframeObserver = new MutationObserver(() => watchFrameContent("observer"));
  iframeObserver.observe(iframe, { attributes: true, attributeFilter: ["src"] });
});
