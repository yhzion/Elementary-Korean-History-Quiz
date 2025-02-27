// 게임 관련 변수 초기화
import { allQuestions } from './questions/index.js';

// 브라우저 콘솔에 로그 출력 (디버깅용)
console.log('게임 스크립트 로드됨');
console.log('allQuestions:', allQuestions);

// 난이도별 문제 개수 확인
const difficulty0Count = allQuestions.filter(q => q.difficulty === 0).length;
const difficulty1Count = allQuestions.filter(q => q.difficulty === 1).length;
const difficulty2Count = allQuestions.filter(q => q.difficulty === 2).length;
console.log(`난이도 0(쉬움): ${difficulty0Count}개`);
console.log(`난이도 1(보통): ${difficulty1Count}개`);
console.log(`난이도 2(어려움): ${difficulty2Count}개`);

let currentQuestionIndex = 0;
let selectedQuestions = [];
let score = 0;
let correctAnswers = 0;
let isAnswered = false;

// 난이도 선택 변수
let selectedDifficulty = 1; // 기본값: 보통 (현재 난이도 1의 문제만 있음)

// DOM 요소
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const startBtn = document.getElementById('start-btn');
const cancelBtn = document.getElementById('cancel-btn');
const restartBtn = document.getElementById('restart-btn');
const exitBtn = document.getElementById('exit-btn');

const questionNumber = document.getElementById('question-number');
const progressFill = document.getElementById('progress-fill');
const scoreDisplay = document.getElementById('score');
const questionText = document.getElementById('question-text');
const options = [
    document.getElementById('option1'),
    document.getElementById('option2'),
    document.getElementById('option3'),
    document.getElementById('option4')
];
const studentImg = document.getElementById('student-img');
const feedbackBubble = document.getElementById('feedback-bubble');
const feedbackText = document.getElementById('feedback-text');

const finalScore = document.getElementById('final-score');
const correctCount = document.getElementById('correct-count');
const resultText = document.getElementById('result-text');
const finalStudentImg = document.getElementById('final-student-img');
const fireworksContainer = document.getElementById('fireworks-container');

// 난이도 선택 이벤트
document.querySelectorAll('.difficulty-btn').forEach(button => {
    button.addEventListener('click', function() {
        // 모든 버튼에서 active 클래스 제거
        document.querySelectorAll('.difficulty-btn').forEach(btn => btn.classList.remove('active'));
        // 선택된 버튼에 active 클래스 추가
        this.classList.add('active');
        // 선택된 난이도 저장
        selectedDifficulty = parseInt(this.dataset.level);
    });
});

// 게임 초기화
function initGame() {
    // 선택된 난이도에 맞는 문제만 필터링
    console.log('initGame 시작: 난이도', selectedDifficulty);
    console.log('allQuestions 길이:', allQuestions.length);
    
    let filteredQuestions = allQuestions.filter(q => q.difficulty === selectedDifficulty);
    console.log('난이도 필터링 후 문제 수:', filteredQuestions.length);
    
    // 만약 선택된 난이도의 문제가 충분하지 않으면 모든 난이도의 문제를 사용
    if (filteredQuestions.length < 20) {
        console.log('선택된 난이도의 문제가 부족합니다. 모든 문제를 사용합니다.');
        filteredQuestions = [...allQuestions];
    }
    
    selectedQuestions = [...filteredQuestions];
    shuffleArray(selectedQuestions);
    selectedQuestions = selectedQuestions.slice(0, 20);
    
    console.log('최종 선택된 문제 수:', selectedQuestions.length);

    currentQuestionIndex = 0;
    score = 0;
    correctAnswers = 0;
    isAnswered = false;

    // 첫 문제 표시
    if (selectedQuestions.length > 0) {
        displayQuestion();
        
        // 화면 표시 설정
        startScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');
        resultScreen.classList.add('hidden');
        fireworksContainer.classList.add('hidden');
    } else {
        // 문제가 없는 경우 오류 메시지 표시
        alert('불러올 수 있는 문제가 없습니다. 페이지를 새로 고침해주세요.');
        console.error('문제를 불러올 수 없습니다.');
    }
}

// 현재 문제 표시
function displayQuestion() {
    const question = selectedQuestions[currentQuestionIndex];
    
    // 진행 상태 업데이트
    questionNumber.textContent = currentQuestionIndex + 1;
    progressFill.style.width = `${((currentQuestionIndex + 1) / 20) * 100}%`;
    
    // 문제 및 보기 설정
    questionText.textContent = question.question;
    
    for (let i = 0; i < 4; i++) {
        options[i].textContent = question.options[i];
        options[i].className = 'option-btn'; // 스타일 초기화
        options[i].addEventListener('click', checkAnswer);
    }
    
    // 캐릭터 및 피드백 초기화
    studentImg.src = 'images/student-animated.svg';
    feedbackBubble.classList.add('hidden');
    
    isAnswered = false;
}

// 답변 확인
function checkAnswer(event) {
    if (isAnswered) return;
    
    isAnswered = true;
    const selectedIndex = options.indexOf(event.target);
    const question = selectedQuestions[currentQuestionIndex];
    
    if (selectedIndex === question.correct) {
        // 정답
        event.target.classList.add('correct');
        showFeedback(true, question.explanation);
        score += 5;
        correctAnswers++;
        studentImg.src = 'images/student-happy-animated.svg';
        studentImg.classList.add('bounce');
        playSound('correct');
    } else {
        // 오답
        event.target.classList.add('incorrect');
        options[question.correct].classList.add('correct');
        showFeedback(false, question.explanation);
        studentImg.src = 'images/student-sad-animated.svg';
        studentImg.classList.add('shake');
        playSound('incorrect');
    }
    
    // 점수 업데이트
    scoreDisplay.textContent = score;
    
    // 다음 문제 준비
    setTimeout(() => {
        studentImg.classList.remove('bounce', 'shake');
        moveToNextQuestion();
    }, 2500);
}

// 피드백 표시
function showFeedback(isCorrect, explanation) {
    feedbackBubble.classList.remove('hidden');
    feedbackBubble.classList.add('fade-in');
    
    if (isCorrect) {
        feedbackText.innerHTML = `<span class="correct-text">정답이에요!</span> ${explanation}`;
    } else {
        feedbackText.innerHTML = `<span class="incorrect-text">아쉽네요.</span> ${explanation}`;
    }
}

// 다음 문제로 이동
function moveToNextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < 20) {
        displayQuestion();
    } else {
        showResult();
    }
}

// 결과 화면 표시
function showResult() {
    quizScreen.classList.add('hidden');
    resultScreen.classList.remove('hidden');
    
    finalScore.textContent = score;
    correctCount.textContent = correctAnswers;
    
    // 결과에 따른 메시지와 캐릭터 표정
    if (correctAnswers >= 18) {
        resultText.textContent = "대단해요! 한국사 박사님이네요! 앞으로도 더 재미있게 역사를 공부해요!";
        finalStudentImg.src = 'images/student-happy-animated.svg'; // 최고 점수일 때 행복한 학생 이미지 사용
        showFireworks();
    } else if (correctAnswers >= 15) {
        resultText.textContent = "정말 잘했어요! 한국사에 대해 많이 알고 있네요!";
        finalStudentImg.src = 'images/student-happy-animated.svg';
    } else if (correctAnswers >= 10) {
        resultText.textContent = "좋아요! 한국사에 대해 꾸준히 공부하면 더 잘할 수 있을 거예요!";
        finalStudentImg.src = 'images/student-animated.svg'; // 보통 점수일 때 기본 이미지 사용
    } else {
        resultText.textContent = "조금 더 공부해 볼까요? 한국사는 재미있는 이야기가 가득해요!";
        finalStudentImg.src = 'images/student-sad-animated.svg'; // 낮은 점수일 때 슬픈 이미지 사용
    }
}

// 폭죽 효과
function showFireworks() {
    fireworksContainer.classList.remove('hidden');
    
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            createFirework();
        }, i * 300);
    }
    
    setTimeout(() => {
        fireworksContainer.classList.add('hidden');
        fireworksContainer.innerHTML = '';
    }, 8000);
}

// 개별 폭죽 생성
function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    
    // 랜덤 위치 및 색상
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const color = getRandomColor();
    
    firework.style.left = `${left}%`;
    firework.style.top = `${top}%`;
    firework.style.backgroundColor = color;
    
    fireworksContainer.appendChild(firework);
    
    // 일정 시간 후 제거
    setTimeout(() => {
        firework.remove();
    }, 1000);
}

// 랜덤 색상 생성
function getRandomColor() {
    const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// 배열 섞기 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 효과음 재생
function playSound(type) {
    // 실제 구현에서는 오디오 요소를 만들어 효과음 재생
    // 예제에서는 생략
}

// 이벤트 리스너 설정
document.addEventListener('DOMContentLoaded', () => {
    // 시작 버튼
    startBtn.addEventListener('click', initGame);
    
    // 재시작 버튼
    restartBtn.addEventListener('click', () => {
        resultScreen.classList.add('hidden');
        initGame();
    });
    
    // 종료 버튼
    exitBtn.addEventListener('click', () => {
        resultScreen.classList.add('hidden');
        startScreen.classList.remove('hidden');
    });
});
