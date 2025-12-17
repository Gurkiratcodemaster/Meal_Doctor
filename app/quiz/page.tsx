"use client";

import { useState } from "react";
import Button from "../components/Button";

type Question = {
  question: string;
  options: string[];
};

const questions: Question[] = [
  {
    question: "What best describes your diet?",
    options: ["Vegetarian", "Eggetarian", "Non-Vegetarian", "Vegan"],
  },
  {
    question: "How many meals do you eat per day?",
    options: ["1–2 meals", "3 meals", "More than 3 meals"],
  },
  {
    question: "How often do you eat junk or fast food?",
    options: ["Rarely", "1–2 times/week", "3–4 times/week", "Daily"],
  },
  {
    question: "How many fruits or vegetables do you eat daily?",
    options: ["None", "1–2 servings", "3–4 servings", "5+ servings"],
  },
  {
    question: "How much water do you drink daily?",
    options: ["< 1 liter", "1–2 liters", "2–3 liters", "3+ liters"],
  },
  {
    question: "Do you consume protein-rich foods regularly?",
    options: ["Yes, daily", "Sometimes", "Rarely", "Not sure"],
  },
  {
    question: "How often do you consume sugary foods or drinks?",
    options: ["Rarely", "Once a week", "3–4 times/week", "Daily"],
  },
  {
    question: "Do you experience digestion issues?",
    options: ["No", "Sometimes", "Frequently"],
  },
  {
    question: "How is your energy level during the day?",
    options: ["High", "Moderate", "Low"],
  },
  {
    question: "Do you eat late at night?",
    options: ["Never", "Occasionally", "Frequently"],
  },
  {
    question: "Have you noticed any recent weight change?",
    options: ["No change", "Weight gain", "Weight loss"],
  },
  {
    question: "Do you have any food allergies or restrictions?",
    options: ["No", "Yes", "Not sure"],
  },
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState<boolean>(false);

  const progress =
    ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: value,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion === questions.length - 1) {
      setCompleted(true);
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const prevQuestion = () => {
    setCurrentQuestion((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">

        {!completed ? (
          <>
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="text-sm text-gray-500 mb-2 text-center">
              Question {currentQuestion + 1} of {questions.length}
            </p>

            {/* Question */}
            <h2 className="text-lg font-semibold mb-4 text-center">
              {questions[currentQuestion].question}
            </h2>

            {/* Options */}
            <select
              className="w-full border rounded p-3 mb-6"
              value={answers[currentQuestion] ?? ""}
              onChange={(e) => handleAnswer(e.target.value)}
            >
              <option value="">Select an option</option>
              {questions[currentQuestion].options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
              >
                Back
              </Button>

              <Button
                className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]}
              >
                {currentQuestion === questions.length - 1
                  ? "Submit"
                  : "Next"}
              </Button>
            </div>
          </>
        ) : (
          /* Final Screen */
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              🎉 Quiz Completed!
            </h2>

            <p className="text-gray-600 mb-6">
              Your answers have been recorded successfully.
            </p>

            <Button className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
              Get My AI Health Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
