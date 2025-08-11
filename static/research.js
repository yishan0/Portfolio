const output = document.getElementById("output");
const inputLine = document.getElementById("input-line");
const input = document.getElementById("terminal-input");
let researchStarted = false;
let questions = [];

const responses = {
  help: "Hey, here’s what you may want to ask me.\n'about' to see more about who I am.\n'projects' to see some of my current and past projects I've worked on.\n'clear' to clear everything I've said so far.",
  about: "I’m Yishan Lin, and here you can find some of my projects and skills.",
  begin: "Below, you will be given multiple images resembling a child's drawing. Your task is to tell whether the drawing is made by a child or an AI model.",
  researchBegun: "What do you mean? The research has already begun. Please proceed with the tasks.",
  clear: "Welcome to my portfolio - Yishan Lin\nTerminal Cleared. Type 'help' for available commands."
};

let currentQuestionIndex = 0;

// Match user input to commands
function matchCommand(input) {
  const text = input.toLowerCase();

  const helpKeywords = ["help", "support", "assist", "what do i do", "help me out", "how to", "how do i"];
  for (let kw of helpKeywords) if (text.includes(kw)) return "help";

  const aboutKeywords = ["about", "who are you", "your story", "background"];
  for (let kw of aboutKeywords) if (text.includes(kw)) return "about";

  const okKeywords = ["ok", "okay", "begin", "yes", "sure", "go", "start", "ready"];
  for (let kw of okKeywords) {
    if (text.includes(kw) && !researchStarted) {
      researchStarted = true;
      return "begin";
    } else if (text.includes(kw)) {
      return "researchBegun";
    }
  }

  if (text === "clear") return "clear";
  if (["1", "2", "3"].includes(text.trim())) return text.trim();
  return null;
}

// Typing effect
function typeLine(text, callback = () => {}) {
  const pre = document.createElement("pre");
  pre.classList.add("terminal-line");
  pre.textContent = ">> ";
  output.appendChild(pre);

  let i = 0;
  function typeChar() {
    if (i < text.length) {
      const char = text[i];
      pre.textContent += char === "\n" ? "\n>> " : char;
      i++;
      setTimeout(typeChar, 30);
    } else {
      callback();
    }
  }
  typeChar();
}

// Button + Slider UI with requirement enforcement
function showChoiceButtons(label1, label2, callback) {
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

  const slidersWrapper = document.createElement("div");
  slidersWrapper.classList.add("slider-wrapper");

  const criteria = [
    { id: "creativity", label: "Creativity" },
    { id: "theme", label: "Connection to Theme" }
  ];

  const sliderStates = { creativity: false, theme: false };

  criteria.forEach(({ id, label }) => {
    const group = document.createElement("div");
    group.className = "slider-label-group";
  
    const sliderLabel = document.createElement("div");
    sliderLabel.className = "slider-label";
    sliderLabel.textContent = label;
  
    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = id;
    slider.min = 1;
    slider.max = 5;
    slider.step = 1;
    slider.value = 3;
    slider.className = "rating-slider";
  
    slider.addEventListener("input", () => {
      sliderStates[id] = true;
    });
  
    const valueLabels = document.createElement("div");
    valueLabels.className = "slider-values";
    for (let i = 1; i <= 5; i++) {
      const span = document.createElement("span");
      span.textContent = i;
      valueLabels.appendChild(span);
    }
  
    group.appendChild(sliderLabel);
    group.appendChild(slider);
    group.appendChild(valueLabels);
    slidersWrapper.appendChild(group);
  });

  const button1 = document.createElement("button");
  const button2 = document.createElement("button");

  button1.textContent = label1;
  button2.textContent = label2;

  button1.className = "custom-terminal-button";
  button2.className = "custom-terminal-button";

  const checkSlidersReady = () => {
    return Object.values(sliderStates).every(v => v);
  };

  const onButtonClick = (label) => {
    if (!checkSlidersReady()) {
      alert("Please adjust both sliders before making your choice.");
      return;
    }

    const ratings = {
      creativity: document.getElementById("creativity").value,
      theme: document.getElementById("theme").value
    };

    output.removeChild(buttonContainer);
    callback(label, ratings);
  };

  button1.addEventListener("click", () => onButtonClick(label1));
  button2.addEventListener("click", () => onButtonClick(label2));

  buttonContainer.appendChild(slidersWrapper);
  buttonContainer.appendChild(button1);
  buttonContainer.appendChild(button2);

  output.appendChild(buttonContainer);
  inputLine.style.display = "none";
}

// Start research session
function beginResearch() {
  currentQuestionIndex = 0;
  askNextQuestion();
}

function askNextQuestion() {
  if (currentQuestionIndex < questions.length) {
    const q = questions[currentQuestionIndex];

    typeLine(`Title: ${q.title}\nDescription: ${q.description}`, () => {
      const img = document.createElement("img");
      img.src = `/static/images/${q.filename}`;
      img.alt = q.title;
      img.className = "terminal-image";
      output.appendChild(img);

      showChoiceButtons("AI", "Human", (choice, ratings) => {
        const correct = choice.toLowerCase() === q.answer.toLowerCase();
        typeLine(
          `You thought that this artwork was made by: ${choice}\nYou gave rated this artwork's creativity (out of 5): ${ratings.creativity}\nyou rated this artwork's connection to theme (out of 5): ${ratings.theme}\n${correct ? "Great, you got it correct!\n" : "Wrong, you were fooled by the machines!\n"}`,
          () => {
            currentQuestionIndex++;
            askNextQuestion();
          }
        );
      });
    });
  } else {
    typeLine("All questions answered. Thanks for taking part in my research!", () => {
      inputLine.style.display = "flex";
      input.focus();
    });
  }
}

// Command processor
function processCommand(command) {
  typeLine(command, () => {
    const cmd = matchCommand(command);

    if (cmd === "clear") {
      output.innerHTML = "";
      typeLine(responses.clear, () => {
        inputLine.style.display = "flex";
        input.focus();
      });
    } else if (cmd === "help" || cmd === "about" || cmd === "researchBegun") {
      typeLine(responses[cmd], () => {
        inputLine.style.display = "flex";
        input.focus();
      });
    } else if (cmd === "begin") {
      beginResearch();
    } else if (["1", "2", "3"].includes(cmd)) {
      window.location.href = "/research";
    } else {
      typeLine("Unknown command. Try 'help'.", () => {
        inputLine.style.display = "flex";
        input.focus();
      });
    }
  });
}

// Keyboard and DOM initialization
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const command = input.value.trim();
    if (command === "") return;
    input.value = "";
    inputLine.style.display = "none";
    processCommand(command);
  }
});

window.addEventListener("DOMContentLoaded", () => {
  fetch("/get_questions")
    .then(res => res.json())
    .then(data => {
      questions = data;
      typeLine("Hello. Thank you for taking part in my research.\nExplanation of project here.\nReady? Type 'ok' to begin", () => {
        inputLine.style.display = "flex";
        input.focus();
        researchStarted = false;
      });
    });
});

document.addEventListener("click", () => {
  input.focus();
});