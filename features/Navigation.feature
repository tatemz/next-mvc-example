Feature: Moving between the two experiences

  Scenario: The root opens the Star Wars experience
    Given the app is running
    When I open the app root
    Then I see "Star Wars character dossier"
    And I see "Build a dossier"
    And the page uses the "night" theme

  Scenario: The header switches to Ghibli
    Given the Star Wars home is open
    When I choose the "Ghibli" universe
    Then I see "Studio Ghibli character dossier"
    And I see "Build a dossier"
    And the page uses the "autumn" theme
