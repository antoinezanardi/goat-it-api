@question-theme @filter-question-themes @admin
Feature: Filter Question Themes as Admin
  In order to find specific question themes in the back office
  As an admin API client
  I want to be able to filter question themes by status

  Scenario: Filtering admin question themes by status "active"
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | status |
      | active |
    Then the request should have succeeded with status code 200
    And the response should contain 4 admin question themes
    And the response should contain the following admin question themes:
      | slug    | status |
      | cinema  | active |
      | history | active |
      | music   | active |
      | science | active |

  Scenario: Filtering admin question themes by status "archived"
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | status   |
      | archived |
    Then the request should have succeeded with status code 200
    And the response should contain 1 admin question themes
    And the response should contain the following admin question themes:
      | slug   | status   |
      | sports | archived |

  Scenario: Filtering admin question themes with invalid status value
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | status  |
      | invalid |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                  | path   | values           |
      | invalid_value | Invalid option: expected one of "active"\|"archived" | status | active, archived |

  Scenario: Filtering admin question themes by is-fully-translated "true"
    Given the database is populated with question themes fixture set with name "eight-translation-completeness-question-themes"
    When the admin retrieves all question themes with the following query:
      | is-fully-translated |
      | true                |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin question themes
    And the response should contain the following admin question themes:
      | slug                   | status |
      | fully-translated-theme-1 | active |
      | fully-translated-theme-2 | active |

  Scenario: Filtering admin question themes by is-fully-translated "false"
    Given the database is populated with question themes fixture set with name "eight-translation-completeness-question-themes"
    When the admin retrieves all question themes with the following query:
      | is-fully-translated |
      | false               |
    Then the request should have succeeded with status code 200
    And the response should contain 6 admin question themes
    And the response should contain the following admin question themes:
      | slug               | status |
      | incomplete-theme-1 | active |
      | incomplete-theme-2 | active |
      | incomplete-theme-3 | active |
      | incomplete-theme-4 | active |
      | incomplete-theme-5 | active |
      | incomplete-theme-6 | active |

  Scenario: Filtering admin question themes with invalid is-fully-translated value
    Given the database is populated with question themes fixture set with name "eight-translation-completeness-question-themes"
    When the admin retrieves all question themes with the following query:
      | is-fully-translated |
      | maybe               |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                       | path                | expected   | values      |
      | invalid_value | Invalid option: expected one of "true"\|"false" | is-fully-translated | stringbool | true, false |
