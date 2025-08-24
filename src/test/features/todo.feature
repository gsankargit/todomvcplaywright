Feature: TodoMVC Application E2E

  @header @12345000
  Scenario: Verify header text and color
    Given User open the TodoMVC application
    Then User should see the header with text "todos"
    And User verify the color of the header is "rgb(184, 63, 69)"

  @header @12345001
  Scenario: Verify input field placeholder text
    Given User open the TodoMVC application
    Then User should see the placeholder text in the input field as "What needs to be done?"

  @header @12345002
  Scenario: Verify input field placeholder text color change on focus
    Given User open the TodoMVC application
    When User focuses on the todo input field
    Then the border color of the input field should be "rgb(17, 17, 17)"

  @footer @12345003
  Scenario: Footer displays messages in correct order
    Given User open the TodoMVC application
    Then the first footer message should be "Double-click to edit a todo"
    And the second footer message should be "Created by the TodoMVC Team"
    And the third footer message should be "Part of TodoMVC"

  @12345004 @add
  Scenario: Add a new todos
    Given User open the TodoMVC application
    When User add a new todo with text "Playwright"
    Then User should see a todo item with text "Playwright" in the list
    And the new todo should not be marked as completed

  @12345005 @add
  Scenario: Add multiple todos
    Given User open the TodoMVC application
    When User add a new todo with text "Playwright"
    Then User should see a todo item with text "Playwright" in the list
    And User should see that the todo list has exactly 1 item
    When User add a new todo with text "Cucumber"
    Then User should see a todo item with text "Cucumber" in the list
    And User should see that the todo list has exactly 2 items

  @12345006 @add
  Scenario: Add multiple todos
    Given User open the TodoMVC application
    When User add todos with texts:
      | Playwright |
      | Cucumber   |
      | JavaScript |
      | TypeScript |
      | NodeJS     |
    Then User should see that the todo list has exactly 5 items
    And User should see todo items with texts:
      | Playwright |
      | Cucumber   |
      | TypeScript |
      | JavaScript |
      | NodeJS     |

  @edit @12345007
  Scenario: Edit a todo
    Given User open the TodoMVC application
    When User add a new todo with text "JavaScript"
    Then User should see a todo item with text "JavaScript" in the list
    When User edit the todo "JavaScript" to "TypeScript"
    Then User should see a todo item with text "TypeScript" in the list
    And the todo list should not contain "JavaScript"

  @complete @12345008
  Scenario: Mark a todo as completed
    Given User open the TodoMVC application
    When User add a new todo with text "Playwright"
    And User should see that the todo list has exactly 1 item
    When User mark the todo "Playwright" as completed
    Then the todo "Playwright" should be marked completed

  @delete @12345009
  Scenario: Delete a todo
    Given User open the TodoMVC application
    When User add a new todo with text "Cucumber"
    Then User delete the todo "Cucumber"
    And the todo list should not contain "Cucumber"

  @filter @12345010
  Scenario: Filter active todos
    Given User open the TodoMVC application
    When User add todos with texts:
      | Playwright |
      | Cucumber   |
    When User mark the todo "Cucumber" as completed
    Then the todo "Cucumber" should be marked completed
    When User filter by "Active"
    Then User should see a todo item with text "Playwright" in the list
    And User should see that the todo list has exactly 1 item
    And the todo list should not contain "Cucumber"

  @filter @12345011
  Scenario: Verify line-through style on completed todo
    Given User open the TodoMVC application
    When User add todos with texts:
      | Playwright |
      | Cucumber   |
    When User mark the todo "Cucumber" as completed
    Then the todo "Cucumber" should be marked completed
    And verify todo "Cucumber" text line through is applied when marked completed

  @clearCompleted @12345012
  Scenario: Clear all completed todos
    Given User open the TodoMVC application
    When User add todos with texts:
      | JavaScript |
      | Cucumber   |
      | TypeScript |
      | NodeJS     |
    Then the items left count should be 4
    When User filter by "All"
    Then User should see todo items with texts:
      | JavaScript |
      | TypeScript |
      | NodeJS     |
      | Cucumber   |
    And the items left count should be 4
    When User complete todos "JavaScript" and "TypeScript"
    Then the todo "JavaScript" should be marked completed
    And the todo "TypeScript" should be marked completed
    When User filter by "Completed"
    Then User should see todo items with texts:
      | JavaScript |
      | TypeScript |
    And the items left count should be 2
    When User filter by "Active"
    Then User should see todo items with texts:
      | NodeJS   |
      | Cucumber |
    And the items left count should be 2
    When User click "Clear completed"
    Then User should see todo items with texts:
      | NodeJS   |
      | Cucumber |
    And the items left count should be 2

  @12345013 @toggleAll
  Scenario: Verify toggle-all marks all todos as completed
    Given User open the TodoMVC application
    When User add todos with texts:
      | Playwright |
      | Cucumber   |
      | JavaScript |
      | TypeScript |
      | NodeJS     |
    And User clicks the "toggle-all" checkbox
    Then all todos should be marked as "completed"
    And the items left count should be 0
    And User clicks the "toggle-all" checkbox
    Then all todos should be marked as "Not completed"
    And the items left count should be 5
#************************* Negative Test Case  ******************************/ 

  @invalidAdd @12345014
  Scenario: Add an empty todo
    Given User open the TodoMVC application
    When User try to add a todo with empty text
    And the todo list should not contain " "

  @12345015 @add
  Scenario: Add a new todos with less than 2 characters
    Given User open the TodoMVC application
    When User add a new todo with text "P"
    And the todo list should not contain "P"
    When User add a new todo with text "Pl"
    Then User should see a todo item with text "Pl" in the list

  @12345016 @clearCompleted
  Scenario: Verify Clear completed button is disabled when no todos are completed
    Given User open the TodoMVC application
    When User add a new todo with text "Java"
    Then User should see a todo item with text "Java" in the list
    When verify "Clear completed" button is disabled
