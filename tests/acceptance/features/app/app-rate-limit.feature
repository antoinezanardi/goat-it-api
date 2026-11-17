@app @app-rate-limit @public
Feature: App Rate Limit

  Scenario: Receiving both rate-limit tiers on a business response
    When the client sends an authenticated business request
    Then the request should have succeeded with status code 200
    And the response should expose the default rate-limit headers
    And the response should expose the sustained rate-limit headers
    And the rate-limit resets should be expressed in seconds

  @rate-limit-429
  Scenario: Exhausting the API-wide budget while probes stay available
    When the client sends a business request to the "questions" handler without an API key
    And the client sends a business request to the "question-themes" handler without an API key
    And the client sends a business request to the "questions" handler without an API key
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