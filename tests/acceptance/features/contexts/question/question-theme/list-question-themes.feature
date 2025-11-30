@question @question-theme @list-question-themes

Feature: List Question Themes
  In order to display question themes to end users
  As an API client
  I want to be able to retrieve all question themes with localization support

  Scenario: Listing all question themes returns results in default locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | label   | aliases              | description                                           | status   |
      | Cinema  | Movies, Films        | Theme about cinema and movies.                        | active   |
      | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | active   |
      | Sports  | Football, Games      | Theme about sports, competitions and athletes.        | archived |
      | History | Past, Chronology     | Theme about historical events, figures and periods.   | active   |
      | Science | Technology, Research | Theme covering sciences, discoveries and innovations. | active   |

  Scenario: Listing all question themes in wildcard locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes in locale "*"
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | label   | aliases              | description                                           | status   |
      | Cinema  | Movies, Films        | Theme about cinema and movies.                        | active   |
      | Music   | Songs, Tunes         | Theme about music, artists and music genres.          | active   |
      | Sports  | Football, Games      | Theme about sports, competitions and athletes.        | archived |
      | History | Past, Chronology     | Theme about historical events, figures and periods.   | active   |
      | Science | Technology, Research | Theme covering sciences, discoveries and innovations. | active   |

  Scenario: Listing all question themes in French locale
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the client retrieves all question themes in locale "fr"
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | label    | aliases                | description                                                    | status   |
      | Cinéma   | Films, Ciné            | Thème concernant le cinéma et les films.                       | active   |
      | Musique  | Chanson, Son           | Thème lié à la musique, aux artistes et aux genres musicaux.   | active   |
      | Sport    | Football, Jeux         | Thème concernant les sports, compétitions et athlètes.         | archived |
      | Histoire | Passé, Chronologie     | Thème sur les événements historiques, personnages et périodes. | active   |
      | Science  | Technologie, Recherche | Thème couvrant les sciences, découvertes et innovations.       | active   |

  Scenario: Listing all question themes when none exist
    When the client retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 0 question themes

  Scenario: Listing all question themes with invalid locale
    When the client retrieves all question themes in locale "invalid-locale"
    Then the request should have failed with status code 400