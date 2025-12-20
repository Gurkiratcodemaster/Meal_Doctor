"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
];

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [completed, setCompleted] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
    <div className="min-h-screen flex items-center justify-center px-4
      bg-gradient-to-br from-green-900 via-black to-green-800">

      {/* GLOW BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.25),_transparent_60%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
          relative w-full max-w-xl
          backdrop-blur-xl bg-white/10
          border border-white/20
          rounded-2xl shadow-2xl
          p-6 sm:p-8
        "
      >
        {!completed ? (
          <>
            {/* PROGRESS BAR */}
            <div className="mb-6">
              <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-[0_0_15px_#22c55e]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-center text-sm text-gray-300 mt-2">
                Question {currentQuestion + 1} of {questions.length}
              </p>
            </div>

            {/* QUESTION */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-semibold text-white text-center mb-6">
                  {questions[currentQuestion].question}
                </h2>

                {/* SELECT */}
                <select
                  className="
                    w-full p-4 rounded-xl mb-6
                    bg-black/40 text-white
                    border border-white/20
                    focus:outline-none focus:ring-2 focus:ring-green-400
                  "
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
              </motion.div>
            </AnimatePresence>

            {/* BUTTONS */}
            <div className="flex justify-between mt-4">
              <Button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className="
                  px-6 py-2 rounded-xl
                  bg-white/20 text-white
                  hover:bg-white/30 transition
                  disabled:opacity-40
                "
              >
                Back
              </Button>

              <Button
                onClick={nextQuestion}
                disabled={!answers[currentQuestion]}
                className="
                  px-8 py-2 rounded-xl
                  bg-green-500 text-black font-semibold
                  hover:bg-green-400
                  shadow-[0_0_20px_#22c55e]
                  transition
                  disabled:opacity-40
                "
              >
                {currentQuestion === questions.length - 1 ? "Submit" : "Next"}
              </Button>
            </div>
          </>
        ) : (
          /* COMPLETED */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <h2 className="text-3xl font-bold mb-4">
              🎉 Quiz Completed!
            </h2>
            <p className="text-gray-300 mb-6">
              Your answers are ready. Let AI analyze your health pattern.
            </p>

            <Button
              className="
                px-8 py-3 rounded-xl
                bg-gradient-to-r from-green-400 to-emerald-500
                text-black font-bold
                shadow-[0_0_25px_#22c55e]
                hover:scale-105 transition
              "
            >
              Get My AI Health Report 🚀
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
