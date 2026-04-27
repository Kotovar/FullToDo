import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Icon } from '@shared/ui';

interface ScrollToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export const ScrollToTopButton = memo(
  ({ isVisible, onClick }: ScrollToTopButtonProps) => {
    const { t } = useTranslation();

    return (
      <Button
        aria-label={t('tasks.backToTop')}
        onClick={onClick}
        className={`absolute right-4 bottom-4 z-20 flex items-center gap-2 rounded-full px-3 py-2 shadow-md transition duration-200 ${
          isVisible
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0'
        }`}
      >
        <Icon name='arrowUp' stroke='currentColor' size={18} />
        <span className='text-sm'>{t('tasks.backToTop')}</span>
      </Button>
    );
  },
);
