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

  Scenario: Creating a question theme in Spanish Locale with trimmed values
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path           | type   | value                                            |
      | slug           | string | "    general-knowledge     "                     |
      | label.es       | string | "   Cultura general "                            |
      | aliases.es     | array  | ["   Conocimientos ", "  General  "]             |
      | description.es | string | "   Un tema que abarca una amplia gama de temas" |
    When the client creates a new question theme with the request payload in locale "es"
    Then the request should have succeeded with status code 201
    And the response should contain the following question theme:
      | slug              | label           | aliases                | description                                 | status |
      | general-knowledge | Cultura general | Conocimientos, General | Un tema que abarca una amplia gama de temas | active |

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

  Scenario: Trying to create a question theme with a too short slug
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path | type   | value |
      | slug | string | ab    |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=3 characters | slug | string | 3       | true      |

  Scenario: Trying to create a question theme with a too long slug
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path | type   | value                                                                |
      | slug | string | a-very-long-slug-that-exceeds-the-maximum-length-of-fifty-characters |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                          | path | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=50 characters | slug | string | 50      | true      |

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

  Scenario: Trying to create a question theme with a too long english label
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path     | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | label.en | string | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut bibendum magna. Morbi fringilla quis massa eu molestie. Nunc sed dictum ipsum, at fermentum ante. Morbi viverra tortor vulputate nisl mollis, sed placerat quam finibus. Mauris neque velit, interdum a gravida id, hendrerit vel metus. Pellentesque convallis mi ut venenatis malesuada. In at convallis nisi, non porta leo. Fusce lectus ex, consequat at pulvinar in, consectetur sit amet ligula. Vestibulum placerat lobortis turpis. |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path     | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | label.en | string | 500     | true      |

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

  Scenario: Trying to create a question theme with too few Spanish aliases
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value |
      | aliases.es | array | []    |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                     | path       | origin | minimum | inclusive |
      | too_small | Too small: expected array to have >=1 items | aliases.es | array  | 1       | true      |

  Scenario: Trying to create a question theme with too many english aliases
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path       | type  | value                                                                                                            |
      | aliases.en | array | ["Alias1", "Alias2", "Alias3", "Alias4", "Alias5", "Alias6", "Alias7", "Alias8", "Alias9", "Alias10", "Alias11"] |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                    | path       | origin | maximum | inclusive |
      | too_big | Too big: expected array to have <=10 items | aliases.en | array  | 10      | true      |

  Scenario: Trying to create a question theme with an empty Spanish description
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

  Scenario: Trying to create a question theme with a too long Italian description
    Given the request payload is set from scope "question-theme", type "creation" and name "complete"
    When the request payload is overridden with the following values:
      | path           | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
      | description.it | string | Questo è un tema che copre una vasta gamma di argomenti di conoscenza generale. Viene utilizzato per testare la conoscenza generale dei partecipanti su vari argomenti, tra cui storia, geografia, scienza, cultura pop e molto altro. Le domande in questo tema sono progettate per essere stimolanti e coinvolgenti, incoraggiando i partecipanti a pensare in modo critico e ad applicare le loro conoscenze in modi nuovi. Che tu sia un appassionato di quiz o semplicemente desideri mettere alla prova la tua conoscenza generale, questo tema offre qualcosa per tutti. Preparati a mettere alla prova la tua mente e a divertirti lungo il percorso! |
    And the client creates a new question theme with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path           | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | description.it | string | 500     | true      |

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
