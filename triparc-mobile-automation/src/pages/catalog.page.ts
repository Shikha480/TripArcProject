import { BasePage } from './base.page.js';
import { Locator, byA11y, byPredicate, bySiblingOf } from '../platform.js';
import { MobileUtils } from '../mobile-utils.js';

export class CatalogPage extends BasePage {
  protected readonly screen: Locator = { android: byA11y('Displays all products of catalog'), ios: byA11y('Products') };

  async openProduct(name: string): Promise<void> {
    const image = await MobileUtils.scrollTo({
      android: bySiblingOf('titleTV', name, 'productIV'),
      ios: byPredicate(`label == "${name}"`),
    });
    await image.click();
  }
}