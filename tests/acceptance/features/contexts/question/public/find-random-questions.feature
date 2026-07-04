@question @find-random-questions @public

Feature: Find Random Questions
  In order to provide varied game sessions
  As a game client
  I want to retrieve a random set of active questions

  Scenario: Should return random questions with default limit
    Given the database is populated with questions fixture set with name "five-active-questions"
    When the game client retrieves random questions
    Then the request should have succeeded with status code 200
    And the response should contain up to 20 questions
    And all returned questions should have status "active"

  Scenario: Should return random questions with custom limit
    Given the database is populated with questions fixture set with name "five-active-questions"
    When the game client retrieves random questions with the following query:
      | limit |
      | 3     |
    Then the request should have succeeded with status code 200
    And the response should contain 3 questions
    And all returned questions should have status "active"

  Scenario: Should return all active questions when limit exceeds available count
    Given the database is populated with questions fixture set with name "five-active-questions"
    When the game client retrieves random questions with the following query:
      | limit |
      | 10    |
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions

  Scenario: Should not return non-active questions
    Given the database is populated with questions fixture set with name "five-questions"
    When the game client retrieves random questions with the following query:
      | limit |
      | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have status "active"

  Scenario: Should return validation error for invalid limit
    When the game client retrieves random questions with the following query:
      | limit |
      | 0     |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                               | path  | minimum | inclusive | origin |
      | too_small | Too small: expected number to be >=1  | limit | 1       | true      | number |

  Scenario: Should return validation error for negative limit
    When the game client retrieves random questions with the following query:
      | limit |
      | -1    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                               | path  | minimum | inclusive | origin |
      | too_small | Too small: expected number to be >=1  | limit | 1       | true      | number |
