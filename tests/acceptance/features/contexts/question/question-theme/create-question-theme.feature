@question @question-theme @create-question-theme

Feature: Create Question Theme
  In order to create question themes to categorize questions
  As an API client
  I want to be able to create a question theme by providing its data

  Scenario: Trying to create a question theme with missing required fields
    When the client creates a new question theme with an empty payload
    Then the request should have failed with status code 400 and contain the following error:
      | error       | statusCode | message                            | validationDetails |
      | Bad Request | 400        | Validation failed for provided DTO | <SET>             |
