@app @app-request-id @public
Feature: App Request ID

  Scenario: Receiving a server-generated request ID on a successful response
    When the client retrieves the application metadata with a caller-supplied request ID
    Then the request should have succeeded with status code 200
    And the response should expose a server-generated request ID
    And the response should not echo the caller-supplied request ID

  Scenario: Receiving a request ID on an application error response
    Given the client retrieves an unknown application route
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                   |
      | Not Found | 404        | Cannot GET /unknown-route |
    And the response should expose a server-generated request ID

  Scenario: Receiving a request ID on a middleware-rejected request
    When the client retrieves the application metadata with an unsupported locale
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                                                                                  |
      | Bad Request | 400        | Invalid locale 'zz' in 'Accept-Language' header, supported locales are: en, fr, es, de, it, pt (only the first locale is considered) |
    And the response should expose a server-generated request ID
