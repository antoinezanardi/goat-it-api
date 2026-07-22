@question-theme @get-question-theme-stats @admin

Feature: Get Question Theme Stats as Admin
  In order to provide dashboard analytics
  As an admin API client
  I want to retrieve aggregated question theme statistics

  Scenario: Get question theme stats with mixed data
    # sixty-questions auto-loads sixty-question-themes (60 themes). We use this
    # fixture alone to avoid slug collisions with five-question-themes.
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves question theme statistics
    Then the request should have succeeded with status code 200
    And the response should contain question themes stats with:
      | field | value |
      | total | 60    |
    And the response should contain question themes status stats with:
      | field    | value |
      | active   | 57    |
      | archived | 3     |
    And the response should contain question themes question count stats with:
      | themeSlug | activeQuestionCount |
      | animals   | 2                   |
      | art       | 3                   |
      | cinema    | 4                   |
      | history   | 2                   |
      | music     | 3                   |
      | science   | 1                   |
      | sports    | 1                   |

  Scenario: Get question theme stats with empty database
    When the admin retrieves question theme statistics
    Then the request should have succeeded with status code 200
    And the response should contain question themes stats with:
      | field | value |
      | total | 0     |
    And the response should contain question themes status stats with:
      | field    | value |
      | active   | 0     |
      | archived | 0     |
    And the response should contain question themes question count stats with an empty list

  Scenario: Trying to get question theme stats without API key
    When the admin retrieves question theme statistics without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to get question theme stats with invalid API key
    When the admin retrieves question theme statistics with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
