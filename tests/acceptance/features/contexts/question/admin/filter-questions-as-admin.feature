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
