import { memo, type ComponentPropsWithoutRef } from 'react';
import { useLocation } from 'react-router';
import { ROUTES } from '@sharedCommon';
import { SearchSection } from './SearchSection';
import { AdditionalActions } from './AdditionalActions';
import { MenuButton } from './MenuButton';

interface HeaderProps extends ComponentPropsWithoutRef<'header'> {
  changeVisibility: () => void;
}

export const Header = memo(({ changeVisibility, ...rest }: HeaderProps) => {
  const { pathname } = useLocation();
  const isAccountPage = pathname === ROUTES.app.account;

  return (
    <header {...rest}>
      {!isAccountPage ? (
        <>
          <nav>
            <MenuButton onClick={changeVisibility} />
          </nav>
          <SearchSection />
        </>
      ) : (
        <div className='flex-1' />
      )}
      <AdditionalActions />
    </header>
  );
});
