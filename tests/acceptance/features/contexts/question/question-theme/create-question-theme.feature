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
      | code           | message                                           | format | path | origin | pattern                       | inclusive | minimum |
      | too_small      | Too small: expected string to have >=3 characters |        | slug | string |                               | true      | 3       |
      | invalid_format | Invalid kebab-case value                          | regex  | slug | string | /^[\\da-z]+(?:-[\\da-z]+)*$/u |           |         |

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

  Scenario: Trying to create a question theme with an empty french label
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path     | type   | value |
      | label.fr | string |       |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path     | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | label.fr | string | 1       | true      |

  Scenario: Trying to create a question theme with a number as english label
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path     | type    | value |
      | label.en | integer | 123   |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                         | expected | path     |
      | invalid_type | Invalid input: expected string, received number | string   | label.en |

  Scenario: Trying to create a question theme with an unknown locale in label
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path     | type   | value |
      | label.jp | string | 日本語   |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path  | keys |
      | unrecognized_keys | Unrecognized key: "jp" | label | jp   |

  Scenario: Trying to create a question theme with an empty english aliases array
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value |
      | aliases.en | array | []    |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                     | path       | origin | minimum | inclusive |
      | too_small | Too small: expected array to have >=1 items | aliases.en | array  | 1       | true      |

  Scenario: Trying to create a question theme with a string as french aliases
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type   | value   |
      | aliases.fr | string | Culture |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                        | expected | path       |
      | invalid_type | Invalid input: expected array, received string | array    | aliases.fr |

  Scenario: Trying to create a question theme with an unknown locale in aliases
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value          |
      | aliases.jp | array | ["日本語", "クイズ"] |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path    | keys |
      | unrecognized_keys | Unrecognized key: "jp" | aliases | jp   |

  Scenario: Trying to create a question theme with an empty spanish description
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path           | type   | value |
      | description.es | string |       |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path           | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | description.es | string | 1       | true      |

  Scenario: Trying to create a question theme with a boolean as german description
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path           | type    | value |
      | description.de | boolean | true  |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                          | expected | path           |
      | invalid_type | Invalid input: expected string, received boolean | string   | description.de |

  Scenario: Trying to create a question theme with an unknown locale in description
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path           | type   | value                        |
      | description.lt | string | Tema apimties įvairias temas |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path        | keys |
      | unrecognized_keys | Unrecognized key: "lt" | description | lt   |

  Scenario: Trying to create a question theme with an already existing slug
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the client creates a new question theme with the request payload
    And the request payload is set from scope "question-theme", type "creation" and name "complete"
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 409 and the response should contain the following error:
      | error    | statusCode | message                                                   |
      | Conflict | 409        | Question theme with slug general-knowledge already exists |
