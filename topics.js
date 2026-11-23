// MathHelper topic catalog: lessons + practice problems (pure data, no DOM).
// Shared by the page script and the action bridge.

export const TOPICS = [
  {
    id: "equations", title: "Solving Equations", subject: "Algebra",
    blurb: "Find x — undo the operations, one step at a time.",
    lesson: [
      "An equation states that two expressions are equal, for example 2x + 5 = 17.",
      "To solve it, do the same operation to both sides until the variable is alone.",
      "Undo addition with subtraction, and undo multiplication with division.",
      "Always check your answer by putting it back into the original equation."
    ],
    problems: [
      { q: "Solve: x + 9 = 20. What is x?", answer: 11, steps: "x = 20 - 9 = 11. Check: 11 + 9 = 20." },
      { q: "Solve: 4x = 36. What is x?", answer: 9, steps: "x = 36 / 4 = 9. Check: 4 x 9 = 36." },
      { q: "Solve: 2x + 5 = 17. What is x?", answer: 6, steps: "2x = 17 - 5 = 12, so x = 12 / 2 = 6. Check: 2 x 6 + 5 = 17." },
      { q: "Solve: x / 3 = 7. What is x?", answer: 21, steps: "x = 7 x 3 = 21. Check: 21 / 3 = 7." },
      { q: "Solve: 5x - 3 = 22. What is x?", answer: 5, steps: "5x = 22 + 3 = 25, so x = 25 / 5 = 5. Check: 5 x 5 - 3 = 22." }
    ]
  },
  {
    id: "fractions", title: "Fractions of a Number", subject: "Fractions",
    blurb: "A fraction of something is a share of it.",
    lesson: [
      "A fraction like 3/4 means 3 parts out of 4 equal parts.",
      "To find a fraction of a number, multiply the number by the numerator and divide by the denominator.",
      "A quick way: divide the number by the denominator first, then multiply by the numerator.",
      "Fractions of a whole number are whole numbers when the number divides evenly."
    ],
    problems: [
      { q: "What is 1/2 of 48?", answer: 24, steps: "48 / 2 = 24." },
      { q: "What is 3/4 of 80?", answer: 60, steps: "80 / 4 = 20, then 20 x 3 = 60." },
      { q: "What is 2/5 of 150?", answer: 60, steps: "150 / 5 = 30, then 30 x 2 = 60." },
      { q: "What is 1/3 + 2/3, as a whole number?", answer: 1, steps: "1/3 + 2/3 = 3/3 = 1." },
      { q: "What is 5/6 of 60?", answer: 50, steps: "60 / 6 = 10, then 10 x 5 = 50." }
    ]
  },
  {
    id: "percentages", title: "Percentages in Money", subject: "Percentages",
    blurb: "Discounts, markups, and shares of a price.",
    lesson: [
      "Percent means per hundred: 10% = 10/100 = 0.10.",
      "To find a percentage of a price, multiply the price by the percentage and divide by 100.",
      "A discount reduces the price: sale price = original price minus the discount.",
      "A markup increases the price: new price = original price plus the increase."
    ],
    problems: [
      { q: "What is 10% of 250?", answer: 25, steps: "250 x 10 / 100 = 25." },
      { q: "What is 50% of 86?", answer: 43, steps: "50% is one half: 86 / 2 = 43." },
      { q: "A Rp100,000 item has a 20% discount. What is the sale price?", answer: 80000, steps: "Discount = 20% of 100,000 = 20,000. Sale price = 100,000 - 20,000 = 80,000." },
      { q: "What is 75% of 120?", answer: 90, steps: "120 x 75 / 100 = 90." },
      { q: "A price of Rp40,000 rises by 25%. What is the new price?", answer: 50000, steps: "Increase = 25% of 40,000 = 10,000. New price = 40,000 + 10,000 = 50,000." }
    ]
  },
  {
    id: "geometry", title: "Area & Perimeter", subject: "Geometry",
    blurb: "Measure the shapes around you.",
    lesson: [
      "Area is the space inside a shape. Perimeter is the distance around it.",
      "Rectangle area = length x width. Rectangle perimeter = 2 x (length + width).",
      "Square perimeter = 4 x side. Triangle area = (base x height) / 2.",
      "Circle area = pi x radius squared. Here use pi = 22/7."
    ],
    problems: [
      { q: "A rectangle is 8 cm by 5 cm. What is its area?", answer: 40, steps: "Area = 8 x 5 = 40 square cm." },
      { q: "A square has side 7 cm. What is its perimeter?", answer: 28, steps: "Perimeter = 4 x 7 = 28 cm." },
      { q: "A triangle has base 10 cm and height 6 cm. What is its area?", answer: 30, steps: "Area = (10 x 6) / 2 = 30 square cm." },
      { q: "A circle has radius 7 cm (use pi = 22/7). What is its area?", answer: 154, steps: "Area = 22/7 x 7 x 7 = 22 x 7 = 154 square cm." },
      { q: "A rectangle is 12 m by 9 m. What is its perimeter?", answer: 42, steps: "Perimeter = 2 x (12 + 9) = 2 x 21 = 42 m." }
    ]
  }
];
