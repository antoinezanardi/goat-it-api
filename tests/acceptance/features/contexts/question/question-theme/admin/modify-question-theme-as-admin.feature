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