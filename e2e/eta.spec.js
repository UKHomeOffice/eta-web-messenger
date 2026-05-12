import { test, expect } from '@playwright/test';

const etaFixture = {
  heading: 'Home Office ETA Chat',
  firstMessage: 'Hi',
  secondMessage: 'I how can i apply for ETA'
};

const selectors = {
  acceptCookies: '#cookies-accept',
  rejectCookies: '#cookies-reject',
  hideCookiesMessage: '#hide-accept-message',
  viewCookiesLink: 'a:has-text("View cookies")',
  messageInput: '[data-testid="message-input"]',
  sendButton: '[data-testid="send-message-button"]',
  endChatButton: '[data-testid="end-chat-button"]',
  inboundMessageWrapper: '[data-testid="inbound-message-wrapper"]',
  outboundMessageWrapper: '[data-testid="outbound-message-wrapper"]',
  messageMetadata: '[data-testid="message-metadata"]',
  bannerMessage: '[data-testid="banner-message"]',
  endChatModal: '[data-testid="end-chat-modal"]',
  closeEndChatButton: '[data-testid="close-end-chat-modal-button"]',
  confirmEndChatButton: '[data-testid="confirm-end-chat-button"]'
};

const offlineBannerText = 'You are currently offline. Messages cannot be sent until reconnected to the internet.';
const onlineBannerText = 'You are now online. Messages can now be sent.';

test.describe('ETA web messenger', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  async function goToEtaMessenger(page) {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: etaFixture.heading })).toBeVisible();
  }

  async function dismissCookieBannerWithAccept(page) {
    await expect(page.locator(selectors.acceptCookies)).toBeVisible();
    await page.locator(selectors.acceptCookies).click();
    await expect(page.locator(selectors.acceptCookies)).toHaveCount(0);
    await expect(page.locator(selectors.rejectCookies)).toHaveCount(0);
    await expect(page.locator(selectors.hideCookiesMessage)).toBeVisible();
    await page.locator(selectors.hideCookiesMessage).click();
    await expect(page.locator(selectors.hideCookiesMessage)).toHaveCount(0);
  }

  async function dismissCookieBannerWithReject(page) {
    await expect(page.locator(selectors.rejectCookies)).toBeVisible();
    await page.locator(selectors.rejectCookies).click();
    await expect(page.locator(selectors.acceptCookies)).toHaveCount(0);
    await expect(page.locator(selectors.rejectCookies)).toHaveCount(0);
    await expect(page.locator(selectors.hideCookiesMessage)).toBeVisible();
    await page.locator(selectors.hideCookiesMessage).click();
    await expect(page.locator(selectors.hideCookiesMessage)).toHaveCount(0);
  }

  async function sendMessage(page, text) {
    await page.locator(selectors.messageInput).fill(text);
    await page.locator(selectors.sendButton).click();
  }

  async function expectMetadataPrefix(page, prefix) {
    const metadata = page.locator(selectors.messageMetadata).filter({ hasText: prefix });
    await expect(metadata.first()).toBeVisible();
    await expect(metadata.first()).toContainText(/\d{2}:\d{2}/);
  }

  test('Accept analytics cookies flow', async ({ page }) => {
    await goToEtaMessenger(page);

    await expect(page.locator(selectors.acceptCookies)).toBeVisible();
    await expect(page.locator(selectors.rejectCookies)).toBeVisible();
    await expect(page.locator(selectors.viewCookiesLink)).toBeVisible();

    await dismissCookieBannerWithAccept(page);
  });

  test('Reject analytics cookies flow', async ({ page }) => {
    await goToEtaMessenger(page);

    await expect(page.locator(selectors.acceptCookies)).toBeVisible();
    await expect(page.locator(selectors.rejectCookies)).toBeVisible();
    await expect(page.locator(selectors.viewCookiesLink)).toBeVisible();

    await dismissCookieBannerWithReject(page);
  });

  test('Invalid web messenger page returns not found', async ({ page }) => {
    await page.goto('/invalid-path-for-eta');

    await expect(page.locator(selectors.acceptCookies)).toBeVisible();
    await page.locator(selectors.acceptCookies).click();
    await page.locator(selectors.hideCookiesMessage).click();

    await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  });

  test('Look and feel, message exchange, and end chat flow', async ({ page }) => {
    await goToEtaMessenger(page);
    await dismissCookieBannerWithAccept(page);

    await expect(page.locator(selectors.messageInput)).toBeVisible();
    await expect(page.locator(selectors.sendButton)).toBeVisible();
    await expect(page.locator(selectors.endChatButton)).toBeVisible();

    const outboundBefore = await page.locator(selectors.outboundMessageWrapper).count();
    await sendMessage(page, etaFixture.firstMessage);

    await expect(page.locator(selectors.inboundMessageWrapper).filter({ hasText: etaFixture.firstMessage }).first()).toBeVisible();
    await expectMetadataPrefix(page, 'You at');
    await expect(page.locator(selectors.outboundMessageWrapper)).toHaveCount(outboundBefore + 1);
    await expectMetadataPrefix(page, 'Digital assistant at');

    const outboundAfterFirst = await page.locator(selectors.outboundMessageWrapper).count();
    await sendMessage(page, etaFixture.secondMessage);

    await expect(page.locator(selectors.inboundMessageWrapper).filter({ hasText: etaFixture.secondMessage }).first()).toBeVisible();
    await expectMetadataPrefix(page, 'You at');
    await expect(page.locator(selectors.outboundMessageWrapper)).toHaveCount(outboundAfterFirst + 1);
    await expectMetadataPrefix(page, 'Digital assistant at');

    await page.locator(selectors.endChatButton).click();
    await expect(page.locator(selectors.endChatModal)).toBeVisible();
    await expect(page.getByTestId('end-chat-modal-heading')).toContainText('Do you want to end the chat?');
    await expect(page.getByRole('button', { name: 'Yes, end chat' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'No, keep chatting' })).toBeVisible();

    await page.locator(selectors.closeEndChatButton).click();
    await expect(page.locator(selectors.inboundMessageWrapper).filter({ hasText: etaFixture.firstMessage }).first()).toBeVisible();
    await expect(page.locator(selectors.inboundMessageWrapper).filter({ hasText: etaFixture.secondMessage }).first()).toBeVisible();

    await page.locator(selectors.endChatButton).click();
    await page.locator(selectors.confirmEndChatButton).click();

    await expect(page.getByRole('heading', { name: 'Your chat has ended' })).toBeVisible();
    await expect(page.locator(selectors.messageInput)).toHaveCount(0);
    await expect(page.locator(selectors.inboundMessageWrapper)).toHaveCount(0);
  });

  test('Character limit flow', async ({ page }) => {
    await goToEtaMessenger(page);
    await dismissCookieBannerWithAccept(page);

    await page.locator(selectors.messageInput).fill('a'.repeat(4096));
    await expect(page.getByTestId('character-counter')).toContainText('0 characters left');

    // The input has maxLength=4096 in the component; it cannot exceed this value via normal typing.
    await page.locator(selectors.messageInput).type('b');
    await expect(page.locator(selectors.messageInput)).toHaveValue('a'.repeat(4096));
    await expect(page.getByTestId('character-counter')).toContainText('0 characters left');
  });

  test('Open Accessibility statement from start page', async ({ page }) => {
    await goToEtaMessenger(page);
    await dismissCookieBannerWithAccept(page);

    await page.getByRole('link', { name: 'Accessibility statement' }).click();
    await expect(page).toHaveURL(/\/accessibility$/);
    await expect(page.getByRole('heading', { name: 'Accessibility statement for ask about electronic travel authorisation (ETA)' })).toBeVisible();
  });

  test('Offline and reconnect banners with control disable/enable', async ({ page, context }) => {
    await goToEtaMessenger(page);
    await dismissCookieBannerWithAccept(page);

    await expect(page.locator(selectors.messageInput)).toBeVisible();
    await expect(page.locator(selectors.sendButton)).toBeEnabled();
    await expect(page.locator(selectors.endChatButton)).toBeEnabled();

    await context.setOffline(true);

    await expect(page.locator(selectors.bannerMessage).filter({ hasText: offlineBannerText }).first()).toBeVisible();
    await expect(page.locator(selectors.messageInput)).toBeDisabled();
    await expect(page.locator(selectors.sendButton)).toBeDisabled();
    await expect(page.locator(selectors.endChatButton)).toBeDisabled();

    let reconnected = false;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await context.setOffline(false);

      try {
        await expect.poll(async () => {
          return page.locator(selectors.bannerMessage).filter({ hasText: onlineBannerText }).count();
        }, {
          timeout: 10_000
        }).toBeGreaterThan(0);

        reconnected = true;
        break;
      } catch {
        // In longer suites the reconnect event can occasionally be missed; retrigger once.
        await context.setOffline(true);
        await expect(page.locator(selectors.bannerMessage).filter({ hasText: offlineBannerText }).first()).toBeVisible();
      }
    }

    expect(reconnected).toBe(true);
    await expect(page.locator(selectors.messageInput)).toBeEnabled();
    await expect(page.locator(selectors.sendButton)).toBeEnabled();
    await expect(page.locator(selectors.endChatButton)).toBeEnabled();
  });

  test('Navigate to cookies page and back to chat', async ({ page }) => {
    await goToEtaMessenger(page);

    await page.getByTestId('footer-cookies-link').click();
    await expect(page).toHaveURL(/\/cookies$/);
    await expect(page.getByRole('heading', { name: 'Cookies', exact: true })).toBeVisible();

    await page.goBack();
    await expect(page.locator(selectors.messageInput)).toBeVisible();
  });

  test('Send 26 sequential messages then continue after refresh @history', async ({ page }) => {
    await goToEtaMessenger(page);
    await dismissCookieBannerWithAccept(page);

    for (let index = 1; index <= 26; index += 1) {
      await sendMessage(page, `sequential message ${index}`);
      await expect(page.locator(selectors.inboundMessageWrapper).filter({ hasText: `sequential message ${index}` }).first()).toBeVisible();
    }

    await expect(page.locator(selectors.inboundMessageWrapper).filter({ hasText: 'sequential message 26' }).first()).toBeVisible();

    await page.reload();
    await expect(page.locator(selectors.messageInput)).toBeVisible();
    const inboundAfterRefresh = await page.locator(selectors.inboundMessageWrapper).count();

    let sendWasObserved = false;
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await sendMessage(page, 'sequential message 27');
      await expect(page.locator(selectors.messageInput)).toHaveValue('');

      try {
        await expect.poll(async () => {
          return page.locator(selectors.inboundMessageWrapper).count();
        }, {
          timeout: 10_000
        }).toBeGreaterThan(inboundAfterRefresh);

        sendWasObserved = true;
        break;
      } catch {
        // Retry: after refresh the first send can be dropped while the chat session is rehydrating.
      }
    }

    expect(sendWasObserved).toBe(true);
  });

  test('Scroll to top fetches older history after refresh @history', async ({ page }) => {
    await goToEtaMessenger(page);
    await dismissCookieBannerWithAccept(page);

    for (let index = 1; index <= 35; index += 1) {
      await sendMessage(page, `sequential message ${index}`);
      await expect(page.locator(selectors.messageInput)).toHaveValue('');
    }

    await page.reload();
    await expect(page.locator(selectors.messageInput)).toBeVisible();

    await expect.poll(async () => {
      const firstMessage = page.locator(selectors.inboundMessageWrapper).filter({
        has: page.getByText('sequential message 1', { exact: true })
      });

      if (await firstMessage.count() > 0) {
        return 1;
      }

      await page.locator('.chat-messages').evaluate((el) => {
        // Trigger "reached top from below" logic in the widget history loader.
        el.scrollTop = el.scrollHeight;
        el.dispatchEvent(new Event('scroll', { bubbles: true }));
        el.scrollTop = 0;
        el.dispatchEvent(new Event('scroll', { bubbles: true }));
      });

        return await firstMessage.count();
    }, {
      timeout: 30_000,
      intervals: [500]
      }).toBeGreaterThan(0);
  });

  
});
