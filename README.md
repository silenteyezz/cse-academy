# Asin's Computer Science & Engineering Academic Portal

A vibrant, accessible, full-stack 3-page web platform created for **Asin**, designed specifically for undergraduate Computer Science & Engineering students.

---

## 🌟 The Three Main Pages

1. **Page 1: Welcome Page (`index.html`)**
   - High-impact welcome hero banner, portal overview, curriculum competency highlights, and accessibility pledge.
2. **Page 2: Semester Roadmap & Curated Resources (`roadmap.html`)**
   - Chronological engineering roadmap from Year 1 foundations (C, Data Structures, OOP) through Year 4 specializations (Cloud, AI/ML, Cybersecurity).
   - Curated directory of 100% free textbooks, coding practice sites (LeetCode, HackerRank), developer tools (Git, Linux), and accessibility guides.
3. **Page 3: 10-Question Interactive CS Quiz (`quiz.html`)**
   - Complete 10-question assessment covering Data Structures, Algorithms, Object-Oriented Programming, Operating Systems, and Web Accessibility.
   - **Real-Time Scoring Marks:** Calculates total marks (out of 10) and percentage upon submission.
   - **Detailed Answer Review:** Explains the correct answer and computer science concepts behind each question.
   - **Screen Reader Announcements:** Dynamic `aria-live="polite"` region speaks your score aloud.
   - **Retake Option:** Cleanly resets the form to test again.

---

## 📁 Project Structure

```text
clg/
├── index.html        # Page 1: Welcome & Portal Introduction
├── roadmap.html      # Page 2: Semester-by-Semester Roadmap & Resources
├── quiz.html         # Page 3: 10-Question Interactive Quiz with Live Scoring
├── style.css         # Shared responsive stylesheet with vibrant design system
├── script.js         # Mobile navigation toggle & interactive quiz engine
├── server.js         # Native Node.js backend (static server & quiz scoring API)
├── server.py         # Python 3 alternative backend server
├── quiz_scores.json  # Local JSON database for recorded quiz attempts
├── package.json      # Node.js start configuration
└── README.md         # Documentation & setup guide
```

---

## 🚀 How to Run the 3-Page Website

### Option 1: Run with Node.js (Recommended)
1. Open PowerShell or Command Prompt in this folder:
   ```powershell
   cd "c:\Users\akther asin\OneDrive\Desktop\clg"
   ```
2. Start the local server:
   ```powershell
   node server.js
   ```
   *(Or run `npm start`)*
3. Open your browser and navigate to:
   - **Welcome Page:** [http://localhost:3000](http://localhost:3000)
   - **Roadmap Page:** [http://localhost:3000/roadmap.html](http://localhost:3000/roadmap.html)
   - **Interactive Quiz:** [http://localhost:3000/quiz.html](http://localhost:3000/quiz.html)

### Option 2: Run with Python
```powershell
python server.py
```
Then visit [http://localhost:3000](http://localhost:3000).

### Option 3: Direct File Opening (No Terminal Needed)
Double-click `index.html` in Windows Explorer. All 3 pages will open and navigate seamlessly via your browser!

---

## 🧠 Quiz Questions & Assessment Topics

The 10 questions test foundational engineering competencies:
1. **Data Structures:** Worst-case time complexity of array index access (O(1)).
2. **Algorithms:** Best average-case time complexity (QuickSort O(N log N)).
3. **OOP Principles:** Subclass specific implementation of parent method (Method Overriding / Polymorphism).
4. **Memory Management:** Dynamic runtime memory segment in C/C++ (Heap).
5. **Web Standards:** Architectural purpose of semantic HTML5 landmark tags (Accessibility & Screen Readers).
6. **Operating Systems:** Circular dependency of waiting processes (Deadlock).
7. **Web Protocols:** HTTP code confirming resource creation (201 Created).
8. **Data Structures:** LIFO operational ordering (Stack).
9. **Database Systems:** SQL clause filtering rows after aggregate functions (HAVING).
10. **Accessibility:** Minimum WCAG 2.1 AA body text contrast ratio (4.5 : 1).

---

## ♿ Accessibility Compliance

- **POUR Principles:** Structured with semantic HTML5 (`<header>`, `<nav>`, `<main>`, `<fieldset>`, `<legend>`, `<footer>`).
- **Skip Link:** Direct jump to `<main id="main-content">` on each page.
- **Keyboard Traversal:** Complete operability using <kbd>Tab</kbd>, <kbd>Space</kbd>, <kbd>Enter</kbd>, and <kbd>Escape</kbd>.
- **High Contrast:** All elements exceed WCAG AA/AAA (> 7:1 contrast).
- **Reduced Motion:** Fully honors `@media (prefers-reduced-motion: reduce)`.

---

## 📄 License

Created by **Asin** for academic learning and computer science education.
