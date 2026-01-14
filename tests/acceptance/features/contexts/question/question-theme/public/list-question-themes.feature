@question-theme @list-question-themes @public

Feature: List Question Themes
  In order to display question themes to end users
  As an API client
  I want to be able to retrieve all question themes with localization support

  Scenario: Listing all question themes returns results in default locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | slug    | label   | aliases              | description                                           | status   |
      | cinema  | Cinema  | Movies, Films        | Theme about cinema and movies.                        | active   |
      | music   | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | active   |
      | sports  | Sports  | Football, Games      | Theme about sports, competitions and athletes.        | archived |
      | history | History | Past, Chronology     | Theme about historical events, figures and periods.   | active   |
      | science | Science | Technology, Research | Theme covering sciences, discoveries and innovations. | active   |

  Scenario: Listing all question themes in wildcard locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes in locale "*"
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | slug    | label   | aliases              | description                                           | status   |
      | cinema  | Cinema  | Movies, Films        | Theme about cinema and movies.                        | active   |
      | music   | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | active   |
      | sports  | Sports  | Football, Games      | Theme about sports, competitions and athletes.        | archived |
      | history | History | Past, Chronology     | Theme about historical events, figures and periods.   | active   |
      | science | Science | Technology, Research | Theme covering sciences, discoveries and innovations. | active   |

  Scenario: Listing all question themes in French locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | slug    | label    | aliases                | description                                                    | status   |
      | cinema  | Cinéma   | Films, Ciné            | Thème concernant le cinéma et les films.                       | active   |
      | music   | Musique  | Chanson, Son           | Thème lié à la musique, aux artistes et aux genres musicaux.   | active   |
      | sports  | Sport    | Football, Jeux         | Thème concernant les sports, compétitions et athlètes.         | archived |
      | history | Histoire | Passé, Chronologie     | Thème sur les événements historiques, personnages et périodes. | active   |
      | science | Science  | Technologie, Recherche | Thème couvrant les sciences, découvertes et innovations.       | active   |

  Scenario: Listing all question themes in French locale with fallback to default because of missing translation
    Given the database is populated with question themes fixture set with name "two-english-only-question-themes"
    When the client retrieves all question themes in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain 2 question themes
    And the response should contain the following question themes:
      | slug   | label  | aliases       | description                                  | status |
      | cinema | Cinema | Movies, Films | Theme about cinema and movies.               | active |
      | music  | Music  | Songs, Tunes  | Theme about music, artists and music genres. | active |

  Scenario: Listing all question themes when none exist
    When the client retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 0 question themes

  Scenario: Trying to list all question themes with invalid locale
    When the client retrieves all question themes in locale "invalid-locale"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                                                                              |
      | Bad Request | 400        | Invalid locale 'in' in 'Accept-Language' header, supported locales are: en, fr, es, de, it, pt (only the first locale is considered) |

  Scenario: Trying to list all question themes without API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to list all question themes with invalid API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |