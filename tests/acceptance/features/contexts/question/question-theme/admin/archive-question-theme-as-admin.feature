@question-theme @archive-question-theme @admin

Feature: Archive Question Theme As Admin
  In order to archive question theme to prevent its use in new questions
  As an admin API client
  I want to be able to archive a question theme by its identifier for administration purposes

  Scenario: Archiving a question theme returns it archived
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin archives the question theme with id "ddb03d94cae8df38d28e5adc"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question theme:
      | slug  | status   |
      | music | archived |

  Scenario: Trying to archive a question theme when provided id is invalid
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin archives the question theme with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to archive a non-existing question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin archives the question theme with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to archive an already archived question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin archives the question theme with id "dbb0664ad4797c6cc79d5aee"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                       |
      | Bad Request | 400        | Question theme with id dbb0664ad4797c6cc79d5aee already has status 'archived' |

  Scenario: Trying to archive a question theme without API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin archives the question theme with id "ddb03d94cae8df38d28e5adc" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to archive a question theme with invalid API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin archives the question theme with id "ddb03d94cae8df38d28e5adc" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
