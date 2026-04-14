@question @question-theme-assignment @modify-question-theme-assignment @admin

Feature: Modify Question Theme Assignment As Admin
  In order to manage question theme assignments
  As an admin API client
  I want to be able to modify a theme assignment on a question

  Scenario: Promoting a theme to primary on a question as admin
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "modification" and name "promoteToPrimary"
    When the admin modifies the theme assignment with id "9adeceb41db80ab7ec49b457" with the request payload on the question with id "d4e5f6a7b8c9012345678904"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                      |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | science | true      | true   |
      | history | false     | false  |

    And the response should contain the question theme with slug "science" for the admin question with the following label:
      | locale | label          |
      | en     | Science        |
      | fr     | Science        |
      | it     | Scienza        |
      | es     | Ciencia        |
      | de     | Wissenschaft   |
      | pt     | Ciência        |

  Scenario: Modifying a theme assignment with empty payload on a question as admin
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin modifies the theme assignment with id "9adeceb41db80ab7ec49b457" with an empty request payload on the question with id "d4e5f6a7b8c9012345678904"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question:
      | id                       | category    | cognitiveDifficulty | status   | sourceUrls                                      |
      | d4e5f6a7b8c9012345678904 | explanation | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | science | false     | true   |
      | history | true      | false  |

  Scenario: Trying to set isPrimary to false on a theme assignment
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "modification" and name "promoteToPrimary"
    When the request payload is overridden with the following values:
      | path      | type    | value |
      | isPrimary | boolean | false |
    And the admin modifies the theme assignment with id "9adeceb41db80ab7ec49b457" with the request payload on the question with id "d4e5f6a7b8c9012345678904"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |

    And the failed request's response should contain the following validation details:
      | code          | message                      | path      | values |
      | invalid_value | Invalid input: expected true | isPrimary | true   |

  Scenario: Trying to modify a theme assignment that is not assigned to the question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "modification" and name "promoteToPrimary"
    When the admin modifies the theme assignment with id "8ef21e4eb04eb0fa5a469d87" with the request payload on the question with id "d4e5f6a7b8c9012345678904"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                                                                      | errorCode                        |
      | Not Found | 404        | Question theme with id 8ef21e4eb04eb0fa5a469d87 is not assigned to question with id d4e5f6a7b8c9012345678904 | question-theme-assignment-absent |

  Scenario: Trying to modify a theme assignment without API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "modification" and name "promoteToPrimary"
    When the admin modifies the theme assignment with id "9adeceb41db80ab7ec49b457" with the request payload on the question with id "d4e5f6a7b8c9012345678904" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to modify a theme assignment with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "modification" and name "promoteToPrimary"
    When the admin modifies the theme assignment with id "9adeceb41db80ab7ec49b457" with the request payload on the question with id "d4e5f6a7b8c9012345678904" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
