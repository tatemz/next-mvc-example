Feature: Building a dossier

  Scenario Outline: Reviewing a dossier
    Given the app is running
    And the universe is <universe>
    When I open the funnel
    And I search for "<query>"
    And I choose the character "<character>"
    And I choose the film "<film>"
    And I choose the transport "<transport>"
    Then I see "Ready for the dossier"
    And I see "<reviewTransport>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  | query | character      | film              | transport                     | reviewTransport                |
      | star-wars | night  | Luke  | Luke Skywalker | A New Hope        | X-wing Starship               | X-wing (Starship)              |
      | ghibli    | autumn | Haku  | Haku           | Spirited Away     | No transport                  | No transport                   |
      | ghibli    | autumn | Muska | Colonel Muska  | Castle in the Sky | Air Destroyer Goliath Vehicle | Air Destroyer Goliath (Vehicle) |

  Scenario Outline: Opening a dossier
    Given the app is running
    And the universe is <universe>
    When I open the funnel
    And I search for "<query>"
    And I choose the character "<character>"
    And I choose the film "<film>"
    And I choose the transport "<transport>"
    And I open the dossier
    Then I see "Your dossier"
    And I see "<character>"
    And I see "<film>"
    And I see "<expectedTransport>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  | query | character      | film              | transport                     | expectedTransport              |
      | star-wars | night  | Luke  | Luke Skywalker | A New Hope        | X-wing Starship               | X-wing (Starship)              |
      | ghibli    | autumn | Haku  | Haku           | Spirited Away     | No transport                  | No transport selected          |
      | ghibli    | autumn | Muska | Colonel Muska  | Castle in the Sky | Air Destroyer Goliath Vehicle | Air Destroyer Goliath (Vehicle) |

  Scenario Outline: No characters match
    Given the app is running
    And the universe is <universe>
    When I open the funnel
    And I search for "<query>"
    Then I see "No characters matched that name."
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  | query           |
      | star-wars | night  | NoSuchCharacter |
      | ghibli    | autumn | NoSuchCharacter |

  Scenario Outline: Reporting an unavailable catalogue
    Given the app is running
    And the universe is <universe>
    And the catalogue is unavailable
    When I open the funnel
    And I search for "<query>"
    Then I see "The dossier could not be built"
    And I see "The character API could not answer."
    And the page uses the "<theme>" theme

    Examples:
      | universe  | theme  | query |
      | star-wars | night  | Luke  |
      | ghibli    | autumn | Haku  |
