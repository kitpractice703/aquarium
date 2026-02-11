import React from "react";
import * as S from "./style";
import { useProgramList } from "./hooks/useProgramList";
import defaultImage from "../../assets/images/deep_sea.jpg";

const Programs: React.FC = () => {
  const { programs, loading } = useProgramList();

  return (
    <S.Container>
      <S.Banner>
        <S.Title>Our Programs</S.Title>
      </S.Banner>

      <S.Content>
        {loading && <S.LoadingMessage>Loading...</S.LoadingMessage>}

        {!loading && programs.length === 0 && (
          <S.EmptyMessage>현재 등록된 프로그램이 없습니다.</S.EmptyMessage>
        )}

        {programs.map((program) => (
          <S.Card key={program.id}>
            <S.CardImage>
              {/* [FIX] 이미지가 없으면 기본 이미지(defaultImage) 사용 */}
              <img
                src={program.imageUrl || defaultImage}
                alt={program.title}
                onError={(e) => {
                  // 이미지 로드 실패 시에도 기본 이미지로 대체
                  e.currentTarget.src = defaultImage;
                }}
              />
            </S.CardImage>
            <S.CardBody>
              <S.CardTitle>{program.title}</S.CardTitle>
              <S.CardDesc>{program.description}</S.CardDesc>
            </S.CardBody>
          </S.Card>
        ))}
      </S.Content>
    </S.Container>
  );
};

export default Programs;
