import * as S from './Header.styles'

type HeaderType = {
  title: string;
};

export const Header: React.FC<HeaderType> = ({ title }) => {
  return (
    <S.Container>
      <h1>{title}</h1>
    </S.Container>
  );
};
