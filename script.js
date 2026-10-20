/**
 * CSE Academic Portal - Client Script (script.js)
 * Features:
 *  1. Responsive mobile navigation
 *  2. 10-Question Interactive Assessment Engine with live score calculation
 */

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add('js-enabled');
  initNavigation();
  initQuiz();
});

/**
 * Navigation Menu Handler
 */
function initNavigation() {
  const toggleBtn = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('primary-nav');

  if (!toggleBtn || !navMenu) return;

  function toggle() {
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    navMenu.classList.toggle('is-open', !isExpanded);
  }

  function close() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
  }

  toggleBtn.addEventListener('click', toggle);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      close();
      toggleBtn.focus();
    }
  });

  document.addEventListener('click', (e) => {
    if (toggleBtn.getAttribute('aria-expanded') === 'true' &&
        !toggleBtn.contains(e.target) &&
        !navMenu.contains(e.target)) {
      close();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) close();
  });
}

/**
 * 10-Question Quiz Engine
 */
function initQuiz() {
  const form = document.getElementById('cs-quiz-form');
  if (!form) return;

  const resultsSection = document.getElementById('results-section');
  const scoreCard = document.getElementById('quiz-score-card');
  const progressCount = document.getElementById('progress-count');
  const progressPercentage = document.getElementById('progress-percentage');
  const progressFill = document.getElementById('progress-fill');
  const submitBtn = document.getElementById('submit-quiz-btn');
  const resetBtn = document.getElementById('reset-quiz-btn');

  const quizData = [
    {
      id: 'q1',
      correctIndex: 2,
      correctText: 'C) O(1)',
      explanation: 'Arrays store elements in contiguous memory blocks. The memory address is calculated instantly in O(1) constant time: Base Address + (Index * Element Size).'
    },
    {
      id: 'q2',
      correctIndex: 2,
      correctText: 'C) QuickSort',
      explanation: 'QuickSort has an average-case time complexity of O(N log N). Bubble Sort, Selection Sort, and Insertion Sort all average O(N²).'
    },
    {
      id: 'q3',
      correctIndex: 1,
      correctText: 'B) Method Overriding (Polymorphism)',
      explanation: 'Method Overriding allows a subclass to define its own specific version of a method inherited from a parent class, forming the core of runtime polymorphism.'
    },
    {
      id: 'q4',
      correctIndex: 2,
      correctText: 'C) Heap',
      explanation: 'The Heap segment is allocated for dynamic memory at runtime (via malloc, calloc, or new). Function frames and local variables reside on the Stack.'
    },
    {
      id: 'q5',
      correctIndex: 1,
      correctText: 'B) They provide structural landmarks for screen readers and assistive technologies',
      explanation: 'Semantic elements (<main>, <header>, <nav>) provide structural landmarks that enable screen-reader users to navigate directly to sections of interest.'
    },
    {
      id: 'q6',
      correctIndex: 1,
      correctText: 'B) Deadlock',
      explanation: 'A Deadlock is a permanent waiting condition where two or more processes each hold a resource that the other process requires to proceed.'
    },
    {
      id: 'q7',
      correctIndex: 1,
      correctText: 'B) 201 Created',
      explanation: 'HTTP 201 Created indicates that the request has succeeded and led to the creation of a new resource on the server.'
    },
    {
      id: 'q8',
      correctIndex: 2,
      correctText: 'C) Stack',
      explanation: 'A Stack operates strictly on Last-In, First-Out (LIFO) order. The most recently added element is the first one removed. Queues operate on FIFO.'
    },
    {
      id: 'q9',
      correctIndex: 1,
      correctText: 'B) HAVING',
      explanation: 'In SQL, the WHERE clause filters rows before grouping, while the HAVING clause filters groups after aggregate functions (COUNT, SUM, AVG) are applied.'
    },
    {
      id: 'q10',
      correctIndex: 1,
      correctText: 'B) 4.5 : 1',
      explanation: 'WCAG 2.1 Level AA requires a minimum contrast ratio of 4.5:1 for regular text (and 3:1 for large text) against its background.'
    }
  ];

  // Update progress bar
  form.addEventListener('change', (e) => {
    if (e.target.type === 'radio') {
      const groupName = e.target.name;
      form.querySelectorAll(`input[name="${groupName}"]`).forEach(radio => {
        const label = radio.closest('.quiz-option-label');
        if (label) label.classList.toggle('is-selected', radio.checked);
      });

      let answered = 0;
      quizData.forEach(q => {
        if (form.querySelector(`input[name="${q.id}"]:checked`)) answered++;
      });

      const percent = Math.round((answered / quizData.length) * 100);
      progressCount.textContent = answered;
      progressPercentage.textContent = `${percent}% Completed`;
      progressFill.style.width = `${percent}%`;
      const track = progressFill.closest('[role="progressbar"]');
      if (track) track.setAttribute('aria-valuenow', percent);
    }
  });

  // Calculate and display scores
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const unanswered = [];
    quizData.forEach((q, i) => {
      if (!form.querySelector(`input[name="${q.id}"]:checked`)) {
        unanswered.push(i + 1);
      }
    });

    const errorMsg = document.getElementById('quiz-error-msg');
    if (unanswered.length > 0) {
      const msg = `Please answer all questions before submitting. Unanswered: Question ${unanswered.join(', ')}.`;
      if (errorMsg) {
        errorMsg.textContent = '';
        // Force re-announce by toggling content
        requestAnimationFrame(() => { errorMsg.textContent = msg; });
      }
      const firstUnanswered = document.getElementById(`q${unanswered[0]}-fieldset`);
      if (firstUnanswered) {
        firstUnanswered.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstUnanswered.querySelector('input[type="radio"]')?.focus();
      }
      return;
    }
    // Clear any prior error on successful submit
    if (errorMsg) errorMsg.textContent = '';

    let correct = 0;
    quizData.forEach(q => {
      const selected = form.querySelector(`input[name="${q.id}"]:checked`);
      const userChoice = parseInt(selected.value, 10);
      const isCorrect = userChoice === q.correctIndex;

      if (isCorrect) correct++;

      const feedback = document.getElementById(`${q.id}-feedback`);
      if (feedback) {
        feedback.style.display = 'block';
        feedback.className = isCorrect ? 'quiz-explanation explanation-correct' : 'quiz-explanation explanation-incorrect';
        feedback.innerHTML = `
          <p><strong>${isCorrect ? 'Correct.' : 'Incorrect.'}</strong> Correct Answer: <strong>${q.correctText}</strong></p>
          <p style="margin-bottom: 0;">${q.explanation}</p>
        `;
      }
    });

    const total = quizData.length;
    const percentage = Math.round((correct / total) * 100);

    let status = '';
    if (percentage >= 80) status = 'Distinction';
    else if (percentage >= 60) status = 'Good Pass';
    else if (percentage >= 50) status = 'Satisfactory Pass';
    else status = 'Review Recommended';

    scoreCard.innerHTML = `
      <div class="card-header">
        <span class="badge">Assessment Results</span>
        <h2 style="margin: 0.5rem 0 0 0; font-size: 1.8rem; border: none;">Final Score</h2>
        <div class="score-number">${correct} / ${total}</div>
        <p style="font-size: 1.25rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.25rem;">
          ${percentage}% &bull; ${status}
        </p>
        <p style="color: var(--color-text-muted); font-size: 0.95rem;">
          Detailed explanations for each question are shown below.
        </p>
      </div>
    `;

    resultsSection.style.display = 'block';
    form.querySelectorAll('input[type="radio"]').forEach(r => { r.disabled = true; r.setAttribute('aria-disabled', 'true'); });
    submitBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    resultsSection.setAttribute('tabindex', '-1');
    resultsSection.focus();

    // Async record to backend
    fetch('/api/quiz-score', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ score: correct, total: total, percentage: percentage, status: status })
    }).catch(() => {});
  });

  // Retake Quiz
  resetBtn.addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('input[type="radio"]').forEach(r => {
      r.disabled = false;
      r.removeAttribute('aria-disabled');
      r.closest('.quiz-option-label')?.classList.remove('is-selected');
    });

    quizData.forEach(q => {
      const fb = document.getElementById(`${q.id}-feedback`);
      if (fb) fb.style.display = 'none';
    });

    progressCount.textContent = '0';
    progressPercentage.textContent = '0% Completed';
    progressFill.style.width = '0%';
    resultsSection.style.display = 'none';

    submitBtn.style.display = 'inline-flex';
    resetBtn.style.display = 'none';

    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

