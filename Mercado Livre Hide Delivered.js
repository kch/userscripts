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

  setTimeout(() => {
    let container = qs(".list-header")
    let a = document.createElement("a")
    a.appendChild(document.createTextNode("Hide delivered"))
    a.className = "andes-button bf-ui-button andes-button--medium andes-button--loud"
    a.href = "#"
    a.onclick = hide
    container.appendChild(a)
  }, 1500)

})()
