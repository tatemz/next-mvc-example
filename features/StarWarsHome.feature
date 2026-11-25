Feature: The Star Wars splash page

  Scenario: The splash introduces the Star Wars experience
    Given the app is running
    When I open the Star Wars home
    Then I see "Star Wars character dossier"
    And I see "Build a dossier"
    And the page uses the "night" theme

  Scenario: The splash CTA opens the funnel
    Given the Star Wars home is open
    When I open the funnel from the splash
    Then I see "Find a character"
    And the page uses the "night" theme
