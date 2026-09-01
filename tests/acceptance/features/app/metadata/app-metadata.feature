@app @app-metadata
Feature: App Metadata

  Scenario: Retrieving app metadata
    Given the client retrieves the application metadata
    Then the request should have succeeded with status code 200
    And the application metadata should be returned