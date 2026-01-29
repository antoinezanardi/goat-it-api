@question @archive-question @admin

Feature: Archive Question As Admin
  In order to archive question to prevent its use in new games
  As an admin API client
  I want to be able to archive a question by its identifier for administration purposes

  Scenario: Archiving a question returns it archived
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin archives the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | cognitiveDifficulty | status   | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | medium              | archived | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

  Scenario: Trying to archive a question when provided id is invalid
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin archives the question with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to archive a non-existing question
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin archives the question with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                             |
      | Not Found | 404        | Question with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to archive an already archived question
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin archives the question with id "efd39a4ac3bdfd03d2f8cdf1"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                 |
      | Bad Request | 400        | Question with id efd39a4ac3bdfd03d2f8cdf1 already has status 'archived' |

  Scenario: Trying to archive a question without API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin archives the question with id "a1b2c3d4e5f6012345678901" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to archive a question with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin archives the question with id "a1b2c3d4e5f6012345678901" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
