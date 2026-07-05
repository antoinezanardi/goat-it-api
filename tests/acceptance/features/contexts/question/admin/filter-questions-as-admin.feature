@question @filter-questions @admin

Feature: Filter Questions as Admin
  In order to find specific questions in the back office
  As an admin API client
  I want to be able to filter questions by various criteria

  Scenario: Filtering admin questions by status "active"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status |
      | active |
    Then the request should have succeeded with status code 200
    And the response should contain 50 admin questions
    And all returned admin questions should have status "active"

  Scenario: Filtering admin questions by category "trivia"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | category |
      | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 15 admin questions
    And all returned admin questions should have category "trivia"

  Scenario: Filtering admin questions by cognitive difficulty "easy"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | cognitive-difficulty |
      | easy                 |
    Then the request should have succeeded with status code 200
    And the response should contain 19 admin questions
    And all returned admin questions should have cognitive difficulty "easy"

  Scenario: Filtering admin questions by author role "ai"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | author-role |
      | ai          |
    Then the request should have succeeded with status code 200
    And the response should contain 18 admin questions

  Scenario: Filtering admin questions by theme IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | theme-ids                                            |
      | 600000000000000000000001,600000000000000000000002 |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions

  Scenario: Filtering admin questions by multiple criteria
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status | category |
      | active | riddle   |
    Then the request should have succeeded with status code 200
    And the response should contain 14 admin questions
    And all returned admin questions should have status "active"
    And all returned admin questions should have category "riddle"

  Scenario: Filtering admin questions returns empty list when no match
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status   | category |
      | archived | lexicon  |
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin questions

  Scenario: Filtering admin questions with invalid status value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status  |
      | invalid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                                     | path   | values                              |
      | invalid_value | Invalid option: expected one of "pending"\|"active"\|"archived"\|"rejected" | status | pending, active, archived, rejected |

  Scenario: Filtering admin questions with invalid category value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | category |
      | invalid  |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                              | path     | values                                 |
      | invalid_value | Invalid option: expected one of "trivia"\|"lexicon"\|"riddle"\|"explanation" | category | trivia, lexicon, riddle, explanation |

  Scenario: Filtering admin questions with invalid cognitive difficulty value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | cognitive-difficulty |
      | invalid              |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                               | path                 | values             |
      | invalid_value | Invalid option: expected one of "easy"\|"medium"\|"hard" | cognitive-difficulty | easy, medium, hard |

  Scenario: Filtering admin questions with invalid author role value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | author-role |
      | invalid     |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                           | path        | values          |
      | invalid_value | Invalid option: expected one of "admin"\|"game"\|"ai" | author-role | admin, game, ai |

  Scenario: Filtering admin questions with invalid theme ID value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | theme-ids |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                | path        | origin | format | pattern          |
      | invalid_format | Invalid ObjectId value | theme-ids.0 | string | regex  | /^[\\da-f]{24}$/iu |
