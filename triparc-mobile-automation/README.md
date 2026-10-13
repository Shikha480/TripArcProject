# TripArc Mobile Automation Assessment

Appium + WebdriverIO + TypeScript + Cucumber tests for the [Sauce Labs My Demo App (Android)](https://github.com/saucelabs/my-demo-app-android). One feature file, two tests, one page class per screen.

| Test                                                          | Tag       | Covers |

| Shopper adds a product to the cart and proceeds to checkout   | `@smoke`  | Launch → scroll to "Sauce Labs Backpack (red)" → open → add to cart → verify cart → checkout → log in →                                                                            shipping screen |
| Cart total updates when the quantity changes                  | `@edge`   | Increase the quantity and check the actual total equals 2 × the product price |

## How to run

**1. Install (one time):** Node 20+, Java JDK 17, Android Studio (SDK + emulator), then:

```bash
npm install -g appium
appium driver install uiautomator2
```

Set `ANDROID_HOME` and `JAVA_HOME`, and add `platform-tools` to `Path`. Check with `appium driver doctor uiautomator2`.

**2. Device:** start an emulator, or connect an Android phone with **USB debugging** on. `adb devices` should list it as `device`.

**3. Project:**

```bash
git clone <this-repo-url>
cd triparc-mobile-automation
npm install
```

**4. App:** from [the app's releases](https://github.com/saucelabs/my-demo-app-android/releases) → **Assets**, download the main `.apk` (not "Source code" or a test APK) and save it as `apps/mda.apk`.

**5. Settings:** copy `.env.example` to `.env` (`Copy-Item .env.example .env` on Windows). Leave `ANDROID_PLATFORM_VERSION` empty; set `ANDROID_UDID` only if several devices are connected.

**6. Run.** Appium is started automatically, so close any Appium you started yourself.

```bash
npm test                # both tests
npm run test:smoke      # checkout test
npm run test:edge       # cart total test
```

Failed steps save a screenshot and the UI tree to `reports/failures/`; the Appium log is `reports/appium.log`.

| Problem | Fix |
|---|---|
| `Missing script` | Run commands in the folder containing `package.json` |
| `address already in use :::4723` | Close the other Appium |
| Session fails on `platformVersion` | Leave `ANDROID_PLATFORM_VERSION` empty |
| Cloud upload: "Launcher Activity not found" | Upload the main APK, not a test APK |

## Framework structure

Page Object Model: one class per screen in `src/pages/` (extending `BasePage`), a shared `Header` component, and a `pages` registry with one instance of each. `MobileUtils` holds waits, scrolling and app reset; `platform.ts` holds the `{ android, ios }` locators. Steps contain no locators, and the app is reset before every scenario.

## Locator strategy

Accessibility id first, then resource-id, then exact product name; no XPath. Matching is exact because the catalog has six backpack colours, and the test taps the product **image** because it's the only clickable part of a catalog tile.

## Android and iOS

Every locator is written once with both values, e.g. `{ android: byA11y('Tap to add product to cart'), ios: byA11y('Add To Cart button') }`, and `sel()` picks one at runtime. For iOS I'd add an XCUITest capability block and verify the iOS ids in Appium Inspector.

## Issues found

- **"Sauce Labs Backpack (green)" does not open** when tapped in the catalog (app bug). Other products open normally.
- **Products far down the catalog are not reached** (framework limit): scrolling is capped at 3 swipes, so all backpacks work but items further down, such as "Sauce Labs Onesie", do not.
- **No error message for an empty card number** on the payment screen (app bug): the field turns red, but unlike the other fields no message is shown.

## Cloud execution (BrowserStack / Sauce Labs)

Upload the APK to get an app id, add a config reusing `wdio.conf.ts` with the provider's host, credentials (from environment variables), device and app id, and add the provider's WDIO service for video and logs. List several capabilities and set `maxInstances` to run devices in parallel. Tests and pages don't change.

## Reducing flaky tests

No sleeps (wait for the next screen and for actual values), exact and unique locators, independent tests, state set up via APIs instead of long UI journeys, and tracking any test that needs a retry.

## How AI was used

I used Claude as an assistant to read the app's source for locators and product data, draft boilerplate (config, page objects), help diagnose failures from my device runs, and proofread this README. The test design, scenarios, framework structure and synchronization approach are my decisions; I ran the tests and reviewed every file.

`.claude/skills/add-mobile-test/SKILL.md` gives an AI assistant this framework's rules and keeps a human in the loop: it proposes scenarios before writing code and never commits without approval.