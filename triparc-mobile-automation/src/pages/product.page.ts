import { BasePage } from './base.page.js';
import { Locator, byA11y, byId, byIdAndText, byPredicate } from '../platform.js';
import { MobileUtils } from '../mobile-utils.js';

export interface Product {
  name: string;
  priceCents: number;
}

export class ProductPage extends BasePage {
  protected readonly screen: Locator = { android: byId('productTV'), ios: byPredicate('name == "product name"') };

  private readonly title: Locator = { android: byId('productTV'), ios: byPredicate('name == "product name"') };
  private readonly price: Locator = { android: byId('priceTV'), ios: byPredicate('name == "product price"') };
  private readonly addToCartButton: Locator = { android: byA11y('Tap to add product to cart'), ios: byA11y('Add To Cart button') };

  async waitForProduct(name: string): Promise<void> {
    const titleWithName: Locator = { android: byIdAndText('productTV', name), ios: byPredicate(`label == "${name}"`) };
    await this.isVisible(titleWithName, 15_000).then((shown) => {
      if (!shown) throw new Error(`Product screen for "${name}" did not open`);
    });
  }

  async readProduct(name: string): Promise<Product> {
    await this.waitForProduct(name);
    return { name: await this.textOf(this.title), priceCents: MobileUtils.toCents(await this.textOf(this.price)) };
  }

  async addToCart(): Promise<void> {
    await this.tap(this.addToCartButton);
  }
}