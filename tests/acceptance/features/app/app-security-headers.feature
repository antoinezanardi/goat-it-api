@app @app-security-headers @public
Feature: App Security Headers

  Scenario: Receiving baseline security headers on a successful application response
    Given the client retrieves the application metadata
    Then the request should have succeeded with status code 200
    And the response should contain the baseline security headers
    And the response should not expose the "X-Powered-By" header
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header

  Scenario: Receiving baseline security headers on an unknown route
    Given the client retrieves an unknown application route
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                   |
      | Not Found | 404        | Cannot GET /unknown-route |
    And the response should contain the baseline security headers
    And the response should not expose the "X-Powered-By" header
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header

  Scenario: Receiving baseline security headers on a middleware rejected request
    Given the client retrieves the application metadata with an invalid locale
    Then the request should have failed with status code 400 and the response should contain the following error:
      | error       | statusCode | message                                                                                                                              |
      | Bad Request | 400        | Invalid locale 'in' in 'Accept-Language' header, supported locales are: en, fr, es, de, it, pt (only the first locale is considered) |
    And the response should contain the baseline security headers
    And the response should not expose the "X-Powered-By" header
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header

  Scenario: Serving the application reference docs with the selected content security policy
    Given the client retrieves the application reference docs
    Then the request should have succeeded with status code 200
    And the response should contain the baseline security headers
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header

  Scenario: Receiving security headers on a CORS preflight
    When the client sends a CORS preflight request for the application metadata
    Then the request should have succeeded with status code 204
    And the response should contain the baseline security headers
    And the response should not expose the "X-Powered-By" header
    And the preflight response should have no body
    And the preflight response should keep the application CORS allow list
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header
