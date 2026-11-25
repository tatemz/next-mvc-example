Feature: Building a dossier

  Scenario Outline: The search reports its outcome
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I am on the funnel
    When I search for "<query>"
    Then I see "<expected>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | query  | expected                        |
      | star-wars | en-US  | night  | Luke   | Choose a character              |
      | star-wars | en-US  | night  | Nobody | No characters matched that name. |
      | star-wars | es-MX  | night  | Luke   | Elige un personaje              |
      | ghibli    | es-MX  | autumn | Nadie  | Ningún personaje coincide con ese nombre. |

  Scenario Outline: The search reports how many characters matched
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I am on the funnel
    When I search for "<query>"
    Then I see text containing "<detail>"

    Examples:
      | universe  | locale | query | detail                 |
      | star-wars | en-US  | Luke  | One character matched  |
      | ghibli    | en-US  | a     | 2 characters matched   |
      | ghibli    | es-MX  | a     | 2 personajes coinciden |

  Scenario Outline: The search requires a character name
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I am on the funnel
    When I search without a query
    Then I see "<error>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | error                              |
      | star-wars | en-US  | night  | Enter a character name.            |
      | star-wars | es-MX  | night  | Escribe el nombre de un personaje. |

  Scenario: The search step reports its progress
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    When I open the funnel
    Then I see "Find a character"
    And I see "Step 1 of 4"

  Scenario: The search leads to the choose step
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I am on the funnel
    When I search for "Luke"
    Then I see "Choose a character"
    And I see "Step 2 of 4"

  Scenario: Choosing a character leads to the film step
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I searched for "Luke"
    When I choose the character "Luke Skywalker"
    Then I see "Choose a film"
    And I see "Step 3 of 4"

  Scenario: Choosing a film leads to the transport step
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I chose the character "Luke Skywalker"
    When I choose the film "A New Hope"
    Then I see "Choose a transport"
    And I see "Step 4 of 4"

  Scenario: Choosing a transport leads to the review step
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I chose the film "A New Hope" for the character "Luke Skywalker"
    When I choose the transport "X-wing Starship"
    Then I see "Ready for the dossier"
    And I see "Review"

  Scenario Outline: Reviewing a dossier
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I chose the film "<film>" for the character "<character>"
    When I choose the transport "<transport>"
    Then I see "<reviewTransport>"
    And the link "<startOverLabel>" points to "funnel"
    And the link "<openLabel>" points to "<resultsHref>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | character      | film          | transport       | reviewTransport   | startOverLabel   | openLabel    | resultsHref                                      |
      | star-wars | en-US  | night  | Luke Skywalker | A New Hope    | X-wing Starship | X-wing (Starship) | Start over       | Open dossier | results?character=1&film=4&transport=starship-12 |
      | ghibli    | es-MX  | autumn | Haku           | Spirited Away | Sin transporte  | Sin transporte    | Empezar de nuevo | Abrir dossier | results?character=1&film=1&transport=none        |

  Scenario Outline: Opening a dossier
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I chose the transport "<transport>" for the character "<character>" and film "<film>"
    When I open the dossier
    Then I see "<resultsHeading>"
    And I see "<filmLabel>"
    And I see "<transportLabel>"
    And I see "<character>"
    And I see "<film>"
    And I see "<expectedTransport>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | character      | film          | transport       | resultsHeading | filmLabel | transportLabel | expectedTransport           |
      | star-wars | en-US  | night  | Luke Skywalker | A New Hope    | X-wing Starship | Your dossier   | Film      | Transport      | X-wing (Starship)           |
      | ghibli    | es-MX  | autumn | Haku           | Spirited Away | Sin transporte  | Tu dossier     | Película  | Transporte     | Sin transporte seleccionado |

  Scenario Outline: Rejecting an unknown character choice
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I searched for "<query>"
    When I choose the character with id "<id>"
    Then I see "<failedHeading>"
    And I see "<message>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | query | id  | failedHeading                  | message                            |
      | star-wars | en-US  | night  | Luke  | 999 | The dossier could not be built | That choice is no longer available. |
      | ghibli    | es-MX  | autumn | Haku  | 999 | No se pudo crear el dossier    | Esa opción ya no está disponible.   |

  Scenario: Rejecting an empty character choice
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I searched for "Luke"
    When I choose the character with id "empty"
    Then I see "The dossier could not be built"
    And I see "That choice is no longer available."

  Scenario Outline: Rejecting an unknown film
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I chose the character "<character>"
    When I choose the film with order "<order>"
    Then I see "<failedHeading>"
    And I see "<message>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | character      | order | failedHeading                  | message                            |
      | star-wars | en-US  | night  | Luke Skywalker | 99    | The dossier could not be built | That choice is no longer available. |
      | ghibli    | es-MX  | autumn | Haku           | 99    | No se pudo crear el dossier    | Esa opción ya no está disponible.   |

  Scenario: Rejecting an empty film choice
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I chose the character "Luke Skywalker"
    When I choose the film with order "empty"
    Then I see "The dossier could not be built"
    And I see "That choice is no longer available."

  Scenario Outline: Rejecting an unknown transport
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I chose the film "<film>" for the character "<character>"
    When I choose the transport with key "<key>"
    Then I see "<failedHeading>"
    And I see "<message>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | character      | film          | key         | failedHeading                  | message                            |
      | star-wars | en-US  | night  | Luke Skywalker | A New Hope    | starship-99 | The dossier could not be built | That choice is no longer available. |
      | ghibli    | es-MX  | autumn | Haku           | Spirited Away | unknown     | No se pudo crear el dossier    | Esa opción ya no está disponible.   |

  Scenario: Rejecting an empty transport choice
    Given the app is running
    And the universe is star-wars
    And the locale is en-US
    And I chose the film "A New Hope" for the character "Luke Skywalker"
    When I choose the transport with key "empty"
    Then I see "The dossier could not be built"
    And I see "That choice is no longer available."

  Scenario Outline: Reporting an unavailable catalogue while searching
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And the catalogue is unavailable
    And I am on the funnel
    When I search for "<query>"
    Then I see "<failedHeading>"
    And I see "<message>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | query | failedHeading                  | message                             |
      | star-wars | en-US  | night  | Luke  | The dossier could not be built | The character API could not answer. |
      | ghibli    | es-MX  | autumn | Haku  | No se pudo crear el dossier    | La API de personajes no respondió.  |

  Scenario Outline: Reporting an unavailable catalogue while choosing
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I searched for "<query>"
    And the catalogue is unavailable
    When I choose the character "<character>"
    Then I see "<failedHeading>"
    And I see "<message>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | query | character      | failedHeading                  | message                             |
      | star-wars | en-US  | night  | Luke  | Luke Skywalker | The dossier could not be built | The character API could not answer. |
      | ghibli    | es-MX  | autumn | Haku  | Haku           | No se pudo crear el dossier    | La API de personajes no respondió.  |

  Scenario Outline: Starting over from the review
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I chose the transport "<transport>" for the character "<character>" and film "<film>"
    When I start over
    Then I see "<searchHeading>"
    And the address is "<funnelPath>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | character      | film          | transport       | searchHeading      | funnelPath              |
      | star-wars | en-US  | night  | Luke Skywalker | A New Hope    | X-wing Starship | Find a character   | /star-wars/funnel       |
      | ghibli    | es-MX  | autumn | Haku           | Spirited Away | Sin transporte  | Busca un personaje | /es-MX/ghibli/funnel    |

  Scenario Outline: Starting over from a failure
    Given the app is running
    And the universe is <universe>
    And the locale is <locale>
    And I searched for "<query>"
    And the character choice failed
    When I start over
    Then I see "<searchHeading>"
    And the address is "<funnelPath>"
    And the page uses the "<theme>" theme

    Examples:
      | universe  | locale | theme  | query | searchHeading      | funnelPath              |
      | star-wars | en-US  | night  | Luke  | Find a character   | /star-wars/funnel       |
      | ghibli    | es-MX  | autumn | Haku  | Busca un personaje | /es-MX/ghibli/funnel    |
