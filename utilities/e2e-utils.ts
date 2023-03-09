import { Page } from 'playwright';

export enum ElementAttribute {
  CLASS = 'class',
  ARIA_EXPANDED = 'aria-expanded',
}

let newPage: Page;

export async function saveNewPageSession(element: string) {
  // @ts-ignore
  [newPage] = await Promise.all([context.waitForEvent('page'), global.page.click(element)]);
  await newPage.waitForLoadState('domcontentloaded');
  return newPage;
}

export async function getNewPageTitle(): Promise<string> {
  return newPage.title();
}

export async function getNewPageURL(): Promise<string> {
  await newPage.waitForLoadState();
  return newPage.url();
}

export async function calculateDataTableLength(table: any) {
  const dataTableLength = await table.hashes().length;
  return dataTableLength;
}
