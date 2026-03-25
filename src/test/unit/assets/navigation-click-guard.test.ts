/**
 * @jest-environment ./jest.environment.jsdom.js
 */

describe('data-navigation-link double-click guard', () => {
  let link: HTMLAnchorElement;

  beforeEach(() => {
    link = document.createElement('a');
    link.setAttribute('href', '/somewhere');
    link.setAttribute('data-navigation-link', '');
    link.textContent = 'view';
    document.body.appendChild(link);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.resetModules();
  });

  it('prevents default on second and third click of the same link', async () => {
    // Import after DOM is ready so listeners can bind
    await import('../../../main/assets/js/navigation-click-guard');

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
    await import('../../../main/assets/js/navigation-click-guard');

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
