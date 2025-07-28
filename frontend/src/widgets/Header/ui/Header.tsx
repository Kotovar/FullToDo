import { memo, type ComponentPropsWithoutRef } from 'react';
import { SearchSection } from './SearchSection';
import { AdditionalActions } from './AdditionalActions';
import { MenuButton } from './MenuButton';

interface HeaderProps extends ComponentPropsWithoutRef<'header'> {
  changeVisibility: () => void;
}

export const Header = memo(({ changeVisibility, ...rest }: HeaderProps) => {
  return (
    <header {...rest}>
      <nav>
        <MenuButton onClick={changeVisibility} />
      </nav>
      <SearchSection />
      <AdditionalActions />
    </header>
  );
});
