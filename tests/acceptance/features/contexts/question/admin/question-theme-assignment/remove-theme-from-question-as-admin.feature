@question @question-theme-assignment @remove-theme-from-question @admin

Feature: Remove Theme From Question As Admin
  In order to keep question themes accurate
  As an admin API client
  I want to be able to remove a theme from a question

  Scenario: Removing a theme from a question as admin
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin removes the theme with id "9adeceb41db80ab7ec49b457" from the question with id "d4e5f6a7b8c9012345678904"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | cognitiveDifficulty | status   | sourceUrls                                      |
      | d4e5f6a7b8c9012345678904 | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | history | true      | false  |

    And the response should contain the question theme with slug "history" for the admin question with the following label:
      | locale | label      |
      | en     | History    |
      | fr     | Histoire   |
      | it     | Storia     |
      | es     | Historia   |
      | de     | Geschichte |
      | pt     | História   |

  Scenario: Trying to remove a theme that is not attached to the question
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin removes the theme with id "8ef21e4eb04eb0fa5a469d87" from the question with id "d4e5f6a7b8c9012345678904"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                                                                      |
      | Not Found | 404        | Question theme with id 8ef21e4eb04eb0fa5a469d87 is not assigned to question with id d4e5f6a7b8c9012345678904 |

  Scenario: Trying to remove a theme when question only has one theme
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin removes the theme with id "8ef21e4eb04eb0fa5a469d87" from the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                       |
      | Bad Request | 400        | Question with id a1b2c3d4e5f6012345678901 must have at least 1 theme assigned |

  Scenario: Trying to remove a theme without API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin removes the theme with id "9adeceb41db80ab7ec49b457" from the question with id "d4e5f6a7b8c9012345678904" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to remove a theme with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin removes the theme with id "9adeceb41db80ab7ec49b457" from the question with id "d4e5f6a7b8c9012345678904" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
