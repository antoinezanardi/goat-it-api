@question-theme @filter-question-themes @admin

Feature: Filter Question Themes as Admin
  In order to find specific question themes in the back office
  As an admin API client
  I want to be able to filter question themes by status

  Scenario: Filtering admin question themes by status "active"
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with filter "status" set to "active"
    Then the request should have succeeded with status code 200
    And the response should contain 4 admin question themes

  Scenario: Filtering admin question themes by status "archived"
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with filter "status" set to "archived"
    Then the request should have succeeded with status code 200
    And the response should contain 1 admin question themes

  Scenario: Filtering admin question themes with invalid status value
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with filter "status" set to "invalid"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
