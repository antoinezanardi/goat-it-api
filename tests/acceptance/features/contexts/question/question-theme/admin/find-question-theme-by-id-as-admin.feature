@question-theme @find-question-theme-by-id @admin

Feature: Find Question Theme by ID as Admin
  In order to display question theme to back office users
  As an admin API client
  I want to be able to retrieve a question theme by its identifier for administration purposes

  Scenario: Finding a question theme returns localized data for all supported locales
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "ddb03d94cae8df38d28e5adc"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question theme:
      | slug  | status |
      | music | active |
    And the response should contain the following localized labels for the admin question theme:
      | locale | label   |
      | en     | Music   |
      | fr     | Musique |
      | it     | Musica  |
      | es     | Música  |
      | de     | Musik   |
      | pt     | Música  |
    And the response should contain the following localized aliases for the admin question theme:
      | locale | aliases             |
      | en     | Songs, Tunes        |
      | fr     | Chanson, Son        |
      | it     | Canzoni, Brani      |
      | es     | Canciones, Melodías |
      | de     | Lieder, Melodien    |
      | pt     | Canções, Músicas    |
    And the response should contain the following localized descriptions for the admin question theme:
      | locale | description                                                  |
      | en     | Theme about music, artists and music genres.                 |
      | fr     | Thème lié à la musique, aux artistes et aux genres musicaux. |
      | it     | Argomento sulla musica, artisti e generi musicali.           |
      | es     | Tema sobre música, artistas y géneros musicales.             |
      | de     | Thema über Musik, Künstler und Musikgenres.                  |
      | pt     | Tema sobre música, artistas e gêneros musicais.              |

  Scenario: Finding a question theme with partial translation returns localized data with undefined values
    Given the database is populated with question themes fixture set with name "two-english-only-question-themes"
    When the admin retrieves the question theme with id "5cd8edcc5fdf4cf6aaf79c9e"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question theme:
      | slug   | status |
      | cinema | active |
    And the response should contain the following localized labels for the admin question theme:
      | locale | label  |
      | en     | Cinema |
      | fr     |        |
      | it     |        |
      | es     |        |
      | de     |        |
      | pt     |        |
    And the response should contain the following localized aliases for the admin question theme:
      | locale | aliases       |
      | en     | Movies, Films |
      | fr     |               |
      | it     |               |
      | es     |               |
      | de     |               |
      | pt     |               |
    And the response should contain the following localized descriptions for the admin question theme:
      | locale | description                    |
      | en     | Theme about cinema and movies. |
      | fr     |                                |
      | it     |                                |
      | es     |                                |
      | de     |                                |
      | pt     |                                |

  Scenario: Trying to find a question theme when provided id is invalid
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to find a non-existing question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to find a question theme without API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "ddb03d94cae8df38d28e5adc" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to find a question theme with invalid API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "ddb03d94cae8df38d28e5adc" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
