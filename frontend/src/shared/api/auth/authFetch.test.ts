import { authFetch } from './authFetch';
import { getAccessToken, setAccessToken } from './accessToken';

describe('authFetch', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('refreshes token and retries protected request after 401', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(
        Response.json({ accessToken: 'new-access-token' }, { status: 200 }),
      )
      .mockResolvedValueOnce(new Response(null, { status: 200 }));
    const listener = vi.fn();

    setAccessToken('expired-token');
    window.addEventListener('auth:unauthorized', listener);

    const response = await authFetch('http://localhost:5000/tasks');

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls[1]?.[0]).toContain('/auth/refresh');
    expect(getAccessToken()).toBe('new-access-token');
    expect(listener).not.toHaveBeenCalled();

    window.removeEventListener('auth:unauthorized', listener);
  });

  test('emits unauthorized event when refresh also fails', async () => {
    vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(null, { status: 401 }))
      .mockResolvedValueOnce(new Response(null, { status: 401 }));
    const listener = vi.fn();

    window.addEventListener('auth:unauthorized', listener);

    await authFetch('http://localhost:5000/tasks');

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
