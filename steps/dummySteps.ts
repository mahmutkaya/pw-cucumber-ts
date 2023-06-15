import { Given } from "@cucumber/cucumber";

Given('I am on the home page', async () => {
    await global.page.goto(global.BASE_URL);
    await global.page.pause();
});