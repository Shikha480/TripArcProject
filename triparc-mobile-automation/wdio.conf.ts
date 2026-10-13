import 'dotenv/config';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { MobileUtils } from './src/mobile-utils.js';

const env = process.env;

export const config: WebdriverIO.Config = {
  runner: 'local',
  port: 4723,
  specs: ['./features/**/*.feature'],
  maxInstances: 1,
  logLevel: 'warn',

  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:udid': env.ANDROID_UDID || undefined, // pick a device when several are connected
      'appium:platformVersion': env.ANDROID_PLATFORM_VERSION || undefined,
      'appium:app': path.resolve(env.ANDROID_APP_PATH || './apps/mda.apk'),
      'appium:appWaitActivity': 'com.saucelabs.mydemoapp.android.view.activities.*', // splash -> main
      'appium:autoGrantPermissions': true, // permission pop-ups can't block the run
      'appium:newCommandTimeout': 240,
    },
  ],

  // Explicit waits only (no implicit wait, no pause()).
  waitforTimeout: Number(env.WAIT_TIMEOUT || 15_000),
  connectionRetryTimeout: 120_000,

  // Appium is started and stopped automatically.
  services: [['appium', { command: 'appium', args: { log: './reports/appium.log' } }]],

  framework: 'cucumber',
  cucumberOpts: {
    require: [path.join(process.cwd(), 'features/step-definitions/*.ts')],
    timeout: 120_000,
  },
  reporters: ['spec'],

  // Every scenario starts from a clean app, so tests don't depend on each other.
  beforeScenario: async () => {
    await MobileUtils.resetApp();
  },

  // When a step fails, save a screenshot.
  afterStep: async (step, scenario, result) => {
    if (result.passed) return;
    const dir = path.resolve('reports/failures');
    const name = `${scenario.name}-${step.text}`.replace(/[^a-z0-9]+/gi, '_').slice(0, 100);
    mkdirSync(dir, { recursive: true });
    await driver.saveScreenshot(path.join(dir, `${name}.png`));
    writeFileSync(path.join(dir, `${name}.xml`), await driver.getPageSource());
  },
};