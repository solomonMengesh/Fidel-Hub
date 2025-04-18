// QuizFetcher.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import QuizView from "./QuizView"; // Adjust path if necessary
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const QuizFetcher = ({ lessonId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/quizzes/6800c842590c687df2300c2a/questions`);
        setQuestions(res.data);
      } catch (error) {
        console.error("Error fetching quiz questions:", error);
        toast.error("Failed to load quiz questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [lessonId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  return (
    <QuizView
      questions={questions}
      onComplete={(score) => {
        console.log("Quiz completed with score:", score);
      }}
    />
  );
};

export default QuizFetcher;
