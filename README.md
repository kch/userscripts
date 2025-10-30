# Userscripts Collection

Browser userscripts and userstyles.

I am using Safari with the [Userscripts extension][userscripts-ext], but should work in any browser/extension.

[userscripts-ext]: https://github.com/quoid/userscripts

## Scripts

### Youtube Ensure HD.js
Forces highest available resolution when video quality drops below HD
- Automatically clicks through settings menu to select best quality
- Prioritizes 1440p > 1080p > 720p (skips Premium options)
- Edit regexp to select max resolution

### Youtube Number Jacking.js
Prevents number keys from seeking video position, adds speed controls
- Blocks default 1-9 seeking behavior
- Key 1: Reset to normal speed
- Key 2: Toggle between 1.75x and 2x speed
- Shows speed overlay when changed
- Sets speed on shorts too

### Youtube Close Chat.js
Automatically closes live chat when it appears
- Clicks close button in chat iframe on load
- Fine to reopen chat afterwards

### Youtube Disable Autoplay.js
Keeps autoplay next permanently disabled
- Automatically clicks autoplay toggle when enabled

### Twitter Video Speed.js
Control video playback speed with keyboard
- Key 1: Set speed to 1x
- Key 2: Set speed to 2x
- Only affects currently playing video

### Odysee Disable Autoplay.js
Automatically disables autoplay on video pages

### Odysee Hide Ads.js
Removes ads from video listings
- Continuously removes ads as page content loads

### Mercado Livre Hide Delivered.js
Adds button to hide delivered orders from purchase history
- Creates "Hide delivered" button in list header

### Aliexpress Such Annoy.js
Automatically closes notification popups and subscription prompts
- Clicks "Don't allow" on notification permission requests
- Closes offer modals by finding and clicking close buttons
- Runs continuously as page content loads

### Substack.css
Removes subscription prompts and UI clutter
- Hides main menu overlay
- Removes subscribe widgets and buttons
- Hides post metadata and comment sections

### Youtube.css
Removes Wikipedia propaganda boxes on YouTube
- Hides clarify-box elements that appear on videos
