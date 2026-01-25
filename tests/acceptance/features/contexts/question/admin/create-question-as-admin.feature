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
      | id    | cognitiveDifficulty | status | sourceUrls                                                                                         |
      | <SET> | medium              | active | https://en.wikipedia.org/wiki/Penicillin, https://www.nobelprize.org/prizes/medicine/1945/summary/ |

    And the response should contain the following question statement for the admin question:
      | locale | statement                        |
      | en     | Who discovered penicillin?       |
      | fr     | Qui a découvert la pénicilline ? |
      | it     | Chi ha scoperto la penicillina?  |
      | es     | ¿Quién descubrió la penicilina?  |
      | de     | Wer entdeckte Penicillin?        |
      | pt     | Quem descobriu a penicilina?     |

    And the response should contain the following question answer for the admin question:
      | locale | answer            |
      | en     | Alexander Fleming |
      | fr     | Alexander Fleming |
      | it     | Alexander Fleming |
      | es     | Alexander Fleming |
      | de     | Alexander Fleming |
      | pt     | Alexander Fleming |

    And the response should contain the following question context for the admin question:
      | locale | context                                                                                                     |
      | en     | In 1928 Alexander Fleming discovered penicillin, a breakthrough that led to modern antibiotics.             |
      | fr     | En 1928, Alexander Fleming a découvert la pénicilline, une percée qui a conduit aux antibiotiques modernes. |
      | it     | Nel 1928 Alexander Fleming scoprì la penicillina, una scoperta che portò agli antibiotici moderni.          |
      | es     | En 1928 Alexander Fleming descubrió la penicilina, un avance que condujo a los antibióticos modernos.       |
      | de     | 1928 entdeckte Alexander Fleming das Penicillin, ein Durchbruch, der zu modernen Antibiotika führte.        |
      | pt     | Em 1928, Alexander Fleming descobriu a penicilina, uma descoberta que levou aos antibióticos modernos.      |

    And the response should contain the following trivia for locale "en" for the admin question:
      | trivia                                                                                    |
      | Alexander Fleming discovered penicillin in 1928.                                          |
      | Fleming, Florey and Chain received the Nobel Prize in 1945 for their work on antibiotics. |

    And the response should contain the following trivia for locale "fr" for the admin question:
      | trivia                                                                                            |
      | Alexander Fleming a découvert la pénicilline en 1928.                                             |
      | Fleming, Florey et Chain ont reçu le prix Nobel en 1945 pour leurs travaux sur les antibiotiques. |

    And the response should contain the following trivia for locale "it" for the admin question:
      | trivia                                                                                             |
      | Alexander Fleming scoprì la penicillina nel 1928.                                                  |
      | Fleming, Florey e Chain ricevettero il Premio Nobel nel 1945 per il loro lavoro sugli antibiotici. |

    And the response should contain the following trivia for locale "es" for the admin question:
      | trivia                                                                                        |
      | Alexander Fleming descubrió la penicilina en 1928.                                            |
      | Fleming, Florey y Chain recibieron el Premio Nobel en 1945 por su trabajo sobre antibióticos. |

    And the response should contain the following trivia for locale "de" for the admin question:
      | trivia                                                                                  |
      | Alexander Fleming entdeckte 1928 das Penicillin.                                        |
      | Fleming, Florey und Chain erhielten 1945 den Nobelpreis für ihre Arbeit an Antibiotika. |

    And the response should contain the following trivia for locale "pt" for the admin question:
      | trivia                                                                                      |
      | Alexander Fleming descobriu a penicilina em 1928.                                           |
      | Fleming, Florey e Chain receberam o Prêmio Nobel em 1945 por seu trabalho com antibióticos. |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | science | true      | false  |
      | history | false     | true   |

    And the response should contain the question theme with slug "science" for the admin question with the following label:
      | locale | label        |
      | en     | Science      |
      | fr     | Science      |
      | it     | Scienza      |
      | es     | Ciencia      |
      | de     | Wissenschaft |
      | pt     | Ciência      |

    And the response should contain the question theme with slug "history" for the admin question with the following label:
      | locale | label      |
      | en     | History    |
      | fr     | Histoire   |
      | it     | Storia     |
      | es     | Historia   |
      | de     | Geschichte |
      | pt     | História   |

    And the response should contain the following author for the admin question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain no rejection for the admin question

  Scenario: Creating a question with complete data as AI, status is then pending
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path          | type   | value     |
      | author.role   | string | ai        |
      | author.name   | string | GoatItGPT |
      | author.gameId | string |           |
    When the admin creates a new question with the request payload
    Then the request should have succeeded with status code 201
    And the response should contain the following admin question:
      | id    | cognitiveDifficulty | status  | sourceUrls                                                                                         |
      | <SET> | medium              | pending | https://en.wikipedia.org/wiki/Penicillin, https://www.nobelprize.org/prizes/medicine/1945/summary/ |
    And the response should contain the following author for the admin question:
      | role | name      | gameId |
      | ai   | GoatItGPT |        |

  Scenario: Creating a question in French locale with trimmed values
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type   | value                                                                                                                                                                     |
      | content.statement.fr | string | "   Qui a découvert la pénicilline ?   "                                                                                                                                  |
      | content.answer.fr    | string | "   Alexander Fleming   "                                                                                                                                                 |
      | content.context.fr   | string | "   En 1928, Alexander Fleming a découvert la pénicilline, une percée qui a conduit aux antibiotiques modernes.   "                                                       |
      | content.trivia.fr    | array  | ["   Alexander Fleming a découvert la pénicilline en 1928.   ","   Fleming, Florey et Chain ont reçu le prix Nobel en 1945 pour leurs travaux sur les antibiotiques.   "] |
    When the admin creates a new question with the request payload
    Then the request should have succeeded with status code 201
    And the response should contain the following question statement for the admin question:
      | locale | statement                        |
      | fr     | Qui a découvert la pénicilline ? |
    And the response should contain the following question answer for the admin question:
      | locale | answer            |
      | fr     | Alexander Fleming |
    And the response should contain the following question context for the admin question:
      | locale | context                                                                                                     |
      | fr     | En 1928, Alexander Fleming a découvert la pénicilline, une percée qui a conduit aux antibiotiques modernes. |
    And the response should contain the following trivia for locale "fr" for the admin question:
      | trivia                                                                                            |
      | Alexander Fleming a découvert la pénicilline en 1928.                                             |
      | Fleming, Florey et Chain ont reçu le prix Nobel en 1945 pour leurs travaux sur les antibiotiques. |

  Scenario: Trying to create a question with empty English statement
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type   | value |
      | content.statement.en | string |       |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path                 | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | content.statement.en | string | 1       | true      |

  Scenario: Trying to create a question with Spanish statement that is too long
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | content.statement.es | string | "En 1928, Alexander Fleming observó por primera vez el efecto antibacteriano de un moho llamado Penicillium notatum sobre cultivos bacterianos, un descubrimiento que cambió radicalmente la medicina. A lo largo de las décadas siguientes, numerosos científicos desarrollaron métodos para purificar y producir penicilina a gran escala, permitiendo el tratamiento de infecciones antes mortales. Este pasaje histórico incluye detalles sobre los ensayos, la colaboración entre investigadores y la rápida adopción clínica que salvó millones de vidas; lo repito aquí para asegurar que el texto supera con creces el umbral de validación y provoque un error de longitud durante las pruebas, simulando un contenido demasiado extenso en español para la validación del campo statement." |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path                 | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | content.statement.es | string | 500     | true      |

  Scenario: Trying to create a question with an unknown locale key for statement
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type   | value   |
      | content.statement.jp | string | 日本語の文です |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path              | keys |
      | unrecognized_keys | Unrecognized key: "jp" | content.statement | jp   |

  Scenario: Trying to create a question with statement of wrong type (integer)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type    | value |
      | content.statement.it | integer | 123   |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                         | expected | path                 |
      | invalid_type | Invalid input: expected string, received number | string   | content.statement.it |

  Scenario: Trying to create a question with empty Portuguese answer
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type   | value |
      | content.answer.pt | string |       |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path              | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | content.answer.pt | string | 1       | true      |

  Scenario: Trying to create a question with German answer that is too long
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
      | content.answer.de | string | "Alexander Fleming war ein britischer Bakteriologe, der 1928 die antibakteriellen Eigenschaften des Schimmelpilzes Penicillium entdeckte und damit den Grundstein für die Entwicklung der Antibiotika legte. Seine Beobachtungen und die anschließenden laborwissenschaftlichen Schritte führten zur Isolierung von Penicillin, dessen großtechnische Herstellung in den 1940er Jahren revolutionäre Auswirkungen auf die Behandlung bakterieller Infektionen hatte. Diese ausführliche biografische und wissenschaftliche Beschreibung wird absichtlich verlängert, um die Validierungsgrenze zu überschreiten und einen too_big Fehler in den Tests zu provozieren; der Text enthält historische Kontexte, wissenschaftliche Details und klinische Auswirkungen in deutscher Sprache." |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path              | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | content.answer.de | string | 500     | true      |

  Scenario: Trying to create a question with unknown locale key for answer
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type   | value     |
      | content.answer.lt | string | Atsakymas |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path           | keys |
      | unrecognized_keys | Unrecognized key: "lt" | content.answer | lt   |

  Scenario: Trying to create a question with answer of wrong type (boolean)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type    | value |
      | content.answer.en | boolean | true  |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                          | expected | path              |
      | invalid_type | Invalid input: expected string, received boolean | string   | content.answer.en |

  Scenario: Trying to create a question with empty Italian context
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path               | type   | value |
      | content.context.it | string |       |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path               | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | content.context.it | string | 1       | true      |

  Scenario: Trying to create a question with English context that is too long
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path               | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
      | content.context.en | string | "In 1928 Alexander Fleming observed the antibacterial effect of a common mold (Penicillium notatum) on bacterial cultures, a discovery that eventually led to the development of penicillin and the antibiotic era. The subsequent decades saw an extraordinary scientific effort to purify and mass-produce penicillin, involving collaboration between researchers, industrial chemists and clinicians, which in turn enabled widespread clinical trials and the rapid deployment of effective treatments for previously lethal infections. This extended context deliberately includes historical background, technical details about extraction and purification, the wartime scaling of production, the ethical and regulatory considerations of early antibiotic use, and the long-term public health consequences—compiled here in a single long paragraph to exceed validation thresholds and simulate a real-world lengthy context field that should trigger a too_big validation error during tests. The paragraph emphasizes how discovery, innovation and global coordination transformed medical practice and saved countless lives, and is intentionally verbose to ensure it goes beyond one thousand characters for the acceptance test." |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path               | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | content.context.en | string | 500     | true      |

  Scenario: Trying to create a question with unknown locale key for context
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path               | type   | value    |
      | content.context.jp | string | 日本語の説明です |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path            | keys |
      | unrecognized_keys | Unrecognized key: "jp" | content.context | jp   |

  Scenario: Trying to create a question with context of wrong type (number)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path               | type    | value |
      | content.context.es | integer | 42    |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                         | expected | path               |
      | invalid_type | Invalid input: expected string, received number | string   | content.context.es |

  Scenario: Trying to create a question with an empty trivia item for English locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type  | value |
      | content.trivia.en | array | [""]  |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path                | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | content.trivia.en.0 | string | 1       | true      |

  Scenario: Trying to create a question with a trivia element that is too long (French)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type  | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
      | content.trivia.fr | array | ["En 1928, Alexander Fleming remarqua qu'un produit dérivé du champignon Penicillium inhibait la croissance bactérienne dans ses cultures, une observation qui a ouvert la voie à l'ère des antibiotiques. Les années suivantes virent des efforts concertés pour isoler et produire la pénicilline à grande échelle, ce qui sauva des millions de vies pendant et après la Seconde Guerre mondiale. Ce texte est volontairement long et détaillé afin de dépasser la limite de validation et provoquer une erreur too_big lors des tests d'acceptation ; il inclut des éléments historiques, scientifiques et cliniques, rédigés en français pour refléter fidèlement le contexte localisé." ] |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path                | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | content.trivia.fr.0 | string | 500     | true      |

  Scenario: Trying to create a question with unknown locale key for trivia
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type  | value        |
      | content.trivia.jp | array | ["豆知識の一つです"] |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path           | keys |
      | unrecognized_keys | Unrecognized key: "jp" | content.trivia | jp   |

  Scenario: Trying to create a question with trivia value of wrong type (should be array)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type   | value        |
      | content.trivia.de | string | not-an-array |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                          | expected | path              | inclusive | maximum | origin |
      | invalid_type | Invalid input: expected array, received string   | array    | content.trivia.de |           |         |        |
      | too_big      | Too big: expected string to have <=10 characters |          | content.trivia.de | true      | 10      | string |

  Scenario: Trying to create a question with missing required fields
    Given the database is populated with question themes fixture set with name "five-question-themes"
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

  Scenario: Trying to create a question without themes
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path   | type  | value |
      | themes | array | []    |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                     | path   | inclusive | origin | minimum |
      | too_small | Too small: expected array to have >=1 items | themes | true      | array  | 1       |
      | custom    | There must be exactly one primary theme     | themes |           |        |         |

  Scenario: Trying to create a question with two primary themes
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                | type    | value |
      | themes[1].isPrimary | boolean | true  |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message                                 | path   |
      | custom | There must be exactly one primary theme | themes |

  Scenario: Trying to create a question without primary theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path                | type    | value |
      | themes[0].isPrimary | boolean | false |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message                                 | path   |
      | custom | There must be exactly one primary theme | themes |

  Scenario: Trying to create a question with duplicate themes
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type   | value                    |
      | themes[1].themeId | string | 9adeceb41db80ab7ec49b457 |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message                  | path   |
      | custom | Theme IDs must be unique | themes |

  Scenario: Trying to create a question with unknown theme ID
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path              | type   | value                    |
      | themes[0].themeId | string | aaa921ed56ba7de91c2aa57f |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id aaa921ed56ba7de91c2aa57f not found |

  Scenario: Trying to create a question without source URLs
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value |
      | sourceUrls | array | []    |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                     | path       | origin | minimum | inclusive |
      | too_small | Too small: expected array to have >=1 items | sourceUrls | array  | 1       | true      |

  Scenario: Trying to create a question with too many source URLs
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value                                                                                                                           |
      | sourceUrls | array | ["http://source1.com","http://source2.com","http://source3.com","http://source4.com","http://source5.com","http://source6.com"] |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                   | path       | origin | maximum | inclusive |
      | too_big | Too big: expected array to have <=5 items | sourceUrls | array  | 5       | true      |

  Scenario: Trying to create a question with duplicate source URLs
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path          | type   | value                                    |
      | sourceUrls[1] | string | https://en.wikipedia.org/wiki/Penicillin |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message                    | path       |
      | custom | Source URLs must be unique | sourceUrls |

  Scenario: Trying to create a question with invalid author role
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path        | type   | value |
      | author.role | string | game  |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                       | values   | path        |
      | invalid_value | Invalid option: expected one of "admin"\|"ai" | admin,ai | author.role |

  Scenario: Trying to create a question without author name
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path        | type   | value |
      | author.name | string |       |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path        | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=3 characters | author.name | string | 3       | true      |

  Scenario: Trying to create a question with author name that is too long
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path        | type   | value                                                                              |
      | author.name | string | This author name is definitely way too long to be accepted by the validation rules |
    And the admin creates a new question with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                          | path        | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=30 characters | author.name | string | 30      | true      |

  Scenario: Trying to create a question without API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the admin creates a new question with the request payload but without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to create a question with invalid API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the admin creates a new question with the request payload but with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
