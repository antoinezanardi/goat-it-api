@question @list-questions @admin

Feature: List Questions as Admin
  In order to display questions to back office users
  As an admin API client
  I want to be able to retrieve all questions for administration purposes

  Scenario: Listing all admin questions returns localized data for all supported locales
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions
    Then the request should have succeeded with status code 200
    And the response should contain 5 admin questions
    And the response should contain the following admin questions:
      | id                       | cognitiveDifficulty | status   | sourceUrls                                                                                                  |
      | a1b2c3d4e5f6012345678901 | medium              | active   | https://en.wikipedia.org/wiki/Psycho_(1960_film)                                                            |
      | b2c3d4e5f6a7012345678902 | hard                | pending  | https://en.wikipedia.org/wiki/The_Dark_Side_of_the_Moon                                                     |
      | c3d4e5f6a7b8012345678903 | easy                | active   | https://en.wikipedia.org/wiki/2018_FIFA_World_Cup                                                           |
      | d4e5f6a7b8c9012345678904 | medium              | rejected | https://en.wikipedia.org/wiki/George_Washington                                                             |
      | efd39a4ac3bdfd03d2f8cdf1 | easy                | archived | https://www.nationalgeographic.com/animals/article/elephants-bees-fear-wildlife-conservation-africa-science |

    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following question statement:
      | locale | statement                                                    |
      | en     | Which director is known for the movie 'Psycho' (1960)?       |
      | fr     | Quel réalisateur est connu pour le film 'Psychose' (1960)?   |
      | it     | Quale regista è noto per il film 'Psycho' (1960)?            |
      | es     | ¿Qué director es conocido por la película 'Psicosis' (1960)? |
      | de     | Welcher Regisseur ist für den Film 'Psycho' (1960) bekannt?  |
      | pt     | Qual diretor é conhecido pelo filme 'Psicose' (1960)?        |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following question answer:
      | locale | answer           |
      | en     | Alfred Hitchcock |
      | fr     | Alfred Hitchcock |
      | it     | Alfred Hitchcock |
      | es     | Alfred Hitchcock |
      | de     | Alfred Hitchcock |
      | pt     | Alfred Hitchcock |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following question context:
      | locale | context                                                                                                                        |
      | en     | Alfred Hitchcock directed the 1960 psychological horror film 'Psycho', which became one of his most famous works.              |
      | fr     | Alfred Hitchcock a réalisé le film d'horreur psychologique 'Psychose' en 1960, devenu l'une de ses œuvres les plus célèbres.   |
      | it     | Alfred Hitchcock ha diretto il film horror psicologico 'Psycho' del 1960, che è diventato una delle sue opere più famose.      |
      | es     | Alfred Hitchcock dirigió la película de terror psicológico 'Psycho' en 1960, que se convirtió en una de sus obras más famosas. |
      | de     | Alfred Hitchcock inszenierte den psychologischen Horrorfilm 'Psycho' (1960), der zu einem seiner berühmtesten Werke wurde.     |
      | pt     | Alfred Hitchcock dirigiu o filme de horror psicológico 'Psycho' em 1960, que se tornou uma de suas obras mais famosas.         |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following trivia for locale "en":
      | trivia                                                               |
      | 'Psycho' is famous for its shower scene, scored by Bernard Herrmann. |
      | The film is based on the novel 'Psycho' by Robert Bloch.             |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following trivia for locale "fr":
      | trivia                                                                         |
      | 'Psychose' est célèbre pour sa scène de douche, composée par Bernard Herrmann. |
      | Le film est adapté du roman 'Psycho' de Robert Bloch.                          |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following trivia for locale "it":
      | trivia                                                                     |
      | 'Psycho' è famoso per la scena della doccia, musicata da Bernard Herrmann. |
      | Il film è tratto dal romanzo 'Psycho' di Robert Bloch.                     |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following trivia for locale "es":
      | trivia                                                                           |
      | 'Psycho' es famoso por su escena de la ducha, musicalizada por Bernard Herrmann. |
      | La película está basada en la novela 'Psycho' de Robert Bloch.                   |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following trivia for locale "de":
      | trivia                                                                             |
      | 'Psycho' ist berühmt für seine Duschszene, die von Bernard Herrmann vertont wurde. |
      | Der Film basiert auf dem Roman 'Psycho' von Robert Bloch.                          |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following trivia for locale "pt":
      | trivia                                                                             |
      | 'Psycho' é famoso por sua cena do chuveiro, com trilha sonora de Bernard Herrmann. |
      | O filme é baseado no romance 'Psycho' de Robert Bloch.                             |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following themes:
      | slug   | isPrimary | isHint |
      | cinema | true      | false  |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the question theme with slug "cinema" with the following label:
      | locale | label  |
      | en     | Cinema |
      | fr     | Cinéma |
      | it     | Cinema |
      | es     | Cine   |
      | de     | Kino   |
      | pt     | Cinema |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" and the following author:
      | role  | name            | gameId |
      | admin | Antoine ZANARDI |        |
    And the response should contain an admin question among them with id "a1b2c3d4e5f6012345678901" but without rejection

    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following question statement:
      | locale | statement                                                          |
      | en     | Which band released the album 'Dark Side of the Moon'?             |
      | fr     | Quel groupe a sorti l'album 'Dark Side of the Moon'?               |
      | it     | Quale band ha pubblicato l'album 'The Dark Side of the Moon'?      |
      | es     | ¿Qué banda lanzó el álbum 'The Dark Side of the Moon'?             |
      | de     | Welche Band veröffentlichte das Album 'The Dark Side of the Moon'? |
      | pt     | Qual banda lançou o álbum 'The Dark Side of the Moon'?             |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following question answer:
      | locale | answer     |
      | en     | Pink Floyd |
      | fr     | Pink Floyd |
      | it     | Pink Floyd |
      | es     | Pink Floyd |
      | de     | Pink Floyd |
      | pt     | Pink Floyd |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following question context:
      | locale | context                                                                                                           |
      | en     | 'The Dark Side of the Moon' is a 1973 album by Pink Floyd, noted for its progressive rock elements.               |
      | fr     | 'The Dark Side of the Moon' est un album de 1973 de Pink Floyd, connu pour ses éléments de rock progressif.       |
      | it     | 'The Dark Side of the Moon' è un album del 1973 dei Pink Floyd, noto per i suoi elementi di rock progressivo.     |
      | pt     | 'The Dark Side of the Moon' é um álbum de 1973 do Pink Floyd, conhecido por seus elementos de rock progressivo.   |
      | es     | 'The Dark Side of the Moon' es un álbum de 1973 de Pink Floyd, conocido por sus elementos de rock progresivo.     |
      | de     | 'The Dark Side of the Moon' ist ein 1973er Album von Pink Floyd, bekannt für seine Elemente des Progressive Rock. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following trivia for locale "en":
      | trivia                                                                          |
      | The album stayed on the Billboard charts for a record-breaking number of weeks. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following trivia for locale "fr":
      | trivia                                                                            |
      | L'album est resté dans les charts Billboard pendant un nombre record de semaines. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following trivia for locale "it":
      | trivia                                                                           |
      | L'album è rimasto nelle classifiche Billboard per un numero record di settimane. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following trivia for locale "es":
      | trivia                                                                              |
      | El álbum se mantuvo en las listas de Billboard durante un número récord de semanas. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following trivia for locale "de":
      | trivia                                                               |
      | Das Album hielt sich rekordverdächtig lange in den Billboard-Charts. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following trivia for locale "pt":
      | trivia                                                                        |
      | O álbum permaneceu nas paradas da Billboard por um número recorde de semanas. |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following themes:
      | slug  | isPrimary | isHint |
      | music | true      | false  |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the question theme with slug "music" with the following label:
      | locale | label   |
      | en     | Music   |
      | fr     | Musique |
      | it     | Musica  |
      | es     | Música  |
      | de     | Musik   |
      | pt     | Música  |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" and the following author:
      | role | name     | gameId |
      | ai   | Music AI |        |
    And the response should contain an admin question among them with id "b2c3d4e5f6a7012345678902" but without rejection

    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" and the following question statement:
      | locale | statement                                                  |
      | en     | Which country won the FIFA World Cup in 2018?              |
      | fr     | Quel pays a remporté la Coupe du Monde de la FIFA en 2018? |
      | it     | Quale paese ha vinto la Coppa del Mondo FIFA nel 2018?     |
      | es     | ¿Qué país ganó la Copa Mundial de la FIFA en 2018?         |
      | de     | Welches Land gewann die FIFA-Weltmeisterschaft 2018?       |
      | pt     | Qual país venceu a Copa do Mundo da FIFA em 2018?          |
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" and the following question answer:
      | locale | answer     |
      | en     | France     |
      | fr     | France     |
      | it     | Francia    |
      | es     | Francia    |
      | de     | Frankreich |
      | pt     | França     |
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" but without context
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" but without trivia
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" and the following themes:
      | slug   | isPrimary | isHint |
      | sports | false     | true   |
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" and the question theme with slug "sports" with the following label:
      | locale | label    |
      | en     | Sports   |
      | fr     | Sport    |
      | it     | Sport    |
      | es     | Deportes |
      | de     | Sport    |
      | pt     | Esportes |
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" and the following author:
      | role | name | gameId                   |
      | game |      | 32dafb5cfb677b53d1f7b60d |
    And the response should contain an admin question among them with id "c3d4e5f6a7b8012345678903" but without rejection

    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following question statement:
      | locale | statement                                              |
      | en     | Who was the first President of the United States?      |
      | fr     | Qui a été le premier président des États-Unis?         |
      | it     | Chi è stato il primo Presidente degli Stati Uniti?     |
      | es     | ¿Quién fue el primer Presidente de los Estados Unidos? |
      | de     | Wer war der erste Präsident der Vereinigten Staaten?   |
      | pt     | Quem foi o primeiro Presidente dos Estados Unidos?     |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following question answer:
      | locale | answer            |
      | en     | George Washington |
      | fr     | George Washington |
      | it     | George Washington |
      | es     | George Washington |
      | de     | George Washington |
      | pt     | George Washington |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following question context:
      | locale | context                                                                                        |
      | en     | George Washington served as the first President of the United States from 1789 to 1797.        |
      | fr     | George Washington a été le premier président des États-Unis de 1789 à 1797.                    |
      | it     | George Washington è stato il primo Presidente degli Stati Uniti dal 1789 al 1797.              |
      | pt     | George Washington serviu como o primeiro Presidente dos Estados Unidos de 1789 a 1797.         |
      | es     | George Washington se desempeñó como el primer Presidente de los Estados Unidos de 1789 a 1797. |
      | de     | George Washington war von 1789 bis 1797 der erste Präsident der Vereinigten Staaten.           |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following trivia for locale "en":
      | trivia                                                  |
      | Washington is often called the 'Father of His Country'. |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following trivia for locale "fr":
      | trivia                                               |
      | Washington est souvent appelé le 'Père de son pays'. |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following trivia for locale "it":
      | trivia                                                     |
      | Washington è spesso chiamato il 'Padre della sua Nazione'. |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following trivia for locale "es":
      | trivia                                                |
      | Washington es a menudo llamado el 'Padre de su País'. |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following trivia for locale "de":
      | trivia                                                 |
      | Washington wird oft der 'Vater seines Landes' genannt. |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following trivia for locale "pt":
      | trivia                                                      |
      | Washington é frequentemente chamado de 'Pai de sua Pátria'. |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following themes:
      | slug    | isPrimary | isHint |
      | science | false     | true   |
      | history | true      | false  |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the question theme with slug "science" with the following label:
      | locale | label        |
      | en     | Science      |
      | fr     | Science      |
      | it     | Scienza      |
      | es     | Ciencia      |
      | de     | Wissenschaft |
      | pt     | Ciência      |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the question theme with slug "history" with the following label:
      | locale | label      |
      | en     | History    |
      | fr     | Histoire   |
      | it     | Storia     |
      | es     | Historia   |
      | de     | Geschichte |
      | pt     | História   |
    And the response should contain an admin question among them with id "d4e5f6a7b8c9012345678904" and the following rejection:
      | type                  | comment                                                          |
      | incorrect-information | Second theme assignment is not relevant to the question content. |

    And the response should contain an admin question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following question statement:
      | locale | statement                                   |
      | en     | Of which animal is the elephant phobic?     |
      | fr     | De quel animal l'éléphant est-il phobique ? |
      | it     | Di quale animale ha paura l'elefante?       |
      | es     | ¿De qué animal es fóbico el elefante?       |
      | de     | Vor welchem Tier hat der Elefant Angst?     |
      | pt     | De qual animal o elefante tem fobia?        |
    And the response should contain an admin question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following question answer:
      | locale | answer       |
      | en     | Bees         |
      | fr     | Les abeilles |
      | it     | Le api       |
      | es     | Abejas       |
      | de     | Bienen       |
      | pt     | Abelhas      |
    And the response should contain an admin question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following question context:
      | locale | context                                                                                                                                                                                                                                                            |
      | en     | Elephants are not widely known for their fear of bees, which may seem surprising given their imposing size. However, this phobia is well documented, and elephants often avoid areas where bees are present.                                                       |
      | fr     | Les éléphants ne sont pas vraiment connus pour leur peur des abeilles, ce qui peut sembler surprenant compte tenu de leur taille imposante. Cependant, cette phobie est bien documentée et les éléphants évitent souvent les zones où les abeilles sont présentes. |
      | it     | Gli elefanti non sono ampiamente conosciuti per la loro paura delle api, il che può sembrare sorprendente data la loro imponente dimensione. Tuttavia, questa fobia è ben documentata e gli elefanti evitano spesso le aree dove sono presenti le api.             |
      | pt     | Os elefantes não são amplamente conhecidos por seu medo de abelhas, o que pode parecer surpreendente dado o seu tamanho imponente. No entanto, essa fobia é bem documentada, e os elefantes frequentemente evitam áreas onde as abelhas estão presentes.           |
      | es     | Los elefantes no son ampliamente conocidos por su miedo a las abejas, lo que puede parecer sorprendente dada su imponente tamaño. Sin embargo, esta fobia está bien documentada y los elefantes a menudo evitan las áreas donde hay abejas.                        |
      | de     | Elefanten sind nicht allgemein für ihre Angst vor Bienen bekannt, was angesichts ihrer imposanten Größe überraschend erscheinen mag. Diese Phobie ist jedoch gut dokumentiert, und Elefanten meiden oft Gebiete, in denen Bienen vorhanden sind.                   |
    And the response should contain an admin question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following trivia for locale "en":
      | trivia                                                                                                                                |
      | Bees are used by some wildlife rangers to protect elephants from poachers, as elephants naturally avoid areas where bees are present. |
    And the response should contain an admin question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the following themes:
      | slug    | isPrimary | isHint |
      | science | true      | false  |
    And the response should contain an admin question among them with id "efd39a4ac3bdfd03d2f8cdf1" and the question theme with slug "science" with the following label:
      | locale | label        |
      | en     | Science      |
      | fr     | Science      |
      | it     | Scienza      |
      | es     | Ciencia      |
      | de     | Wissenschaft |
      | pt     | Ciência      |

  Scenario: Listing all admin questions when none exist
    When the admin retrieves all questions
    Then the request should have succeeded with status code 200
    And the response should contain 0 admin questions

  Scenario: Trying to list all admin questions without API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions without an API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message                    |
      | Unauthorized | 401        | Missing API key in headers |

  Scenario: Trying to list all admin questions with invalid API key
    Given the database is populated with questions fixture set with name "five-questions"
    When the admin retrieves all questions with an invalid API key
    Then the request should have failed with status code 401 and the response should contain the following error:
      | error        | statusCode | message         |
      | Unauthorized | 401        | Invalid API key |
