import { type HeaderProps } from '../types';

const Header = (props: HeaderProps) => {
  return (
    <div>
      <h1>{props.name}</h1>
    </div>
  );
};

export default Header;