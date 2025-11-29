@question @question-theme

Feature: Question Theme

  Scenario: User retrieves all question themes
    Given the database is populated with question themes fixture set with name "five-question-themes"
    And the client retrieves all questions themes
    Then the request should have succeeded with status code 200
    And the response should contain 5 question themes
    And the response should contain the following question themes:
      | label    | aliases                | description                                                    | status   |
      | Cinéma   | Films, Ciné            | Thème concernant le cinéma et les films.                       | active   |
      | Musique  | Chanson, Son           | Thème lié à la musique, aux artistes et aux genres musicaux.   | active   |
      | Sport    | Football, Jeux         | Thème concernant les sports, compétitions et athlètes.         | archived |
      | Histoire | Passé, Chronologie     | Thème sur les événements historiques, personnages et périodes. | active   |
      | Science  | Technologie, Recherche | Thème couvrant les sciences, découvertes et innovations.       | active   |