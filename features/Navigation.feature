Feature: Moving between the universes

  Scenario Outline: The header opens the universe
    Given the app is running
    And the universe is <universe>
    When I open the app root
    And I choose the universe from the header
    Then I see "<title>"
    And I see "Build a dossier"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | title                          | theme  |
      | star-wars | Star Wars character dossier    | night  |
      | ghibli    | Studio Ghibli character dossier | autumn |
