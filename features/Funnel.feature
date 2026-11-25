Feature: Building a character dossier

  Background:
    Given the funnel is open

  Scenario: Reviewing the dossier
    When I search the funnel for "Luke"
    And I choose the character "Luke Skywalker"
    And I choose the film "A New Hope"
    And I choose the transport "X-wing Starship"
    Then I see "Ready for the dossier"
    And I see "X-wing (Starship)"

  Scenario: Opening the dossier
    When I search the funnel for "Luke"
    And I choose the character "Luke Skywalker"
    And I choose the film "A New Hope"
    And I choose the transport "X-wing Starship"
    And I open the dossier
    Then I see "Your dossier"
    And I see "Tatooine"
    And I see "X-wing (Starship)"
