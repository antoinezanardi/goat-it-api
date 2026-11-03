@app @app-health
Feature: App Health

  Scenario: Checking application health
    Given the client retrieves the application health
    Then the request should have succeeded with status code 200
    And the application health response should not be cached
    And the application good health should be returned

  Scenario: Checking application health with a HEAD request
    Given the client checks the application health using a HEAD request
    Then the request should have succeeded with status code 200
    And the application health response should not be cached