@question @question-theme-assignment @assign-theme-to-question @admin

Feature: Assign Theme To Question As Admin
  In order to enrich existing questions with relevant themes
  As an admin API client
  I want to be able to assign a theme to a question

  Scenario: Assigning a primary history theme to a question as admin
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "c3d4e5f6a7b8012345678903"
    Then the request should have succeeded with status code 201
    And the response should contain the following admin question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                        |
      | c3d4e5f6a7b8012345678903 | easy                | active | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | history | true      | false  |
      | sports  | false     | true   |

    And the response should contain the question theme with slug "history" for the admin question with the following label:
      | locale | label      |
      | en     | History    |
      | fr     | Histoire   |
      | it     | Storia     |
      | es     | Historia   |
      | de     | Geschichte |
      | pt     | História   |

  Scenario: Trying to assign a theme to a non-existing question
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                             |
      | Not Found | 404        | Question with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to assign an archived theme to a question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the request payload is overridden with the following values:
      | path    | type   | value                    |
      | themeId | string | dbb0664ad4797c6cc79d5aee |
    And the admin assigns the theme with the request payload to the question with id "c3d4e5f6a7b8012345678903"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                |
      | Bad Request | 400        | Referenced question theme with id dbb0664ad4797c6cc79d5aee is archived |

  Scenario: Trying to assign a theme without API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "c3d4e5f6a7b8012345678903" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to assign a theme with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "c3d4e5f6a7b8012345678903" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |