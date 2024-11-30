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

  const selectedSentences = [];
  while (selectedSentences.length < 2) {
    const randomIndex = Math.floor(Math.random() * SAMPLE_SENTENCES.length);
    const sentence = SAMPLE_SENTENCES[randomIndex];
    if (!selectedSentences.includes(sentence)) {
      selectedSentences.push(sentence);
    }
  }

  let currentSentenceIndex = 0;

  givenSentence.textContent = selectedSentences[currentSentenceIndex];

  function checkAnswer() {
    const userText = userInput.value.trim();
    const correctText = givenSentence.textContent.trim();

    if (userText === correctText) {
      currentSentenceIndex++;
      if (currentSentenceIndex < selectedSentences.length) {
        givenSentence.textContent = selectedSentences[currentSentenceIndex];
        userInput.value = "";
        resultDisplay.textContent = "정답입니다! 🎉";
        resultDisplay.style.color = "green";
      } else {
        resultDisplay.textContent = "모든 문장을 완료했습니다! 🎉";
        resultDisplay.style.color = "blue";

        const moveMessage = document.createElement("p");
        moveMessage.id = "countdown";
        moveMessage.textContent = "3초 뒤에 결과 페이지로 이동합니다.";
        moveMessage.style.marginTop = "10px";
        moveMessage.style.color = "black";
        moveMessage.style.fontWeight = "normal";
        resultDisplay.appendChild(moveMessage);

        userInput.disabled = true;

        let countdown = 3;
        const interval = setInterval(() => {
          if (countdown > 1) {
            countdown--;
            moveMessage.textContent = `${countdown}초 뒤에 결과 페이지로 이동합니다.`;
          } else {
            clearInterval(interval);
            window.location.href = "/typing-result.html";
          }
        }, 1000);
      }
    } else {
      resultDisplay.textContent = "다시 시도해주세요. ❌";
      resultDisplay.style.color = "red";
    }
  }

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
});
