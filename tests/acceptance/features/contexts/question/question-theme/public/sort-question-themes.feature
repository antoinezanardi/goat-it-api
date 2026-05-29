@question-theme @sort-question-themes @public

Feature: Sort Question Themes
  In order to display question themes in a specific order
  As an API client
  I want to be able to sort question themes by various fields

  Scenario: Sorting question themes by createdAt in ascending order
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes sorted by "createdAt" in "asc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | slug    | label   | aliases              | description                                           | color   | status   |
      | history | History | Past, Chronology     | Theme about historical events, figures and periods.   | #FF5733 | active   |
      | science | Science | Technology, Research | Theme covering sciences, discoveries and innovations. |         | active   |
      | sports  | Sports  | Football, Games      | Theme about sports, competitions and athletes.        |         | archived |
      | music   | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | #FA2333 | active   |
      | cinema  | Cinema  | Movies, Films        | Theme about cinema and movies.                        | #33A1FF | active   |

  Scenario: Sorting question themes by createdAt in descending order (default behavior)
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes sorted by "createdAt" in "desc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | slug    | label   | aliases              | description                                           | color   | status   |
      | cinema  | Cinema  | Movies, Films        | Theme about cinema and movies.                        | #33A1FF | active   |
      | music   | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | #FA2333 | active   |
      | sports  | Sports  | Football, Games      | Theme about sports, competitions and athletes.        |         | archived |
      | science | Science | Technology, Research | Theme covering sciences, discoveries and innovations. |         | active   |
      | history | History | Past, Chronology     | Theme about historical events, figures and periods.   | #FF5733 | active   |

  Scenario: Sorting question themes by slug in ascending order
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes sorted by "slug" in "asc" order
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | slug    | label   | aliases              | description                                           | color   | status   |
      | cinema  | Cinema  | Movies, Films        | Theme about cinema and movies.                        | #33A1FF | active   |
      | history | History | Past, Chronology     | Theme about historical events, figures and periods.   | #FF5733 | active   |
      | music   | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | #FA2333 | active   |
      | science | Science | Technology, Research | Theme covering sciences, discoveries and innovations. |         | active   |
      | sports  | Sports  | Football, Games      | Theme about sports, competitions and athletes.        |         | archived |

  Scenario: Trying to sort question themes with an invalid sort-by field
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes sorted by "invalidField" in "asc" order
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
    And the failed request's response should contain the following validation details:
      | code          | message                                                                          | path    | values                       |
      | invalid_value | Invalid option: expected one of "createdAt"\|"updatedAt"\|"slug" | sort-by | createdAt, updatedAt, slug |
