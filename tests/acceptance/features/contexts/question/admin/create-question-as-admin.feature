@question @create-question @admin

Feature: Create Question as Admin
  In order to create new questions for the system
  As an admin API client
  I want to be able to create question a question by providing its data

  Scenario: Creating a question with complete data
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the request payload is set from scope "question", type "creation" and name "complete"
    When the admin creates a new question with the request payload
    Then the request should have succeeded with status code 201