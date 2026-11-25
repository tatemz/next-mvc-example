Feature: Building a Star Wars dossier

  Background:
    Given the Star Wars funnel is open

  Scenario: Reviewing the dossier
    When I search the funnel for "Luke"
    And I choose the character "Luke Skywalker"
    And I choose the film "A New Hope"
    And I choose the transport "X-wing Starship"
    Then I see "Ready for the dossier"
    And I see "X-wing (Starship)"
    And the page uses the "night" theme

  Scenario: Opening the dossier
    When I search the funnel for "Luke"
    And I choose the character "Luke Skywalker"
    And I choose the film "A New Hope"
    And I choose the transport "X-wing Starship"
    And I open the dossier
    Then I see "Your dossier"
    And I see "Tatooine"
    And I see "X-wing (Starship)"

  Scenario: Searching with no matches
    When I search the funnel for "NoSuchCharacter"
    Then I see "No characters matched that name."
    And I see "Find a character"
