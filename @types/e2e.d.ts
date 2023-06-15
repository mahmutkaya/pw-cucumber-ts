/* eslint-disable no-var */
import type { Browser, BrowserContext, Page } from "playwright";

declare global {
  var browser: Browser;
  var context: BrowserContext;
  var page: Page;
  var BROWSER: string;
  var BASE_URL: string;
  var BASE_ENV: string;
  var CUCUMBER_TIMEOUT: number;
  var FEATURE_BRANCH_TESTING: boolean;
  var MICRO_UI_NAME: string;
  var OVERRIDES_BRANCH: string;
}
