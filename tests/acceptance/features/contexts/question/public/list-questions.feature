@question @list-questions @public

Feature: List Questions
  In order to display questions to end users
  As an API client
  I want to be able to retrieve all questions with localization support

  Scenario: Listing all questions returns results in default locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | a1b2c3d4e5f6012345678901 | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | c3d4e5f6a7b8012345678903 | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following content:
      | statement                                              | answer           | context                                                                                                           |
      | Which director is known for the movie 'Psycho' (1960)? | Alfred Hitchcock | Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works. |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following trivia:
      | trivia                                                               |
      | 'Psycho' is famous for its shower scene, scored by Bernard Herrmann. |
      | The film is based on the novel 'Psycho' by Robert Bloch.             |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following themes:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Theme about cinema and movies. | true      | false  |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following author:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" but without rejection

    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following content:
      | statement                                              | answer     | context                                                                                             |
      | Which band released the album 'Dark Side of the Moon'? | Pink Floyd | 'The Dark Side of the Moon' is a 1973 album by Pink Floyd, noted for its progressive rock elements. |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following trivia:
      | trivia                                                                          |
      | The album stayed on the Billboard charts for a record-breaking number of weeks. |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following themes:
      | slug  | label | description                                  | isPrimary | isHint |
      | music | Music | Theme about music, artists and music genres. | true      | false  |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following author:
      | role | name     | gameId |
      | ai   | Music AI |        |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" but without rejection

    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following content:
      | statement                                     | answer | context |
      | Which country won the FIFA World Cup in 2018? | France |         |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" but without trivia
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following themes:
      | slug   | label  | description                                    | isPrimary | isHint |
      | sports | Sports | Theme about sports, competitions and athletes. | false     | true   |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following author:
      | role | name | gameId                   |
      | game |      | 32dafb5cfb677b53d1f7b60d |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" but without rejection

    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following content:
      | statement                                         | answer            | context                                                                                 |
      | Who was the first President of the United States? | George Washington | George Washington served as the first President of the United States from 1789 to 1797. |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following trivia:
      | trivia                                                  |
      | Washington is often called the 'Father of His Country'. |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following themes:
      | slug    | label   | description                                           | isPrimary | isHint |
      | science | Science | Theme covering sciences, discoveries and innovations. | false     | true   |
      | history | History | Theme about historical events, figures and periods.   | true      | false  |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following author:
      | role | name       | gameId |
      | ai   | History AI |        |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following rejection:
      | type                  | comment                                                          |
      | incorrect-information | Second theme assignment is not relevant to the question content. |

    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following content:
      | statement                               | answer | context                                                                                                                                                                                                      |
      | Of which animal is the elephant phobic? | Bees   | Elephants are not widely known for their fear of bees, which may seem surprising given their imposing size. However, this phobia is well documented, and elephants often avoid areas where bees are present. |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following trivia:
      | trivia                                                                                                                                |
      | Bees are used by some wildlife rangers to protect elephants from poachers, as elephants naturally avoid areas where bees are present. |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following themes:
      | slug    | label   | description                                           | isPrimary | isHint |
      | science | Science | Theme covering sciences, discoveries and innovations. | true      | false  |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following author:
      | role | name                  | gameId |
      | ai   | AI Question Generator |        |

    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" but without rejection

  Scenario: Listing all questions in wildcard locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions in locale "*"
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | a1b2c3d4e5f6012345678901 | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | c3d4e5f6a7b8012345678903 | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following content:
      | statement                                              | answer           | context                                                                                                           |
      | Which director is known for the movie 'Psycho' (1960)? | Alfred Hitchcock | Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works. |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following trivia:
      | trivia                                                               |
      | 'Psycho' is famous for its shower scene, scored by Bernard Herrmann. |
      | The film is based on the novel 'Psycho' by Robert Bloch.             |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following themes:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Theme about cinema and movies. | true      | false  |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following author:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" but without rejection

    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following content:
      | statement                                              | answer     | context                                                                                             |
      | Which band released the album 'Dark Side of the Moon'? | Pink Floyd | 'The Dark Side of the Moon' is a 1973 album by Pink Floyd, noted for its progressive rock elements. |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following trivia:
      | trivia                                                                          |
      | The album stayed on the Billboard charts for a record-breaking number of weeks. |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following themes:
      | slug  | label | description                                  | isPrimary | isHint |
      | music | Music | Theme about music, artists and music genres. | true      | false  |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following author:
      | role | name     | gameId |
      | ai   | Music AI |        |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" but without rejection

    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following content:
      | statement                                     | answer | context |
      | Which country won the FIFA World Cup in 2018? | France |         |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" but without trivia
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following themes:
      | slug   | label  | description                                    | isPrimary | isHint |
      | sports | Sports | Theme about sports, competitions and athletes. | false     | true   |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following author:
      | role | name | gameId                   |
      | game |      | 32dafb5cfb677b53d1f7b60d |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" but without rejection

    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following content:
      | statement                                         | answer            | context                                                                                 |
      | Who was the first President of the United States? | George Washington | George Washington served as the first President of the United States from 1789 to 1797. |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following trivia:
      | trivia                                                  |
      | Washington is often called the 'Father of His Country'. |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following themes:
      | slug    | label   | description                                           | isPrimary | isHint |
      | science | Science | Theme covering sciences, discoveries and innovations. | false     | true   |
      | history | History | Theme about historical events, figures and periods.   | true      | false  |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following author:
      | role | name       | gameId |
      | ai   | History AI |        |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following rejection:
      | type                  | comment                                                          |
      | incorrect-information | Second theme assignment is not relevant to the question content. |

    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following content:
      | statement                               | answer | context                                                                                                                                                                                                      |
      | Of which animal is the elephant phobic? | Bees   | Elephants are not widely known for their fear of bees, which may seem surprising given their imposing size. However, this phobia is well documented, and elephants often avoid areas where bees are present. |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following trivia:
      | trivia                                                                                                                                |
      | Bees are used by some wildlife rangers to protect elephants from poachers, as elephants naturally avoid areas where bees are present. |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following themes:
      | slug    | label   | description                                           | isPrimary | isHint |
      | science | Science | Theme covering sciences, discoveries and innovations. | true      | false  |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following author:
      | role | name                  | gameId |
      | ai   | AI Question Generator |        |

    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" but without rejection

  Scenario: Listing all questions in Italian locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions in locale "it"
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | a1b2c3d4e5f6012345678901 | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | c3d4e5f6a7b8012345678903 | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following content:
      | statement                                         | answer           | context                                                                                                                   |
      | Quale regista è noto per il film 'Psycho' (1960)? | Alfred Hitchcock | Alfred Hitchcock ha diretto il film horror psicologico 'Psycho' del 1960, che è diventato una delle sue opere più famose. |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following trivia:
      | trivia                                                                     |
      | 'Psycho' è famoso per la scena della doccia, musicata da Bernard Herrmann. |
      | Il film è tratto dal romanzo 'Psycho' di Robert Bloch.                     |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following themes:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Argomento sul cinema e i film. | true      | false  |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" and the following author:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain a question among them with id "a1b2c3d4e5f6012345678901" but without rejection

    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following content:
      | statement                                                     | answer     | context                                                                                                       |
      | Quale band ha pubblicato l'album 'The Dark Side of the Moon'? | Pink Floyd | 'The Dark Side of the Moon' è un album del 1973 dei Pink Floyd, noto per i suoi elementi di rock progressivo. |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following trivia:
      | trivia                                                                           |
      | L'album è rimasto nelle classifiche Billboard per un numero record di settimane. |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following themes:
      | slug  | label  | description                                        | isPrimary | isHint |
      | music | Musica | Argomento sulla musica, artisti e generi musicali. | true      | false  |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" and the following author:
      | role | name     | gameId |
      | ai   | Music AI |        |
    And the response should contain a question among them with id "b2c3d4e5f6a7012345678902" but without rejection

    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following content:
      | statement                                              | answer  | context |
      | Quale paese ha vinto la Coppa del Mondo FIFA nel 2018? | Francia |         |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" but without trivia
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following themes:
      | slug   | label | description                              | isPrimary | isHint |
      | sports | Sport | Tema sullo sport, competizioni e atleti. | false     | true   |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" and the following author:
      | role | name | gameId                   |
      | game |      | 32dafb5cfb677b53d1f7b60d |
    And the response should contain a question among them with id "c3d4e5f6a7b8012345678903" but without rejection

    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following content:
      | statement                                          | answer            | context                                                                           |
      | Chi è stato il primo Presidente degli Stati Uniti? | George Washington | George Washington è stato il primo Presidente degli Stati Uniti dal 1789 al 1797. |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following trivia:
      | trivia                                                     |
      | Washington è spesso chiamato il 'Padre della sua Nazione'. |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following themes:
      | slug    | label   | description                                          | isPrimary | isHint |
      | science | Scienza | Argomento che copre scienze, scoperte e innovazioni. | false     | true   |
      | history | Storia  | Tema sugli eventi storici, personaggi e periodi.     | true      | false  |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following author:
      | role | name       | gameId |
      | ai   | History AI |        |
    And the response should contain a question among them with id "d4e5f6a7b8c9012345678904" and the following rejection:
      | type                  | comment                                                          |
      | incorrect-information | Second theme assignment is not relevant to the question content. |

    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following content:
      | statement                             | answer | context                                                                                                                                                                                                                                                |
      | Di quale animale ha paura l'elefante? | Le api | Gli elefanti non sono ampiamente conosciuti per la loro paura delle api, il che può sembrare sorprendente data la loro imponente dimensione. Tuttavia, questa fobia è ben documentata e gli elefanti evitano spesso le aree dove sono presenti le api. |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following trivia:
      | trivia                                                                                                                                                                                    |
      | Le api sono utilizzate da alcuni guardiani della fauna selvatica per proteggere gli elefanti dai bracconieri, poiché gli elefanti evitano naturalmente le aree dove sono presenti le api. |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following themes:
      | slug    | label   | description                                          | isPrimary | isHint |
      | science | Scienza | Argomento che copre scienze, scoperte e innovazioni. | true      | false  |
    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following author:
      | role | name                  | gameId |
      | ai   | AI Question Generator |        |

    And the response should contain a question among them with id "efd39a4ac3bdfd03d2f8cdf1" but without rejection

  Scenario: Listing all questions in French locale with fallback to default because of missing translation
    Given the database is populated with questions fixture set with name "two-english-only-questions"
    When the client retrieves all questions in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions
    And the response should contain the following questions:
      | id                       | cognitiveDifficulty | status  | sourceUrls                                              |
      | aa11bb22cc33dd44ee55ff01 | medium              | active  | https://en.wikipedia.org/wiki/Vertigo_(film)            |
      | bb22cc33dd44ee55ff660102 | hard                | pending | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon |

    And the response should contain a question among them with id "aa11bb22cc33dd44ee55ff01" and the following content:
      | statement                                             | answer           | context                                                                                                  |
      | Which famous director made the film 'Vertigo' (1958)? | Alfred Hitchcock | 'Vertigo' is a 1958 film directed by Alfred Hitchcock and is widely regarded as one of his masterpieces. |
    And the response should contain a question among them with id "aa11bb22cc33dd44ee55ff01" and the following trivia:
      | trivia                                                                                            |
      | The film's exploration of obsession and identity has made it a subject of much critical analysis. |
    And the response should contain a question among them with id "aa11bb22cc33dd44ee55ff01" and the following themes:
      | slug   | label  | description                    | isPrimary | isHint |
      | cinema | Cinema | Theme about cinema and movies. | true      | false  |
    And the response should contain a question among them with id "aa11bb22cc33dd44ee55ff01" and the following author:
      | role  | name        | gameId |
      | admin | Test Author |        |
    And the response should contain a question among them with id "aa11bb22cc33dd44ee55ff01" but without rejection

    And the response should contain a question among them with id "bb22cc33dd44ee55ff660102" and the following content:
      | statement                                                               | answer     | context                                                                                           |
      | Which English rock band released the album 'The Dark Side of the Moon'? | Pink Floyd | 'The Dark Side of the Moon' is a 1973 album by Pink Floyd, notable for its sonic experimentation. |
    And the response should contain a question among them with id "bb22cc33dd44ee55ff660102" and the following trivia:
      | trivia                                                            |
      | The album spent a record number of weeks on the Billboard charts. |
    And the response should contain a question among them with id "bb22cc33dd44ee55ff660102" and the following themes:
      | slug  | label | description                                  | isPrimary | isHint |
      | music | Music | Theme about music, artists and music genres. | true      | false  |
    And the response should contain a question among them with id "bb22cc33dd44ee55ff660102" and the following author:
      | role | name     | gameId |
      | ai   | Music AI |        |
    And the response should contain a question among them with id "bb22cc33dd44ee55ff660102" but without rejection

  Scenario: Listing all questions when none exist
    When the client retrieves all questions
    Then the request should have succeeded with status code 200
    And the response should contain 0 questions

  Scenario: Trying to list all questions with invalid locale
    When the client retrieves all questions in locale "invalid-locale"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                                                                              |
      | Bad Request | 400        | Invalid locale 'in' in 'Accept-Language' header, supported locales are: en, fr, es, de, it, pt (only the first locale is considered) |

  Scenario: Trying to list all questions without API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to list all questions with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
