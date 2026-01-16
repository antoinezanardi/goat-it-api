@question @find-question-by-id @public

Feature: Find Question by ID
  In order to display question to end users
  As an API client
  I want to be able to retrieve a question by its identifier with localization support

  Scenario: Finding a question returns it in default locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have succeeded with status code 200
    And the response should contain the following question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

    And the response should contain the following content for the question:
      | statement                                              | answer           | context                                                                                                           |
      | Which director is known for the movie 'Psycho' (1960)? | Alfred Hitchcock | Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works. |
    And the response should contain the following trivia for the question:
      | trivia                                                               |
      | 'Psycho' is famous for its shower scene, scored by Bernard Herrmann. |
      | The film is based on the novel 'Psycho' by Robert Bloch.             |
    And the response should contain the following themes for the question:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Theme about cinema and movies. | true      | false  |
    And the response should contain the following author for the question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain no rejection for the question

  Scenario: Finding a question in wildcard locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "a1b2c3d4e5f6012345678901" in locale "*"
    Then the request should have succeeded with status code 200
    And the response should contain the following question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

    And the response should contain the following content for the question:
      | statement                                              | answer           | context                                                                                                           |
      | Which director is known for the movie 'Psycho' (1960)? | Alfred Hitchcock | Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works. |
    And the response should contain the following trivia for the question:
      | trivia                                                               |
      | 'Psycho' is famous for its shower scene, scored by Bernard Herrmann. |
      | The film is based on the novel 'Psycho' by Robert Bloch.             |
    And the response should contain the following themes for the question:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Theme about cinema and movies. | true      | false  |
    And the response should contain the following author for the question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain no rejection for the question

  Scenario: Finding a question in French locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "a1b2c3d4e5f6012345678901" in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain the following question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

    And the response should contain the following content for the question:
      | statement                                                  | answer           | context                                                                                                                      |
      | Quel réalisateur est connu pour le film 'Psychose' (1960)? | Alfred Hitchcock | Alfred Hitchcock a réalisé le film d'horreur psychologique 'Psychose' en 1960, devenu l'une de ses œuvres les plus célèbres. |
    And the response should contain the following trivia for the question:
      | trivia                                                                         |
      | 'Psychose' est célèbre pour sa scène de douche, composée par Bernard Herrmann. |
      | Le film est adapté du roman 'Psycho' de Robert Bloch.                          |
    And the response should contain the following themes for the question:
      | slug   | label  | description                              | isPrimary | isHint |
      | cinema | Cinéma | Thème concernant le cinéma et les films. | true      | false  |
    And the response should contain the following author for the question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain no rejection for the question

  Scenario: Finding a question in French locale with fallback to default because of missing translation
    Given the database is populated with questions fixture set with name "two-english-only-questions"
    When the client retrieves the question with id "aa11bb22cc33dd44ee55ff01" in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain the following question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                   |
      | aa11bb22cc33dd44ee55ff01 | medium              | active | https://en.wikipedia.org/wiki/Vertigo_(film) |

    And the response should contain the following content for the question:
      | statement                                             | answer           | context                                                                                                  |
      | Which famous director made the film 'Vertigo' (1958)? | Alfred Hitchcock | 'Vertigo' is a 1958 film directed by Alfred Hitchcock and is widely regarded as one of his masterpieces. |
    And the response should contain the following trivia for the question:
      | trivia                                                                                            |
      | The film's exploration of obsession and identity has made it a subject of much critical analysis. |
    And the response should contain the following themes for the question:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Theme about cinema and movies. | true      | false  |
    And the response should contain the following author for the question:
      | role  | name        | gameId |
      | admin | Test Author |        |
    And the response should contain no rejection for the question

  Scenario: Trying to find a question when provided id is invalid
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to find a non-existing question
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                             |
      | Not Found | 404        | Question with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to find a question without API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "a1b2c3d4e5f6012345678901" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to find a question with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves the question with id "a1b2c3d4e5f6012345678901" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
