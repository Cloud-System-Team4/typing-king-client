// 랜덤 문장 리스트
const sentences = [
  // "체다치즈를 최고 많이 먹은 최다연이 체다치즈 먹기 대회 최다 우승자이다.",
  // "정희수가 희희낙락하게 희끄무리한 흰머리를 뽑으며",
  // "이수지가 저수지에 갔는데 이 수지가 저수지에 간 걸까 저 수지가 저수지에 간걸까",
  // "그 수지가 저수지에 간 걸까 하며 이수지는 고민했는데 고민 끝에 이수의 마이웨이를 부르며 불쾌지수가 올라가며",
  // "저수지를 떠나 경기도 수지구의 한 학원으로 달려가더니 지수함수를 배워서 잘 사용하여 주식 수지를 맞아",
  "나 이수지, 바로 고단수지! 수지맞았다!하며 행복해했다.",
  // "내가 그린 기린 그림은 잘 그린 기린 그림이고 네가 그린 기린 그림은 못 그린 기린 그림이다.",
  // "내가 그린 기린 그림은 목이 긴 기린 그림이고, 네가 그린 기린 그림은 목이 안 긴 기린 그림이다",
  // "내가 그린 구름그림은 새털구름 그린 구름그림이고, 네가 그린 구름그림은 깃털구름 그린 구름그림이다.",
  // "저기 계신 저 분이 박 법학박사이시고 여기 계신 이 분이 백 법학박사이시다.",
  "김혜진, 류미성, 문채일 함께 만든 게임입니다.",
  "2024 클라우드 시스템 짱!",
];

let selectedSentences = [];
let currentIndex = 0;
let startTime;

// DOM 요소 가져오기
const givenSentenceElement = document.getElementById("given-sentence");
const userInputElement = document.getElementById("user-input");
const resultDisplay = document.getElementById("result");

// 게임 초기화
function initializeGame() {
  selectedSentences = getRandomSentences(3); // 문장 3개 랜덤 선택
  currentIndex = 0;
  startTime = new Date(); // 시작 시간 기록
  showSentence();
  resultDisplay.textContent = ""; // 결과 초기화
}

// 랜덤 문장 가져오기
function getRandomSentences(count) {
  const shuffled = sentences.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// 현재 문장 표시
function showSentence() {
  givenSentenceElement.textContent = selectedSentences[currentIndex];
  userInputElement.value = ""; // 입력창 초기화
  userInputElement.focus();
}

// 정답 체크
function checkAnswer() {
  const userText = userInputElement.value.trim();
  const correctText = givenSentenceElement.textContent.trim();

  if (userText === correctText) {
    resultDisplay.textContent = "정답입니다👏👏";
    resultDisplay.style.color = "green";

    currentIndex++;
    if (currentIndex < selectedSentences.length) {
      showSentence(); // 다음 문장 표시
    } else {
      finishGame(); // 게임 종료
    }
  } else {
    resultDisplay.textContent = "틀렸습니다. 다시 시도하세요.";
    resultDisplay.style.color = "red";
  }
}

// 게임 종료 처리
function finishGame() {
  const endTime = new Date();
  const elapsedTime = ((endTime - startTime) / 1000).toFixed(2); // 소요 시간 계산
  const opponentTime = (Math.random() * (30 - 10) + 10).toFixed(2); // 상대 시간 랜덤 생성 (10초 ~ 30초)

  // 결과 페이지로 데이터 전달
  localStorage.setItem("playerTime", elapsedTime);
  localStorage.setItem("opponentTime", opponentTime);

  window.location.href = "typing-result.html";
}

// 이벤트 리스너
userInputElement.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

// 페이지 로드 시 게임 초기화
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("typing-battle.html")) {
    initializeGame();
  }
});

// 결과 페이지 처리
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("typing-result.html")) {
    const playerTime = localStorage.getItem("playerTime");
    const opponentTime = localStorage.getItem("opponentTime");
    const timerBox = document.querySelectorAll(".timer-box span");
    const resultMessage = document.querySelector(".result-message");

    if (playerTime && opponentTime) {
      timerBox[0].textContent = `내 기록: ${playerTime}초`;
      timerBox[1].textContent = `상대 기록: ${opponentTime}초`;

      // 승자 판별
      const winner =
        parseFloat(playerTime) < parseFloat(opponentTime) ? "내" : "상대";
      resultMessage.innerHTML = `<strong>${winner}</strong>가 이겼습니다!`;
    }
  }
});
