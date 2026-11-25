Feature: Looking up a Ghibli character

  Background:
    Given the Ghibli home is open

  Scenario: The configured character loads
    When I load the character
    Then I see "Haku"
    And I see "Spirited Away"
    And I see "Dragon"
    And I see 1 film
    And the page uses the "autumn" theme

  Scenario: Reporting an unknown character
    When I enter "999" as the character id
    And I load the character
    Then I see "The character could not be loaded."
    And I see "Try again"
