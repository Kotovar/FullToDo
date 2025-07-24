import { act, renderHook } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import { i18nForTests } from '@shared/testing';
import { useLanguage } from './useLanguage';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18nForTests}>{children}</I18nextProvider>
);

describe('useLanguage hook', () => {
  test('should toggle language icon from ru to en', async () => {
    const { result, rerender } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.iconNameLanguage).toBe('flagRu');

    await act(async () => {
      await result.current.changeLanguage();
    });

    rerender();

    expect(result.current.iconNameLanguage).toBe('flagEn');
  });

  test('should toggle language from en to ru', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(i18nForTests.language).toBe('en');

    await act(async () => {
      await result.current.changeLanguage();
      expect(i18nForTests.language).toBe('ru');
    });
  });
});
