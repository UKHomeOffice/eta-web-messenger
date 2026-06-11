import { createBdd } from 'playwright-bdd';
import { test } from './bdd-fixtures';

const { Given, When, Then } = createBdd(test);

Given('I open the ETA web messenger', async ({ etaPage }) => {
  await etaPage.openHome();
});

Given('I open an invalid ETA page', async ({ etaPage }) => {
  await etaPage.openInvalidPage();
});

Given('I dismiss cookies by accepting', async ({ etaPage }) => {
  await etaPage.dismissCookiesByAccepting();
});

Then('I should see the ETA messenger heading', async ({ etaPage }) => {
  await etaPage.expectHeading();
});

Then('I should see cookie banner action controls', async ({ etaPage }) => {
  await etaPage.expectCookieBannerControls();
});

When('I accept analytics cookies', async ({ etaPage }) => {
  await etaPage.acceptCookies();
});

When('I reject analytics cookies', async ({ etaPage }) => {
  await etaPage.rejectCookies();
});

When('I hide the cookie acceptance message', async ({ etaPage }) => {
  await etaPage.hideCookieMessage();
});

Then('cookie action buttons should no longer be visible', async ({ etaPage }) => {
  await etaPage.expectCookieActionButtonsHidden();
});

Then('I should see the hide cookie message button', async ({ etaPage }) => {
  await etaPage.expectHideCookieMessageVisible();
});

Then('I should not see the hide cookie message button', async ({ etaPage }) => {
  await etaPage.expectHideCookieMessageHidden();
});

Then('I should see the page not found heading', async ({ etaPage }) => {
  await etaPage.expectNotFoundHeading();
});

Then('I should see chat controls', async ({ etaPage }) => {
  await etaPage.expectChatControlsVisible();
});

When('I send the message {string}', async ({ etaPage }, message) => {
  await etaPage.sendMessage(message);
});

Then('I should see my message {string}', async ({ etaPage }, message) => {
  await etaPage.expectUserMessageVisible(message);
});

Then('I should see message metadata prefixed with {string}', async ({ etaPage }, prefix) => {
  await etaPage.expectMessageMetadataPrefix(prefix);
});

Then('I should receive one more assistant response', async ({ etaPage }) => {
  await etaPage.expectAssistantResponseIncreased();
});

When('I open the end chat dialog', async ({ etaPage }) => {
  await etaPage.openEndChatDialog();
});

Then('I should see end chat confirmation controls', async ({ etaPage }) => {
  await etaPage.expectEndChatDialog();
});

When('I choose to keep chatting', async ({ etaPage }) => {
  await etaPage.keepChatting();
});

When('I confirm ending the chat', async ({ etaPage }) => {
  await etaPage.confirmEndChat();
});

Then('I should see the chat ended page', async ({ etaPage }) => {
  await etaPage.expectChatEndedPage();
});

Then('I should not see chat input or message history', async ({ etaPage }) => {
  await etaPage.expectChatCleared();
});

When('I fill the input with {int} characters of {string}', async ({ etaPage }, count, character) => {
  await etaPage.fillInputWithRepeatedCharacters(count, character);
});

When('I type one more character {string}', async ({ etaPage }, character) => {
  await etaPage.typeOneCharacter(character);
});

Then('I should see character counter text {string}', async ({ etaPage }, text) => {
  await etaPage.expectCharacterCounterText(text);
});

Then('the input should be clamped to {int} characters of {string}', async ({ etaPage }, count, character) => {
  await etaPage.expectInputClampedToCount(count, character);
});

When('I open the accessibility statement from the footer', async ({ etaPage }) => {
  await etaPage.openAccessibilityFromFooter();
});

Then('I should see the ETA accessibility statement', async ({ etaPage }) => {
  await etaPage.expectAccessibilityStatement();
});

Then('chat controls should be enabled', async ({ etaPage }) => {
  await etaPage.expectChatControlsEnabled();
});

When('I set network offline', async ({ etaPage }) => {
  await etaPage.setOffline();
});

Then('I should see the offline banner', async ({ etaPage }) => {
  await etaPage.expectOfflineBanner();
});

Then('chat controls should be disabled', async ({ etaPage }) => {
  await etaPage.expectChatControlsDisabled();
});

When('I reconnect network with retry', async ({ etaPage }) => {
  await etaPage.reconnectWithRetry();
});

Then('I should see the online banner', async ({ etaPage }) => {
  await etaPage.expectOnlineBanner();
});

When('I open the cookies page from the footer', async ({ etaPage }) => {
  await etaPage.openCookiesFromFooter();
});

Then('I should see the cookies page', async ({ etaPage }) => {
  await etaPage.expectCookiesPage();
});

When('I navigate back in the browser', async ({ etaPage }) => {
  await etaPage.navigateBack();
});

Then('I should see chat input', async ({ etaPage }) => {
  await etaPage.expectChatInputVisible();
});

When('I send {int} sequential messages with prefix {string}', async ({ etaPage }, count, prefix) => {
  await etaPage.sendSequentialMessages(count, prefix);
});

When('I refresh the page', async ({ etaPage }) => {
  await etaPage.refreshPage();
});

When('I send the next sequential message with prefix {string}', async ({ etaPage }, prefix) => {
  etaPage.sequentialPrefix = prefix;
  await etaPage.sendNextSequentialMessage();
});

Then('I should observe one more inbound message after refresh', async () => {
  // Verified in sendNextSequentialMessage with poll + assertion.
});

Then('I should be able to fetch older history by scrolling to top', async ({ etaPage }) => {
  await etaPage.expectOlderHistoryOnScrollTop();
});
