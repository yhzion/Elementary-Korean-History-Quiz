// 모든 질문 세트 배럴 익스포트
import { questionSet1 } from './set1.js';
import { questionSet2 } from './set2.js';
import { questionSet3 } from './set3.js';


// 모든 문제를 한 배열에 합치기
export const allQuestions = [
  ...questionSet1,
  ...questionSet2,
  ...questionSet3,
];

// 개별 세트도 내보내기
export {
  questionSet1,
  questionSet2,
  questionSet3,
};
