Feature: Shopping on My Demo App
  As a shopper using the My Demo App
  I want to add products to my cart and check out
  So that I can buy what I need

  Business rules:
    - The cart shows the products the user added, with the right quantity
    - A user must log in before checking out
    - The cart total is the product price multiplied by the quantity

  Background:
    Given the app is open on the products screen

  @smoke
  Scenario: Shopper adds a product to the cart and proceeds to checkout
    The main journey: scroll to the red backpack (one of several backpack colours), add it
    to the cart, confirm the cart, then log in and reach the shipping address screen.

    When the user scrolls to and opens "Sauce Labs Backpack (red)"
    And adds it to the cart
    Then "Sauce Labs Backpack (red)" is in the cart with quantity 1
    And the user proceeds to checkout and logs in as the "standard" user
    Then the shipping address screen is shown

  @edge
  Scenario: Cart total updates when the quantity changes
    The total refreshes a moment after the quantity changes, so the test checks
    the actual amount shown rather than just that the total is on screen.

    Given the user has "Sauce Labs Backpack" in the cart
    When the user increases the quantity by 1
    Then the total is 2 x the product price