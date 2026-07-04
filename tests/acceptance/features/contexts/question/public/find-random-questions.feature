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

  Scenario: Returning validation error for too many excluded IDs
    When the client retrieves random questions with the following query:
      | excluded-ids                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
      | 60af924f4f1a2563f8e8b00,60af924f4f1a2563f8e8b01,60af924f4f1a2563f8e8b02,60af924f4f1a2563f8e8b03,60af924f4f1a2563f8e8b04,60af924f4f1a2563f8e8b05,60af924f4f1a2563f8e8b06,60af924f4f1a2563f8e8b07,60af924f4f1a2563f8e8b08,60af924f4f1a2563f8e8b09,60af924f4f1a2563f8e8b0a,60af924f4f1a2563f8e8b0b,60af924f4f1a2563f8e8b0c,60af924f4f1a2563f8e8b0d,60af924f4f1a2563f8e8b0e,60af924f4f1a2563f8e8b0f,60af924f4f1a2563f8e8b10,60af924f4f1a2563f8e8b11,60af924f4f1a2563f8e8b12,60af924f4f1a2563f8e8b13,60af924f4f1a2563f8e8b14,60af924f4f1a2563f8e8b15,60af924f4f1a2563f8e8b16,60af924f4f1a2563f8e8b17,60af924f4f1a2563f8e8b18,60af924f4f1a2563f8e8b19,60af924f4f1a2563f8e8b1a,60af924f4f1a2563f8e8b1b,60af924f4f1a2563f8e8b1c,60af924f4f1a2563f8e8b1d,60af924f4f1a2563f8e8b1e,60af924f4f1a2563f8e8b1f,60af924f4f1a2563f8e8b20,60af924f4f1a2563f8e8b21,60af924f4f1a2563f8e8b22,60af924f4f1a2563f8e8b23,60af924f4f1a2563f8e8b24,60af924f4f1a2563f8e8b25,60af924f4f1a2563f8e8b26,60af924f4f1a2563f8e8b27,60af924f4f1a2563f8e8b28,60af924f4f1a2563f8e8b29,60af924f4f1a2563f8e8b2a,60af924f4f1a2563f8e8b2b,60af924f4f1a2563f8e8b2c,60af924f4f1a2563f8e8b2d,60af924f4f1a2563f8e8b2e,60af924f4f1a2563f8e8b2f,60af924f4f1a2563f8e8b30,60af924f4f1a2563f8e8b31,60af924f4f1a2563f8e8b32,60af924f4f1a2563f8e8b33,60af924f4f1a2563f8e8b34,60af924f4f1a2563f8e8b35,60af924f4f1a2563f8e8b36,60af924f4f1a2563f8e8b37,60af924f4f1a2563f8e8b38,60af924f4f1a2563f8e8b39,60af924f4f1a2563f8e8b3a,60af924f4f1a2563f8e8b3b,60af924f4f1a2563f8e8b3c,60af924f4f1a2563f8e8b3d,60af924f4f1a2563f8e8b3e,60af924f4f1a2563f8e8b3f,60af924f4f1a2563f8e8b40,60af924f4f1a2563f8e8b41,60af924f4f1a2563f8e8b42,60af924f4f1a2563f8e8b43,60af924f4f1a2563f8e8b44,60af924f4f1a2563f8e8b45,60af924f4f1a2563f8e8b46,60af924f4f1a2563f8e8b47,60af924f4f1a2563f8e8b48,60af924f4f1a2563f8e8b49,60af924f4f1a2563f8e8b4a,60af924f4f1a2563f8e8b4b,60af924f4f1a2563f8e8b4c,60af924f4f1a2563f8e8b4d,60af924f4f1a2563f8e8b4e,60af924f4f1a2563f8e8b4f,60af924f4f1a2563f8e8b50,60af924f4f1a2563f8e8b51,60af924f4f1a2563f8e8b52,60af924f4f1a2563f8e8b53,60af924f4f1a2563f8e8b54,60af924f4f1a2563f8e8b55,60af924f4f1a2563f8e8b56,60af924f4f1a2563f8e8b57,60af924f4f1a2563f8e8b58,60af924f4f1a2563f8e8b59,60af924f4f1a2563f8e8b5a,60af924f4f1a2563f8e8b5b,60af924f4f1a2563f8e8b5c,60af924f4f1a2563f8e8b5d,60af924f4f1a2563f8e8b5e,60af924f4f1a2563f8e8b5f,60af924f4f1a2563f8e8b60,60af924f4f1a2563f8e8b61,60af924f4f1a2563f8e8b62,60af924f4f1a2563f8e8b63,60af924f4f1a2563f8e8b64,60af924f4f1a2563f8e8b65,60af924f4f1a2563f8e8b66,60af924f4f1a2563f8e8b67,60af924f4f1a2563f8e8b68,60af924f4f1a2563f8e8b69,60af924f4f1a2563f8e8b6a,60af924f4f1a2563f8e8b6b,60af924f4f1a2563f8e8b6c,60af924f4f1a2563f8e8b6d,60af924f4f1a2563f8e8b6e,60af924f4f1a2563f8e8b6f,60af924f4f1a2563f8e8b70,60af924f4f1a2563f8e8b71,60af924f4f1a2563f8e8b72,60af924f4f1a2563f8e8b73,60af924f4f1a2563f8e8b74,60af924f4f1a2563f8e8b75,60af924f4f1a2563f8e8b76,60af924f4f1a2563f8e8b77,60af924f4f1a2563f8e8b78,60af924f4f1a2563f8e8b79,60af924f4f1a2563f8e8b7a,60af924f4f1a2563f8e8b7b,60af924f4f1a2563f8e8b7c,60af924f4f1a2563f8e8b7d,60af924f4f1a2563f8e8b7e,60af924f4f1a2563f8e8b7f,60af924f4f1a2563f8e8b80,60af924f4f1a2563f8e8b81,60af924f4f1a2563f8e8b82,60af924f4f1a2563f8e8b83,60af924f4f1a2563f8e8b84,60af924f4f1a2563f8e8b85,60af924f4f1a2563f8e8b86,60af924f4f1a2563f8e8b87,60af924f4f1a2563f8e8b88,60af924f4f1a2563f8e8b89,60af924f4f1a2563f8e8b8a,60af924f4f1a2563f8e8b8b,60af924f4f1a2563f8e8b8c,60af924f4f1a2563f8e8b8d,60af924f4f1a2563f8e8b8e,60af924f4f1a2563f8e8b8f,60af924f4f1a2563f8e8b90,60af924f4f1a2563f8e8b91,60af924f4f1a2563f8e8b92,60af924f4f1a2563f8e8b93,60af924f4f1a2563f8e8b94,60af924f4f1a2563f8e8b95,60af924f4f1a2563f8e8b96,60af924f4f1a2563f8e8b97,60af924f4f1a2563f8e8b98,60af924f4f1a2563f8e8b99,60af924f4f1a2563f8e8b9a,60af924f4f1a2563f8e8b9b,60af924f4f1a2563f8e8b9c,60af924f4f1a2563f8e8b9d,60af924f4f1a2563f8e8b9e,60af924f4f1a2563f8e8b9f,60af924f4f1a2563f8e8ba0,60af924f4f1a2563f8e8ba1,60af924f4f1a2563f8e8ba2,60af924f4f1a2563f8e8ba3,60af924f4f1a2563f8e8ba4,60af924f4f1a2563f8e8ba5,60af924f4f1a2563f8e8ba6,60af924f4f1a2563f8e8ba7,60af924f4f1a2563f8e8ba8,60af924f4f1a2563f8e8ba9,60af924f4f1a2563f8e8baa,60af924f4f1a2563f8e8bab,60af924f4f1a2563f8e8bac,60af924f4f1a2563f8e8bad,60af924f4f1a2563f8e8bae,60af924f4f1a2563f8e8baf,60af924f4f1a2563f8e8bb0,60af924f4f1a2563f8e8bb1,60af924f4f1a2563f8e8bb2,60af924f4f1a2563f8e8bb3,60af924f4f1a2563f8e8bb4,60af924f4f1a2563f8e8bb5,60af924f4f1a2563f8e8bb6,60af924f4f1a2563f8e8bb7,60af924f4f1a2563f8e8bb8,60af924f4f1a2563f8e8bb9,60af924f4f1a2563f8e8bba,60af924f4f1a2563f8e8bbb,60af924f4f1a2563f8e8bbc,60af924f4f1a2563f8e8bbd,60af924f4f1a2563f8e8bbe,60af924f4f1a2563f8e8bbf,60af924f4f1a2563f8e8bc0,60af924f4f1a2563f8e8bc1,60af924f4f1a2563f8e8bc2,60af924f4f1a2563f8e8bc3,60af924f4f1a2563f8e8bc4,60af924f4f1a2563f8e8bc5,60af924f4f1a2563f8e8bc6,60af924f4f1a2563f8e8bc7,60af924f4f1a2563f8e8bc8 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |

  Scenario: Returning validation error for invalid category
    When the client retrieves random questions with the following query:
      | categories |
      | unknown    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |

  Scenario: Returning validation error for invalid cognitive difficulty
    When the client retrieves random questions with the following query:
      | cognitive-difficulties |
      | extreme                |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |

  Scenario: Returning validation error for duplicate excluded IDs
    When the client retrieves random questions with the following query:
      | excluded-ids                              |
      | 60af924f4f1a2563f8e8b456,60af924f4f1a2563f8e8b456 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
