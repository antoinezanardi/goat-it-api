@question @find-random-questions @public

Feature: Find Random Questions
  In order to provide varied game sessions
  As a game client
  I want to retrieve a random set of active questions

  Scenario: Returning random questions with default limit
    Given the database is populated with questions fixture set with name "five-active-questions"
    When the client retrieves random questions
    Then the request should have succeeded with status code 200
    And the response should contain up to 20 questions
    And all returned questions should have status "active"

  Scenario: Returning random questions with custom limit
    Given the database is populated with questions fixture set with name "five-active-questions"
    When the client retrieves random questions with the following query:
      | limit |
      | 3     |
    Then the request should have succeeded with status code 200
    And the response should contain 3 questions
    And all returned questions should have status "active"

  Scenario: Returning all active questions when limit exceeds available count
    Given the database is populated with questions fixture set with name "five-active-questions"
    When the client retrieves random questions with the following query:
      | limit |
      | 10    |
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions

  Scenario: Filtering out non-active questions
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves random questions with the following query:
      | limit |
      | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have status "active"

  Scenario: Returning validation error for limit below minimum
    When the client retrieves random questions with the following query:
      | limit |
      | 0     |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                               | path  | minimum | inclusive | origin |
      | too_small | Too small: expected number to be >=1  | limit | 1       | true      | number |

  Scenario: Returning validation error for negative limit
    When the client retrieves random questions with the following query:
      | limit |
      | -1    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                               | path  | minimum | inclusive | origin |
      | too_small | Too small: expected number to be >=1  | limit | 1       | true      | number |

  Scenario: Returning validation error for limit exceeding maximum
    When the client retrieves random questions with the following query:
      | limit |
      | 51    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code     | message                              | path  | maximum | inclusive | origin |
      | too_big  | Too big: expected number to be <=50  | limit | 50      | true      | number |
