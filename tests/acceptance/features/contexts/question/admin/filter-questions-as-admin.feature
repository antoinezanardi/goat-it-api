@question @filter-questions @admin

Feature: Filter Questions as Admin
  In order to find specific questions in the back office
  As an admin API client
  I want to be able to filter questions by various criteria

  Scenario: Filtering admin questions by status "active"
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | status |
      | active |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin questions
    And the response should contain the following admin questions:
      | id                       | category | cognitiveDifficulty | status | sourceUrls                                         |
      | a1b2c3d4e5f6012345678901 | riddle   | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film)   |
      | c3d4e5f6a7b8012345678903 | lexicon  | easy                | active | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup  |

  Scenario: Filtering admin questions by category "trivia"
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | category |
      | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin questions
    And the response should contain the following admin questions:
      | id                       | category | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | b2c3d4e5f6a7012345678902 | trivia   | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia   | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering admin questions by cognitive difficulty "easy"
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | cognitive-difficulty |
      | easy                 |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin questions
    And the response should contain the following admin questions:
      | id                       | category | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | c3d4e5f6a7b8012345678903 | lexicon  | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia   | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering admin questions by author role "ai"
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | author-role |
      | ai          |
    Then the request should have succeeded with status code 200
    And the response should contain 3 admin questions
    And the response should contain the following admin questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering admin questions by theme IDs
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | theme-ids                                            |
      | 9adeceb41db80ab7ec49b457,cddb37b90e4f6b7ec27bc1ee |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin questions
    And the response should contain the following admin questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Filtering admin questions by multiple criteria
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | status | category |
      | active | riddle   |
    Then the request should have succeeded with status code 200
    And the response should contain 1 admin questions
    And the response should contain the following admin questions:
      | id                       | category | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | riddle   | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

  Scenario: Filtering admin questions returns empty list when no match
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | status | category    |
      | active | explanation |
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin questions

  Scenario: Filtering admin questions with invalid status value
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
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
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | theme-ids |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
