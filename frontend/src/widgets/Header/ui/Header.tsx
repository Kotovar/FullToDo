import { memo, type ComponentPropsWithoutRef } from 'react';
import { SearchSection } from './SearchSection';
import { AdditionalActions } from './AdditionalActions';
import { MenuButton } from './MenuButton';

interface Props extends ComponentPropsWithoutRef<'header'> {
  changeVisibility: () => void;
}

export const Header = memo((props: Props) => {
  const { changeVisibility, ...rest } = props;

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
