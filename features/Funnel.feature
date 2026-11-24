Feature: Building a character dossier

  Background:
    Given the funnel is open

  Scenario: Building a dossier for Luke Skywalker
    When I search the funnel for "Luke"
    And I choose the character "Luke Skywalker"
    And I choose the film "A New Hope (Episode 4)"
    And I choose the transport "X-wing Starship"
    Then I see "Ready for the dossier"
    And I see "X-wing (Starship)"
    When I open the dossier
    Then I see "Character dossier"
    And I see "Tatooine"
    And I see "X-wing (Starship)"
