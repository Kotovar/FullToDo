import userEvent from '@testing-library/user-event';
import { renderHook } from '@testing-library/react';
import { createWrapper } from '@shared/mocks';
import { useFocusTrap } from './useFocusTrap';

describe('useFocusTrap', () => {
  let mockMenuRef: { current: HTMLElement | null };
  let mockButtonRef: { current: HTMLElement | null };
  let mockCloseMenu: () => void;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    const button = document.createElement('button');
    button.id = 'trigger-button';
    document.body.appendChild(button);

    const menu = document.createElement('div');
    menu.innerHTML = `
      <button id="first">First</button>
      <input type="text" id="input" />
      <button id="last">Last</button>
    `;
    menu.id = 'menu';
    menu.style.display = 'block';
    document.body.appendChild(menu);

    mockMenuRef = { current: menu };
    mockButtonRef = { current: button };
    mockCloseMenu = vi.fn();
    user = userEvent.setup();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  test('should trap focus with Tab key', async () => {
    renderHook(() => useFocusTrap(mockMenuRef, mockButtonRef, mockCloseMenu), {
      wrapper: createWrapper(),
    });

    const firstElement = mockMenuRef.current!.querySelector('#first')!;
    const lastElement = mockMenuRef.current!.querySelector('#last')!;

    expect(document.activeElement).toBe(firstElement);

    await user.tab();
    expect(document.activeElement).toBe(
      mockMenuRef.current!.querySelector('#input'),
    );

    await user.tab();
    expect(document.activeElement).toBe(lastElement);
    await user.tab();
    expect(document.activeElement).toBe(firstElement);

    await user.tab({ shift: true });
    expect(document.activeElement).toBe(lastElement);
  });

  test('should call closeMenu on Escape key', async () => {
    renderHook(() => useFocusTrap(mockMenuRef, mockButtonRef, mockCloseMenu), {
      wrapper: createWrapper(),
    });

    await user.keyboard('{Escape}');
    expect(mockCloseMenu).toHaveBeenCalled();
  });

  test('should not setup focus trap if no focusable elements', () => {
    const emptyMenu = document.createElement('div');
    emptyMenu.id = 'empty-menu';
    document.body.appendChild(emptyMenu);
    const emptyMenuRef = { current: emptyMenu };

    renderHook(() => useFocusTrap(emptyMenuRef, mockButtonRef, mockCloseMenu), {
      wrapper: createWrapper(),
    });

    expect(document.activeElement).not.toBe(emptyMenu);
  });

  test('should do nothing when menuRef.current is null', () => {
    const emptyMenuRef = { current: null };

    renderHook(() => useFocusTrap(emptyMenuRef, mockButtonRef, mockCloseMenu), {
      wrapper: createWrapper(),
    });

    expect(document.activeElement).not.toBe(mockMenuRef.current);
  });
});
