@question @sort-questions @admin

Feature: Sort Questions as Admin
  In order to display questions in a specific order in the back office
  As an admin API client
  I want to be able to sort questions by various fields

  Scenario: Sorting admin questions by createdAt in ascending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | sort-by   | sort-order |
      | createdAt | asc        |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions
    And the response should contain the following admin questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |

  Scenario: Sorting admin questions by category in descending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | sort-by  | sort-order |
      | category | desc       |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions
    And the response should contain the following admin questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |

  Scenario: Sorting admin questions by status in ascending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | sort-by | sort-order |
      | status  | asc        |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions
    And the response should contain the following admin questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

  Scenario: Sorting admin questions by status in descending order
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | sort-by | sort-order |
      | status  | desc       |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions
    And the response should contain the following admin questions:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | efd39a4ac3bdfd03d2f8cdf1 | trivia      | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | c3d4e5f6a7b8012345678903 | lexicon     | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | a1b2c3d4e5f6012345678901 | riddle      | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | trivia      | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |

  Scenario: Trying to sort admin questions with an invalid sort-by field
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with the following query:
      | sort-by      |
      | invalidField |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                                                      | path    | values                                                        |
      | invalid_value | Invalid option: expected one of "createdAt"\|"updatedAt"\|"category"\|"cognitiveDifficulty"\|"status" | sort-by | createdAt, updatedAt, category, cognitiveDifficulty, status |
