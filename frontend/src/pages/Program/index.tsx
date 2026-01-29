import React, { useState, useEffect } from "react"; // [MODIFIED] React 기본 훅 임포트
import { api } from "../../api/axios"; // [ADDED] 서버 통신용
import * as S from "./style"; // [ADDED] style.ts의 모든 컴포넌트를 S라는 이름으로 가져옴 (깔끔한 코드 관리)

// [ADDED] TypeScript Interface 정의: 서버에서 받아올 데이터의 형태를 미리 약속합니다.
// DB 컬럼명과 일치해야 합니다. (여기서는 일반적인 카멜케이스 규칙을 따랐습니다)
interface ProgramData {
  id: number; // DB의 Primary Key
  title: string; // 프로그램 제목
  description: string; // 프로그램 설명
  imageUrl?: string; // 이미지 URL (없을 수도 있으니 ? 처리)
}

const Programs: React.FC = () => {
  // [ADDED] 상태 관리: 프로그램 목록(배열)과 로딩 상태
  // <ProgramData[]>는 이 상태가 ProgramData 형태의 배열임을 명시합니다.
  const [programs, setPrograms] = useState<ProgramData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // [ADDED] 비동기 데이터 호출 함수
    const fetchPrograms = async () => {
      try {
        // [Fact Check] 로컬 개발 환경 주소입니다. 추후 배포 시 환경변수로 변경 필요
        const response = await api.get<ProgramData[]>("/programs");
        setPrograms(response.data);
      } catch (error) {
        console.error("프로그램 목록을 불러오지 못했습니다.", error);
        // [ADDED] 에러 발생 시 사용자에게 보여줄 처리가 필요하지만, 일단 콘솔에 남깁니다.
      } finally {
        setLoading(false); // [ADDED] 로딩 종료
      }
    };

    fetchPrograms();
  }, []);

  return (
    <S.Container>
      <S.Banner>
        <S.Title>Our Programs</S.Title>
      </S.Banner>

      <S.Content>
        {/* [ADDED] 로딩 중일 때 표시 */}
        {loading && (
          <p style={{ color: "white", textAlign: "center" }}>Loading...</p>
        )}

        {/* [ADDED] 데이터가 없을 때 표시 */}
        {!loading && programs.length === 0 && (
          <div
            style={{
              color: "#a0a0a0",
              gridColumn: "1/-1",
              textAlign: "center",
              padding: "40px",
            }}
          >
            현재 등록된 프로그램이 없습니다.
          </div>
        )}

        {/* [ADDED] 데이터 매핑하여 카드 생성 */}
        {programs.map((program) => (
          <S.Card key={program.id}>
            <S.CardImage>
              {/* [ADDED] 이미지가 없을 경우를 대비한 기본 이미지 처리 */}
              <img
                src={
                  program.imageUrl ||
                  "https://via.placeholder.com/300x200?text=No+Image"
                }
                alt={program.title}
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
