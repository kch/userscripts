// ==UserScript==
// @name        Aliexpress so annoy
// @description Don't want your notifications not ever or popups
// @match       *://*.aliexpress.com/*
// @run-at      document-idle
// ==/UserScript==

(function(){

  const closers = () => {
    const btn = document.evaluate(`//div[contains(text(),'Subscribe to notifications')]/..//div[contains(text(),"Don't allow")]`,
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    if (btn) btn.click()
    console.log("xxx-ali", btn);

    [...document.body.children].filter(el => getComputedStyle(el).zIndex == "1000000").flatMap(zel =>
      [...zel.querySelectorAll("div")].filter(div => {
        const cs    = getComputedStyle(div);
        const img15 = div.children[0];
        const cs15  = img15 && getComputedStyle(img15);
        return cs.width === "28px" && cs.height === "28px" && div.children.length === 1 &&
          img15.tagName === "IMG" && cs15.width === "15px" && cs15.height === "15px";
      })
    ).forEach(btn => btn.click())
  }

  closers()

  const mo = new MutationObserver(closers)

  mo.observe(document.body, { childList: true, subtree: true });

})()
