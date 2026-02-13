# **MTG Safari Overlay**

A high-performance "Zero-Tab" card browser for iOS, iPadOS, and Desktop Safari. Get instant Magic: The Gathering card context without leaving your current page.

## **📖 Why this exists**

Browsing Magic articles or Reddit threads on mobile is often a "multi-tab nightmare." Checking a card's price, legality, or synergy usually forces you to open a new tab, navigate a mobile-unfriendly site, and then switch back to your original page.

**MTG Safari Overlay provides instant context:**

* **Zero-Tab Switching:** The info comes to you as a sliding console.  
* **Electric Pricing:** Vibrant green pricing (![][image1]) that pops against the dark UI.  
* **Universal Legality:** A dedicated 8-format grid (✓/✕) for EDH, Brawl (S/H), Modern, Standard, Pioneer, Legacy, and Arena.  
* **Usage Insights:** Identifies "Global Staples" and calculates synergy scores (e.g., ![][image2] synergy) with top commanders.  
* **Responsive Design:** Optimized for iPhone portrait and iPad landscape views.

## **🚀 Installation**

### **1\. Fork this Repo (Required)**

To ensure fast performance and avoid traffic bottlenecks, please **Fork** this repository to your own GitHub account.

* Once forked, go to **Settings \> Pages**.  
* Under "Build and deployment", set the Branch to main and folder to /(root).  
* Click **Save**.  
* Your script URL will be https://\<YOUR\_USERNAME\>.github.io/mtg-overlay/overlay.js.

### **2\. Create the Safari Bookmarklet**

Copy the loader code below, replacing \<YOUR\_USERNAME\> with your actual GitHub username:

javascript:(function(){  
  var script \= document.createElement('script');  
  script.src \= 'https://\<YOUR\_USERNAME\>.github.io/mtg-overlay/overlay.js?v=' \+ Math.random();  
  document.body.appendChild(script);  
})();

### **3\. Safari Setup**

1. Open **Safari** on your iPhone or iPad.  
2. Bookmark any page and name it **"Scan MTG"**.  
3. Open your Bookmarks, tap **Edit**, find "Scan MTG", and paste the code from Step 2 into the URL field.  
4. **Save.**

## **🛠 How to Use**

1. **Highlight Mode:** Simply highlight a card name (e.g., "The One Ring") on any website.  
2. **Trigger:** Tap your Safari Bookmarks and select **"Scan MTG"**.  
3. **Search Mode:** If no text is highlighted, the tool will prompt you to type a name.

## **⚖️ Credits & Data Sources**

* **Prices & Images:** [Scryfall](https://scryfall.com) (TCGPlayer Market)  
* **Deck Usage:** [EDHREC](https://edhrec.com)  
* **Price History:** [MTGGoldfish](https://mtggoldfish.com)

*This tool is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards.*

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAD0AAAAUCAYAAAA+wTUXAAADD0lEQVR4Xu2WXWjOcRTHj5cJeeeKrNwpCUm7V4obuSCJFnGnxIRJbUQpL7nwmmbDjfJS81pemoWEPc+2nuYJN3Mxr6G1JG2z+ZztnO3nv/9Te+aO/6lv55zv+Z2X3+//e/7/RySRRP4PqRNZ3igyQ+2USBoUqf1QZHRaZCvxSvQl+Nl/ZvasPwnOazwaU4EvJ34K/AQ/cnH0eIBdr/2J14Y1ukWGEV+ja7QPuBjGhyQ0eh/YNYHdTYPVgf9OD8LsaaCZgYYH8S4GW+m+cffcJrYgjsNvdV/lhch8+t5xX+fQQ3LfHsRO94ckWlS1bgi7VO2nIlOwv/smVWh2HGywnKOe54L/C7x1v0lkHP7NYEksF62jTxauOYyDEveZYSF+lft5CYm7DV9N3+UE96iNvoGuCNfzBBbZxvQp6yDRTd92Dl0ELoAs2M6g6+I4W/sKPNa65p8Gc4O67Vr3ssgI8zN6eB7PS9jYNhrvoMgtUApalVNgvwT7wvVseqY2t80P2DS1zjlXLzIPuwI06e3Q90Ycp2vRS6xeM/Yh9Mewrs6hcXLuPxeZVdeT8hdC9l4KFlBwbbgJ7C6wJVyLP9aar7chv4VxG7ivBn5xKvj95uJU4EqsptY/E42reBxsisYGJSQWUXwpuhO9GN2iJ6m2/e7q9apHcgqtqV/vjjDO+krlA3/ABuM4em6GX2bxnoNDn/A4/hXwSW2e9FTrvcrjgxaSqkBKC9D0qhV6ZA30iVaDw2EO13oO3GfLH3C9LTfvTeO3RfxdoAMUmh99e1/Hf9OfkYeQmE3b9xW7MYzZ21s/USOdwy/Tgcw+GG7QOP3ufnE/boNxXLSOc2CF22l76YXxjMjkkBuUaCJDbEQXgCM54sWBX/NMZILavJSm47f7G9XXgzL3rXbfdz8Xp3n6mYpwndrD45HrPhFk+1fnISS+Vs0pHuDJjomJ6zXXT8xZUO2/u8iaDPwxHaJBZJLzdb1/Otps4Gu8J0bFcbrWvsst2oNZatEfwkN4IjI+1XuzdI79oMFjiSSSSCKJ/OvyG67FrZ2nKI+gAAAAAElFTkSuQmCC>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADMAAAAWCAYAAABtwKSvAAACpUlEQVR4Xu2VTYiNYRTHZ0aRSRpyS/frvV8sbtTMZlaUKQsprCyURlKi7EZSZGEhE/IV2SjJBqtJykdZSQwWSEwpH43GGEWYfCV+p3kejtN73/ve211YvP86Pef8z/85zznvfZ/3trUlSBAbpVJpoeUsCoXCfMv9d6DJrUEQ/MA22ZxHLpdbSv6T5VuNDppZZ0kBhw9gfT5Op9PziLcbzST22vkHsV/5fP4U60rh8PuxK8SjnNOl97YUHLKZQx5xyBGbE0hjzp5j97Cf2LYQzWnxs9nsXDfMYdZn4lP7AvEZ1hV6Xyyw8ZXlLCi8H9vIT192B9YaRp662BiaIfTpEI0Ms0vFt3WefvbAvdBcbLBx3HK1wJPM1BnmouUs3DAnXNiB/9XnKpXKDOLjPm4YbJ6wXC20cJjL4vMrLAnUJafuIPes86+6QVDsneVqod4wNHeV/CFsBM0w612rge+Cf+pep/usc4SXIYgPWH1DaHKYozYnIHdDP1nis9hEKpWapXUWDLQc3Xcf4/cFU3fvm7x6WhuJZobBjtlcGGhyrRt+p81pyEcI3V7xi8ViL/5nhkiVy+Uc/jmrl5+3m0RPiH0I4XooNtvWUMOEXdJ2u4ev2SKnH9W8BoOsou5iHzv9Gx/T9zXv10XQ3C/jv0Z/APdecgyw2nM0sszpL2mtB/nz5G5pTvTwD1U8oPORaHKYkzYH90Carlar0z1HU1tEz9PfobUe5CapucBwUv+xj9m7T+cjEWcYmlpD0f5g6kLLYS/hNsCt9xqamgk3LH+sjpomWrkDXqOBdoil3fLs+Rj8+zEY0/lIxBkGzYg75C027lZ5rb5oHcPdccNed/qbOq8h+y0nkAckNXyM/0TnIxFnmFYjk8lkLWchrxe97bZ8ggQJGsNv7MvRJ6/cgAUAAAAASUVORK5CYII=>
