@question @question-theme @find-question-theme-by-id

Feature: Find Question Theme by ID
  In order to display question theme to end users
  As an API client
  I want to be able to retrieve a question theme by its identifier with localization support

  Scenario: Finding a question theme returns it in default locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves the question theme with id "ddb03d94cae8df38d28e5adc"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug  | label | aliases      | description                                  | status |
      | music | Music | Songs, Tunes | Theme about music, artists and music genres. | active |

  Scenario: Finding a question theme in wildcard locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves the question theme with id "ddb03d94cae8df38d28e5adc" in locale "*"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug  | label | aliases      | description                                  | status |
      | music | Music | Songs, Tunes | Theme about music, artists and music genres. | active |

  Scenario: Finding a question theme in French locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves the question theme with id "ddb03d94cae8df38d28e5adc" in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug  | label   | aliases      | description                                                  | status |
      | music | Musique | Chanson, Son | Thème lié à la musique, aux artistes et aux genres musicaux. | active |

  Scenario: Finding a question theme in French locale with fallback to default because of missing translation
    Given the database is populated with question themes fixture set with name "two-english-only-question-themes"
    When the client retrieves the question theme with id "5cd8edcc5fdf4cf6aaf79c9e" in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug   | label  | aliases       | description                    | status |
      | cinema | Cinema | Movies, Films | Theme about cinema and movies. | active |

  Scenario: Trying to find a question theme when provided id is invalid
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves the question theme with id "invalid-id"
    Then the request should have failed with status code 400 and contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to find a non-existing question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves the question theme with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 3ece5c485ddc36118b9fbd5c not found |