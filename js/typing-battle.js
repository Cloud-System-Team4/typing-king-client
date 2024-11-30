document.addEventListener("DOMContentLoaded", () => {
  const givenSentence = document.getElementById("given-sentence");
  const userInput = document.getElementById("user-input");
  const resultDisplay = document.getElementById("result");

  givenSentence.textContent = "dog";

  function checkAnswer() {
    const userText = userInput.value.trim();
    const correctText = givenSentence.textContent.trim();

    if (userText === correctText) {
      resultDisplay.textContent = "정답입니다! 🎉";
      resultDisplay.style.color = "green";
    } else {
      resultDisplay.textContent = "다시 시도해주세요. ❌";
      resultDisplay.style.color = "red";
    }
  }

  // Enter 키 이벤트
  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      checkAnswer();
    }
  });
});
