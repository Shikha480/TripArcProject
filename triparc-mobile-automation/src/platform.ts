/**
 * Android/iOS abstraction.
 * Every locator is written once with both platforms.
 */
export interface Locator {
  android: string;
  ios: string;
}

export const ANDROID_PACKAGE = 'com.saucelabs.mydemoapp.android';
export const IOS_BUNDLE_ID = 'com.saucelabs.mydemo.app.ios';

export const sel = (locator: Locator): string => (driver.isAndroid ? locator.android : locator.ios);

/** Accessibility id: Android content-desc / iOS accessibilityIdentifier. First choice. */
export const byA11y = (id: string): string => `~${id}`;

/** Android resource-id. */
export const byId = (id: string): string => `android=new UiSelector().resourceId("${ANDROID_PACKAGE}:id/${id}")`;

/** Android resource-id + exact text, for elements that share an id (list rows, titles). */
export const byIdAndText = (id: string, text: string): string =>
  `android=new UiSelector().resourceId("${ANDROID_PACKAGE}:id/${id}").text("${text}")`;

export const bySiblingOf = (id: string, text: string, siblingId: string): string =>
  `android=new UiSelector().resourceId("${ANDROID_PACKAGE}:id/${id}").text("${text}")` +
  `.fromParent(new UiSelector().resourceId("${ANDROID_PACKAGE}:id/${siblingId}"))`;

/** iOS predicate string. */
export const byPredicate = (predicate: string): string => `-ios predicate string:${predicate}`;