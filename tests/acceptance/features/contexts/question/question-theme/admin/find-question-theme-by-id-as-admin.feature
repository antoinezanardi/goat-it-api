@question @question-theme @find-question-theme-by-id @admin

Feature: Find Question Theme by ID as Admin
  In order to display question theme to back office users
  As an admin API client
  I want to be able to retrieve a question theme by its identifier for administration purposes

  Scenario: Finding a question theme returns localized data for all supported locales
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "ddb03d94cae8df38d28e5adc"
    Then the request should have succeeded with status code 200
    And the response should contain the following admin question theme:
      | slug  | status |
      | music | active |

  Scenario: Trying to find a question theme when provided id is invalid
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "invalid-id"
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                      |
      | Bad Request | 400        | Invalid Mongo ID: invalid-id |

  Scenario: Trying to find a non-existing question theme
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves the question theme with id "3ece5c485ddc36118b9fbd5c"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                                                   |
      | Not Found | 404        | Question theme with id 3ece5c485ddc36118b9fbd5c not found |