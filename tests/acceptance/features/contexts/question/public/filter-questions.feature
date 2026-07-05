@question @filter-questions @public

Feature: Filter Questions
  In order to find specific questions
  As an API client
  I want to be able to filter questions by various criteria

  Scenario: Filtering questions by category "trivia"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | category |
      | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 15 questions
    And all returned questions should have category "trivia"

  Scenario: Filtering questions by cognitive difficulty "hard"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | cognitive-difficulty |
      | hard                 |
    Then the request should have succeeded with status code 200
    And the response should contain 22 questions
    And all returned questions should have cognitive difficulty "hard"

  Scenario: Filtering questions by author role "game"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | author-role |
      | game        |
    Then the request should have succeeded with status code 200
    And the response should contain 20 questions
    And all returned questions should have author role "game"

  Scenario: Filtering questions by a single theme ID
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | theme-ids                |
      | 600000000000000000000001 |
    Then the request should have succeeded with status code 200
    And the response should contain 4 questions
    And all returned questions should have theme id "600000000000000000000001"

  Scenario: Filtering questions by multiple criteria
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | category | cognitive-difficulty |
      | trivia   | easy                 |
    Then the request should have succeeded with status code 200
    And the response should contain 7 questions
    And all returned questions should have category "trivia"
    And all returned questions should have cognitive difficulty "easy"

  Scenario: Filtering questions returns empty list when no match
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | category | author-role | cognitive-difficulty |
      | lexicon  | admin       | hard                 |
    Then the request should have succeeded with status code 200
    And the response should contain 0 questions

  Scenario: Filtering questions with invalid category value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | category |
      | invalid  |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                              | path     | values                                 |
      | invalid_value | Invalid option: expected one of "trivia"\|"lexicon"\|"riddle"\|"explanation" | category | trivia, lexicon, riddle, explanation |

  Scenario: Filtering questions with invalid cognitive difficulty value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | cognitive-difficulty |
      | invalid              |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                               | path                 | values             |
      | invalid_value | Invalid option: expected one of "easy"\|"medium"\|"hard" | cognitive-difficulty | easy, medium, hard |

  Scenario: Filtering questions with invalid author role value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | author-role |
      | invalid     |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                           | path        | values          |
      | invalid_value | Invalid option: expected one of "admin"\|"game"\|"ai" | author-role | admin, game, ai |

  Scenario: Filtering questions with invalid theme ID value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | theme-ids |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                | path        | origin | format | pattern          |
      | invalid_format | Invalid ObjectId value | theme-ids.0 | string | regex  | /^[\\da-f]{24}$/iu |
