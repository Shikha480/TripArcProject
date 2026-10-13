import { BasePage } from './base.page.js';
import { Locator, byA11y, byId, byIdAndText, byPredicate } from '../platform.js';
import { MobileUtils } from '../mobile-utils.js';

export class CartPage extends BasePage {
  protected readonly screen: Locator = { android: byA11y('Confirms products for checkout'), ios: byA11y('ProceedToCheckout') };

  private readonly quantity: Locator = { android: byId('noTV'), ios: byPredicate('name == "Amount"') };
  private readonly plusButton: Locator = { android: byA11y('Increase item quantity'), ios: byA11y('AddPlus Icons') };
  private readonly total: Locator = { android: byId('totalPriceTV'), ios: byPredicate('name == "Total Price"') };

  async hasProduct(name: string): Promise<boolean> {
    return this.isVisible({ android: byIdAndText('titleTV', name), ios: byPredicate(`label == "${name}"`) });
  }

  async quantityShown(): Promise<number> {
    return Number(await this.textOf(this.quantity));
  }

  async increaseQuantity(): Promise<void> {
    await this.tap(this.plusButton);
  }

  async waitForTotal(expectedCents: number): Promise<number> {
    return MobileUtils.waitForValue(
      `cart total of ${expectedCents} cents`,
      async () => MobileUtils.toCents(await this.textOf(this.total)),
      (cents) => cents === expectedCents,
    );
  }

  async proceedToCheckout(): Promise<void> {
    await this.tap(this.screen);
  }
}
