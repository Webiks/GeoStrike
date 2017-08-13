import { CesiumFpsPage } from './app.po';

describe('cesium-fps App', () => {
  let page: CesiumFpsPage;

  beforeEach(() => {
    page = new CesiumFpsPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
