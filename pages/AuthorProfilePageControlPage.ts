import { ElementHandle, Locator } from '@playwright/test';

import { ElementAttribute } from '@scopus/e2e-utils';

const authorGeneralDetailsCard = '[id*="general-information-content"]';

export const locators: any = {
  abstractContent: 'section[class*="collapsible-panel"]',
  addAuthorToListButton: '#AuthorProfile_AddToAuthorListLink',
  affiliationLinks: '[data-testid="authorInstitution"] a',
  authorGeneralDetailsCard,
  authorGeneralDetailsCardLearnMoreLink: `${authorGeneralDetailsCard} a:has-text("Learn more")`,
  authorId: '[data-testid=authorId]',
  authorList: '.author-list',
  authorName: '#scopusProfileTip ~ h1',
  authorSubjects: '[data-testid=authorSubjects]',
  authorToolbar: '[data-testid=author-toolbar]',
  awardedGrantsTitle: '#author-awarded-grants-summary',
  awardedGrantsDescription: '#author-awarded-grants-description',
  buttonHasText: (text: string) => `button:has-text("${text}"), [value="${text}"]`,
  citedByCountLink: '[href*="citedby"]',
  citedBySubTab: 'input#pill-documents-citedBy',
  countLabelAndValue: '[data-testid="count-label-and-value"]',
  deleteListLink: (listName: string) => `td:has-text('${listName}') ~ td[class*='deleteListRow'] a`,
  docsSubTab: 'input#pill-documents-documents',
  documentsPanel: '#documents-panel',
  documentTitleLink: 'a[class*="link-doc-title"]',
  editProfileButton: '#AuthorToolbar_reviewAuthorProfile',
  emptyResults: '.empty-results',
  errorMsgContainer: '#errorMsgContainer',
  exportToScivalButton: '#AuthorProfilePage_ExportToScivalLink',
  institutionHistory: '[data-testid=authorInstitutionHistory]',
  isThisYouLink: 'a[href*="mendeley"]',
  linkHasText: (text: string) => `a:has-text("${text}")`,
  listNameInput: 'input#listName',
  messageContainer: '#confirmMsgContainer, #messagePH',
  moreActionsButton: '[data-testid=author-toolbar-more-actions-button]',
  pageHeader: '.documentHeader',
  potentialAuthorMatchesButton: '#AuthorProfilePage_PotentialAuthorMatchesLink',
  preprintsSubTab: 'input#pill-documents-preprints',
  preprintNoteDescription: '[data-testid=author-tabs-preprint-note-title] ~ div p',
  preprintNoteTitle: '[data-testid=author-tabs-preprint-note-title]',
  relatedDocumentsLink: 'a[href*="resultsListItem"]',
  resultsListAuthorsLink: '.author-list a',
  resultsListItem: '[data-component=results-list-item]',
  saveToListButton: '#saveToList',
  saveToListSubmitButton: '#saveTolistSubmit',
  setAlertButton: '#AuthorToolbar__setAlertLink',
  setCitationAlertButton: '#scopus-document-results__authcit',
  setDocumentAlertButton: '#scopus-document-results__doccit',
  showOrHideAbstractButton: 'button:has-text("abstract")',
  unclickableCount: '[data-testid=unclickable-count]',
  viewMoreButton: '#AuthorHeader__showAllAuthorInfo',
};

export class AuthorProfilePageControlPage {
  listOverviewUrl = '/list/form/overview.uri';

  authorIdUrl = (authorId: string) => `/authid/detail.uri?authorId=${authorId}`;

  defaultWaitForSelectorOptions: Record<string, any> = { state: 'visible', timeout: 3000 };

  async navigate(authorId: string, tabId?: string) {
    const tabSegment = tabId ? `#tab=${tabId}` : '#';
    await global.page.goto(global.BASE_URL + this.authorIdUrl(authorId) + tabSegment);
    await global.page.waitForLoadState('networkidle');
  }

  async navigateExperiment(authorId: string, extraSearchParams?: string) {
    const searchParams = extraSearchParams ? `&${extraSearchParams}` : '';
    await global.page.goto(global.BASE_URL + this.authorIdUrl(authorId) + searchParams);
  }

  async getAuthorGeneralDetailsCard() {
    return (await global.page.waitForSelector(locators.authorGeneralDetailsCard)).innerText();
  }

  async getAffiliationsTexts(): Promise<string[]> {
    await global.page.waitForSelector(locators.affiliationLinks);
    return global.page.locator(locators.affiliationLinks).allInnerTexts();
  }

  async selectOptionInSortResultListDropdown(option: string) {
    const sortResultListDropdown = `${locators.documentsPanel} [data-control="document-sorting"] select`;
    await global.page.locator(sortResultListDropdown).selectOption(option);
    await global.page.waitForSelector(locators.resultsListItem);
  }

  async clickLinkinTabResultList(linkName: string) {
    const linkLocator: string | undefined = {
      'Cited by count': locators.citedByCountLink,
      'Related documents': locators.relatedDocumentsLink,
      'Document title': locators.documentTitleLink,
      'Author name': locators.resultsListAuthorsLink,
    }[linkName];

    const locator = `${locators.documentsPanel} ${linkLocator}`;
    await global.page.click(locator);
    await global.page.waitForLoadState();
  }

  async getAriaExpandedAttrOfAbstractButton(): Promise<string | null> {
    return global.page.getAttribute(locators.showOrHideAbstractButton, ElementAttribute.ARIA_EXPANDED);
  }

  async getClassdAttrOfAbstractContent(): Promise<string | null> {
    return global.page.getAttribute(locators.abstractContent, ElementAttribute.CLASS);
  }

  async isCitedCountInDocPanelClickable(): Promise<boolean> {
    const countLabelAndValueLocatorInDocsPanel = `${locators.documentsPanel} ${locators.countLabelAndValue}`;
    await global.page.waitForSelector(countLabelAndValueLocatorInDocsPanel);

    return global.page
      .locator(countLabelAndValueLocatorInDocsPanel)
      .filter({ has: global.page.locator(locators.unclickableCount) })
      .locator(locators.citedByCountLink)
      .isVisible({ timeout: 0 });
  }

  async getApiResponseForTab(tab: string) {
    const endPoint = `api/documents/${tab == 'cited-by' ? 'citations' : 'search'}`;
    return Promise.all([
      page.waitForResponse((resp) => resp.url().includes(endPoint) && resp.status() === 200),
      global.page.reload(),
    ]);
  }

  async getFilteredElementFromResultsList(controllerEl: string, targetEl: string) {
    await global.page.waitForSelector(locators.resultsListItem);

    return global.page
      .locator(locators.resultsListItem)
      .filter({ has: global.page.locator(controllerEl) })
      .locator(targetEl);
  }

  async getAuthorByDocumentsFromResultsList(documentName: string) {
    const documentLocator = `${locators.documentTitleLink}:has-text('${documentName}')`;
    return (await this.getFilteredElementFromResultsList(documentLocator, locators.authorList)).innerText();
  }

  async isSubTabElementLoaded(subTab: string): Promise<null | ElementHandle> {
    const tabElements: Record<typeof subTab, string> = {
      documents: locators.setDocumentAlertButton,
      citedBy: locators.setCitationAlertButton,
      preprints: locators.preprintNoteTitle,
    };
    return global.page.waitForSelector(tabElements[subTab], this.defaultWaitForSelectorOptions);
  }

  async saveList(listName: string) {
    await global.page.fill(locators.listNameInput, listName);
    await global.page.click(locators.saveToListSubmitButton);

    //in case previously created list has not been deleted due to a failure
    try {
      await global.page.waitForSelector(locators.errorMsgContainer, this.defaultWaitForSelectorOptions);
      const newPage = await context.newPage();
      await newPage.goto(global.BASE_URL + this.listOverviewUrl);

      await this.deleteList(listName, newPage);
      await newPage.close();

      await this.saveList(listName);
    } catch {
      await global.page.waitForLoadState('domcontentloaded');
    }
  }

  async deleteList(listName: string, page = global.page) {
    await page.click(locators.deleteListLink(listName));
    await page.click(locators.buttonHasText('Delete'));
  }

  async getTabDetailsTitle(tabName: string): Promise<string> {
    const tabElements: Record<typeof tabName, string> = {
      preprints: locators.preprintNoteTitle,
      grants: locators.awardedGrantsTitle,
    };
    return global.page.locator(tabElements[tabName]).innerText();
  }

  async getTabDetailsDescription(tabName: string): Promise<string> {
    const tabElements: Record<typeof tabName, string> = {
      preprints: locators.preprintNoteDescription,
      grants: locators.awardedGrantsDescription,
    };
    return global.page.locator(tabElements[tabName]).innerText();
  }

  async getAuthorToolbarClass(): Promise<string | null> {
    return global.page.locator(locators.authorToolbar).locator('..').getAttribute(ElementAttribute.CLASS);
  }

  getAuthorToolbarElement(toolbarElement: string): Locator {
    const tabElements: Record<typeof toolbarElement, string> = {
      'Author name': locators.authorName,
      'Set alert': locators.setAlertButton,
      'Add author to list': locators.addAuthorToListButton,
      'Edit profile': locators.editProfileButton,
      More: locators.moreActionsButton,
    };
    return global.page.locator(tabElements[toolbarElement]);
  }

  getMoreDropdownOption(option: string): Locator {
    const dropdownOption: Record<typeof option, string> = {
      'Edit profile': locators.editProfileButton,
      'Potential author matches': locators.potentialAuthorMatchesButton,
      'Export to SciVal': locators.exportToScivalButton,
    };
    return global.page.locator(dropdownOption[option]);
  }
}
