@question @modify-question @admin

Feature: Modify Question as Admin
  In order to update question data without recreating it
  As an admin API client
  I want to be able to partially modify a question by its identifier

  Scenario: Modifying a question with complete modification data as admin
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | category | cognitiveDifficulty | status | sourceUrls                                                                      |
      | a1b2c3d4e5f6012345678901 | trivia   | hard                | active | https://en.wikipedia.org/wiki/Psycho_(1960_film), https://www.imdb.com/title/tt0054215/ |

    And the response should contain the following question statement for the admin question:
      | locale | statement                                                         |
      | en     | Which director created the iconic horror film 'Psycho' in 1960?   |
      | fr     | Quel réalisateur a créé le film d'horreur iconique 'Psychose' en 1960? |
      | it     | Quale regista è noto per il film 'Psycho' (1960)?                 |
      | pt     | Qual diretor é conhecido pelo filme 'Psicose' (1960)?             |
      | es     | ¿Qué director es conocido por la película 'Psicosis' (1960)?     |
      | de     | Welcher Regisseur ist für den Film 'Psycho' (1960) bekannt?      |

    And the response should contain the following question answer for the admin question:
      | locale | answer                |
      | en     | Sir Alfred Hitchcock  |
      | fr     | Sir Alfred Hitchcock  |
      | it     | Alfred Hitchcock      |
      | pt     | Alfred Hitchcock      |
      | es     | Alfred Hitchcock      |
      | de     | Alfred Hitchcock      |

    And the response should contain the following question context for the admin question:
      | locale | context                                                                                                            |
      | en     | Alfred Hitchcock, known as the 'Master of Suspense', directed 'Psycho' in 1960, revolutionizing the horror genre.  |
      | fr     | Alfred Hitchcock, connu comme le 'Maître du Suspense', a réalisé 'Psychose' en 1960, révolutionnant le genre horrifique. |
      | it     | Alfred Hitchcock ha diretto il film horror psicologico 'Psycho' del 1960, che è diventato una delle sue opere più famose. |
      | pt     | Alfred Hitchcock dirigiu o filme de horror psicológico 'Psycho' em 1960, que se tornou uma de suas obras mais famosas.   |
      | es     | Alfred Hitchcock dirigió la película de terror psicológico 'Psycho' en 1960, que se convirtió en una de sus obras más famosas. |
      | de     | Alfred Hitchcock inszenierte den psychologischen Horrorfilm 'Psycho' (1960), der zu einem seiner berühmtesten Werke wurde. |

    And the response should contain the following trivia for locale "en" for the admin question:
      | trivia                                                                                      |
      | The shower scene in Psycho took 7 days to shoot and features 70 camera angles.              |
      | Hitchcock bought as many copies of the source novel as possible to keep the ending a secret. |

    And the response should contain the following trivia for locale "fr" for the admin question:
      | trivia                                                                                                     |
      | La scène de douche dans Psychose a nécessité 7 jours de tournage et 70 angles de caméra.                   |
      | Hitchcock a acheté autant d'exemplaires du roman source que possible pour garder la fin secrète.            |

    And the response should contain the following trivia for locale "it" for the admin question:
      | trivia                                                                       |
      | 'Psycho' è famoso per la scena della doccia, musicata da Bernard Herrmann.   |
      | Il film è tratto dal romanzo 'Psycho' di Robert Bloch.                       |

    And the response should contain the following themes for the admin question:
      | slug   | isPrimary | isHint |
      | cinema | true      | false  |

    And the response should contain the following author for the admin question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain no rejection for the admin question

  Scenario: Modifying only the category of a question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path               | type      | value       |
      | content            | undefined |             |
      | sourceUrls         | undefined |             |
      | cognitiveDifficulty | undefined |             |
      | category           | string    | explanation |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | category    | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | explanation | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

  Scenario: Modifying only the English statement of a question with deep merge
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path                | type      | value                                              |
      | category            | undefined |                                                    |
      | cognitiveDifficulty | undefined |                                                    |
      | sourceUrls          | undefined |                                                    |
      | content.answer      | undefined |                                                    |
      | content.context     | undefined |                                                    |
      | content.trivia      | undefined |                                                    |
      | content.statement.fr | undefined |                                                    |
      | content.statement.en | string    | Who directed the legendary film 'Psycho' in 1960? |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have succeeded with status code 200
    And the response should contain the following question statement for the admin question:
      | locale | statement                                                     |
      | en     | Who directed the legendary film 'Psycho' in 1960?             |
      | fr     | Quel réalisateur est connu pour le film 'Psychose' (1960)?    |
      | it     | Quale regista è noto per il film 'Psycho' (1960)?             |
      | pt     | Qual diretor é conhecido pelo filme 'Psicose' (1960)?         |
      | es     | ¿Qué director es conocido por la película 'Psicosis' (1960)? |
      | de     | Welcher Regisseur ist für den Film 'Psycho' (1960) bekannt?  |

  Scenario: Trying to modify a question with invalid Mongo ID
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the admin modifies the question with id "invalid-id" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to modify a non-existing question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the admin modifies the question with id "3ece5c485ddc36118b9fbd5c" with the request payload
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                             | errorCode          |
      | Not Found | 404        | Question with id 3ece5c485ddc36118b9fbd5c not found | question-not-found |

  Scenario: Trying to modify a question with invalid category
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path     | type   | value   |
      | category | string | invalid |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                      | path     | values                            |
      | invalid_value | Invalid option: expected one of "trivia"\|"lexicon"\|"riddle"\|"explanation" | category | trivia,lexicon,riddle,explanation |

  Scenario: Trying to modify a question with invalid cognitive difficulty
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path                | type   | value   |
      | cognitiveDifficulty | string | invalid |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                              | path                | values         |
      | invalid_value | Invalid option: expected one of "easy"\|"medium"\|"hard" | cognitiveDifficulty | easy,medium,hard |

  Scenario: Trying to modify a question with empty statement locale value
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type   | value |
      | content.statement.en | string |       |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path                 | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | content.statement.en | string | 1       | true      |

  Scenario: Trying to modify a question with unknown locale key for statement
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path                 | type   | value   |
      | content.statement.jp | string | 日本語の文です |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path              | keys |
      | unrecognized_keys | Unrecognized key: "jp" | content.statement | jp   |

  Scenario: Trying to modify a question with empty source URLs array
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value |
      | sourceUrls | array | []    |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                     | path       | origin | minimum | inclusive |
      | too_small | Too small: expected array to have >=1 items | sourceUrls | array  | 1       | true      |

  Scenario: Trying to modify a question with duplicate source URLs
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the request payload is overridden with the following values:
      | path          | type   | value                                           |
      | sourceUrls[1] | string | https://en.wikipedia.org/wiki/Psycho_(1960_film) |
    And the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message                    | path       |
      | custom | Source URLs must be unique | sourceUrls |

  Scenario: Trying to modify a question without an API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload but without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to modify a question with an invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question", type "modification" and name "complete"
    When the admin modifies the question with id "a1b2c3d4e5f6012345678901" with the request payload but with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
