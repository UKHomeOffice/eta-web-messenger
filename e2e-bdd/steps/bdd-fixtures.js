import { test as base } from 'playwright-bdd';
import { EtaMessengerPage } from '../pages/eta-messenger-page';

export const test = base.extend({
  etaPage: async ({ page, context }, applyFixture) => {
    await applyFixture(new EtaMessengerPage(page, context));
  }
});
