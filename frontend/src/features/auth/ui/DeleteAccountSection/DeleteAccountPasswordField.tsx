import { useTranslation } from 'react-i18next';
import { Icon, Input } from '@shared/ui';
import type { Translation } from '@shared/i18n';

type DeleteAccountPasswordFieldProps = {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  error?: Translation | null;
  errorId: string;
};

export const DeleteAccountPasswordField = ({
  value,
  onChange,
  visible,
  onToggleVisible,
  error,
  errorId,
}: DeleteAccountPasswordFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-1'>
      <label
        className='text-sm font-medium text-slate-900 dark:text-slate-100'
        htmlFor='delete-account-password'
      >
        {t('account.dangerZone.password.label')}
      </label>
      <div className='relative w-full'>
        <Input
          id='delete-account-password'
          className='w-full rounded border border-rose-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:border-rose-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
          type={visible ? 'text' : 'password'}
          autoComplete='current-password'
          value={value}
          onChange={event => onChange(event.target.value)}
          placeholder={t('account.dangerZone.password.placeholder')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
        />
        <button
          type='button'
          className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          onClick={onToggleVisible}
          aria-label={t(
            `account.dangerZone.password.${visible ? 'hide' : 'show'}`,
          )}
          aria-pressed={visible}
        >
          <Icon
            name={visible ? 'eyeOff' : 'eye'}
            size={20}
            stroke='currentColor'
          />
        </button>
      </div>
      <div className='min-h-5'>
        {error ? (
          <p id={errorId} className='text-sm text-rose-700 dark:text-rose-300'>
            {t(error)}
          </p>
        ) : null}
      </div>
    </div>
  );
};
