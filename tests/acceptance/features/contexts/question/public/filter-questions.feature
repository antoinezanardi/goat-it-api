@question @filter-questions @public

Feature: Filter Questions
  In order to find specific questions
  As an API client
  I want to be able to filter questions by various criteria

  Scenario: Filtering questions by category "trivia"
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | category |
      | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions
    And the response should contain the following questions:
      | id                       | category | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | b2c3d4e5f6a7012345678902 | trivia   | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia   | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering questions by cognitive difficulty "hard"
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | cognitive-difficulty |
      | hard                 |
    Then the request should have succeeded with status code 200
    And the response should contain 1 questions
    And the response should contain the following questions:
      | id                       | category | cognitiveDifficulty | status  | sourceUrls                                          |
      | b2c3d4e5f6a7012345678902 | trivia   | hard                | pending | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon |

  Scenario: Filtering questions by author role "game"
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | author-role |
      | game        |
    Then the request should have succeeded with status code 200
    And the response should contain 1 questions
    And the response should contain the following questions:
      | id                       | category | cognitiveDifficulty | status | sourceUrls                                        |
      | c3d4e5f6a7b8012345678903 | lexicon  | easy                | active | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup |

  Scenario: Filtering questions by a single theme ID
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | theme-ids                |
      | 9adeceb41db80ab7ec49b457 |
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions
    And the response should contain the following questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering questions by multiple criteria
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | category | cognitive-difficulty |
      | trivia   | easy                 |
    Then the request should have succeeded with status code 200
    And the response should contain 1 questions
    And the response should contain the following questions:
      | id                       | category | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia   | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering questions returns empty list when no match
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | category    | author-role |
      | explanation | game        |
    Then the request should have succeeded with status code 200
    And the response should contain 0 questions

  Scenario: Filtering questions with invalid category value
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | theme-ids |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                | path        | origin | format | pattern          |
      | invalid_format | Invalid ObjectId value | theme-ids.0 | string | regex  | /^[\\da-f]{24}$/iu |
