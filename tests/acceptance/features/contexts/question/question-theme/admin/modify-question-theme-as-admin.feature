@question @question-theme @modify-question-theme @admin

Feature: Modify Question Theme As Admin
  In order to modify an existing question theme
  As an admin API client
  I want to be able to update partially a question theme by its identifier for administration purposes

  Scenario: Modifying the slug of a question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | video-games |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question theme:
      | slug        | status |
      | video-games | active |

  Scenario: Modifying a question theme with empty payload returns the same question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with an empty payload
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question theme:
      | slug  | status |
      | music | active |
    And the response should contain the following localized labels for the question theme:
      | locale | label   |
      | en     | Music   |
      | fr     | Musique |
      | it     | Musica  |
      | es     | Música  |
      | de     | Musik   |
      | pt     | Música  |
    And the response should contain the following localized aliases for the question theme:
      | locale | aliases             |
      | en     | Songs, Tunes        |
      | fr     | Chanson, Son        |
      | it     | Canzoni, Brani      |
      | es     | Canciones, Melodías |
      | de     | Lieder, Melodien    |
      | pt     | Canções, Músicas    |
    And the response should contain the following localized descriptions for the question theme:
      | locale | description                                                  |
      | en     | Theme about music, artists and music genres.                 |
      | fr     | Thème lié à la musique, aux artistes et aux genres musicaux. |
      | it     | Argomento sulla musica, artisti e generi musicali.           |
      | es     | Tema sobre música, artistas y géneros musicales.             |
      | de     | Thema über Musik, Künstler und Musikgenres.                  |
      | pt     | Tema sobre música, artistas e gêneros musicais.              |

  Scenario: Modifying only the french label of a question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path     | type   | value      |
      | label.fr | string | Musique FR |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have succeeded with status code 200
    And the response should contain the following localized labels for the question theme:
      | locale | label      |
      | en     | Music      |
      | fr     | Musique FR |
      | it     | Musica     |
      | es     | Música     |
      | de     | Musik      |
      | pt     | Música     |

  Scenario: Modifying all the descriptions of a question theme with trimmed values
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path           | type   | value                                    |
      | description.en | string | "   New description in English         " |
      | description.fr | string | "   Nouvelle description en Français   " |
      | description.it | string | "   Nuova descrizione in Italiano     "  |
      | description.es | string | "   Nueva descripción en Español      "  |
      | description.de | string | "   Neue Beschreibung auf Deutsch     "  |
      | description.pt | string | "   Nova descrição em Português       "  |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have succeeded with status code 200
    And the response should contain the following localized descriptions for the question theme:
      | locale | description                      |
      | en     | New description in English       |
      | fr     | Nouvelle description en Français |
      | it     | Nuova descrizione in Italiano    |
      | es     | Nueva descripción en Español     |
      | de     | Neue Beschreibung auf Deutsch    |
      | pt     | Nova descrição em Português      |

  Scenario: Trying to modify a question theme when provided id is invalid
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | video-games |
    And the admin modifies the question theme with id "invalid-id" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to modify a non-existing question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | video-games |
    And the admin modifies the question theme with id "3ece5c485ddc36118b9fbd5c" with the request payload
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 3ece5c485ddc36118b9fbd5c not found |

  Scenario: Trying to modify a question theme with an empty slug
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value |
      | slug | string |       |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                                           | format | path | origin | pattern                       | inclusive | minimum |
      | too_small      | Too small: expected string to have >=3 characters |        | slug | string |                               | true      | 3       |
      | invalid_format | Invalid kebab-case value                          | regex  | slug | string | /^[\\da-z]+(?:-[\\da-z]+)*$/u |           |         |

  Scenario: Trying to modify a question theme with an invalid kebab-case slug
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | Video Games |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                  | format | path | origin | pattern                       |
      | invalid_format | Invalid kebab-case value | regex  | slug | string | /^[\\da-z]+(?:-[\\da-z]+)*$/u |

  Scenario: Trying to modify a question theme with a slug that is already used by another question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value   |
      | slug | string | history |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 409 and the response should contain the following error:
      | error    | statusCode | message                                         |
      | Conflict | 409        | Question theme with slug history already exists |

  Scenario: Trying to modify a question theme with a too short slug
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value |
      | slug | string | ab    |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=3 characters | slug | string | 3       | true      |

  Scenario: Trying to modify a question theme with a too long slug
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value                                                                |
      | slug | string | a-very-long-slug-that-exceeds-the-maximum-length-of-fifty-characters |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                          | path | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=50 characters | slug | string | 50      | true      |

  Scenario: Trying to modify a question theme with an empty french label
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path     | type   | value |
      | label.fr | string |       |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path     | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | label.fr | string | 1       | true      |

  Scenario: Trying to modify a question theme with a number as English label
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path     | type    | value |
      | label.en | integer | 123   |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                         | expected | path     |
      | invalid_type | Invalid input: expected string, received number | string   | label.en |

  Scenario: Trying to modify a question theme with an unknown locale in label
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path     | type   | value |
      | label.jp | string | 音楽    |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path  | keys |
      | unrecognized_keys | Unrecognized key: "jp" | label | jp   |

  Scenario: Trying to modify a question theme with a too long English label
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path     | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
      | label.en | string | Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut bibendum magna. Morbi fringilla quis massa eu molestie. Nunc sed dictum ipsum, at fermentum ante. Morbi viverra tortor vulputate nisl mollis, sed placerat quam finibus. Mauris neque velit, interdum a gravida id, hendrerit vel metus. Pellentesque convallis mi ut venenatis malesuada. In at convallis nisi, non porta leo. Fusce lectus ex, consequat at pulvinar in, consectetur sit amet ligula. Vestibulum placerat lobortis turpis. |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path     | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | label.en | string | 500     | true      |

  Scenario: Trying to modify a question theme with a string as french aliases
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path       | type   | value   |
      | aliases.fr | string | Culture |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                        | expected | path       |
      | invalid_type | Invalid input: expected array, received string | array    | aliases.fr |

  Scenario: Trying to modify a question theme with an unknown locale in aliases
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path       | type  | value          |
      | aliases.jp | array | ["日本語", "クイズ"] |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path    | keys |
      | unrecognized_keys | Unrecognized key: "jp" | aliases | jp   |

  Scenario: Trying to modify a question theme with too few Spanish aliases
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path       | type  | value |
      | aliases.es | array | []    |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                     | path       | origin | minimum | inclusive |
      | too_small | Too small: expected array to have >=1 items | aliases.es | array  | 1       | true      |

  Scenario: Trying to modify a question theme with too many English aliases
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path       | type  | value                                                                                                            |
      | aliases.en | array | ["Alias1", "Alias2", "Alias3", "Alias4", "Alias5", "Alias6", "Alias7", "Alias8", "Alias9", "Alias10", "Alias11"] |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                    | path       | origin | maximum | inclusive |
      | too_big | Too big: expected array to have <=10 items | aliases.en | array  | 10      | true      |

  Scenario: Trying to modify a question theme with an empty Spanish description
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path           | type   | value |
      | description.es | string |       |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code      | message                                           | path           | origin | minimum | inclusive |
      | too_small | Too small: expected string to have >=1 characters | description.es | string | 1       | true      |

  Scenario: Trying to modify a question theme with a boolean as german description
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path           | type    | value |
      | description.de | boolean | true  |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                          | expected | path           |
      | invalid_type | Invalid input: expected string, received boolean | string   | description.de |

  Scenario: Trying to modify a question theme with a too long Italian description
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path           | type   | value                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
      | description.it | string | Questo è un tema che copre una vasta gamma di argomenti di conoscenza generale. Viene utilizzato per testare la conoscenza generale dei partecipanti su vari argomenti, tra cui storia, geografia, scienza, cultura pop e molto altro. Le domande in questo tema sono progettate per essere stimolanti e coinvolgenti, incoraggiando i partecipanti a pensare in modo critico e ad applicare le loro conoscenze in modi nuovi. Che tu sia un appassionato di quiz o semplicemente desideri mettere alla prova la tua conoscenza generale, questo tema offre qualcosa per tutti. Preparati a mettere alla prova la tua mente e a divertirti lungo il percorso! |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                           | path           | origin | maximum | inclusive |
      | too_big | Too big: expected string to have <=500 characters | description.it | string | 500     | true      |

  Scenario: Trying to modify a question theme with an unknown locale in description
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path           | type   | value                        |
      | description.lt | string | Tema apimties įvairias temas |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code              | message                | path        | keys |
      | unrecognized_keys | Unrecognized key: "lt" | description | lt   |

  Scenario: Trying to modify a question theme without API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | video-games |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload but without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to modify a question theme with invalid API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the request payload is overridden with the following values:
      | path | type   | value       |
      | slug | string | video-games |
    And the admin modifies the question theme with id "ddb03d94cae8df38d28e5adc" with the request payload with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
