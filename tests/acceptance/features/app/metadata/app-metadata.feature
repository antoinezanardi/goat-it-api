@app @app-metadata

Feature: App Metadata

  Scenario: App responds with correct metadata
    Given I retrieve the application metadata
    Then the request should have succeeded with status code 200
    And the application metadata should be returned