Feature: The universe splash

  Scenario Outline: The splash introduces the universe
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    When I open the home
    Then I see "<title>"
    And I see "<funnelLabel>"
    And the page uses the "<theme>" theme
    And the document language is <locale>

    Examples:
      | universe  | locale | title                                 | funnelLabel      | theme  |
      | star-wars | en-US  | Star Wars character dossier           | Build a dossier  | night  |
      | star-wars | es-MX  | Dossier de personaje de Star Wars     | Crear un dossier | night  |
      | ghibli    | en-US  | Studio Ghibli character dossier       | Build a dossier  | autumn |
      | ghibli    | es-MX  | Dossier de personaje de Studio Ghibli | Crear un dossier | autumn |

  Scenario Outline: The splash CTA opens the funnel
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    When I open the home
    And I open the funnel from the home
    Then I see "<heading>"
    And the page uses the "<theme>" theme
    And the address is "<funnelPath>"

    Examples:
      | universe  | locale | theme  | funnelLabel      | funnelPath            | heading           |
      | star-wars | en-US  | night  | Build a dossier  | /star-wars/funnel     | Find a character  |
      | star-wars | es-MX  | night  | Crear un dossier | /es-MX/star-wars/funnel | Busca un personaje |
      | ghibli    | en-US  | autumn | Build a dossier  | /ghibli/funnel        | Find a character  |
      | ghibli    | es-MX  | autumn | Crear un dossier | /es-MX/ghibli/funnel  | Busca un personaje |

  Scenario Outline: The language switch keeps the universe
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    When I open the home
    And I choose the language <targetLocale>
    Then I see "<title>"
    And the document language is <targetLocale>
    And the page uses the "<theme>" theme
    And the address is "<homePath>"

    Examples:
      | universe  | locale | targetLocale | title                                 | theme  | homePath          |
      | star-wars | en-US  | es-MX        | Dossier de personaje de Star Wars     | night  | /es-MX/star-wars  |
      | star-wars | es-MX  | en-US        | Star Wars character dossier           | night  | /star-wars        |
      | ghibli    | en-US  | es-MX        | Dossier de personaje de Studio Ghibli | autumn | /es-MX/ghibli     |
      | ghibli    | es-MX  | en-US        | Studio Ghibli character dossier       | autumn | /ghibli           |
