import { BasePage } from './base.page.js';
import { Locator, byA11y } from '../platform.js';

export class ShippingPage extends BasePage {
  protected readonly screen: Locator = { android: byA11y('Saves user info for checkout'), ios: byA11y('To Payment button') };
}
