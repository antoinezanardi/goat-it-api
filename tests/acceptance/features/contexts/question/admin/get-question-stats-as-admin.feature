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
    And the response should contain a Question Stats DTO with:
      | field                             | value |
      | total                             | 60    |
      | byStatus.active                   | 57    |
      | byStatus.pending                  | 1     |
      | byStatus.rejected                 | 1     |
      | byStatus.archived                 | 1     |
      | byCategory.trivia                 | 15    |
      | byCategory.lexicon                | 15    |
      | byCategory.riddle                 | 15    |
      | byCategory.explanation            | 15    |
      | byCognitiveDifficulty.easy        | 19    |
      | byCognitiveDifficulty.medium      | 19    |
      | byCognitiveDifficulty.hard        | 22    |
      | byAuthorRole.admin                | 22    |
      | byAuthorRole.ai                   | 18    |
      | byAuthorRole.game                 | 20    |
      | byRejectionType.inappropriate-content | 0  |
      | byRejectionType.incorrect-information | 0  |
      | byRejectionType.poor-quality          | 0  |
      | byRejectionType.duplicate-question    | 1  |
      | byRejectionType.other                 | 0  |

  Scenario: Get question stats with empty database
    When the admin retrieves question statistics
    Then the request should have succeeded with status code 200
    And the response should contain a Question Stats DTO with:
      | field                             | value |
      | total                             | 0     |
      | byStatus.active                   | 0     |
      | byStatus.pending                  | 0     |
      | byStatus.rejected                 | 0     |
      | byStatus.archived                 | 0     |
      | byCategory.trivia                 | 0     |
      | byCategory.lexicon                | 0     |
      | byCategory.riddle                 | 0     |
      | byCategory.explanation            | 0     |
      | byCognitiveDifficulty.easy        | 0     |
      | byCognitiveDifficulty.medium      | 0     |
      | byCognitiveDifficulty.hard        | 0     |
      | byAuthorRole.admin                | 0     |
      | byAuthorRole.ai                   | 0     |
      | byAuthorRole.game                 | 0     |
      | byRejectionType.inappropriate-content | 0  |
      | byRejectionType.incorrect-information | 0  |
      | byRejectionType.poor-quality          | 0  |
      | byRejectionType.duplicate-question    | 0  |
      | byRejectionType.other                 | 0  |

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
