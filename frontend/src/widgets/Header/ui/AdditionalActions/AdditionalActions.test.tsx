import userEvent from '@testing-library/user-event';
import { screen, waitFor } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { AdditionalActions } from './AdditionalActions';
import { useTranslation } from 'react-i18next';

vi.mock('react-i18next', async importOriginal => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    // eslint-disable-next-line react-hooks-extra/no-unnecessary-use-prefix
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        language: 'ru',
        changeLanguage: vi
          .fn()
          .mockImplementation(lang => Promise.resolve(lang)),
      },
    }),
  };
});

describe('AdditionalActions component', () => {
  const user = userEvent.setup();

  test('changes language from ru to en when clicked', async () => {
    renderWithRouter(<AdditionalActions />);
    const { i18n } = useTranslation();

    const button = screen.getByLabelText('change.language');

    await user.click(button);
    waitFor(() => {
      expect(i18n.changeLanguage).toHaveBeenCalledWith('en');
    });

    await user.click(button);
    waitFor(() => {
      expect(i18n.changeLanguage).toHaveBeenCalledWith('ru');
    });
  });
});
