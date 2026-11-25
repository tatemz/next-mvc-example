Feature: Opening a dossier

  Scenario Outline: Opening a complete dossier
    Given the app is running
    And the universe is <universe>
    When I open the results for character "<characterId>", film "<filmOrder>", transport "<transportKey>"
    Then I see "Your dossier"
    And I see "<character>"
    And I see "<film>"
    And I see "<expectedTransport>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  | characterId | filmOrder | transportKey                         | character      | film              | expectedTransport              |
      | star-wars | night  | 1           | 4         | starship-12                          | Luke Skywalker | A New Hope        | X-wing (Starship)              |
      | star-wars | night  | 1           | 4         | none                                 | Luke Skywalker | A New Hope        | No transport selected          |
      | ghibli    | autumn | 1           | 1         | none                                 | Haku           | Spirited Away     | No transport selected          |
      | ghibli    | autumn | 42          | 1         | 4e09b023-f650-4747-9ab9-eacf14540cfb | Colonel Muska  | Castle in the Sky | Air Destroyer Goliath (Vehicle) |

  Scenario Outline: Rejecting an invalid dossier
    Given the app is running
    And the universe is <universe>
    When I open the results for character "<characterId>", film "<filmOrder>", transport "<transportKey>"
    Then I see "Dossier not found"
    And I see "Build a dossier"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  | characterId | filmOrder | transportKey |
      | star-wars | night  | 1           | 4         | missing      |
      | star-wars | night  | 1           | 4         | starship-99  |
      | ghibli    | autumn | 1           | 1         | missing      |
      | ghibli    | autumn | 1           | 1         | unknown      |
