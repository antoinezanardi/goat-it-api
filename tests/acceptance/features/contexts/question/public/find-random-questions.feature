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

  Scenario: Excluding questions by IDs
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves random questions with the following query:
      | excluded-ids             | limit |
      | a1b2c3d4e5f6012345678901 | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have status "active"
    And the response should not contain a question with id "a1b2c3d4e5f6012345678901"

  Scenario: Filtering by categories
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves random questions with the following query:
      | categories | limit |
      | riddle     | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have category "riddle"

  Scenario: Filtering by cognitive difficulties
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves random questions with the following query:
      | cognitive-difficulties | limit |
      | easy                   | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have cognitive difficulty "easy"

  Scenario: Filtering by theme IDs
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves random questions with the following query:
      | theme-ids                | limit |
      | 8ef21e4eb04eb0fa5a469d87 | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have theme id "8ef21e4eb04eb0fa5a469d87"

  Scenario: Combining multiple filters
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves random questions with the following query:
      | categories | cognitive-difficulties | limit |
      | riddle     | medium                 | 20    |
    Then the request should have succeeded with status code 200
    And all returned questions should have category "riddle"
    And all returned questions should have cognitive difficulty "medium"

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

  Scenario: Returning validation error for invalid excluded ID
    When the client retrieves random questions with the following query:
      | excluded-ids |
      | not-valid    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message               | path           | format | pattern              | origin |
      | invalid_format | Invalid ObjectId value | excluded-ids.0 | regex  | /^[\da-f]{24}$/iu   | string |

  Scenario: Returning validation error for too many excluded IDs
    When the client retrieves random questions with the following query:
      | excluded-ids                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
      | 60af924f4f1a2563f8e8b000,60af924f4f1a2563f8e8b001,60af924f4f1a2563f8e8b002,60af924f4f1a2563f8e8b003,60af924f4f1a2563f8e8b004,60af924f4f1a2563f8e8b005,60af924f4f1a2563f8e8b006,60af924f4f1a2563f8e8b007,60af924f4f1a2563f8e8b008,60af924f4f1a2563f8e8b009,60af924f4f1a2563f8e8b010,60af924f4f1a2563f8e8b011,60af924f4f1a2563f8e8b012,60af924f4f1a2563f8e8b013,60af924f4f1a2563f8e8b014,60af924f4f1a2563f8e8b015,60af924f4f1a2563f8e8b016,60af924f4f1a2563f8e8b017,60af924f4f1a2563f8e8b018,60af924f4f1a2563f8e8b019,60af924f4f1a2563f8e8b020,60af924f4f1a2563f8e8b021,60af924f4f1a2563f8e8b022,60af924f4f1a2563f8e8b023,60af924f4f1a2563f8e8b024,60af924f4f1a2563f8e8b025,60af924f4f1a2563f8e8b026,60af924f4f1a2563f8e8b027,60af924f4f1a2563f8e8b028,60af924f4f1a2563f8e8b029,60af924f4f1a2563f8e8b030,60af924f4f1a2563f8e8b031,60af924f4f1a2563f8e8b032,60af924f4f1a2563f8e8b033,60af924f4f1a2563f8e8b034,60af924f4f1a2563f8e8b035,60af924f4f1a2563f8e8b036,60af924f4f1a2563f8e8b037,60af924f4f1a2563f8e8b038,60af924f4f1a2563f8e8b039,60af924f4f1a2563f8e8b040,60af924f4f1a2563f8e8b041,60af924f4f1a2563f8e8b042,60af924f4f1a2563f8e8b043,60af924f4f1a2563f8e8b044,60af924f4f1a2563f8e8b045,60af924f4f1a2563f8e8b046,60af924f4f1a2563f8e8b047,60af924f4f1a2563f8e8b048,60af924f4f1a2563f8e8b049,60af924f4f1a2563f8e8b050,60af924f4f1a2563f8e8b051,60af924f4f1a2563f8e8b052,60af924f4f1a2563f8e8b053,60af924f4f1a2563f8e8b054,60af924f4f1a2563f8e8b055,60af924f4f1a2563f8e8b056,60af924f4f1a2563f8e8b057,60af924f4f1a2563f8e8b058,60af924f4f1a2563f8e8b059,60af924f4f1a2563f8e8b060,60af924f4f1a2563f8e8b061,60af924f4f1a2563f8e8b062,60af924f4f1a2563f8e8b063,60af924f4f1a2563f8e8b064,60af924f4f1a2563f8e8b065,60af924f4f1a2563f8e8b066,60af924f4f1a2563f8e8b067,60af924f4f1a2563f8e8b068,60af924f4f1a2563f8e8b069,60af924f4f1a2563f8e8b070,60af924f4f1a2563f8e8b071,60af924f4f1a2563f8e8b072,60af924f4f1a2563f8e8b073,60af924f4f1a2563f8e8b074,60af924f4f1a2563f8e8b075,60af924f4f1a2563f8e8b076,60af924f4f1a2563f8e8b077,60af924f4f1a2563f8e8b078,60af924f4f1a2563f8e8b079,60af924f4f1a2563f8e8b080,60af924f4f1a2563f8e8b081,60af924f4f1a2563f8e8b082,60af924f4f1a2563f8e8b083,60af924f4f1a2563f8e8b084,60af924f4f1a2563f8e8b085,60af924f4f1a2563f8e8b086,60af924f4f1a2563f8e8b087,60af924f4f1a2563f8e8b088,60af924f4f1a2563f8e8b089,60af924f4f1a2563f8e8b090,60af924f4f1a2563f8e8b091,60af924f4f1a2563f8e8b092,60af924f4f1a2563f8e8b093,60af924f4f1a2563f8e8b094,60af924f4f1a2563f8e8b095,60af924f4f1a2563f8e8b096,60af924f4f1a2563f8e8b097,60af924f4f1a2563f8e8b098,60af924f4f1a2563f8e8b099,60af924f4f1a2563f8e8b100,60af924f4f1a2563f8e8b101,60af924f4f1a2563f8e8b102,60af924f4f1a2563f8e8b103,60af924f4f1a2563f8e8b104,60af924f4f1a2563f8e8b105,60af924f4f1a2563f8e8b106,60af924f4f1a2563f8e8b107,60af924f4f1a2563f8e8b108,60af924f4f1a2563f8e8b109,60af924f4f1a2563f8e8b110,60af924f4f1a2563f8e8b111,60af924f4f1a2563f8e8b112,60af924f4f1a2563f8e8b113,60af924f4f1a2563f8e8b114,60af924f4f1a2563f8e8b115,60af924f4f1a2563f8e8b116,60af924f4f1a2563f8e8b117,60af924f4f1a2563f8e8b118,60af924f4f1a2563f8e8b119,60af924f4f1a2563f8e8b120,60af924f4f1a2563f8e8b121,60af924f4f1a2563f8e8b122,60af924f4f1a2563f8e8b123,60af924f4f1a2563f8e8b124,60af924f4f1a2563f8e8b125,60af924f4f1a2563f8e8b126,60af924f4f1a2563f8e8b127,60af924f4f1a2563f8e8b128,60af924f4f1a2563f8e8b129,60af924f4f1a2563f8e8b130,60af924f4f1a2563f8e8b131,60af924f4f1a2563f8e8b132,60af924f4f1a2563f8e8b133,60af924f4f1a2563f8e8b134,60af924f4f1a2563f8e8b135,60af924f4f1a2563f8e8b136,60af924f4f1a2563f8e8b137,60af924f4f1a2563f8e8b138,60af924f4f1a2563f8e8b139,60af924f4f1a2563f8e8b140,60af924f4f1a2563f8e8b141,60af924f4f1a2563f8e8b142,60af924f4f1a2563f8e8b143,60af924f4f1a2563f8e8b144,60af924f4f1a2563f8e8b145,60af924f4f1a2563f8e8b146,60af924f4f1a2563f8e8b147,60af924f4f1a2563f8e8b148,60af924f4f1a2563f8e8b149,60af924f4f1a2563f8e8b150,60af924f4f1a2563f8e8b151,60af924f4f1a2563f8e8b152,60af924f4f1a2563f8e8b153,60af924f4f1a2563f8e8b154,60af924f4f1a2563f8e8b155,60af924f4f1a2563f8e8b156,60af924f4f1a2563f8e8b157,60af924f4f1a2563f8e8b158,60af924f4f1a2563f8e8b159,60af924f4f1a2563f8e8b160,60af924f4f1a2563f8e8b161,60af924f4f1a2563f8e8b162,60af924f4f1a2563f8e8b163,60af924f4f1a2563f8e8b164,60af924f4f1a2563f8e8b165,60af924f4f1a2563f8e8b166,60af924f4f1a2563f8e8b167,60af924f4f1a2563f8e8b168,60af924f4f1a2563f8e8b169,60af924f4f1a2563f8e8b170,60af924f4f1a2563f8e8b171,60af924f4f1a2563f8e8b172,60af924f4f1a2563f8e8b173,60af924f4f1a2563f8e8b174,60af924f4f1a2563f8e8b175,60af924f4f1a2563f8e8b176,60af924f4f1a2563f8e8b177,60af924f4f1a2563f8e8b178,60af924f4f1a2563f8e8b179,60af924f4f1a2563f8e8b180,60af924f4f1a2563f8e8b181,60af924f4f1a2563f8e8b182,60af924f4f1a2563f8e8b183,60af924f4f1a2563f8e8b184,60af924f4f1a2563f8e8b185,60af924f4f1a2563f8e8b186,60af924f4f1a2563f8e8b187,60af924f4f1a2563f8e8b188,60af924f4f1a2563f8e8b189,60af924f4f1a2563f8e8b190,60af924f4f1a2563f8e8b191,60af924f4f1a2563f8e8b192,60af924f4f1a2563f8e8b193,60af924f4f1a2563f8e8b194,60af924f4f1a2563f8e8b195,60af924f4f1a2563f8e8b196,60af924f4f1a2563f8e8b197,60af924f4f1a2563f8e8b198,60af924f4f1a2563f8e8b199,60af924f4f1a2563f8e8b200 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                        | path         | maximum | inclusive | origin |
      | too_big | Too big: expected array to have <=200 items    | excluded-ids | 200     | true      | array  |

  Scenario: Returning validation error for invalid category
    When the client retrieves random questions with the following query:
      | categories |
      | unknown    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                              | path           | values                            |
      | invalid_value | Invalid option: expected one of "trivia"\|"lexicon"\|"riddle"\|"explanation" | categories.0 | trivia,lexicon,riddle,explanation |

  Scenario: Returning validation error for invalid cognitive difficulty
    When the client retrieves random questions with the following query:
      | cognitive-difficulties |
      | extreme                |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                    | path                         | values               |
      | invalid_value | Invalid option: expected one of "easy"\|"medium"\|"hard" | cognitive-difficulties.0 | easy,medium,hard |

  Scenario: Returning validation error for duplicate excluded IDs
    When the client retrieves random questions with the following query:
      | excluded-ids                              |
      | 60af924f4f1a2563f8e8b456,60af924f4f1a2563f8e8b456 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message                       | path         |
      | custom | Excluded IDs must be unique   | excluded-ids |
