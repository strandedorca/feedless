## Extension name: Feedless

## Description:

We scroll through social media in the name of finding inspiration, but more than often we end up wasting hours just scrolling and creating nothing. This extension simply hides feed and related content, disabling the 'scrolling' feature of Instagram and Pinterest. I'm sure you have hundreds if not thousands of saved content already, you've consumed enough, it's time to create.

## Features:

1. Hide feed.
2. Hide related content.

## Development Notes:

1. Hide Pinterest feed.

- Just hide the feed node in the DOM (`data-test-id="homefeed-feed"`).

2. Hide related pin when seeing a single pin.

- Hide every node other than the first one (`[data-grid-item-idx]:not([data-grid-item-idx="0"]`).
- Problem: the board page is affected too since Pinterest uses the class `data-grid-item-idx` for every page.
  - Solution: Check the current URL then add a custom class to distinguish which page is currently open.
