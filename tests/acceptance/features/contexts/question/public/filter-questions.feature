@question @filter-questions @public

Feature: Filter Questions
  In order to find specific questions
  As an API client
  I want to be able to filter questions by various criteria

  Scenario: Filtering questions by category "trivia"
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | category |
      | trivia   |
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions

  Scenario: Filtering questions by cognitive difficulty "hard"
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | cognitive-difficulty |
      | hard                 |
    Then the request should have succeeded with status code 200
    And the response should contain 1 questions

  Scenario: Filtering questions by author role "game"
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | author-role |
      | game        |
    Then the request should have succeeded with status code 200
    And the response should contain 1 questions

  Scenario: Filtering questions by a single theme ID
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions with the following query:
      | theme-ids                |
      | 9adeceb41db80ab7ec49b457 |
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions
