Feature: Two dependency layers

  Background:
    Given the app is open

  Scenario: The Ghibli layer serves the same home page
    When I open the Ghibli app
    Then I see "Haku"
    And I see "Spirited Away"
    And I see "Dragon"
    And I see 1 film
