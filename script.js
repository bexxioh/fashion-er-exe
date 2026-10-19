const questions = [
  {
    key: "issue", label: "WHAT'S THE EMERGENCY?",
    title: "WHAT WENT WRONG?",
    hint: "Choose the closest match. We can get more specific later.",
    options: [
      ["zipper", "Zipper, button, or closure failure"],
      ["seam", "Tear, hole, or busted seam"],
      ["fit", "The fit is fighting me"],
      ["hem", "Hem, length, or alteration"],
      ["style", "It needs a whole new personality"],
      ["other", "Something else / not sure"]
    ]
  },
  {
    key: "garment", label: "PATIENT DETAILS",
    title: "WHAT ARE WE TREATING?",
    hint: "Pick the main garment type.",
    options: [
      ["pants", "Pants, jeans, or shorts"],
      ["top", "Top, shirt, or blouse"],
      ["dress", "Dress, skirt, or jumpsuit"],
      ["outerwear", "Jacket, coat, or outerwear"],
      ["accessory", "Bag or accessory"],
      ["other", "Other / not sure"]
    ]
  },
  {
    key: "material", label: "MATERIAL CHECK",
    title: "WHAT'S IT MADE OF?",
    hint: "A best guess is completely fine.",
    options: [
      ["woven", "Woven / non-stretch fabric"],
      ["stretch", "Knit / stretchy fabric"],
      ["denim", "Denim or heavy canvas"],
      ["delicate", "Silk, lace, satin, or delicate fabric"],
      ["leather", "Leather or faux leather"],
      ["unknown", "No clue — surprise us"]
    ]
  },
  {
    key: "severity", label: "SEVERITY CHECK",
    title: "HOW URGENT IS IT?",
    hint: "This helps us estimate complexity, not guarantee a turnaround.",
    options: [
      ["small", "Minor fix — quick tidy-up"],
      ["medium", "Noticeable damage or alteration"],
      ["major", "Major damage or complex redesign"],
      ["unsure", "I need a professional opinion"]
    ]
  },
  {
    key: "goal", label: "TREATMENT PLAN",
    title: "WHAT'S YOUR IDEAL OUTCOME?",
    hint: "We'll use this to prepare your case for review.",
    options: [
      ["repair", "Make it wearable again"],
      ["upgrade", "Repair it and add a little flair"],
      ["transform", "Give it a full makeover"],
      ["advice", "Help me decide what's possible"]
    ]
  }
];

const answers = {};
let currentStep = 0;
const intake = document.getElementById("intake");
const result = document.getElementById("result");
const questionArea = document.getElementById("question-area");
const nextButton = document.getElementById("next-button");
const backButton = document.getElementById("back-button");

function renderQuestion() {
  const question = questions[currentStep];
  document.getElementById("step-label").textContent = `TRIAGE / 0${currentStep + 1}`;
  document.getElementById("step-count").textContent = `${currentStep + 1} OF ${questions.length}`;
  document.getElementById("progress-fill").style.width = `${((currentStep + 1) / questions.length) * 100}%`;
  backButton.disabled = currentStep === 0;
  nextButton.textContent = currentStep === questions.length - 1 ? "VIEW DIAGNOSIS →" : "NEXT →";
  nextButton.disabled = !answers[question.key];

  questionArea.innerHTML = `
    <h2 class="question-title">${question.title}</h2>
    <p class="question-hint">${question.hint}</p>
    <div class="options">
      ${question.options.map(([value, label], index) => `
        <button type="button" class="option ${answers[question.key] === value ? "selected" : ""}"
          data-value="${value}" aria-pressed="${answers[question.key] === value}">
          <span class="option-mark">0${index + 1}</span><span>${label}</span>
        </button>`).join("")}
    </div>`;
  questionArea.querySelectorAll(".option").forEach((button) => {
    button.addEventListener("click", () => {
      answers[question.key] = button.dataset.value;
      renderQuestion();
    });
  });
}

function getEstimate() {
  let low = 15;
  let high = 35;
  const issue = answers.issue;
  const severity = answers.severity;
  const goal = answers.goal;
  if (issue === "zipper") { low = 20; high = 55; }
  if (issue === "seam") { low = 15; high = 45; }
  if (issue === "fit" || issue === "hem") { low = 18; high = 60; }
  if (issue === "style" || goal === "transform") { low = 35; high = 120; }
  if (severity === "medium") { high += 20; }
  if (severity === "major") { low += 20; high += 55; }
  if (answers.material === "delicate" || answers.material === "leather") { high += 20; }
  if (goal === "upgrade") { high += 15; }
  return `$${low}–$${high}+`;
}

function labelFor(key, value) {
  const question = questions.find((item) => item.key === key);
  const option = question.options.find((item) => item[0] === value);
  return option ? option[1] : value;
}

function showResult() {
  intake.classList.add("hidden");
  result.classList.remove("hidden");
  document.getElementById("result-price").textContent = getEstimate();
  const title = answers.goal === "transform" || answers.issue === "style"
    ? "PATIENT STATUS: READY FOR A GLOW-UP."
    : answers.severity === "major"
      ? "PATIENT STATUS: NEEDS A CLOSER LOOK."
      : "PATIENT STATUS: PROMISING.";
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-description").textContent =
    "We've created a preliminary treatment direction. This is a starting estimate only — B@D will need to review the garment, photos, materials, and requested work before confirming a quote.";
  document.getElementById("summary").innerHTML = questions.map((question) => `
    <div class="summary-row"><span>${question.key.toUpperCase()}</span><span>${labelFor(question.key, answers[question.key])}</span></div>
  `).join("");
  result.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.getElementById("start-button").addEventListener("click", () => {
  intake.classList.remove("hidden");
  result.classList.add("hidden");
  currentStep = 0;
  renderQuestion();
  intake.scrollIntoView({ behavior: "smooth", block: "start" });
});

nextButton.addEventListener("click", () => {
  if (!answers[questions[currentStep].key]) return;
  if (currentStep < questions.length - 1) {
    currentStep += 1;
    renderQuestion();
  } else {
    showResult();
  }
});

backButton.addEventListener("click", () => {
  if (currentStep > 0) {
    currentStep -= 1;
    renderQuestion();
  }
});

document.getElementById("restart-button").addEventListener("click", () => {
  Object.keys(answers).forEach((key) => delete answers[key]);
  currentStep = 0;
  result.classList.add("hidden");
  intake.classList.remove("hidden");
  renderQuestion();
  intake.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("garment-photo").addEventListener("change", (event) => {
  const file = event.target.files[0];
  document.getElementById("photo-status").textContent = file
    ? `Selected: ${file.name}. It is not uploaded by this demo.`
    : "Photo stays in this browser preview; this demo does not upload it.";
});

document.getElementById("case-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("customer-name").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const notes = document.getElementById("customer-notes").value.trim();
  const summaryText = questions.map((question) =>
    `${question.label}: ${labelFor(question.key, answers[question.key])}`
  ).join("\n");
  const subject = encodeURIComponent(`B@D Fashion ER case — ${name}`);
  const body = encodeURIComponent(
    `Hi B@D,\n\nI'd like to submit a garment for review.\n\nName: ${name}\nEmail: ${email}\nPreliminary estimate: ${getEstimate()}\n\n${summaryText}\n\nAdditional notes: ${notes || "None"}\n\nI understand this estimate is not a final quote.`
  );
  const message = document.getElementById("submit-message");
  message.classList.remove("hidden");
  message.textContent = "Your email app should open with the case details. This prototype does not store or transmit your information. Attach your garment photos to the email before sending.";
  window.location.href = `mailto:?subject=${subject}&body=${body}`;
});
