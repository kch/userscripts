// ==UserScript==
// @name        Cmd-Del Element
// @description ⌘⌫ deletes element under mouse, ⌘Z puts back
// @match       *://*/*
// ==/UserScript==

let undoWindow        = 3000 // can undo for this long
let undoCooldown      = 1500 // will prevent default undo for this long after last undo
let scheduledDeletion = null // timeout id for deleteElements
let lastHide          = 0    // timestamp for last element was hidden
let lastUndo          = 0    // timestamp for last successful undo
let hiddenElements    = []   // elements that can be unhidden by undo

let cmdCombo       = (ev, key) => !ev.shiftKey && !ev.ctrlKey && !ev.altKey && ev.metaKey && ev.key == key
let tsWithin       = (ts, ms)  => (Date.now() - ts) <= ms
let deleteElements = ()        => { let e; while (e = hiddenElements.shift()) e.parentNode.removeChild(e) }

let styleBackup = Symbol('styleBackup')
let willDelete  = Symbol('willDelete')

document.addEventListener('keydown', function(ev) {

  if (cmdCombo(ev, 'Backspace')) {
    let elem = [...document.querySelectorAll(":hover")].pop() // get innermost elem under pointer
    while (elem[willDelete] && elem.parentElement) elem = elem.parentElement // find ancestor not marked for deletion
    hiddenElements.push(elem)                               // keep track of it for undo
    elem[styleBackup]          = elem.style.cssText         // save styles for undo
    elem[willDelete]           = true                       // mark for deletion so we look up parent on next delete
    elem.style.opacity         = '30%'                      // make it look weird while waiting for deletion
    elem.style.color           = '#666'                     // make it look weird while waiting for deletion
    elem.style.backgroundColor = '#000'                     // make it look weird while waiting for deletion
    lastHide                   = Date.now()                 // timestamp for undo window
    clearTimeout(scheduledDeletion)                         // clear pending deletion to extend undo window
    scheduledDeletion = setTimeout(deleteElements, undoWindow + 1) // really delete elements after undo window times out
    ev.preventDefault()
  }

  if (cmdCombo(ev, 'z') && tsWithin(lastHide, undoWindow)) {
    let elem = hiddenElements.pop() || []
    if (elem) {
      elem.style = elem[styleBackup]
      lastUndo = Date.now()
    }
    // preventDefault if we restored an element, or if it's only been 1500ms since last undo,
    // so you don't accidentally reopen a tab by way of over-undoing
    if (elem || tsWithin(lastUndo, undoCooldown)) ev.preventDefault()
  }

})

// try this later https://bryanlrobinson.com/blog/how-to-css-after-elements-for-background-overlays/
