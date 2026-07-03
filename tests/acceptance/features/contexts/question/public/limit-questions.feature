@question @limit-questions @public

Feature: Limit Questions
  In order to control how many questions are returned
  As an API client
  I want to be able to limit the number of questions in the response

  Scenario: Limiting questions to 2 results
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | limit |
      | 2     |
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions

  Scenario: Returning all questions when limit is 0 (unlimited)
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | limit |
      | 0     |
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions

  Scenario: Trying to limit questions with an invalid limit value
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | limit |
      | -1    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code       | message                                | path  | minimum | inclusive | origin |
      | too_small  | Too small: expected number to be >=0   | limit | 0       | true      | number |

  Scenario: Trying to limit questions with an invalid value type
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | limit |
      | abc   |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                        | path  | expected | received |
      | invalid_type  | Invalid input: expected number, received NaN   | limit | number   | NaN      |
