import { ANDROID_PACKAGE, IOS_BUNDLE_ID, Locator, sel } from './platform.js';
export class MobileUtils {
 
  static async waitForValue<T>(description: string, read: () => Promise<T>, predicate: (value: T) => boolean): Promise<T> {
    let last: T | undefined;
    try {
      await browser.waitUntil(
        async () => {
          try {
            last = await read();
            return predicate(last);
          } catch {
            return false; 
          }
        },
        { interval: 250 },
      );
    } catch {
      throw new Error(`Timed out waiting for ${description}. Last value: ${JSON.stringify(last)}`);
    }
    return last as T;
  }

  static async scrollTo(locator: Locator, maxSwipes = 3): Promise<WebdriverIO.Element> {
    for (let swipe = 0; swipe <= maxSwipes; swipe++) {
      const el = await $(sel(locator)).getElement();
      if (await el.isDisplayed()) return el;
      if (swipe < maxSwipes) await MobileUtils.swipeUp();
    }
    throw new Error(`Could not find ${sel(locator)} after ${maxSwipes} swipes`);
  }

  /** One slow upward swipe from 70% to 30% of the screen (W3C actions: Android and iOS). */
  static async swipeUp(): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const x = Math.round(width / 2);
    await driver
      .action('pointer', { parameters: { pointerType: 'touch' } })
      .move({ x, y: Math.round(height * 0.7) })
      .down()
      .pause(100)
      .move({ duration: 800, x, y: Math.round(height * 0.3) })
      .up()
      .perform();
  }

  static async hideKeyboard(): Promise<void> {
    if (await driver.isKeyboardShown()) await driver.hideKeyboard();
  }

  static async resetApp(): Promise<void> {
    if (driver.isAndroid) {
      await driver.execute('mobile: clearApp', { appId: ANDROID_PACKAGE });
      await driver.execute('mobile: activateApp', { appId: ANDROID_PACKAGE });
    } else {
      await driver.execute('mobile: terminateApp', { bundleId: IOS_BUNDLE_ID });
      await driver.execute('mobile: launchApp', { bundleId: IOS_BUNDLE_ID });
    }
  }


  static toCents(price: string): number {
    const match = price.replace(/,/g, '').match(/(\d+)(?:\.(\d{1,2}))?/);
    if (!match) throw new Error(`Not a price: "${price}"`);
    return Number(match[1]) * 100 + Number((match[2] ?? '0').padEnd(2, '0'));
  }

  static firstNumber(text: string): number {
    const match = text.match(/\d+/);
    if (!match) throw new Error(`No number in "${text}"`);
    return Number(match[0]);
  }
}
