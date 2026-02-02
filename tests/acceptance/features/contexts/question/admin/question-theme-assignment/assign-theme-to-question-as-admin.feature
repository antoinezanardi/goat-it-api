@question @question-theme-assignment @assign-theme-to-question @admin

Feature: Assign Theme To Question As Admin
  In order to enrich existing questions with relevant themes
  As an admin API client
  I want to be able to assign a theme to a question

  Scenario: Assigning a primary history theme to a question as admin
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have succeeded with status code 201
    And the response should contain the following admin question:
      | id                       | cognitiveDifficulty | status | sourceUrls                                       |
      | a1b2c3d4e5f6012345678901 | medium              | active | https://en.wikipedia.org/wiki/Psycho_(1960_film) |

    And the response should contain the following themes for the admin question:
      | slug    | isPrimary | isHint |
      | cinema  | true      | false  |
      | history | true      | false  |

    And the response should contain the question theme with slug "history" for the admin question with the following label:
      | locale | label      |
      | en     | History    |
      | fr     | Histoire   |
      | it     | Storia     |
      | es     | Historia   |
      | de     | Geschichte |
      | pt     | História   |

  Scenario: Trying to assign a theme with empty payload
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin assigns the theme with an empty request payload to the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |

    And the failed request's response should contain the following validation details:
      | code         | message                                             | expected | path      |
      | invalid_type | Invalid input: expected string, received undefined  | string   | themeId   |
      | invalid_type | Invalid input: expected boolean, received undefined | boolean  | isPrimary |
      | invalid_type | Invalid input: expected boolean, received undefined | boolean  | isHint    |

  Scenario: Trying to assign a theme to a non-existing question
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                             |
      | Not Found | 404        | Question with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to assign a non-existing theme to a question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the request payload is overridden with the following values:
      | path    | type   | value                    |
      | themeId | string | 60f7c2b8e1d2f70012345678 |
    And the admin assigns the theme with the request payload to the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 60f7c2b8e1d2f70012345678 not found |

  Scenario: Trying to assign an archived theme to a question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the request payload is overridden with the following values:
      | path    | type   | value                    |
      | themeId | string | dbb0664ad4797c6cc79d5aee |
    And the admin assigns the theme with the request payload to the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                |
      | Bad Request | 400        | Referenced question theme with id dbb0664ad4797c6cc79d5aee is archived |

  Scenario: Trying to assign a theme without API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "a1b2c3d4e5f6012345678901" without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to assign a theme which is already assigned to a question
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the request payload is overridden with the following values:
      | path    | type   | value                    |
      | themeId | string | 8ef21e4eb04eb0fa5a469d87 |
    And the admin assigns the theme with the request payload to the question with id "a1b2c3d4e5f6012345678901"
    Then the request should have failed with status code 409 and the response should contain the following error:
      | error    | statusCode | message                                                                                                                |
      | Conflict | 409        | Question theme assignment with id 8ef21e4eb04eb0fa5a469d87 already exists in question with id a1b2c3d4e5f6012345678901 |

  Scenario: Trying to assign a theme with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    And the request payload is set from scope "question-theme-assignment", type "creation" and name "primaryHistory"
    When the admin assigns the theme with the request payload to the question with id "a1b2c3d4e5f6012345678901" with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
