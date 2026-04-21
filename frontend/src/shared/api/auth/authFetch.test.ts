import { authFetch } from './authFetch';

describe('authFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('emits a global unauthorized event for protected non-auth requests', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response(null, { status: 401 }));
    const listener = vi.fn();

    window.addEventListener('auth:unauthorized', listener);

    await authFetch('http://localhost:5000/tasks');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);

    window.removeEventListener('auth:unauthorized', listener);
  });

  test('does not emit a global unauthorized event for auth endpoints', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(null, { status: 401 }),
    );
    const listener = vi.fn();

    window.addEventListener('auth:unauthorized', listener);

    await authFetch('http://localhost:5000/auth/me');

    expect(listener).not.toHaveBeenCalled();

    window.removeEventListener('auth:unauthorized', listener);
  });
});
