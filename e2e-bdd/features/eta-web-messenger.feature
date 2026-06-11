@EtaWebMessenger
Feature: ETA web messenger core journeys
  As a user of the ETA chat service
  I want reliable messenger behavior
  So that I can manage cookies and use chat flows safely

  Scenario: Accept analytics cookies flow
    Given I open the ETA web messenger
    Then I should see the ETA messenger heading
    And I should see cookie banner action controls
    When I accept analytics cookies
    Then cookie action buttons should no longer be visible
    And I should see the hide cookie message button
    When I hide the cookie acceptance message
    Then I should not see the hide cookie message button

  Scenario: Reject analytics cookies flow
    Given I open the ETA web messenger
    Then I should see the ETA messenger heading
    And I should see cookie banner action controls
    When I reject analytics cookies
    Then cookie action buttons should no longer be visible
    And I should see the hide cookie message button
    When I hide the cookie acceptance message
    Then I should not see the hide cookie message button

  Scenario: Invalid page returns not found
    Given I open an invalid ETA page
    When I accept analytics cookies
    And I hide the cookie acceptance message
    Then I should see the page not found heading

  Scenario: Look and feel, message exchange, and end chat flow
    Given I open the ETA web messenger
    And I dismiss cookies by accepting
    Then I should see chat controls
    When I send the message "Hi"
    Then I should see my message "Hi"
    And I should see message metadata prefixed with "You at"
    And I should receive one more assistant response
    And I should see message metadata prefixed with "Digital assistant at"
    When I send the message "I how can i apply for ETA"
    Then I should see my message "I how can i apply for ETA"
    And I should see message metadata prefixed with "You at"
    And I should receive one more assistant response
    And I should see message metadata prefixed with "Digital assistant at"
    When I open the end chat dialog
    Then I should see end chat confirmation controls
    When I choose to keep chatting
    Then I should see my message "Hi"
    And I should see my message "I how can i apply for ETA"
    When I open the end chat dialog
    And I confirm ending the chat
    Then I should see the chat ended page
    And I should not see chat input or message history

  Scenario: Character limit flow
    Given I open the ETA web messenger
    And I dismiss cookies by accepting
    When I fill the input with 4096 characters of "a"
    Then I should see character counter text "0 characters left"
    When I type one more character "b"
    Then the input should be clamped to 4096 characters of "a"
    And I should see character counter text "0 characters left"

  Scenario: Open accessibility statement from start page
    Given I open the ETA web messenger
    And I dismiss cookies by accepting
    When I open the accessibility statement from the footer
    Then I should see the ETA accessibility statement

  Scenario: Offline and reconnect banners with control disable and enable
    Given I open the ETA web messenger
    And I dismiss cookies by accepting
    Then chat controls should be enabled
    When I set network offline
    Then I should see the offline banner
    And chat controls should be disabled
    When I reconnect network with retry
    Then I should see the online banner
    And chat controls should be enabled

  Scenario: Navigate to cookies page and back to chat
    Given I open the ETA web messenger
    When I open the cookies page from the footer
    Then I should see the cookies page
    When I navigate back in the browser
    Then I should see chat input

  @history
  Scenario: Send 26 sequential messages and continue after refresh
    Given I open the ETA web messenger
    And I dismiss cookies by accepting
    When I send 26 sequential messages with prefix "sequential message"
    Then I should see my message "sequential message 26"
    When I refresh the page
    And I send the next sequential message with prefix "sequential message"
    Then I should observe one more inbound message after refresh

  @history
  Scenario: Scroll to top fetches older history after refresh
    Given I open the ETA web messenger
    And I dismiss cookies by accepting
    When I send 35 sequential messages with prefix "sequential message"
    And I refresh the page
    Then I should be able to fetch older history by scrolling to top
