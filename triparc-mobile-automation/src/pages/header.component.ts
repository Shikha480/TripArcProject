import { Locator, byA11y, byId, byPredicate, sel } from '../platform.js';
import { MobileUtils } from '../mobile-utils.js';

export class Header {
  private readonly cartIcon: Locator = { android: byA11y('View cart'), ios: byA11y('tab bar option cart') };
  private readonly cartBadge: Locator = { android: byId('cartTV'), ios: byPredicate('name == "tab bar option cart"') };

  async openCart(): Promise<void> {
    await $(sel(this.cartIcon)).click();
  }
  async waitForCartCount(expected: number): Promise<number> {
    return MobileUtils.waitForValue(
      `cart icon to show ${expected}`,
      async () => MobileUtils.firstNumber(await $(sel(this.cartBadge)).getText()),
      (count) => count === expected,
    );
  }
}
