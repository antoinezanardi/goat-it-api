@question-theme @list-question-themes @admin

Feature: List Question Themes as Admin
  In order to display question themes to back office users
  As an admin API client
  I want to be able to retrieve all question themes for administration purposes

  Scenario: Listing all admin question themes returns localized data for all supported locales
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
    And the response should contain an admin question theme among them with slug "cinema" and the following localized labels:
      | locale | label  |
      | en     | Cinema |
      | fr     | Cinéma |
      | it     | Cinema |
      | es     | Cine   |
      | de     | Kino   |
      | pt     | Cinema |
    And the response should contain an admin question theme among them with slug "cinema" and the following localized aliases:
      | locale | aliases         |
      | en     | Movies, Films   |
      | fr     | Films, Ciné     |
      | it     | Film, Pellicole |
      | es     | Películas, Cine |
      | de     | Filme, Kino     |
      | pt     | Filmes, Cinema  |
    And the response should contain an admin question theme among them with slug "cinema" and the following localized descriptions:
      | locale | description                              |
      | en     | Theme about cinema and movies.           |
      | fr     | Thème concernant le cinéma et les films. |
      | it     | Argomento sul cinema e i film.           |
      | es     | Tema sobre cine y películas.             |
      | de     | Thema über Kino und Filme.               |
      | pt     | Tema sobre o cinema e filmes.            |
    And the response should contain an admin question theme among them with slug "science" and the following localized labels:
      | locale | label        |
      | en     | Science      |
      | fr     | Science      |
      | it     | Scienza      |
      | es     | Ciencia      |
      | de     | Wissenschaft |
      | pt     | Ciência      |
    And the response should contain an admin question theme among them with slug "science" and the following localized aliases:
      | locale | aliases                   |
      | en     | Technology, Research      |
      | fr     | Technologie, Recherche    |
      | it     | Tecnologia, Ricerca       |
      | es     | Tecnología, Investigación |
      | de     | Technologie, Forschung    |
      | pt     | Tecnologia, Pesquisa      |
    And the response should contain an admin question theme among them with slug "science" and the following localized descriptions:
      | locale | description                                                       |
      | en     | Theme covering sciences, discoveries and innovations.             |
      | fr     | Thème couvrant les sciences, découvertes et innovations.          |
      | it     | Argomento che copre scienze, scoperte e innovazioni.              |
      | es     | Tema que abarca ciencias, descubrimientos e innovaciones.         |
      | de     | Thema, das Wissenschaften, Entdeckungen und Innovationen abdeckt. |
      | pt     | Tema que abrange ciências, descobertas e inovações.               |

  Scenario: Listing all admin question themes with partial translation returns localized data with undefined values
    Given the database is populated with question themes fixture set with name "two-english-only-question-themes"
    When the admin retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 2 admin question themes
    And the response should contain an admin question theme among them with slug "cinema" and the following localized labels:
      | locale | label  |
      | en     | Cinema |
      | fr     |        |
      | it     |        |
      | es     |        |
      | de     |        |
      | pt     |        |
    And the response should contain an admin question theme among them with slug "cinema" and the following localized aliases:
      | locale | aliases       |
      | en     | Movies, Films |
      | fr     |               |
      | it     |               |
      | es     |               |
      | de     |               |
      | pt     |               |
    And the response should contain an admin question theme among them with slug "cinema" and the following localized descriptions:
      | locale | description                    |
      | en     | Theme about cinema and movies. |
      | fr     |                                |
      | it     |                                |
      | es     |                                |
      | de     |                                |
      | pt     |                                |

  Scenario: Listing all admin question themes when none exist
    When the admin retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin question themes

  Scenario: Trying to list all admin question themes without API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to list all admin question themes with invalid API key
    Given the database is populated with question themes fixture set with name "five-question-themes"
    When the admin retrieves all question themes with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
