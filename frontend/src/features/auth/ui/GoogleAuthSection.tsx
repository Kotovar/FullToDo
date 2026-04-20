import { useTranslation } from 'react-i18next';
import { useGoogleLogin } from '../model/login/useGoogleLogin';

type GoogleAuthSectionProps = {
  redirectTo: string;
};

export const GoogleAuthSection = ({ redirectTo }: GoogleAuthSectionProps) => {
  const { t } = useTranslation();
  const { buttonRef, googleError, isConfigured } = useGoogleLogin({
    redirectTo,
  });

  if (!isConfigured) {
    return null;
  }

  return (
    <>
      <div ref={buttonRef} className='flex w-full justify-center' />
      <div className='min-h-14'>
        {googleError ? (
          <p className='rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700'>
            {t(googleError)}
          </p>
        ) : null}
      </div>
      <div className='relative flex items-center justify-center'>
        <span className='h-px w-full bg-slate-200' />
        <span className='bg-light text-dark absolute px-3 text-xs tracking-[0.2em] uppercase'>
          {t('auth.divider')}
        </span>
      </div>
    </>
  );
};
