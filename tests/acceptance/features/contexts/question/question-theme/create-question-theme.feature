@question @question-theme @create-question-theme

Feature: Create Question Theme
  In order to create question themes to categorize questions
  As an API client
  I want to be able to create a question theme by providing its data

  Scenario: Trying to create a question theme with missing required fields
    When the client creates a new question theme with an empty payload
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code         | message                                            | expected | path        |
      | invalid_type | Invalid input: expected string, received undefined | string   | slug        |
      | invalid_type | Invalid input: expected object, received undefined | object   | label       |
      | invalid_type | Invalid input: expected object, received undefined | object   | aliases     |
      | invalid_type | Invalid input: expected object, received undefined | object   | description |
