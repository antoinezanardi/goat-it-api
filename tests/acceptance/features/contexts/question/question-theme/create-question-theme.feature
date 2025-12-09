@question @question-theme @create-question-theme

Feature: Create Question Theme
  In order to create question themes to categorize questions
  As an API client
  I want to be able to create a question theme by providing its data

  Scenario: Creating a question theme in default locale
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the client creates a new question theme with the request payload
    Then the request should have succeeded with status code 201
    And the response should contain the following question theme:
      | slug              | label             | aliases            | description                                                        | status |
      | general-knowledge | General Knowledge | Knowledge, General | A theme that encompasses a wide range of general knowledge topics. | active |

  Scenario: Creating a question theme in wildcard locale
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the client creates a new question theme with the request payload in locale "*"
    Then the request should have succeeded with status code 201
    And the response should contain the following question theme:
      | slug              | label             | aliases            | description                                                        | status |
      | general-knowledge | General Knowledge | Knowledge, General | A theme that encompasses a wide range of general knowledge topics. | active |

  Scenario: Creating a question theme in French locale
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the client creates a new question theme with the request payload in locale "fr"
    Then the request should have succeeded with status code 201
    And the response should contain the following question theme:
      | slug              | label            | aliases                | description                                                         | status |
      | general-knowledge | Culture générale | Connaissances, Général | Un thème qui englobe une large gamme de sujets de culture générale. | active |

  Scenario: Trying to create a question theme with missing required fields
    When the client creates a new question theme with an empty payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                            | expected | path        |
      | invalid_type | Invalid input: expected string, received undefined | string   | slug        |
      | invalid_type | Invalid input: expected object, received undefined | object   | label       |
      | invalid_type | Invalid input: expected object, received undefined | object   | aliases     |
      | invalid_type | Invalid input: expected object, received undefined | object   | description |

  Scenario: Trying to create a question theme with an empty slug
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path | type   | value |
      | slug | string |       |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                  | format | path | origin | pattern                       |
      | invalid_format | Invalid kebab-case value | regex  | slug | string | /^[\\da-z]+(?:-[\\da-z]+)*$/u |

  Scenario: Trying to create a question theme with an invalid kebab-case slug
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | InvalidSlug |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                  | format | path | origin | pattern                       |
      | invalid_format | Invalid kebab-case value | regex  | slug | string | /^[\\da-z]+(?:-[\\da-z]+)*$/u |

  Scenario: Trying to create a question theme with an already existing slug
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the client creates a new question theme with the request payload
    And the request payload is set from scope "question-theme", type "creation" and name "complete"
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 409 and the response should contain the following error:
      | error    | statusCode | message                                                   |
      | Conflict | 409        | Question theme with slug general-knowledge already exists |
