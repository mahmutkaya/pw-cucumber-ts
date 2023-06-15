import {
  BeforeAll,
  AfterAll,
  After,
  Before,
  Status,
  BeforeStep,
  AfterStep,
} from "@cucumber/cucumber";
import { chromium, firefox, webkit, LaunchOptions } from "@playwright/test";

const options: LaunchOptions = {
  args: ["--remote-allow-origins=*"],
  headless: true,
  slowMo: 0,
};

BeforeAll(async () => {
  console.log("starting browser");
  switch (process.env.BROWSER) {
    case "firefox":
      global.browser = await firefox.launch(options);
      break;
    case "webkit":
      global.browser = await webkit.launch(options);
      break;
    default:
      global.browser = await chromium.launch(options);
  }
});

AfterAll(async () => {
  await global.browser.close();
});

Before(async () => {
  global.context = await global.browser.newContext({ ignoreHTTPSErrors: true });
  global.page = await global.context.newPage();
});

After(async function (scenario) {
  if (scenario.result!.status === Status.FAILED) {
    const buffer = await global.page.screenshot({
      path: `test-results/screenshots/${scenario.pickle.name}.png`,
      fullPage: true,
    });
    await this.attach(buffer, "image/png");
  }
  await global.page.close();
  await global.context.close();
});
