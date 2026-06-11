import { expect } from '@playwright/test';

export class EtaMessengerPage {
  constructor(page, context) {
    this.page = page;
    this.context = context;
    this.heading = 'Home Office ETA Chat';
    this.offlineBannerText = 'You are currently offline. Messages cannot be sent until reconnected to the internet.';
    this.onlineBannerText = 'You are now online. Messages can now be sent.';

    this.selectors = {
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
      confirmEndChatButton: '[data-testid="confirm-end-chat-button"]',
      characterCounter: '[data-testid="character-counter"]'
    };

    this.lastOutboundCount = 0;
    this.lastInboundCountAfterRefresh = 0;
    this.sequentialMessageIndex = 0;
    this.sequentialPrefix = '';
  }

  async openHome() {
    await this.page.goto('/');
  }

  async openInvalidPage() {
    await this.page.goto('/invalid-path-for-eta');
  }

  async expectHeading() {
    await expect(this.page.getByRole('heading', { name: this.heading })).toBeVisible();
  }

  async expectCookieBannerControls() {
    await expect(this.page.locator(this.selectors.acceptCookies)).toBeVisible();
    await expect(this.page.locator(this.selectors.rejectCookies)).toBeVisible();
    await expect(this.page.locator(this.selectors.viewCookiesLink)).toBeVisible();
  }

  async acceptCookies() {
    await this.page.locator(this.selectors.acceptCookies).click();
  }

  async rejectCookies() {
    await this.page.locator(this.selectors.rejectCookies).click();
  }

  async hideCookieMessage() {
    await this.page.locator(this.selectors.hideCookiesMessage).click();
  }

  async expectCookieActionButtonsHidden() {
    await expect(this.page.locator(this.selectors.acceptCookies)).toHaveCount(0);
    await expect(this.page.locator(this.selectors.rejectCookies)).toHaveCount(0);
  }

  async expectHideCookieMessageVisible() {
    await expect(this.page.locator(this.selectors.hideCookiesMessage)).toBeVisible();
  }

  async expectHideCookieMessageHidden() {
    await expect(this.page.locator(this.selectors.hideCookiesMessage)).toHaveCount(0);
  }

  async dismissCookiesByAccepting() {
    await this.expectCookieBannerControls();
    await this.acceptCookies();
    await this.expectCookieActionButtonsHidden();
    await this.expectHideCookieMessageVisible();
    await this.hideCookieMessage();
    await this.expectHideCookieMessageHidden();
  }

  async expectNotFoundHeading() {
    await expect(this.page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  }

  async expectChatControlsVisible() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeVisible();
    await expect(this.page.locator(this.selectors.sendButton)).toBeVisible();
    await expect(this.page.locator(this.selectors.endChatButton)).toBeVisible();
  }

  async expectChatControlsEnabled() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeEnabled();
    await expect(this.page.locator(this.selectors.sendButton)).toBeEnabled();
    await expect(this.page.locator(this.selectors.endChatButton)).toBeEnabled();
  }

  async expectChatControlsDisabled() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeDisabled();
    await expect(this.page.locator(this.selectors.sendButton)).toBeDisabled();
    await expect(this.page.locator(this.selectors.endChatButton)).toBeDisabled();
  }

  async sendMessage(text) {
    this.lastOutboundCount = await this.page.locator(this.selectors.outboundMessageWrapper).count();
    await this.page.locator(this.selectors.messageInput).fill(text);
    await this.page.locator(this.selectors.sendButton).click();
  }

  async expectUserMessageVisible(text) {
    await expect(this.page.locator(this.selectors.inboundMessageWrapper).filter({ hasText: text }).first()).toBeVisible();
  }

  async expectMessageMetadataPrefix(prefix) {
    const metadata = this.page.locator(this.selectors.messageMetadata).filter({ hasText: prefix });
    await expect(metadata.first()).toBeVisible();
    await expect(metadata.first()).toContainText(/\d{2}:\d{2}/);
  }

  async expectAssistantResponseIncreased() {
    await expect.poll(async () => this.page.locator(this.selectors.outboundMessageWrapper).count(), {
      timeout: 30_000,
      intervals: [500, 1000, 2000]
    }).toBeGreaterThan(this.lastOutboundCount);
  }

  async openEndChatDialog() {
    await this.page.locator(this.selectors.endChatButton).click();
  }

  async expectEndChatDialog() {
    await expect(this.page.locator(this.selectors.endChatModal)).toBeVisible();
    await expect(this.page.getByTestId('end-chat-modal-heading')).toContainText('Do you want to end the chat?');
    await expect(this.page.getByRole('button', { name: 'Yes, end chat' })).toBeVisible();
    await expect(this.page.getByRole('button', { name: 'No, keep chatting' })).toBeVisible();
  }

  async keepChatting() {
    await this.page.locator(this.selectors.closeEndChatButton).click();
  }

  async confirmEndChat() {
    await this.page.locator(this.selectors.confirmEndChatButton).click();
  }

  async expectChatEndedPage() {
    await expect(this.page.getByRole('heading', { name: 'Your chat has ended' })).toBeVisible();
  }

  async expectChatCleared() {
    await expect(this.page.locator(this.selectors.messageInput)).toHaveCount(0);
    await expect(this.page.locator(this.selectors.inboundMessageWrapper)).toHaveCount(0);
  }

  async fillInputWithRepeatedCharacters(count, character) {
    await this.page.locator(this.selectors.messageInput).fill(character.repeat(count));
  }

  async typeOneCharacter(character) {
    await this.page.locator(this.selectors.messageInput).type(character);
  }

  async expectCharacterCounterText(text) {
    await expect(this.page.locator(this.selectors.characterCounter)).toContainText(text);
  }

  async expectInputClampedToCount(count, character) {
    await expect(this.page.locator(this.selectors.messageInput)).toHaveValue(character.repeat(count));
  }

  async openAccessibilityFromFooter() {
    await this.page.getByRole('link', { name: 'Accessibility statement' }).click();
  }

  async expectAccessibilityStatement() {
    await expect(this.page).toHaveURL(/\/accessibility$/);
    await expect(
      this.page.getByRole('heading', {
        name: 'Accessibility statement for ask about electronic travel authorisation (ETA)'
      })
    ).toBeVisible();
  }

  async setOffline() {
    await this.context.setOffline(true);
  }

  async expectOfflineBanner() {
    await expect(this.page.locator(this.selectors.bannerMessage).filter({ hasText: this.offlineBannerText }).first()).toBeVisible();
  }

  async reconnectWithRetry() {
    let reconnected = false;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await this.context.setOffline(false);

      try {
        await expect.poll(async () => {
          return this.page.locator(this.selectors.bannerMessage).filter({ hasText: this.onlineBannerText }).count();
        }, {
          timeout: 10_000
        }).toBeGreaterThan(0);

        reconnected = true;
        break;
      } catch {
        await this.context.setOffline(true);
        await this.expectOfflineBanner();
      }
    }

    expect(reconnected).toBe(true);
  }

  async expectOnlineBanner() {
    await expect(this.page.locator(this.selectors.bannerMessage).filter({ hasText: this.onlineBannerText }).first()).toBeVisible();
  }

  async openCookiesFromFooter() {
    await this.page.getByTestId('footer-cookies-link').click();
  }

  async expectCookiesPage() {
    await expect(this.page).toHaveURL(/\/cookies$/);
    await expect(this.page.getByRole('heading', { name: 'Cookies', exact: true })).toBeVisible();
  }

  async navigateBack() {
    await this.page.goBack();
  }

  async expectChatInputVisible() {
    await expect(this.page.locator(this.selectors.messageInput)).toBeVisible();
  }

  async sendSequentialMessages(count, prefix) {
    this.sequentialPrefix = prefix;
    for (let index = 1; index <= count; index += 1) {
      await this.sendMessage(`${prefix} ${index}`);
      await this.expectUserMessageVisible(`${prefix} ${index}`);
      this.sequentialMessageIndex = index;
    }
  }

  async refreshPage() {
    await this.page.reload();
    await this.expectChatInputVisible();
    this.lastInboundCountAfterRefresh = await this.page.locator(this.selectors.inboundMessageWrapper).count();
  }

  async sendNextSequentialMessage() {
    let sendWasObserved = false;
    const nextIndex = this.sequentialMessageIndex + 1;
    const nextMessage = `${this.sequentialPrefix} ${nextIndex}`;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      await this.sendMessage(nextMessage);
      await expect(this.page.locator(this.selectors.messageInput)).toHaveValue('');

      try {
        await expect.poll(async () => this.page.locator(this.selectors.inboundMessageWrapper).count(), {
          timeout: 10_000,
          intervals: [500, 1000, 2000]
        }).toBeGreaterThan(this.lastInboundCountAfterRefresh);

        sendWasObserved = true;
        this.sequentialMessageIndex = nextIndex;
        break;
      } catch {
        // Retry: first send can be dropped while chat session rehydrates.
      }
    }

    expect(sendWasObserved).toBe(true);
  }

  async expectOlderHistoryOnScrollTop() {
    await expect.poll(async () => {
      const firstMessage = this.page.locator(this.selectors.inboundMessageWrapper).filter({
        has: this.page.getByText('sequential message 1', { exact: true })
      });

      if (await firstMessage.count() > 0) {
        return 1;
      }

      await this.page.locator('.chat-messages').evaluate((el) => {
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
  }
}
