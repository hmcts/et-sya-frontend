import { JSDOM } from 'jsdom';

describe('button-navigation data-navigation-link double-click guard', () => {
  const setupDomWithLink = () => {
    const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
    global.window = dom.window as unknown as Window & typeof globalThis;
    global.document = dom.window.document as unknown as Document;

    const link = document.createElement('a');
    link.setAttribute('href', '/somewhere');
    link.setAttribute('data-navigation-link', '');
    link.textContent = 'view';
    document.body.appendChild(link);

    return { dom, link } as const;
  };

  afterEach(() => {
    // Cleanup globals and reset module between tests
    delete global.window;
    delete global.document;
    jest.resetModules();
  });

  it('prevents default on second click of the same link', async () => {
    const { link } = setupDomWithLink();

    // Import after DOM is ready so listeners can bind
    await import('../../../main/assets/js/button-navigation');

    const first = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    const second = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    const third = new window.MouseEvent('click', { bubbles: true, cancelable: true });

    link.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(false);

    link.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);

    link.dispatchEvent(third);
    expect(third.defaultPrevented).toBe(true);
  });

  it('allows click again after pageshow clears the guard', async () => {
    const { link } = setupDomWithLink();
    await import('../../../main/assets/js/button-navigation');

    const first = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    const second = new window.MouseEvent('click', { bubbles: true, cancelable: true });

    link.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(false);

    link.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(true);

    // Simulate BFCache/back navigation restore
    window.dispatchEvent(new window.Event('pageshow'));

    // 3rd click should be allowed again
    const third = new window.MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(third);
    expect(third.defaultPrevented).toBe(false);
  });
});
