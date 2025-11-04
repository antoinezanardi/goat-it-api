@app @app-docs

Feature: App Docs

  Scenario: App serves API Reference Docs
    Given the client retrieves the application reference docs
    Then the request should have succeeded with status code 200
    And the application reference docs should be returned