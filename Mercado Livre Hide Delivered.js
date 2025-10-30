// ==UserScript==
// @name        Mercado Livre hide delivered
// @description Hide delivered items in order list
// @match       https://myaccount.mercadolivre.com.br/my_purchases/list
// @run-at      document-end
// ==/UserScript==

(function(){

  let qs  = (q) => document.querySelector(q)
  let qsa = (q, x) => [...(x || document).querySelectorAll(q)]

  let hide = (e) => {
    e.preventDefault();
    qsa("div.list-item__product > div.list-item__data > p.list-item__intro > span")
      .filter(x => x.innerText == "Entregue")
      .map(x => x.closest(".list-item"))
      .forEach(x => x.style.display = "none")

    qsa("div.list-item-grouper")
      .filter(x => qsa(".list-item", x).every(x => x.style.display == "none"))
      .forEach(x => x.style.display = "none")
  }

  const addButton = () => {
    let container = qs(".list-header__subtitles")
    if (container && qs(".hide-delivered-btn")) return;
    let a = document.createElement("a")
    a.appendChild(document.createTextNode("Hide delivered"))
    a.className = "andes-button bf-ui-button andes-button--medium andes-button--loud hide-delivered-btn"
    a.href = "#"
    a.onclick = hide
    container.appendChild(a)
  }

  addButton()

  const mo1 = new MutationObserver(addButton)

  mo1.observe(document.body, { childList: true, subtree: true });


  //  dismiss le annoy recurring hint

  const closers = () => {
    const btn = document.evaluate(`//span[@class='andes-button__content' and contains(text(),'OK, entendi')]`,
      document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue

    if (btn) btn.click()
  }

  closers()

  const mo2 = new MutationObserver(closers)

  mo2.observe(document.body, { childList: true, subtree: true });

})()
