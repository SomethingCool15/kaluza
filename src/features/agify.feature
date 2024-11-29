Feature: Agify API

  Background:
    Given the API endpoint is available

  Scenario Outline: Get age estimation for various names
    When I request the age for the name "<name>"
    Then the response should be successful
    And the age should be a number
    And the response should include a valid count

    Examples:
      | name     |
      | John     |
      | Jane     |
      | José     |

  Scenario: Handle empty name parameter
    When I request the age for the name ""
    Then the response should indicate an error

  Scenario: Handle long name parameter
    When I request the age for the name "a" repeated 1000 times
    Then the response should indicate an error

  Scenario: Measure response time for a valid name
    When I request the age for the name "Alice"
    Then the response should be successful
    And the response time should be less than 400ms

  Scenario: Handle numeric name parameter
    When I request the age for the name "12345"
    Then the response should indicate an error

  Scenario: Test caching behavior for repeated requests
    When I request the age for the name "John" twice
    Then the second response time should be less than the first