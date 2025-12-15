@question @question-theme @list-question-themes @admin

Feature: List Question Themes as Admin
  In order to display question themes to back office users
  As an admin API client
  I want to be able to retrieve all question themes for administration purposes

  Scenario: Listing all admin question themes returns detailed results in every locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin question themes
    And the response should contain the following admin question themes:
      | slug    | status   |
      | cinema  | active   |
      | music   | active   |
      | sports  | archived |
      | history | active   |
      | science | active   |
    And the response should contain an admin question theme from others with slug "cinema" and the following localized labels:
      | locale | label  |
      | en     | Cinema |
      | fr     | Cinéma |
      | it     | Cinema |
      | es     | Cine   |
      | de     | Kino   |
      | pt     | Cinema |

  Scenario: Listing all admin question themes when none exist
    When the admin retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin question themes