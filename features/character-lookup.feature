Feature: Looking up a Star Wars character

  Background:
    Given the app is open

  Scenario: The configured character loads
    Then I see "Luke Skywalker"
    And I see "A New Hope (Episode 4)"
    And I see 4 films

  Scenario: Loading another character
    When I enter "3" as the character id
    And I load the character
    Then I see "R2-D2"
    And I see 6 films
    And the character id field contains "3"

  Scenario: Rejecting a non-numeric id
    When I enter "abc" as the character id
    And I load the character
    Then I see "Character id must be a positive whole number."
    And the character id field contains "abc"
