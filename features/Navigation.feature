Feature: Moving between the two experiences

  Scenario: The root opens the Star Wars experience
    Given the app is running
    When I open the app root
    Then I see "Luke Skywalker"
    And the page uses the "night" theme

  Scenario: The header switches to Ghibli
    Given the Star Wars home is open
    When I choose the "Ghibli" universe
    Then I see "Haku"
    And the page uses the "autumn" theme
