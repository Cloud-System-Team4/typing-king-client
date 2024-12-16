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

    // 서버에서 START 메시지 수신
    if (message.type === "START") {
      givenSentence.textContent = message.sentence; // 서버에서 받은 문장 표시
      resultDisplay.textContent = `게임 시작! 당신은 ${message.role}입니다.`;
      resultDisplay.style.color = "black";
      userInput.disabled = false;
      userInput.focus(); // 입력창 활성화
    }

    // 서버에서 NEXT_SENTENCE 메시지 수신
    else if (message.type === "NEXT_SENTENCE") {
      givenSentence.textContent = message.sentence; // 새로운 문장 표시
      resultDisplay.textContent = "새 문장이 도착했습니다! 입력을 시작하세요.";
      resultDisplay.style.color = "black";
      userInput.disabled = false;
      userInput.value = ""; // 입력창 초기화
      userInput.focus();
    }

    // 서버에서 RESULT 메시지 수신
    else if (message.type === "RESULT") {
      resultDisplay.innerHTML = `
        <p>당신의 총 소요 시간: ${message.total_time}초</p>
        <p>상대의 총 소요 시간: ${message.opponent_time}초</p>
        <p>승자: ${message.winner}</p>
      `;
      userInput.disabled = true; // 입력창 비활성화
    }
  };

  socket.onclose = () => {
    console.log("서버와 연결이 종료되었습니다.");
    resultDisplay.textContent = "서버와 연결이 종료되었습니다. 새로고침하세요.";
  };

  socket.onerror = (error) => {
    console.error("WebSocket 오류:", error);
  };

  // 클라이언트 → 서버: 정답 제출
  function checkAnswer() {
    const userText = userInput.value.trim();
    const correctText = givenSentence.textContent.trim();

    if (userText === correctText) {
      socket.send(
        JSON.stringify({
          type: "ANSWER", // 정답 제출
          correct: true,
        })
      );

      resultDisplay.textContent = "정답입니다! 다음 문장을 기다리세요...";
      resultDisplay.style.color = "green";
      userInput.disabled = true;
    } else {
      socket.send(
        JSON.stringify({
          type: "ANSWER", // 오답 제출
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

  // 클라이언트 → 서버: 게임 시작 요청
  if (startGameButton) {
    startGameButton.addEventListener("click", () => {
      const message = JSON.stringify({
        type: "START_GAME", // 게임 시작 요청
        start: true,
      });
      socket.send(message); // 서버로 메시지 전송
      console.log("'게임 시작하기' 메시지를 서버에 보냈습니다.");
    });
  }

  // 클라이언트 → 서버: 재도전 요청
  if (retryButton) {
    retryButton.addEventListener("click", (event) => {
      event.preventDefault(); // 기본 링크 동작 방지
      const message = JSON.stringify({
        type: "RETRY", // 재도전 요청
        continue: true,
      });
      socket.send(message); // 서버로 메시지 전송
      console.log("재도전 여부를 서버에 전송했습니다.");

      // 페이지 새로고침
      window.location.href = "/typing-battle.html";
    });
  }
});
