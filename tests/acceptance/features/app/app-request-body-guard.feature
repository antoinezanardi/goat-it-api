@app @app-request-body-guard
Feature: App Request Body Guard

  Scenario: Sending a valid JSON body within the limit
    Given the database is populated with questions fixture set with name "five-questions"
    When the client searches random questions with a valid JSON body
    Then the request should have succeeded with status code 200
    And the response should contain 2 questions

  Scenario: Sending a JSON body larger than the limit
    When the client searches random questions with a JSON body larger than the limit
    Then the request should have failed with status code 413 and the response should contain the following error:
      | error             | statusCode | message                   |
      | Payload Too Large | 413        | Request body is too large |

  Scenario: Sending a form-encoded body
    When the client searches random questions with the "application/x-www-form-urlencoded" content type
    Then the request should have failed with status code 415 and the response should contain the following error:
      | error                  | statusCode | message                |
      | Unsupported Media Type | 415        | Unsupported Media Type |

  Scenario: Sending a plain text body
    When the client searches random questions with the "text/plain" content type
    Then the request should have failed with status code 415 and the response should contain the following error:
      | error                  | statusCode | message                |
      | Unsupported Media Type | 415        | Unsupported Media Type |

  Scenario: Sending an empty JSON body
    When the client searches random questions with an empty JSON body
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message              |
      | Bad Request | 400        | Invalid request body |

  Scenario: Sending a malformed JSON body
    When the client searches random questions with a malformed JSON body
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message              |
      | Bad Request | 400        | Invalid request body |

  Scenario: Sending a bodyless request without a content type
    When the client searches random questions without a body and without a content type
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                 | validationDetails |
      | Bad Request | 400        | Invalid request payload | <SET>             |
