# Digital Electronics Calculator

A modern, interactive web application for digital electronics students and professionals.  
This calculator provides a suite of tools for Boolean algebra, Karnaugh maps, truth tables, base conversions, sequential circuits.
---

## 🚀 Features

- **Karnaugh Map (K-Map) Interactive Solver**
  - Supports 2-4 variables
  - Clickable K-Map cells (0, 1, X)
  - Real-time minimal SOP solution, truth table, and logic gate diagram

- **Boolean Algebra Simplifier**
  - Enter any Boolean expression (supports AND, OR, NOT, NAND, NOR, XOR, XNOR, parentheses)
  - Step-by-step simplification and minimal SOP form

- **Truth Table Generator**
  - Generates a full truth table for any Boolean expression
  - Color-coded outputs for easy visualization

- **Base Conversion Calculator**
  - Convert between binary, octal, decimal, and hexadecimal
  - Step-by-step conversion explanation

- **Binary Arithmetic Calculator**
  - Add, subtract, multiply, or divide binary numbers
  - Shows all calculation steps

- **Gray Code Converter**
  - Convert binary to Gray code and vice versa

- **BCD Converter**
  - Convert decimal to BCD and BCD to decimal

- **Sequential Circuits**
  - Flip-Flop calculator (SR, JK, D, T)
  - Counter and Register calculators

---

## 🖥️ Live Demo

> _Host the site on your favorite static server or open `src/index.html` in your browser._

---

## 📦 Folder Structure

```
src/
  index.html
  css/
    styles.css
  js/
    main.js
    logic-diagram.js
```

---

## 🛠️ Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/yourusername/digital-electronics-calculator.git
cd digital-electronics-calculator/src
```

### 2. **Open in Browser**

Just open `src/index.html` in your browser.  
No build step is required.

### 3. **(Optional) Serve Locally**

For best results, use a local server:

```bash
# Python 3
python3 -m http.server 8080
# Then visit http://localhost:8080/src/
```

---

## ✨ Customization

- **UI/UX:** All styles are in Tailwind CSS. You can further customize by editing classes in `index.html` and components.
- **Logic:** All calculators are in `js/main.js`. Add new features or tweak logic as needed.
- **Animations:** Tailwind’s `transition`, `duration`, and `animate-*` classes are used for smooth effects.

---

## 🧑‍💻 Technologies Used

- Vanilla JavaScript (no frameworks)
- [D3.js](https://d3js.org/) (for logic gate diagrams)
- HTML5/CSS3

---

## 📝 Usage Notes

- Boolean expressions support: `A`, `B`, `C`, `D`, `'` (NOT), `*` or no symbol (AND), `+` (OR), `^` (XOR), `NAND`, `NOR`, `XNOR`, and parentheses.
- K-Map and truth table outputs are color-coded for clarity.
- All calculators are mobile-friendly and accessible.

---

## 📄 License

- MIT

---

## 🙏 Credits

- Inspired by digital electronics courses and open-source logic tools.

---

## 🤝 Contributing

Pull requests and suggestions are welcome!  
Please open an issue or PR for bug fixes, improvements, or new features.

---

## 📬 Contact

For questions or feedback, open an issue or contact [yrahul906@gmail.com](mailto:yrahul906@gmail.com).

---