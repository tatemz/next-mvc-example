Feature: The universe splash

  Scenario Outline: The splash introduces the universe
    Given the app is running
    And the universe is <universe>
    When I open the home
    Then I see "<title>"
    And I see "Build a dossier"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | title                          | theme  |
      | star-wars | Star Wars character dossier    | night  |
      | ghibli    | Studio Ghibli character dossier | autumn |

  Scenario Outline: The splash CTA opens the funnel
    Given the app is running
    And the universe is <universe>
    When I open the home
    And I open the funnel from the home
    Then I see "Find a character"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  |
      | star-wars | night  |
      | ghibli    | autumn |

  Scenario: The splash uses Mexican Spanish
    Given the app is running
    And the universe is star-wars
    And the locale is es-MX
    When I open the home
    Then I see "Dossier de personaje de Star Wars"
    And I see "Crear un dossier"
    And the page uses the "night" theme

  Scenario: The header switches back to US English
    Given the app is running
    And the universe is star-wars
    And the locale is es-MX
    When I open the home
    And I choose the language en-US
    Then I see "Star Wars character dossier"
