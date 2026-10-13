import { BasePage } from './base.page.js';
import { Locator, byA11y, byId } from '../platform.js';
import type { User } from '../test-data.js';

export class LoginPage extends BasePage {
  protected readonly screen: Locator = { android: byA11y('Tap to login with given credentials'), ios: byA11y('Login Button') };

  private readonly fields: Record<keyof User, Locator> = {
    username: { android: byId('nameET'), ios: byA11y('Username input field') },
    password: { android: byId('passwordET'), ios: byA11y('Password input field') },
  };

  async login(user: User): Promise<void> {
    await this.fillForm(this.fields, user);
    await this.tap(this.screen);
  }
}
