import { useId, useRef, useState, type SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@shared/ui';
import { useLogout } from '../../model/logout/useLogout';

type LogoutButtonProps = {
  appearance?: 'primary' | 'ghost';
  className?: string;
  padding?: 'none' | 'sm' | 'md';
};

export const LogoutButton = ({
  appearance = 'ghost',
  className,
  padding = 'sm',
}: LogoutButtonProps) => {
  const { t } = useTranslation();
  const { isAuthenticated, isPending, logout } = useLogout();
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const popoverId = useId();
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  if (!isAuthenticated) {
    return null;
  }

  const closeConfirm = () => {
    popoverRef.current?.hidePopover?.();
    setConfirmOpen(false);
  };

  const openConfirm = () => {
    if (isConfirmOpen) {
      closeConfirm();
      return;
    }

    popoverRef.current?.showPopover?.();
    setConfirmOpen(true);
  };

  const handleLogout = async () => {
    closeConfirm();
    await logout();
  };

  const handleToggle = (event: SyntheticEvent<HTMLDivElement>) => {
    setConfirmOpen(event.currentTarget.matches(':popover-open'));
  };

  return (
    <>
      <Button
        onClick={openConfirm}
        aria-label={t('logout.label')}
        aria-haspopup='dialog'
        aria-expanded={isConfirmOpen}
        aria-controls={popoverId}
        className={
          className ??
          'hover:border-light flex gap-x-2 rounded-xl border border-transparent text-white'
        }
        appearance={appearance}
        padding={padding}
        disabled={isPending}
      >
        <span>{t('logout.label')}</span>
      </Button>
      <div
        ref={popoverRef}
        id={popoverId}
        popover='auto'
        role='dialog'
        aria-label={t('logout.confirm')}
        onToggle={handleToggle}
        className='bg-light text-dark fixed top-1/2 left-1/2 m-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 p-4 text-center text-sm shadow-lg shadow-slate-900/10 backdrop:bg-black/35 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
      >
        <p className='mb-4 text-sm font-medium'>{t('logout.confirm')}</p>
        <div className='flex items-center justify-center gap-2'>
          <Button
            onClick={closeConfirm}
            className='min-w-24 justify-center border-slate-300 bg-slate-100 text-slate-700 enabled:hover:bg-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:enabled:hover:bg-slate-700'
            appearance='ghost'
            padding='sm'
          >
            {t('logout.cancel')}
          </Button>
          <Button
            onClick={handleLogout}
            className='min-w-24 justify-center'
            padding='sm'
            disabled={isPending}
          >
            {isPending ? t('logout.submitting') : t('logout.confirmAction')}
          </Button>
        </div>
      </div>
    </>
  );
};
