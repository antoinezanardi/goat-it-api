@app @app-cache-policy @public
Feature: App Cache Policy

  Scenario: Preserving revalidated caching for a public game asset
    Given the client retrieves the public game asset "/public/img/logo/logo-16.avif"
    Then the request should have succeeded with status code 200
    And the response should be cached with revalidation
    And the response should provide the "etag" validator
    And the response should provide the "last-modified" validator
    And the response should not vary on the "Accept-Language" header

  Scenario: Avoiding caching for a missing public asset
    Given the client retrieves the public game asset "/public/unknown"
    Then the request should have failed with status code 404 and the response should contain the following error:
      | error     | statusCode | message                    |
      | Not Found | 404        | Cannot GET /public/unknown |
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header

  Scenario: Avoiding caching for the application reference docs JSON
    Given the client retrieves the application reference docs JSON
    Then the request should have succeeded with status code 200
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header

  Scenario: Avoiding caching for the application reference docs stylesheet
    Given the client retrieves the application reference docs stylesheet
    Then the request should have succeeded with status code 200
    And the response should not be cacheable
    And the response should vary on the "Accept-Language" header
