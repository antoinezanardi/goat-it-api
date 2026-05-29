@question @sort-questions @public

Feature: Sort Questions
  In order to display questions in a specific order
  As an API client
  I want to be able to sort questions by various fields

  Scenario: Sorting questions by createdAt in ascending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions sorted by "createdAt" in "asc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |

  Scenario: Sorting questions by createdAt in descending order (default behavior)
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions sorted by "createdAt" in "desc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Sorting questions by category in ascending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions sorted by "category" in "asc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Sorting questions by cognitiveDifficulty in ascending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions sorted by "cognitiveDifficulty" in "asc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |

  Scenario: Sorting questions by cognitiveDifficulty in descending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions sorted by "cognitiveDifficulty" in "desc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |

  Scenario: Trying to sort questions with an invalid sort-by field
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions sorted by "invalidField" in "asc" order
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                                          | path    | values                                              |
      | invalid_value | Invalid option: expected one of "createdAt"\|"updatedAt"\|"category"\|"cognitiveDifficulty" | sort-by | createdAt, updatedAt, category, cognitiveDifficulty |
