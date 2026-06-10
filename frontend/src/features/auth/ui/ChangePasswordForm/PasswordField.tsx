import type { ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon, Input } from '@shared/ui';
import { createTranslationKeyGuard } from '../../lib/createTranslationKeyGuard';

const isTranslationKey = createTranslationKeyGuard('account');

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  visible: boolean;
  onToggleVisible: () => void;
  error?: string;
  help?: string;
  autoComplete: string;
  showLabel: string;
  hideLabel: string;
};

export const PasswordField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  visible,
  onToggleVisible,
  error,
  help,
  autoComplete,
  showLabel,
  hideLabel,
}: PasswordFieldProps) => {
  const { t } = useTranslation();

  return (
    <div className='flex flex-col gap-1'>
      <label className='text-left text-sm font-medium' htmlFor={id}>
        {label}
      </label>
      <div className='relative w-full'>
        <Input
          id={id}
          className='w-full rounded border border-slate-300 bg-white px-3 py-2 pr-11 text-base text-slate-900 placeholder:text-slate-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500'
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-help ${id}-error`}
        />
        <button
          type='button'
          className='absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 transition hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
          onClick={onToggleVisible}
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
        >
          <Icon
            name={visible ? 'eyeOff' : 'eye'}
            size={20}
            stroke='currentColor'
          />
        </button>
      </div>
      {(help || error) && (
        <div className={`min-h-${help ? 10 : 5}`}>
          {help && (
            <p
              id={`${id}-help`}
              className='text-left text-sm text-slate-600 dark:text-slate-300'
            >
              {help}
            </p>
          )}
          {error && (
            <p
              id={`${id}-error`}
              className='text-left text-sm text-red-600 dark:text-red-400'
            >
              {isTranslationKey(error) ? t(error) : error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
