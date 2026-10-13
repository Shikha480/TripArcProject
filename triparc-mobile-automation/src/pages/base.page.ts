import { Locator, sel } from '../platform.js';
import { MobileUtils } from '../mobile-utils.js';

export abstract class BasePage {
  protected abstract readonly screen: Locator;

  async waitForScreen(): Promise<void> {
    await $(sel(this.screen)).waitForDisplayed({ timeoutMsg: `${this.constructor.name} did not open` });
  }

  async isOpen(): Promise<boolean> {
    return $(sel(this.screen)).isDisplayed();
  }

  protected async isVisible(locator: Locator, timeout = 5_000): Promise<boolean> {
    return $(sel(locator)).waitForDisplayed({ timeout }).then(() => true, () => false);
  }

  protected async find(locator: Locator): Promise<WebdriverIO.Element> {
    const el = await $(sel(locator)).getElement();
    const visible = await el.waitForDisplayed({ timeout: 3_000 }).then(() => true, () => false);
    return visible ? el : MobileUtils.scrollTo(locator);
  }

  protected async tap(locator: Locator): Promise<void> {
    const el = await this.find(locator);
    await el.waitForEnabled();
    await el.click();
  }

  protected async textOf(locator: Locator): Promise<string> {
    return (await (await this.find(locator)).getText()).trim();
  }

  protected async fillForm<T extends object>(fields: Record<keyof T, Locator>, values: T): Promise<void> {
    for (const key of Object.keys(fields) as (keyof T)[]) {
      await (await this.find(fields[key])).setValue(String(values[key]));
      await MobileUtils.hideKeyboard();
    }
  }
}
