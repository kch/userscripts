// ==UserScript==
// @name               Youtube ads unfuckery
// @name:zh-CN         隐藏youtube google广告
// @namespace          Grenade Vault
// @version            1.1.7
// @description        Automatically Skips all youtube ads! with no waiting time.
// @description        Stop Stealing my code yes please
// @description:zh-CN  BF5 : This skips all adds instantly. Youtube.com
// @author             高梨フブキ
// @match              *://www.youtube.com/*
// @match              *://youtu.be/*
// @run-at             document-start
// ==/UserScript==

// via https://greasyfork.org/en/scripts/406876-no-more-youtube-ads-updated/code

'use strict'

function hideAd() {
  let css    = '.video-ads .ad-container .adDisplay, #player-ads, .ytp-ad-module, .ytp-ad-image-overlay { display: none !important; }'
  let head   = document.head
  let style  = document.createElement('style')
  style.type = 'text/css'
  style.appendChild(document.createTextNode(css))
  head.appendChild(style)
}

function skipAd() {
  let skipBtn = document.querySelector('.ytp-ad-skip-button.ytp-button, .videoAdUiSkipButton')
  // console.log("Youtube Skip Ad: checking...")
  if(skipBtn) {
    console.log("Youtube Skip Ad: Skip")
    skipBtn.click()
  }
}

hideAd()
skipAd()
setInterval(skipAd, 400)
