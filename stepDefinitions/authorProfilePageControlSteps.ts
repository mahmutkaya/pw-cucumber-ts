/* eslint-disable @typescript-eslint/no-unused-expressions */
import { DataTable, Given, Then, When } from '@cucumber/cucumber';
import { expect } from 'chai';
import { Response } from 'playwright';

import { getNewPageTitle, saveNewPageSession } from '@scopus/e2e-utils';

import { AuthorProfilePageControlPage, locators } from '../pages/AuthorProfilePageControlPage';

const authorProfilePage = new AuthorProfilePageControlPage();
let response: Response;

Given('I navigate to the details page of author with {string} id', async (authorId: string) => {
  await authorProfilePage.navigate(authorId);
});

Given(
  'I navigate to the details page of author with {string} id on experiment {string}',
  async (authorId: string, extraSearchParams: string) => {
    await authorProfilePage.navigateExperiment(authorId, extraSearchParams);
  },
);

Then('I verify the text {string} is shown in the author details card', async (expectedText: string) => {
  const actualText = await authorProfilePage.getAuthorGeneralDetailsCard();
  expect(actualText, `${expectedText} has not found in author general details`).to.contain(expectedText);
});

Then(/^I verify that "([^"]*)" is the author\'s affiliation$/, async (expecteAffiliationName: string) => {
  const actualTexts: string[] = await authorProfilePage.getAffiliationsTexts();
  expect(actualTexts, `${expecteAffiliationName} is not author's default affiliation`).to.contain(
    expecteAffiliationName,
  );
});

When('I click on "Learn more" link in author general details section', async () => {
  //clicking 'learn more' link opens a new page, so storing new page session to the newPage var. for further step(s)
  await saveNewPageSession(locators.authorGeneralDetailsCardLearnMoreLink);
});

When(/^I click on "Is this you\?" link$/, async () => {
  //clicking 'Is this you?' link opens a new page, so storing new page session to the newPage var. for further step(s)
  await saveNewPageSession(locators.isThisYouLink);
});

Then('I verify new page is displayed with {string} title', async (expectedTitle: string) => {
  const actualTitle = await getNewPageTitle();
  expect(actualTitle, `A page with ${expectedTitle} has not been found`).to.contain(expectedTitle);
});

When('I click on "Affiliation" link in author details', async () => {
  await global.page.click(locators.affiliationLinks);
});

Then('I verify that more items from the affiliation history are displayed', async () => {
  await global.page.waitForSelector(locators.institutionHistory);
  const numberOfAffiliations = (await global.page.$$(locators.affiliationLinks)).length;
  expect(numberOfAffiliations, `No more affiliations has been found`).to.greaterThan(1);
});

Then('I verify {string} page is displayed', async (expectedTitle: string) => {
  const actualTitle = await global.page.title();
  expect(actualTitle, `A page with ${expectedTitle} has not been found`).to.contain(expectedTitle);
});

When('I click on {string} tab in author profile page', async (tabName: string) => {
  const tabSelectorById = `#${tabName}`;
  await global.page.click(tabSelectorById);
});

Then(
  'I verify that the {string} tab panel contains the text {string}',
  async (tabPanelName: string, expectedTabPanelText: string) => {
    const tabPanelSelectorById = `#${tabPanelName}-panel`;
    const actualTabPanelText = await (await global.page.waitForSelector(tabPanelSelectorById)).innerText();

    expect(
      actualTabPanelText,
      `'${expectedTabPanelText}' has not been found in '${tabPanelName}' tab panel`,
    ).to.contains(expectedTabPanelText);
  },
);

Then('I verify that the author name is {string}', async (expectedAuthorName: string) => {
  const actualAuthorName = await global.page.innerText(locators.authorName);
  expect(actualAuthorName, `${expectedAuthorName} is not matching with ${actualAuthorName}`).to.equal(
    expectedAuthorName,
  );
});

Then('I verify that the author id is {string}', async (expectedAuthorId: string) => {
  const actualAuthorId = await global.page.innerText(locators.authorId);
  expect(actualAuthorId, `${expectedAuthorId} is not author's id`).to.equal(expectedAuthorId);
});

Then('I verify that the subject {string} is among the subject areas', async (expectedAuthorSubject: string) => {
  const actualAuthorSubjects = await global.page.innerText(locators.authorSubjects);
  expect(actualAuthorSubjects, `${expectedAuthorSubject} is not author's id`).to.contain(expectedAuthorSubject);
});

When('I click on {string} link in the results', async (linkName: string) => {
  await authorProfilePage.clickLinkinTabResultList(linkName);
});

When('I select {string} option in the results', async (option: string) => {
  await authorProfilePage.selectOptionInSortResultListDropdown(option);
});

Then('I verify {string} is the page header', async (expectedPageHeader: string) => {
  const actualPageHeader = await global.page.innerText(locators.pageHeader);
  expect(actualPageHeader, `${expectedPageHeader} is not the header of displayed page`).to.contain(expectedPageHeader);
});

Given(
  'I navigate to the details page of author with {string} id and {string} tab',
  async (authorId: string, tab: string) => {
    await authorProfilePage.navigate(authorId, tab);
  },
);

When('I click on {string} sub tab in author profile page', async (subTabName: string) => {
  const subtabSelectorById = `input#pill-documents-${subTabName}`;
  await global.page.click(subtabSelectorById);
  await global.page.waitForLoadState();
});

Then('I verify that {string} sub tab is loaded', async (subTab: string) => {
  const isVisible = await authorProfilePage.isSubTabElementLoaded(subTab);
  expect(isVisible, `${subTab} tab is not loaded`).to.be.not.null;
});

Then('I verify that the abstract dropdown is {string}', async (dropdownState: string) => {
  const ariaExpanded: string | null = await authorProfilePage.getAriaExpandedAttrOfAbstractButton();

  const isExpanded: string = dropdownState === 'expanded' ? 'true' : 'false';
  expect(ariaExpanded, `abstract dropdown is not ${dropdownState}`).equals(isExpanded);
});

Then('I verify that the abstract content is {string}', async (contentState: string) => {
  const abstractContentClass: string | null = await authorProfilePage.getClassdAttrOfAbstractContent();

  if (contentState === 'hidden') {
    expect(abstractContentClass, 'abstract content is visible').contains(contentState);
  } else {
    expect(abstractContentClass, 'abstract content is hidden').to.not.contains(contentState);
  }
});

When('I click on {string} button', async (buttonText: string) => {
  await global.page.click(locators.buttonHasText(buttonText));
  await global.page.waitForLoadState('domcontentloaded');
});

When('I click on {string} link in the side menu', async (linkText: string) => {
  const linkTextMatcher = new RegExp(linkText, 'i');
  await global.page
    .getByRole('link', {
      name: linkTextMatcher,
    })
    .click();
  await global.page.waitForLoadState();
});

Then('I verify that {string} message is displayed', async (expectedMessage: string) => {
  await global.page.waitForSelector(locators.messageContainer);
  const actualMessage: string = await global.page.innerText(locators.messageContainer);
  expect(actualMessage, `${expectedMessage} message is not displayed`).to.contains(expectedMessage);
});

Then('I verify Cited By count is NOT a link for ZERO citations', async () => {
  const isCitedCountClickable: boolean = await authorProfilePage.isCitedCountInDocPanelClickable();
  expect(isCitedCountClickable, 'Cited By count is clickable for ZERO citations').to.be.false;
});

When('I save the api response for {string} tab', async (tab: string) => {
  [response] = await authorProfilePage.getApiResponseForTab(tab);
});

Then('I verify that max 5 author names are displayed in each results', async () => {
  const authorList = await global.page.locator(locators.authorList).all();
  for (const authors of authorList) {
    const countAuthor = await authors.locator('a').count();
    expect(countAuthor, 'There are more than 5 author in a row').to.be.lessThanOrEqual(5);
  }
});

Then('I verify that last two names are seperated by three dots if more than 5 authors exist', async () => {
  const authorListsFromUi = await global.page.locator(locators.authorList).all();
  await response.json().then(async (resData) => {
    for (const authorList of authorListsFromUi) {
      const i = authorListsFromUi.indexOf(authorList);
      if (resData.items[i].totalAuthors > 5) {
        const authorNames = await authorList.innerText();
        expect(authorNames.trim(), 'Last two names are not seperated by three dots').to.contains(', ...');
      }
    }
  });
});

Then(
  'I verify the authors {string} displayed with the document {string}',
  async (expectedAuthors: string, documentName: string) => {
    const actualAuthors: string = await authorProfilePage.getAuthorByDocumentsFromResultsList(documentName);
    expect(actualAuthors.replace(/(\r\n|\n|\r)/gm, ''), `Authors not found for ${documentName} document`).equals(
      expectedAuthors,
    );
  },
);

Then('I save the list with {string} name in author details page', async (listName: string) => {
  await authorProfilePage.saveList(listName);
});

When('I click on {string} link in author details page', async (linkText: string) => {
  await (await global.page.waitForSelector(locators.linkHasText(linkText))).click();
});

When('I delete {string} the list in list overview page', async (listName: string) => {
  await authorProfilePage.deleteList(listName);
});

Then(
  'I verify that the notification title of {string} tab is {string}',
  async (tabName: string, expectedTitle: string) => {
    const actualTitle: string = await authorProfilePage.getTabDetailsTitle(tabName);
    expect(actualTitle, `${tabName} doesn't have the title: ${expectedTitle}`).to.equals(expectedTitle);
  },
);

Then(
  'I verify that the notification text of {string} tab is {string}',
  async (tabName: string, expectedDescription: string) => {
    const actualDescription: string = await authorProfilePage.getTabDetailsDescription(tabName);
    expect(actualDescription, `${tabName} doesn't have the description: ${expectedDescription}`).to.equals(
      expectedDescription,
    );
  },
);

Then('I verify that {string} is displayed for empty results', async (expectedMessage: string) => {
  const actualMessage = await global.page.locator(locators.emptyResults).innerText();
  expect(actualMessage, 'Results are not empty').to.equals(expectedMessage);
});

Then('I verify that the author toolbar is in {string} mode', async (toolbarMode: string) => {
  const toolbarClass = await authorProfilePage.getAuthorToolbarClass();
  expect(toolbarClass, `Author toolbar is not in ${toolbarMode} mode`).to.contains(toolbarMode);
});

When('I scroll down to the bottom of the page', async () => {
  await global.page.keyboard.down('End');
});

Then('I verify that the author toolbar has following elements:', (toolbarElementsDt: DataTable) => {
  toolbarElementsDt.raw()[0].map(async (toolbarElement: string) => {
    const countToolbarElement = await authorProfilePage.getAuthorToolbarElement(toolbarElement).count();
    expect(countToolbarElement, `'${toolbarElement}' element is not in author toolbar`).to.greaterThan(0);
  });
});

Then('I enable preview mode', async () => {
  await global.page.addInitScript(() => {
    document.addEventListener('DOMContentLoaded', () => {
      // @ts-ignore
      window.ScopusUser.isSubscribed = false;
    });
  });
  await global.page.reload();
  await global.page.waitForLoadState('networkidle');
});

Then('I verify that More dropdown has following options in author toolbar:', async (optionsDt: DataTable) => {
  await global.page.locator(locators.moreActionsButton).click();
  optionsDt.raw()[0].map(async (option) => {
    const countOptionElement = await authorProfilePage.getMoreDropdownOption(option).count();
    expect(countOptionElement, `'${option}' option is not in more-actions dropdown`).to.greaterThan(0);
  });
});
