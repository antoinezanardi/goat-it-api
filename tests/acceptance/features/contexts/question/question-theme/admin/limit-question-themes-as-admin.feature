@question-theme @limit-question-themes @admin

Feature: Limit Question Themes as Admin
  In order to control how many question themes are returned in the back office
  As an admin API client
  I want to be able to limit the number of question themes in the response

  Scenario: Limiting admin question themes to 2 results
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | limit |
      | 2     |
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin question themes

  Scenario: Returning all admin question themes when limit is 0 (unlimited)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | limit |
      | 0     |
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin question themes

  Scenario: Trying to limit admin question themes with an invalid limit value
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with the following query:
      | limit |
      | -1    |
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
