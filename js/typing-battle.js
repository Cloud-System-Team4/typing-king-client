const SAMPLE_SENTENCES = [
  "바람이 분다.",
  "하늘은 높고 푸르다.",
  "시간은 금이다.",
  "모든 일에는 이유가 있다.",
  "행복은 멀리 있지 않다.",
  "인내는 쓰지만 그 열매는 달다.",
  "사랑은 모든 것을 이긴다.",
  "아는 것이 힘이다.",
  "지혜는 무기보다 강하다.",
  "모든 것은 변한다.",
  "작은 일에도 최선을 다하자.",
  "오늘은 다시 오지 않는다.",
  "행동은 말보다 강하다.",
  "꿈은 이루어진다.",
  "웃음은 최고의 약이다.",
  "성공은 준비된 자의 것이다.",
  "기회는 준비된 사람에게 온다.",
  "모든 일은 시작이 중요하다.",
  "노력 없는 성공은 없다.",
  "쉬운 길은 없다.",
];

document.addEventListener("DOMContentLoaded", () => {
  const givenSentence = document.getElementById("given-sentence");
  const userInput = document.getElementById("user-input");
  const resultDisplay = document.getElementById("result");

  const socket = new WebSocket("ws://localhost:9999");

  let startTime = null;

  socket.onopen = () => {
    console.log("서버에 연결되었습니다.");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "START") {
      givenSentence.textContent = message.sentence;
      resultDisplay.textContent = `게임 시작! 당신은 ${message.role}입니다.`;
      resultDisplay.style.color = "black";
      startTime = new Date().getTime();
      userInput.disabled = false;
      userInput.focus();
    } else if (message.type === "RESULT") {
      resultDisplay.innerHTML = `
        <p>당신의 시간: ${message.your_time}초</p>
        <p>상대방의 시간: ${message.opponent_time}초</p>
        <p>승자: ${message.winner}</p>
      `;
      userInput.disabled = true;
    } else if (message.type === "GAMING"){
      // sentence 받은 것이 여기로 감감

    }
  };

  socket.onclose = () => {
    console.log("서버와 연결이 종료되었습니다.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket 오류:", error);
  };

  function checkAnswer() {
    const userText = userInput.value.trim();
    const correctText = givenSentence.textContent.trim();

    if (userText === correctText) {
      const endTime = new Date().getTime();
      const elapsedTime = ((endTime - startTime) / 1000).toFixed(2);
      socket.send(elapsedTime); //
      resultDisplay.textContent = "정답입니다! 상대방을 기다리는 중...";
      resultDisplay.style.color = "green";
      userInput.disabled = true;
    } else {
      resultDisplay.textContent = "틀렸습니다. 다시 시도하세요.";
      resultDisplay.style.color = "red";
    }
  }

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
});
