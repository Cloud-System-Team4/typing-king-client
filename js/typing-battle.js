const socket = new WebSocket("ws://localhost:9998"); // WebSocket 인스턴스 전역 선언

document.addEventListener("DOMContentLoaded", () => {
  const givenSentence = document.getElementById("given-sentence");
  const userInput = document.getElementById("user-input");
  const resultDisplay = document.getElementById("result");
  const retryButton = document.getElementById("retry-button");
  const startGameButton = document.getElementById("start-game-button"); // '게임 시작하기' 버튼

  // WebSocket 이벤트 핸들러
  socket.onopen = () => {
    console.log("서버에 연결되었습니다.");
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    if (message.type === "START") {
      // 서버로부터 받은 문장을 화면에 표시
      givenSentence.textContent = message.sentence; // 문장 설정
      resultDisplay.textContent = `게임 시작! 당신은 ${message.role}입니다.`;
      resultDisplay.style.color = "black";
      userInput.disabled = false;
      userInput.focus();
    } else if (message.type === "NEXT_SENTENCE") {
      givenSentence.textContent = message.sentence;
      resultDisplay.textContent = "새 문장이 도착했습니다! 입력을 시작하세요.";
      resultDisplay.style.color = "black";
      userInput.disabled = false;
      userInput.value = "";
      userInput.focus();
    } else if (message.type === "RESULT") {
      resultDisplay.innerHTML = `
        <p>당신의 총 소요 시간: ${message.total_time}초</p>
        <p>상대의 총 소요 시간: ${message.opponent_time}초</p>
        <p>승자: ${message.winner}</p>
      `;
      userInput.disabled = true;
    }
  };

  socket.onclose = () => {
    console.log("서버와 연결이 종료되었습니다.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket 오류:", error);
  };

  // 정답 체크
  function checkAnswer() {
    const userText = userInput.value.trim();
    const correctText = givenSentence.textContent.trim();

    if (userText === correctText) {
      socket.send(
        JSON.stringify({
          type: "ANSWER",
          correct: true,
        })
      );

      resultDisplay.textContent = "정답입니다! 다음 문장을 기다리세요...";
      resultDisplay.style.color = "green";
      userInput.disabled = true;
    } else {
      socket.send(
        JSON.stringify({
          type: "ANSWER",
          correct: false,
        })
      );

      resultDisplay.textContent = "틀렸습니다. 다시 시도하세요.";
      resultDisplay.style.color = "red";
    }
  }

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });

  // '게임 시작하기' 버튼 이벤트
  if (startGameButton) {
    startGameButton.addEventListener("click", () => {
      const message = JSON.stringify({
        type: "START_GAME",
        start: true,
      });
      socket.send(message); // 서버로 메시지 전송
      console.log("'게임 시작하기' 메시지를 서버에 보냈습니다.");

      // 100ms 딜레이 후 페이지 이동
      setTimeout(() => {
        window.location.href = "typing-battle.html";
      }, 100);
    });
  }

  // 재도전 버튼 이벤트
  if (retryButton) {
    retryButton.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 동작 방지
      const message = JSON.stringify({
        type: "RETRY",
        continue: true,
      });
      socket.send(message); // 서버로 메시지 전송
      console.log("재도전 여부를 서버에 전송했습니다.");

      // 버튼 클릭 후 페이지 이동
      window.location.href = "/typing-battle.html";
    });
  }
});
