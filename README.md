## **Extension name: Feedless**

## Description:

We scroll through social media in the name of finding inspiration, but more than often we end up wasting hours just scrolling and creating nothing. This extension simply hides feed and related content, disabling the 'scrolling' feature of Instagram and Pinterest. I'm sure you have hundreds if not thousands of saved content already, you've consumed enough, it's time to create.

## Features:

1. Hide feed.
2. Hide related content.

## Limitations:

- There is currently no popup or toggle. The extension is always on. To disable it, you need to go to your browser's extension settings and disable it from there. A toggle popup is planned for a future version.

## Development Notes:

1. **Hide Pinterest feed.**

- Just hide the feed node in the DOM (`data-test-id="homefeed-feed"`).
- ~~Hide the last child of that node instead of the whole node (keep the first child which suggests some saved boards)~~.

2. **Hide related pin when seeing a single pin.**

- Hide every node other than the first one (`[data-grid-item-idx]:not([data-grid-item-idx="0"]`).
- Problem: the board page is affected too since Pinterest uses the class `data-grid-item-idx` for every page.
  - Solution: Check the current URL then add a custom class to distinguish which page is currently open.
- Problem: the script only runs once when the site is open, not when the user navigates, so the custom class is applied once only and does not update.
  - Solution: add event listeners for when user performs a click or navigates through the browser's history stack.

3. ~~**Disable scrolling when scrolling a single pin.**~~

- Just hide overflow of the body when it's single pin page -> not working, long pin won't show.
- 25/5: I gave up after 2 days of trying to mess with this. Just don't scroll, there's no reason to scroll anyways, right?

4. **Center the pin when viewing single pin**

- Select the node then override `left` and `transform` style with JavaScript (can't use pure CSS because it seems that Pinterest unmounts the component then mounts again).
- Problem: the pin isn't established when the script runs the first time, so the pin isn't center at all and only centered after a click (or popstate).
  - Solution: add a MutationObserver on the body and run `centerPin` again once some changes are observed.
- Problem: when navigating somewhere else after viewing a single pin (board view or search,...), the first pin is always centered.
  - Solution: the observers are stacked up (everytime `applyCustomPageClass` is called while being on the single pin page) and keep calling `centerPin` even after the user navigated away -> disconnect the previous observer before making a new one.

4. **Hide Instagram feed.**

- Hide posts in the home timeline (`main article` on `/`).
- Hide the loading spinner so an empty feed does not show a perpetual loader.
- Hide the "Suggested for you" accounts sidebar via the stable `/explore/people/` link.
- Disable the Reels page (`/reels/...`) and hide the Reels nav link.

## Next Steps:

- **Add a popup.**
- **Hide Instagram Explore page.**
- **Customizable background on home feed.**
