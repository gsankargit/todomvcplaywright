const { Given, When, Then, Before, After,setDefaultTimeout,Status  } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { chromium } = require('playwright');

const fs = require('fs');
const path = require('path');

setDefaultTimeout(90 * 1000);

let browser;
let page;

Before(async () => {
  browser = await chromium.launch({ headless: false });
  page = await browser.newPage();
});

 After(async () => {

  await browser.close();
 });



// After(async function (scenario) {
//   if (scenario.result.status === 'passed') {
//     const screenshotPath = path.join('screenshots', `${scenario.pickle.name.replace(/\s+/g, '_')}.png`);
//     await page.screenshot({ path: screenshotPath });
//   }

//   await browser.close();
// });


Given('User open the TodoMVC application', async () => {
  await page.goto('https://todomvc.com/examples/react/dist/');
});


Then('User should see the header with text {string}', async function (headerText) {
  const header = await page.locator('h1').textContent();
  expect(header.trim()).toBe(headerText);
});

Then('User verify the color of the header is {string}', async function (expectedColor) {
  const header = page.locator('h1');
  const color = await header.evaluate(el => getComputedStyle(el).color);
  expect(color).toBe(expectedColor);
});

Then('User should see the placeholder text in the input field as {string}', async function (placeholderText) {
  const input = page.locator('.new-todo');
  const actualPlaceholder = await input.getAttribute('placeholder');
  expect(actualPlaceholder).toBe(placeholderText);
});

When('User focuses on the todo input field', async function () {
  await page.locator('.new-todo').focus();
});

Then('the border color of the input field should be {string}', async function (expectedColor) {
  const input = page.locator('.new-todo');
  const borderColor = await input.evaluate(el => getComputedStyle(el).borderColor);
  expect(borderColor).toBe(expectedColor);
});

When('User look at the footer section', async function () {
  // Optionally, check that the footer is visible
  await expect(page.locator('footer')).toBeVisible();
});
Then('the first footer message should be {string}', async function (expectedMessage) {
const footerText = await page.locator('//footer//p[1]').textContent();
 expect(footerText).toBe(expectedMessage);
});

Then('the second footer message should be {string}', async function (expectedMessage) {
  const footerText = await page.locator('//footer//p[2]').textContent();
  expect(footerText).toBe(expectedMessage);
});

Then('the third footer message should be {string}', async function (expectedMessage) {
 const footerText = await page.locator('//footer//p[3]').textContent();
  expect(footerText).toBe(expectedMessage);
});

When('User add a new todo with text {string}', async (text) => {
  await page.fill('.new-todo', text);
  await page.keyboard.press('Enter');
});

Then('User should see a todo item with text {string} in the list', async (text) => {
  const labels = await page.locator('.todo-list li label').allTextContents();
  expect(labels).toContain(text);
});

Then('the new todo should not be marked as completed', async  ()=> {
  const item = await page.locator('.todo-list li');
  await expect(item).not.toHaveClass(/completed/);
});


Then('User should see that the todo list has exactly {int} item(s)', async (count)=> {
  const items = await page.locator('.todo-list li');
  await expect(items).toHaveCount(count);
});

When('User add todos with texts:', async (dataTable)=> {
  for (const row of dataTable.raw()) {
    const todo = row[0];
    await page.waitForSelector('.new-todo');
    const input = await page.locator('.new-todo');
    await input.fill(todo);
    await input.press('Enter');
  }
});

  Then('User should see todo items with texts:', async (dataTable) =>{
  const expectedTodos = [];
  const rows = dataTable.raw();
  for (let i = 0; i < rows.length; i++) {
    expectedTodos.push(rows[i][0]);
  }
  const actualTodos = await page.locator('.todo-list li label').allTextContents();
  for (let i = 0; i < expectedTodos.length; i++) {
    expect(actualTodos).toContain(expectedTodos[i]);
  }
});

When('User mark the todo {string} as completed', async (todoText) =>{
  const item = page.locator('.todo-list li').filter({ hasText: todoText });
  const checkbox = item.locator('.toggle');
  await checkbox.check();
});

Then('the todo {string} should be marked completed', async (todoText) => {
  const item = page.locator('.todo-list li').filter({ hasText: todoText });
  await expect(item).toHaveClass(/completed/);
});

When('User delete the todo {string}', async (todoText) => {
  const item = page.locator('.todo-list li').filter({ hasText: todoText });
  await item.hover();
  await item.locator('.destroy').click({ force: true });
});

Then('the todo list should not contain {string}', async (todoText) => {
  const item = page.locator('.todo-list li').filter({ hasText: todoText });
  await expect(item).toHaveCount(0);
});


When('User filter by {string}', async (filterName) => {
  await page.locator('.filters a', { hasText: filterName }).click();
});

When('User complete todos {string} and {string}', async (todo1, todo2) => {
  await page.locator('.todo-list li', { hasText: todo1 }).locator('.toggle').check();
  await page.locator('.todo-list li', { hasText: todo2 }).locator('.toggle').check();
});

When('User click {string}', async (buttonLabel) => {
  if (buttonLabel === 'Clear completed') {
    await page.locator('.clear-completed').click();
  }
});

Then('the items left count should be {int}', async (count) => {
  const countText = await page.locator('.todo-count').textContent();
expect(countText).toContain(count + ' item' + (count === 1 ? '' : 's') + ' left');
});


When('User edit the todo {string} to {string}', async function (oldText, newText) {
  const todoItem = page.locator('.todo-list li', { hasText: oldText });
  await todoItem.dblclick();
  // Wait for the edit input to appear globally
  const editInput = page.locator('.todo-list li .new-todo');
  await editInput.waitFor({ state: 'visible' });
  await editInput.fill(newText);
  await editInput.press('Enter');
});

When('User clicks the "toggle-all" checkbox', async function () {
  await page.locator('.toggle-all').click();
});

Then('all todos should be marked as {string}', async function (textValue) {
  const items = await page.locator('.todo-list li');
  const count = await items.count();
  for (let i = 0; i < count; i++) {
    const todo = items.nth(i);

    if (textValue === 'completed') {
      await expect(todo).toHaveClass(/completed/);
    }
      else {
      await expect(todo).not.toHaveClass(/completed/);
      }
  }
});

//************************ Negative test cases *******************************/

When('User try to add a todo with empty text', async function () {
  await page.fill('.new-todo', '');
  await page.keyboard.press('Enter');
});

When ('verify {string} button is disabled' , async function (textValue) {
  await expect(page.locator('.clear-completed')).toHaveAttribute('disabled', '');
  
});

Then ('verify todo {string} text line through is applied when marked completed' , async function (textValue) {
  const todoItem = page.locator('.todo-list li', { hasText: textValue });
  const isCompleted = await todoItem.getAttribute('class');
  if (isCompleted && isCompleted.includes('completed')) {
    const label = todoItem.locator('label');
    const textDecoration = await label.evaluate(el => getComputedStyle(el).textDecoration);
    expect(textDecoration).toContain('line-through');
  } else {
    throw new Error('Todo item "Cucumber" is not marked as completed.');
  }
});