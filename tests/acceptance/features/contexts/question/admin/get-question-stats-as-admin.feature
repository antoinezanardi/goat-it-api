@question @get-question-stats @admin

Feature: Get Question Stats as Admin
  In order to provide dashboard analytics
  As an admin API client
  I want to retrieve aggregated question statistics

  Scenario: Get question stats with mixed data
    # NOTE: DataTable values below MUST match the actual contents of the "sixty-questions" fixture.
    # Values computed from the fixture header comment:
    #   60 total (57 active, 1 pending, 1 rejected, 1 archived)
    #   Categories: 15 each (trivia, lexicon, riddle, explanation)
    #   Difficulties: 19 easy, 19 medium, 22 hard
    #   Author roles: 22 admin, 18 ai, 20 game
    #   Rejection: 1 rejected question with type "duplicate-question"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves question statistics
    Then the request should have succeeded with status code 200
    And the response should contain questions stats with:
      | field | value |
      | total | 60    |
    And the response should contain questions status stats with:
      | field    | value |
      | active   | 57    |
      | pending  | 1     |
      | rejected | 1     |
      | archived | 1     |
    And the response should contain questions category stats with:
      | field       | value |
      | trivia      | 15    |
      | lexicon     | 15    |
      | riddle      | 15    |
      | explanation | 15    |
    And the response should contain questions cognitive difficulty stats with:
      | field  | value |
      | easy   | 19    |
      | medium | 19    |
      | hard   | 22    |
    And the response should contain questions author role stats with:
      | field | value |
      | admin | 22    |
      | ai    | 18    |
      | game  | 20    |
    And the response should contain questions rejection type stats with:
      | field                   | value |
      | inappropriate-content   | 0     |
      | incorrect-information   | 0     |
      | poor-quality            | 0     |
      | duplicate-question      | 1     |
      | other                   | 0     |

  Scenario: Get question stats with empty database
    When the admin retrieves question statistics
    Then the request should have succeeded with status code 200
    And the response should contain questions stats with:
      | field | value |
      | total | 0     |
    And the response should contain questions status stats with:
      | field    | value |
      | active   | 0     |
      | pending  | 0     |
      | rejected | 0     |
      | archived | 0     |
    And the response should contain questions category stats with:
      | field       | value |
      | trivia      | 0     |
      | lexicon     | 0     |
      | riddle      | 0     |
      | explanation | 0     |
    And the response should contain questions cognitive difficulty stats with:
      | field  | value |
      | easy   | 0     |
      | medium | 0     |
      | hard   | 0     |
    And the response should contain questions author role stats with:
      | field | value |
      | admin | 0     |
      | ai    | 0     |
      | game  | 0     |
    And the response should contain questions rejection type stats with:
      | field                   | value |
      | inappropriate-content   | 0     |
      | incorrect-information   | 0     |
      | poor-quality            | 0     |
      | duplicate-question      | 0     |
      | other                   | 0     |

  Scenario: Trying to get question stats without API key
    When the admin retrieves question statistics without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to get question stats with invalid API key
    When the admin retrieves question statistics with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
