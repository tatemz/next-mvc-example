Feature: Looking up a Star Wars character

  Background:
    Given the Star Wars home is open

  Scenario: The configured character loads
    When I load the character
    Then I see "Luke Skywalker"
    And I see "A New Hope"
    And I see 4 films
    And the page uses the "night" theme

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

  Scenario: Reporting an unknown character
    When I enter "9999" as the character id
    And I load the character
    Then I see "The character could not be loaded."
    And I see "Try again"
