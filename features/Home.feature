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
