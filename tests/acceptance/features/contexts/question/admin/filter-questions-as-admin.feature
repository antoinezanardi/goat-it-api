@question @filter-questions @admin
Feature: Filter Questions as Admin
  In order to find specific questions in the back office
  As an admin API client
  I want to be able to filter questions by various criteria

  Scenario: Filtering admin questions by status "active"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status |
      | active |
    Then the request should have succeeded with status code 200
    And the response should contain 50 admin questions
    And all returned admin questions should have status "active"

  Scenario: Filtering admin questions by category "trivia"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | category |
      | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 15 admin questions
    And all returned admin questions should have category "trivia"

  Scenario: Filtering admin questions by cognitive difficulty "easy"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | cognitive-difficulty |
      | easy                 |
    Then the request should have succeeded with status code 200
    And the response should contain 19 admin questions
    And all returned admin questions should have cognitive difficulty "easy"

  Scenario: Filtering admin questions by author role "ai"
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | author-role |
      | ai          |
    Then the request should have succeeded with status code 200
    And the response should contain 18 admin questions
    And all returned admin questions should have author role "ai"

  Scenario: Filtering admin questions by theme IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | theme-ids                |
      | 600000000000000000000001 |
    Then the request should have succeeded with status code 200
    And the response should contain 4 admin questions
    And all returned admin questions should have theme id "600000000000000000000001"

  Scenario: Filtering admin questions by multiple criteria
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status | category |
      | active | riddle   |
    Then the request should have succeeded with status code 200
    And the response should contain 14 admin questions
    And all returned admin questions should have status "active"
    And all returned admin questions should have category "riddle"

  Scenario: Filtering admin questions returns empty list when no match
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status   | category |
      | archived | lexicon  |
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin questions

  Scenario: Filtering admin questions with invalid status value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | status  |
      | invalid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                                     | path   | values                              |
      | invalid_value | Invalid option: expected one of "pending"\|"active"\|"archived"\|"rejected" | status | pending, active, archived, rejected |

  Scenario: Filtering admin questions with invalid category value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | category |
      | invalid  |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                              | path     | values                                 |
      | invalid_value | Invalid option: expected one of "trivia"\|"lexicon"\|"riddle"\|"explanation" | category | trivia, lexicon, riddle, explanation |

  Scenario: Filtering admin questions with invalid cognitive difficulty value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | cognitive-difficulty |
      | invalid              |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                               | path                 | values             |
      | invalid_value | Invalid option: expected one of "easy"\|"medium"\|"hard" | cognitive-difficulty | easy, medium, hard |

  Scenario: Filtering admin questions with invalid author role value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | author-role |
      | invalid     |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                           | path        | values          |
      | invalid_value | Invalid option: expected one of "admin"\|"game"\|"ai" | author-role | admin, game, ai |

  Scenario: Filtering admin questions with invalid theme ID value
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | theme-ids |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                | path        | origin | format | pattern          |
      | invalid_format | Invalid ObjectId value | theme-ids.0 | string | regex  | /^[\\da-f]{24}$/iu |

  Scenario: Filtering admin questions that are fully translated as admin
    Given the database is populated with questions fixture set with name "eight-translation-completeness-questions"
    When the admin retrieves all questions with the following query:
      | is-fully-translated |
      | true                |
    Then the request should have succeeded with status code 200
    And the response should contain 3 admin questions
    And the response should contain an admin question among them with id "a10000000000000000000001" and the following question statement:
      | locale | statement                                                                  |
      | en     | What is the main ingredient in traditional Italian pesto sauce?              |
      | fr     | Quel est l'ingrédient principal de la sauce pesto traditionnelle italienne? |
      | it     | Qual è l'ingrediente principale del tradizionale pesto italiano?            |
      | pt     | Qual é o ingrediente principal do molho pesto tradicional italiano?          |
      | es     | ¿Cuál es el ingrediente principal de la salsa pesto tradicional italiana?   |
      | de     | Was ist die Hauptzutat der traditionellen italienischen Pesto-Soße?          |
    And the response should contain an admin question among them with id "a20000000000000000000002" and the following question statement:
      | locale | statement                                              |
      | en     | Which city is known as the Eternal City?               |
      | fr     | Quelle ville est connue comme la Ville Éternelle?       |
      | it     | Quale città è conosciuta come la Città Eterna?          |
      | pt     | Qual cidade é conhecida como a Cidade Eterna?          |
      | es     | ¿Qué ciudad es conocida como la Ciudad Eterna?         |
      | de     | Welche Stadt ist als Die Ewige Stadt bekannt?           |
    And the response should contain an admin question among them with id "a50000000000000000000005" and the following question statement:
      | locale | statement                 |
      | en     | What does HTML stand for? |
      | fr     | Que signifie HTML?        |
      | it     | Cosa significa HTML?      |

  Scenario: Filtering admin questions that are not fully translated as admin
    Given the database is populated with questions fixture set with name "eight-translation-completeness-questions"
    When the admin retrieves all questions with the following query:
      | is-fully-translated |
      | false               |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions
    And the response should contain an admin question among them with id "a30000000000000000000003" and the following question statement:
      | locale | statement                                    |
      | en     | What is the largest rainforest in the world? |
    And the response should contain an admin question among them with id "a40000000000000000000004" and the following question statement:
      | locale | statement                      |
      | en     | Who composed the Four Seasons? |
      | fr     | Qui a composé les Quatre Saisons? |
    And the response should contain an admin question among them with id "a60000000000000000000006" and the following question statement:
      | locale | statement                            |
      | en     | Which is the longest river in Africa? |
      | fr     | Quel est le plus long fleuve d'Afrique? |
      | it     | Qual è il fiume più lungo dell'Africa? |
      | pt     | Qual é o rio mais longo da África? |
    And the response should contain an admin question among them with id "a70000000000000000000007" and the following question statement:
      | locale | statement                      |
      | en     | Who painted the Mona Lisa?     |
      | fr     | Qui a peint la Joconde?        |
      | it     | Chi ha dipinto la Gioconda?    |
      | pt     | Quem pintou a Mona Lisa?       |
      | es     | ¿Quién pintó la Mona Lisa?     |
    And the response should contain an admin question among them with id "a80000000000000000000008" and the following question statement:
      | locale | statement                                  |
      | en     | Who wrote 'One Hundred Years of Solitude'? |
      | it     | Chi ha scritto 'Cent'anni di solitudine'?  |
      | es     | ¿Quién escribió 'Cien años de soledad'?   |

  Scenario: Filtering admin questions with invalid is-fully-translated value
    Given the database is populated with questions fixture set with name "eight-translation-completeness-questions"
    When the admin retrieves all questions with the following query:
      | is-fully-translated |
      | maybe               |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                       | path                | expected   | values      |
      | invalid_value | Invalid option: expected one of "true"\|"false" | is-fully-translated | stringbool | true, false |

  Scenario: Filtering admin questions by a single ID
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids                      |
      | 700000000000000000000001 |
    Then the request should have succeeded with status code 200
    And the response should contain 1 admin question
    And the response should contain an admin question among them with id "700000000000000000000001"

  Scenario: Filtering admin questions by multiple IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids                                              |
      | 700000000000000000000001,70000000000000000000000f |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin questions

  Scenario: Filtering admin questions by IDs combined with status
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids                      | status |
      | 700000000000000000000001 | active |
    Then the request should have succeeded with status code 200
    And the response should contain 1 admin question
    And all returned admin questions should have status "active"

  Scenario: Filtering admin questions by unknown ID returns empty list
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids                      |
      | 700000000000000000000abc |
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin questions

  Scenario: Filtering admin questions with invalid ID ObjectId
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids      |
      | not-valid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code           | message                | path  | origin | format | pattern          |
      | invalid_format | Invalid ObjectId value | ids.0 | string | regex  | /^[\\da-f]{24}$/iu |

  Scenario: Filtering admin questions with too many IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids |
      | 700000000000000000000001,700000000000000000000002,700000000000000000000003,700000000000000000000004,700000000000000000000005,700000000000000000000006,700000000000000000000007,700000000000000000000008,700000000000000000000009,70000000000000000000000a,70000000000000000000000b,70000000000000000000000c,70000000000000000000000d,70000000000000000000000e,70000000000000000000000f,700000000000000000000010,700000000000000000000011,700000000000000000000012,700000000000000000000013,700000000000000000000014,700000000000000000000015,700000000000000000000016,700000000000000000000017,700000000000000000000018,700000000000000000000019,70000000000000000000001a,70000000000000000000001b,70000000000000000000001c,70000000000000000000001d,70000000000000000000001e,70000000000000000000001f,700000000000000000000020,700000000000000000000021,700000000000000000000022,700000000000000000000023,700000000000000000000024,700000000000000000000025,700000000000000000000026,700000000000000000000027,700000000000000000000028,700000000000000000000029,70000000000000000000002a,70000000000000000000002b,70000000000000000000002c,70000000000000000000002d,70000000000000000000002e,70000000000000000000002f,700000000000000000000030,700000000000000000000031,700000000000000000000032,700000000000000000000033,700000000000000000000034,700000000000000000000035,700000000000000000000036,700000000000000000000037,700000000000000000000038,700000000000000000000039,70000000000000000000003a,70000000000000000000003b,70000000000000000000003c,70000000000000000000003d,70000000000000000000003e,70000000000000000000003f,700000000000000000000040,700000000000000000000041,700000000000000000000042,700000000000000000000043,700000000000000000000044,700000000000000000000045,700000000000000000000046,700000000000000000000047,700000000000000000000048,700000000000000000000049,70000000000000000000004a,70000000000000000000004b,70000000000000000000004c,70000000000000000000004d,70000000000000000000004e,70000000000000000000004f,700000000000000000000050,700000000000000000000051,700000000000000000000052,700000000000000000000053,700000000000000000000054,700000000000000000000055,700000000000000000000056,700000000000000000000057,700000000000000000000058,700000000000000000000059,70000000000000000000005a,70000000000000000000005b,70000000000000000000005c,70000000000000000000005d,70000000000000000000005e,70000000000000000000005f,700000000000000000000060,700000000000000000000061,700000000000000000000062,700000000000000000000063,700000000000000000000064,700000000000000000000065 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code    | message                                     | path | origin | maximum | inclusive |
      | too_big | Too big: expected array to have <=100 items | ids  | array  | 100     | true      |

  Scenario: Filtering admin questions with duplicate IDs
    Given the database is populated with questions fixture set with name "sixty-questions"
    When the admin retrieves all questions with the following query:
      | ids                                              |
      | 700000000000000000000001,700000000000000000000001 |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code   | message            | path |
      | custom | IDs must be unique | ids  |
