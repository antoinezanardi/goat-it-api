@question @question-theme @archive-question-theme

Feature: Archive Question Theme
  In order to archive question theme to prevent its use in new questions
  As an API client
  I want to be able to archive a question theme by its identifier

  Scenario: Archiving a question theme returns it archived in default locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client archives the question theme with id "ddb03d94cae8df38d28e5adc"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug  | label | aliases      | description                                  | status   |
      | music | Music | Songs, Tunes | Theme about music, artists and music genres. | archived |

  Scenario: Archiving a question theme in wildcard locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client archives the question theme with id "ddb03d94cae8df38d28e5adc" in locale "*"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug  | label | aliases      | description                                  | status   |
      | music | Music | Songs, Tunes | Theme about music, artists and music genres. | archived |

  Scenario: Archiving a question theme in French locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client archives the question theme with id "ddb03d94cae8df38d28e5adc" in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug  | label   | aliases      | description                                                  | status   |
      | music | Musique | Chanson, Son | Thème lié à la musique, aux artistes et aux genres musicaux. | archived |

  Scenario: Archiving a question theme in French locale with fallback to default because of missing translation
    Given the database is populated with question themes fixture set with name "two-english-only-question-themes"
    When the client archives the question theme with id "5cd8edcc5fdf4cf6aaf79c9e" in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain the following question theme:
      | slug   | label  | aliases       | description                    | status   |
      | cinema | Cinema | Movies, Films | Theme about cinema and movies. | archived |

  Scenario: Trying to archive a question theme when provided id is invalid
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client archives the question theme with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to archive a non-existing question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client archives the question theme with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to archive an already archived question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client archives the question theme with id "dbb0664ad4797c6cc79d5aee"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                       |
      | Bad Request | 400        | Question theme with id dbb0664ad4797c6cc79d5aee already has status 'archived' |