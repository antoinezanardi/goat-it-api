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

  Scenario: Filtering public questions by a single ID
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids                      |
      | 700000000000000000000001 |
    Then the request should have succeeded with status code 200
    And the response should contain 1 question
    And the response should contain a question among them with id "700000000000000000000001"

  Scenario: Filtering public questions by multiple IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids                                              |
      | 700000000000000000000001,70000000000000000000000f |
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions
    And the response should contain a question among them with id "700000000000000000000001"
    And the response should contain a question among them with id "70000000000000000000000f"

  Scenario: Filtering public questions by IDs combined with category
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids                      | category |
      | 700000000000000000000001 | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 1 question
    And the response should contain a question among them with id "700000000000000000000001"

  Scenario: Filtering public questions by unknown ID returns empty list
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids                      |
      | 700000000000000000000abc |
    Then the request should have succeeded with status code 200
    And the response should contain 0 questions

  Scenario: Filtering public questions with invalid ID ObjectId
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids      |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                | path  | origin | format | pattern          |
      | invalid_format | Invalid ObjectId value | ids.0 | string | regex  | /^[\\da-f]{24}$/iu |

  Scenario: Filtering public questions with too many IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids |
      | 700000000000000000000001,700000000000000000000002,700000000000000000000003,700000000000000000000004,700000000000000000000005,700000000000000000000006,700000000000000000000007,700000000000000000000008,700000000000000000000009,70000000000000000000000a,70000000000000000000000b,70000000000000000000000c,70000000000000000000000d,70000000000000000000000e,70000000000000000000000f,700000000000000000000010,700000000000000000000011,700000000000000000000012,700000000000000000000013,700000000000000000000014,700000000000000000000015,700000000000000000000016,700000000000000000000017,700000000000000000000018,700000000000000000000019,70000000000000000000001a,70000000000000000000001b,70000000000000000000001c,70000000000000000000001d,70000000000000000000001e,70000000000000000000001f,700000000000000000000020,700000000000000000000021,700000000000000000000022,700000000000000000000023,700000000000000000000024,700000000000000000000025,700000000000000000000026,700000000000000000000027,700000000000000000000028,700000000000000000000029,70000000000000000000002a,70000000000000000000002b,70000000000000000000002c,70000000000000000000002d,70000000000000000000002e,70000000000000000000002f,700000000000000000000030,700000000000000000000031,700000000000000000000032,700000000000000000000033,700000000000000000000034,700000000000000000000035,700000000000000000000036,700000000000000000000037,700000000000000000000038,700000000000000000000039,70000000000000000000003a,70000000000000000000003b,70000000000000000000003c,70000000000000000000003d,70000000000000000000003e,70000000000000000000003f,700000000000000000000040,700000000000000000000041,700000000000000000000042,700000000000000000000043,700000000000000000000044,700000000000000000000045,700000000000000000000046,700000000000000000000047,700000000000000000000048,700000000000000000000049,70000000000000000000004a,70000000000000000000004b,70000000000000000000004c,70000000000000000000004d,70000000000000000000004e,70000000000000000000004f,700000000000000000000050,700000000000000000000051,700000000000000000000052,700000000000000000000053,700000000000000000000054,700000000000000000000055,700000000000000000000056,700000000000000000000057,700000000000000000000058,700000000000000000000059,70000000000000000000005a,70000000000000000000005b,70000000000000000000005c,70000000000000000000005d,70000000000000000000005e,70000000000000000000005f,700000000000000000000060,700000000000000000000061,700000000000000000000062,700000000000000000000063,700000000000000000000064,700000000000000000000065 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                     | path | origin | maximum | inclusive |
      | too_big | Too big: expected array to have <=100 items | ids  | array  | 100     | true      |

  Scenario: Filtering public questions with duplicate IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the client retrieves all questions with the following query:
      | ids                                              |
      | 700000000000000000000001,700000000000000000000001 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message            | path |
      | custom | IDs must be unique | ids  |
