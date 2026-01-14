@question @list-questions @public

Feature: List Questions
  In order to display questions to end users
  As an API client
  I want to be able to retrieve all questions with localization support

  Scenario: Listing all question themes returns results in default locale
    Given the database is populated with questions fixture set with name "five-questions"
    When the client retrieves all questions
    Then the request should have succeeded with status code 200
    And the response should contain 5 questions
    And the response should contain the following questions:
      | id                         | cognitiveDifficulty | status   | sourceUrls |
      | a1b2c3d4e5f6012345678901   | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film) |
      | b2c3d4e5f6a7012345678902   | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon |
      | c3d4e5f6a7b8012345678903   | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup |
      | d4e5f6a7b8c9012345678904   | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington |
      | efd39a4ac3bdfd03d2f8cdf1   | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |
