@app @app-health

Feature: App Health

  Scenario: App responds with correct metadata
    Given the client retrieves the application health
    Then the request should have succeeded with status code 200
    And the application good health should be returned