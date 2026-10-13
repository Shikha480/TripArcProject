import { Before, Given, When, Then } from '@wdio/cucumber-framework';
import { pages } from '../../src/pages/index.js';
import type { Product } from '../../src/pages/product.page.js';
import { testData } from '../../src/test-data.js';

/** The product opened in this scenario (name and price as shown in the app). */
let product: Product | undefined;

Before(() => {
  product = undefined;
});

/* ---------- Helpers shared by several steps ---------- */

async function openProduct(name: string): Promise<void> {
  await pages.catalog.openProduct(name);
  await pages.product.waitForScreen();
  product = await pages.product.readProduct(name);
}

async function addToCart(): Promise<void> {
  await pages.product.addToCart();
  await pages.header.waitForCartCount(1);
}

async function openCart(): Promise<void> {
  if (await pages.cart.isOpen()) return;
  await pages.header.openCart();
  await pages.cart.waitForScreen();
}

/* ---------- Steps ---------- */

Given('the app is open on the products screen', async () => {
  await pages.catalog.waitForScreen();
});

Given('the user has {string} in the cart', async (name: string) => {
  await openProduct(name);
  await addToCart();
  await openCart();
});

When('the user scrolls to and opens {string}', async (name: string) => {
  await openProduct(name);
});

When('adds it to the cart', async () => {
  await addToCart();
});

When('the user increases the quantity by {int}', async (times: number) => {
  for (let i = 0; i < times; i++) await pages.cart.increaseQuantity();
});

When('the user proceeds to checkout and logs in as the {string} user', async (user: string) => {
  await openCart();
  await pages.cart.proceedToCheckout();
  await pages.login.waitForScreen();
  await pages.login.login(testData.user(user));
});

Then('{string} is in the cart with quantity {int}', async (name: string, quantity: number) => {
  await openCart();
  expect(await pages.cart.hasProduct(name)).toBe(true);
  expect(await pages.cart.quantityShown()).toBe(quantity);
});

// Real value check: quantity x the price read on the product screen, compared in cents.
Then('the total is {int} x the product price', async (quantity: number) => {
  const expected = product!.priceCents * quantity;
  expect(await pages.cart.waitForTotal(expected)).toBe(expected);
});

Then('the shipping address screen is shown', async () => {
  await pages.shipping.waitForScreen();
});
