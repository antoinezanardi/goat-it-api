@app @app-rate-limit @public
Feature: App Rate Limit

  Scenario: Receiving both rate-limit tiers on a business response
    When the client retrieves all question themes
    Then the request should have succeeded with status code 200
    And the response should expose the default rate-limit headers
    And the response should expose the sustained rate-limit headers
    And the rate-limit resets should be expressed in seconds

  @rate-limit-429
  Scenario: Exhausting the API-wide budget while probes stay available
    When the client retrieves all questions without an API key
    And the client retrieves all question themes without an API key
    And the client retrieves all questions without an API key
    Then the request should have failed with status code 429 and the response should contain the following error:
      | error             | statusCode | message           | errorCode         |
      | Too Many Requests | 429        | Too many requests | too-many-requests |
    And the response should contain a plain "Retry-After" header in seconds
    And the response should not be cacheable
    And the client retrieves the application metadata
    And the request should have succeeded with status code 200
    And the response should not expose any rate-limit headers
    And the client retrieves the application health
    And the request should have succeeded with status code 200
    And the response should not expose any rate-limit headers
    And the client checks the application health using a HEAD request
    And the request should have succeeded with status code 200
    And the response should not expose any rate-limit headers

  @rate-limit-429
  Scenario: Keeping forwarded client budgets separate behind the trusted proxy
    When the client retrieves all questions from the first forwarded client IP
    And the client retrieves all questions from the first forwarded client IP
    And the client retrieves all questions from the first forwarded client IP
    Then the request should have failed with status code 429 and the response should contain the following error:
      | error             | statusCode | message           | errorCode         |
      | Too Many Requests | 429        | Too many requests | too-many-requests |
    And the response should contain a plain "Retry-After" header in seconds
    And the client retrieves all questions from the second forwarded client IP
    And the request should have succeeded with status code 200
    And the response should expose a fresh default rate-limit budget