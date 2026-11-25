Feature: Opening a Star Wars dossier

  Scenario: Opening a complete dossier
    Given the app is running
    When I open the complete results
    Then I see "Your dossier"
    And I see "Tatooine"
    And I see "X-wing (Starship)"
    And the page uses the "night" theme

  Scenario: Rejecting a dossier without a transport
    Given the app is running
    When I open the results without a transport
    Then I see "Dossier not found"
    And I see "Build a dossier"

  Scenario: Rejecting an unknown transport
    Given the app is running
    When I open the results with transport "starship-99"
    Then I see "Dossier not found"

  Scenario: Opening a dossier without a transport
    Given the app is running
    When I open the results with transport "none"
    Then I see "Your dossier"
    And I see "No transport selected"
