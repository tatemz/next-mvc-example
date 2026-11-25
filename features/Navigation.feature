Feature: Moving between universes and locales

  Scenario Outline: A route resolves its locale and universe
    Given the app is running
    When I open the path "<path>"
    Then the address is "<address>"
    And I see "<title>"
    And the document language is <locale>
    And the page uses the "<theme>" theme

    Examples:
      | path            | address         | title                                 | locale | theme  |
      | /               | /star-wars      | Star Wars character dossier           | en-US  | night  |
      | /en-US          | /star-wars      | Star Wars character dossier           | en-US  | night  |
      | /es-MX          | /es-MX/star-wars | Dossier de personaje de Star Wars    | es-MX  | night  |
      | /star-wars      | /star-wars      | Star Wars character dossier           | en-US  | night  |
      | /en-US/star-wars | /en-US/star-wars | Star Wars character dossier          | en-US  | night  |
      | /es-MX/star-wars | /es-MX/star-wars | Dossier de personaje de Star Wars    | es-MX  | night  |
      | /ghibli         | /ghibli         | Studio Ghibli character dossier       | en-US  | autumn |
      | /es-MX/ghibli   | /es-MX/ghibli   | Dossier de personaje de Studio Ghibli | es-MX  | autumn |

  Scenario Outline: The header switches the universe and keeps the locale
    Given the app is running
    And the universe is <fromUniverse>
    And the locale is <locale>
    When I open the home
    And I choose the universe <targetUniverse>
    Then I see "<title>"
    And the page uses the "<theme>" theme
    And the document language is <locale>
    And the address is "<address>"

    Examples:
      | fromUniverse | targetUniverse | locale | title                                 | theme  | address          |
      | star-wars    | ghibli         | en-US  | Studio Ghibli character dossier       | autumn | /ghibli          |
      | star-wars    | ghibli         | es-MX  | Dossier de personaje de Studio Ghibli | autumn | /es-MX/ghibli    |
      | ghibli       | star-wars      | en-US  | Star Wars character dossier           | night  | /star-wars       |
      | ghibli       | star-wars      | es-MX  | Dossier de personaje de Star Wars     | night  | /es-MX/star-wars |

  Scenario Outline: The brand returns to the app home
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    When I open the funnel
    And I open the brand
    Then I see "<title>"
    And the address is "<address>"
    And the document language is <locale>

    Examples:
      | universe  | locale | title                             | address          |
      | star-wars | en-US  | Star Wars character dossier       | /star-wars       |
      | star-wars | es-MX  | Dossier de personaje de Star Wars | /es-MX/star-wars |
      | ghibli    | en-US  | Star Wars character dossier       | /star-wars       |
      | ghibli    | es-MX  | Dossier de personaje de Star Wars | /es-MX/star-wars |

  Scenario Outline: An unknown universe renders NotFound
    Given the app is running
    When I open the path "<path>"
    Then the address is "<path>"
    And I see "<heading>"
    And I see "<message>"
    And the link "<homeLabel>" points to "<homeHref>"
    And the document language is <locale>

    Examples:
      | path           | heading            | message                       | homeLabel       | homeHref | locale |
      | /unknown       | Page not found     | That universe does not exist. | Back home       | /        | en-US  |
      | /en-US/unknown | Page not found     | That universe does not exist. | Back home       | /        | en-US  |
      | /es-MX/unknown | Página no encontrada | Ese universo no existe.     | Volver al inicio | /es-MX  | es-MX  |
