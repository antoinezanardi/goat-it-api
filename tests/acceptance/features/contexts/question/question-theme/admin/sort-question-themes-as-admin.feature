@question-theme @sort-question-themes @admin

Feature: Sort Question Themes as Admin
  In order to display question themes in a specific order in the back office
  As an admin API client
  I want to be able to sort question themes by various fields

  Scenario: Sorting admin question themes by slug in ascending order (default behavior)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | sort-by | sort-order |
      | slug    | asc        |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin question themes
    And the response should contain the following admin question themes:
      | slug    | status   |
      | cinema  | active   |
      | history | active   |
      | music   | active   |
      | science | active   |
      | sports  | archived |

  Scenario: Sorting admin question themes by createdAt in ascending order
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | sort-by   | sort-order |
      | createdAt | asc        |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin question themes
    And the response should contain the following admin question themes:
      | slug    | status   |
      | history | active   |
      | science | active   |
      | sports  | archived |
      | music   | active   |
      | cinema  | active   |

  Scenario: Sorting admin question themes by slug in descending order
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | sort-by | sort-order |
      | slug    | desc       |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin question themes
    And the response should contain the following admin question themes:
      | slug    | status   |
      | sports  | archived |
      | science | active   |
      | music   | active   |
      | history | active   |
      | cinema  | active   |

  Scenario: Sorting admin question themes by status in ascending order
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | sort-by | sort-order |
      | status  | asc        |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin question themes
    And the response should contain the following admin question themes:
      | slug    | status   |
      | cinema  | active   |
      | science | active   |
      | history | active   |
      | music   | active   |
      | sports  | archived |

  Scenario: Trying to sort admin question themes with an invalid sort-by field
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | sort-by      |
      | invalidField |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                                      | path    | values                              |
      | invalid_value | Invalid option: expected one of "createdAt"\|"updatedAt"\|"slug"\|"status" | sort-by | createdAt, updatedAt, slug, status |
