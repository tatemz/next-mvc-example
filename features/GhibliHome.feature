Feature: The Studio Ghibli splash page

  Scenario: The splash introduces the Ghibli experience
    Given the app is running
    When I open the Ghibli home
    Then I see "Studio Ghibli character dossier"
    And I see "Build a dossier"
    And the page uses the "autumn" theme

  Scenario: The splash CTA opens the funnel
    Given the Ghibli home is open
    When I open the funnel from the splash
    Then I see "Find a character"
    And the page uses the "autumn" theme
