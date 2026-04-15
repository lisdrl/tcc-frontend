import * as S from './UnreadBadge.styles';

type UnreadBadgeProps = {
  count: number;
  label?: string;
};

export const UnreadBadge: React.FC<UnreadBadgeProps> = ({ count, label }) => {
  if (count <= 0) {
    return null;
  }

  return (
    <S.Badge aria-label={label ?? `${count} mensagens nao lidas`}>
      {count}
    </S.Badge>
  );
};
