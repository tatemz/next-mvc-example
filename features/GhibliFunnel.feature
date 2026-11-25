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
    And the page uses the "autumn" theme

  Scenario: Building a dossier with a vehicle
    When I search the funnel for "Muska"
    And I choose the character "Colonel Muska"
    And I choose the film "Castle in the Sky"
    And I choose the transport "Air Destroyer Goliath Vehicle"
    And I open the dossier
    Then I see "Your dossier"
    And I see "Air Destroyer Goliath (Vehicle)"
    And the page uses the "autumn" theme

  Scenario: Searching with no matches
    When I search the funnel for "NoSuchCharacter"
    Then I see "No characters matched that name."
