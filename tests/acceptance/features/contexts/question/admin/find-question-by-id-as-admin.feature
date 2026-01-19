@question @find-question-by-id @admin

Feature: Find Question by ID as Admin
  In order to display question to back office users
  As an admin API client
  I want to be able to retrieve a question by its identifier for administration purposes

  Scenario: Finding an admin question returns it
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

    And the response should contain the following question statement for the admin question:
      | locale | statement                                                    |
      | en     | Which director is known for the movie 'Psycho' (1960)?       |
      | fr     | Quel réalisateur est connu pour le film 'Psychose' (1960)?   |
      | it     | Quale regista è noto per il film 'Psycho' (1960)?            |
      | es     | ¿Qué director es conocido por la película 'Psicosis' (1960)? |
      | de     | Welcher Regisseur ist für den Film 'Psycho' (1960) bekannt?  |
      | pt     | Qual diretor é conhecido pelo filme 'Psicose' (1960)?        |

    And the response should contain the following question answer for the admin question:
      | locale | answer           |
      | en     | Alfred Hitchcock |
      | fr     | Alfred Hitchcock |
      | it     | Alfred Hitchcock |
      | es     | Alfred Hitchcock |
      | de     | Alfred Hitchcock |
      | pt     | Alfred Hitchcock |

    And the response should contain the following question context for the admin question:
      | locale | context                                                                                                                        |
      | en     | Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works.              |
      | fr     | Alfred Hitchcock a réalisé le film d'horreur psychologique 'Psychose' en 1960, devenu l'une de ses œuvres les plus célèbres.   |
      | it     | Alfred Hitchcock ha diretto il film horror psicologico 'Psycho' del 1960, che è diventato una delle sue opere più famose.      |
      | es     | Alfred Hitchcock dirigió la película de terror psicológico 'Psycho' en 1960, que se convirtió en una de sus obras más famosas. |
      | de     | Alfred Hitchcock inszenierte den psychologischen Horrorfilm 'Psycho' (1960), der zu einem seiner berühmtesten Werke wurde.     |
      | pt     | Alfred Hitchcock dirigiu o filme de horror psicológico 'Psycho' em 1960, que se tornou uma de suas obras mais famosas.         |

    And the response should contain the following trivia for locale "en" for the admin question:
      | trivia                                                               |
      | 'Psycho' is famous for its shower scene, scored by Bernard Herrmann. |
      | The film is based on the novel 'Psycho' by Robert Bloch.             |

    And the response should contain the following trivia for locale "fr" for the admin question:
      | trivia                                                                         |
      | 'Psychose' est célèbre pour sa scène de douche, composée par Bernard Herrmann. |
      | Le film est adapté du roman 'Psycho' de Robert Bloch.                          |

    And the response should contain the following trivia for locale "it" for the admin question:
      | trivia                                                                     |
      | 'Psycho' è famoso per la scena della doccia, musicata da Bernard Herrmann. |
      | Il film è tratto dal romanzo 'Psycho' di Robert Bloch.                     |

    And the response should contain the following trivia for locale "es" for the admin question:
      | trivia                                                                           |
      | 'Psycho' es famoso por su escena de la ducha, musicalizada por Bernard Herrmann. |
      | La película está basada en la novela 'Psycho' de Robert Bloch.                   |

    And the response should contain the following trivia for locale "de" for the admin question:
      | trivia                                                                             |
      | 'Psycho' ist berühmt für seine Duschszene, die von Bernard Herrmann vertont wurde. |
      | Der Film basiert auf dem Roman 'Psycho' von Robert Bloch.                          |

    And the response should contain the following trivia for locale "pt" for the admin question:
      | trivia                                                                             |
      | 'Psycho' é famoso por sua cena do chuveiro, com trilha sonora de Bernard Herrmann. |
      | O filme é baseado no romance 'Psycho' de Robert Bloch.                             |

    And the response should contain the following themes for the admin question:
      | slug   | isPrimary | isHint |
      | cinema | true      | false  |

    And the response should contain the question theme with slug "cinema" for the admin question with the following label:
      | locale | label  |
      | en     | Cinema |
      | fr     | Cinéma |
      | it     | Cinema |
      | es     | Cine   |
      | de     | Kino   |
      | pt     | Cinema |

    And the response should contain the following author for the admin question:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |

    And the response should contain no rejection for the admin question

  Scenario: Trying to find a question when provided id is invalid
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves the question with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to find a non-existing admin question
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves the question with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                             |
      | Not Found | 404        | Question with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to find an admin question without API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves the question with id "a1b2c3d4e5f6012345678901" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to find an admin question with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves the question with id "a1b2c3d4e5f6012345678901" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
