@question @create-question @admin

Feature: Create Question as Admin
  In order to create new questions for the system
  As an admin API client
  I want to be able to create a question by providing its data

  Scenario: Creating a question with complete data as admin
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the admin creates a new question with the request payload
    Then the request should have succeeded with status code 201
    And the response should contain the following admin question:
      | id    | cognitiveDifficulty | status | sourceUrls                                                                              |
      | <SET> | easy                | active | https://solarsystem.nasa.gov/planets/mars/overview/, https://en.wikipedia.org/wiki/Mars |

    And the response should contain the following question statement for the admin question:
      | locale | statement                                                                         |
      | en     | Which planet in our solar system is known as the Red Planet?                      |
      | fr     | Quelle planète de notre système solaire est connue sous le nom de planète rouge ? |
      | it     | Quale pianeta del nostro sistema solare è conosciuto come il Pianeta Rosso?       |
      | es     | ¿Qué planeta de nuestro sistema solar es conocido como el Planeta Rojo?           |
      | de     | Welcher Planet in unserem Sonnensystem ist als der Rote Planet bekannt?           |
      | pt     | Qual planeta do nosso sistema solar é conhecido como o Planeta Vermelho?          |

    And the response should contain the following question answer for the admin question:
      | locale | answer |
      | en     | Mars   |
      | fr     | Mars   |
      | it     | Marte  |
      | es     | Marte  |
      | de     | Mars   |
      | pt     | Marte  |

    And the response should contain the following question context for the admin question:
      | locale | context                                                 |
      | en     | Basic astronomy — planets and their nicknames.          |
      | fr     | Astronomie de base — planètes et leurs surnoms.         |
      | it     | Astronomia di base: pianeti e i loro soprannomi.        |
      | es     | Astronomía básica: planetas y sus apodos.               |
      | de     | Grundlegende Astronomie — Planeten und ihre Spitznamen. |
      | pt     | Astronomia básica — planetas e seus apelidos.           |

    And the response should contain the following trivia for locale "en" for the admin question:
      | trivia                                                        |
      | Mars appears red because of iron oxide (rust) on its surface. |
      | It has the largest volcano in the solar system, Olympus Mons. |

    And the response should contain the following trivia for locale "fr" for the admin question:
      | trivia                                                              |
      | Mars semble rouge à cause de l'oxyde de fer à sa surface.           |
      | Elle possède le plus grand volcan du système solaire, Olympus Mons. |

    And the response should contain the following trivia for locale "it" for the admin question:
      | trivia                                                                |
      | Marte appare rosso a causa dell'ossido di ferro sulla sua superficie. |
      | Ha il vulcano più grande del sistema solare, Olympus Mons.            |

    And the response should contain the following trivia for locale "es" for the admin question:
      | trivia                                                        |
      | Marte parece rojo debido al óxido de hierro en su superficie. |
      | Tiene el volcán más grande del sistema solar, Olympus Mons.   |

    And the response should contain the following trivia for locale "de" for the admin question:
      | trivia                                                    |
      | Mars erscheint rot wegen Eisenoxid auf seiner Oberfläche. |
      | Er hat den größten Vulkan im Sonnensystem, Olympus Mons.  |

    And the response should contain the following trivia for locale "pt" for the admin question:
      | trivia                                                               |
      | Marte parece vermelho por causa do óxido de ferro em sua superfície. |
      | Possui o maior vulcão do sistema solar, Olympus Mons.                |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | science | true      | false  |

    And the response should contain the question theme with slug "science" for the admin question with the following label:
      | locale | label        |
      | en     | Science      |
      | fr     | Science      |
      | it     | Scienza      |
      | es     | Ciencia      |
      | de     | Wissenschaft |
      | pt     | Ciência      |

    And the response should contain the following author for the admin question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain no rejection for the admin question

  Scenario: Trying to create a question with missing required fields
    When the admin creates a new question with an empty payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                  | expected | path                | values           |
      | invalid_type  | Invalid input: expected array, received undefined        | array    | themes              |                  |
      | invalid_type  | Invalid input: expected object, received undefined       | object   | content             |                  |
      | invalid_value | Invalid option: expected one of "easy"\|"medium"\|"hard" |          | cognitiveDifficulty | easy,medium,hard |
      | invalid_type  | Invalid input: expected object, received undefined       | object   | author              |                  |
      | invalid_type  | Invalid input: expected array, received undefined        | array    | sourceUrls          |                  |

  Scenario: Trying to create a question without API key
    Given the request payload is set from scope "question", type "creation" and name "complete"
    When the admin creates a new question with the request payload but without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to create a question with invalid API key
    Given the request payload is set from scope "question", type "creation" and name "complete"
    When the admin creates a new question with the request payload but with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
