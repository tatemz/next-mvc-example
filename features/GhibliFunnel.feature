Feature: Building a Ghibli dossier

  Background:
    Given the Ghibli funnel is open

  Scenario: Building a dossier for Haku
    When I search the funnel for "Haku"
    And I choose the character "Haku"
    And I choose the film "Spirited Away"
    And I choose the transport "No transport"
    And I open the dossier
    Then I see "Your dossier"
    And I see "Haku"
    And I see "Spirited Away"
    And I see "No transport selected"
