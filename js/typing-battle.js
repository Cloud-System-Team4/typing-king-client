const socket = new WebSocket("ws://localhost:9998"); // WebSocket 인스턴스 전역 선언

document.addEventListener("DOMContentLoaded", () => {
  const givenSentence = document.getElementById("given-sentence");
  const userInput = document.getElementById("user-input");
  const resultDisplay = document.getElementById("result");
  const retryButton = document.getElementById("retry-button"); // 재도전 버튼

  // WebSocket 이벤트 핸들러
  socket.onopen = () => {
    console.log("서버에 연결되었습니다.");
    resultDisplay.textContent = "매칭을 시도 중입니다..."; // 페이지에 처음 접속했을때
  };

  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);

    // 매칭 중 문구 표시
    if (message.type === "MATCHING") {
      resultDisplay.textContent = "매칭 중... 상대방을 기다리고 있습니다."; // 서버가 MATCHING 메시지를 보냈을때
    }

    // 카운트다운 처리
    else if (message.type === "COUNTDOWN") {
      const playerRole = message.player; // 서버로부터 받은 플레이어 정보 (예: "Player1" 또는 "Player2")
      const sentence = message.sentence; // 서버로부터 받은 첫 번째 문장
      let countdown = 3; // 카운트다운 시작 숫자

      // 플레이어 정보 표시
      resultDisplay.textContent = `당신은 ${playerRole}입니다. 게임이 곧 시작됩니다...`;

      const interval = setInterval(() => {
        resultDisplay.textContent = `${countdown}...`;
        countdown--;
        if (countdown < 0) {
          clearInterval(interval);
          resultDisplay.textContent = "게임 시작!";
          givenSentence.textContent = message.sentence; // 첫 문장 표시
          userInput.disabled = false;
          userInput.focus();
        }
      }, 1000); // 1초 간격
    }

    // 게임 진행 중: 새로운 문장 전달
    else if (message.type === "NEXT_SENTENCE") {
      givenSentence.textContent = message.sentence;
      resultDisplay.textContent = "새 문장이 도착했습니다! 입력을 시작하세요.";
      resultDisplay.style.color = "black";
      userInput.disabled = false;
      userInput.value = "";
      userInput.focus();
    }

    // 상대방이 게임을 끝내지 않았을 때 대기 문구 표시
    else if (message.type === "WAIT_FOR_OPPONENT") {
      resultDisplay.textContent =
        "상대방의 입력이 끝날 때까지 기다리고 있습니다...";
      userInput.disabled = true; // 입력 비활성화
    }

    // 결과 페이지 이동
    else if (message.type === "GAME_OVER") {
      console.log("게임이 종료되었습니다. 결과 페이지로 이동합니다.");
      window.location.href = "typing-result.html";
    }

    // 게임 결과 출력
    else if (message.type === "RESULT") {
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
    resultDisplay.textContent = "서버와 연결이 종료되었습니다. 새로고침하세요.";
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

  // 재도전 버튼 클릭 이벤트
  if (retryButton) {
    retryButton.addEventListener("click", () => {
      socket.send(
        JSON.stringify({
          type: "RETRY",
          continue: true,
        })
      );
      console.log("재도전 요청을 서버로 보냈습니다.");
      window.location.href = "/typing-battle.html"; // 페이지 새로고침
    });
  }
});
