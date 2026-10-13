import { Header } from './header.component.js';
import { CatalogPage } from './catalog.page.js';
import { ProductPage } from './product.page.js';
import { CartPage } from './cart.page.js';
import { LoginPage } from './login.page.js';
import { ShippingPage } from './shipping.page.js';

export const pages = Object.freeze({
  header: new Header(),
  catalog: new CatalogPage(),
  product: new ProductPage(),
  cart: new CartPage(),
  login: new LoginPage(),
  shipping: new ShippingPage(),
});
