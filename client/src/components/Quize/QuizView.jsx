import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox ";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Check, X, ChevronRight, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const QuizView = ({ lesson_id, onComplete, studentId, courseId }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentLoading, setEnrollmentLoading] = useState(true);

  // Check enrollment status
  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/enrollments/check?studentId=${studentId}&courseId=${courseId}`
        );
        const data = await response.json();
        setIsEnrolled(data?.isEnrolled || false);
      } catch (error) {
        console.error("Error checking enrollment:", error);
      } finally {
        setEnrollmentLoading(false);
      }
    };

    if (studentId && courseId) {
      checkEnrollment();
    } else {
      setEnrollmentLoading(false);
    }
  }, [studentId, courseId]);

  // Fetch quiz questions from the API
  useEffect(() => {
    const fetchQuizQuestions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/quizzes/${lesson_id}/questions`);
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        toast.error("Failed to load quiz questions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizQuestions();
  }, [lesson_id]);

  const resetQuiz = () => {
    setAnswers([]);
    setSubmitted(false);
    setScore(null);
    setShowAnswers(false);
  };

  const handleSingleChoice = (questionId, optionId) => {
    setAnswers((prev) => {
      const otherAnswers = prev.filter((a) => a.questionId !== questionId);
      return [...otherAnswers, { questionId, selectedOptions: [optionId] }];
    });
  };

  const handleMultipleChoice = (questionId, optionId, checked) => {
    setAnswers((prev) => {
      const existingAnswer = prev.find((a) => a.questionId === questionId);
      const otherAnswers = prev.filter((a) => a.questionId !== questionId);

      if (existingAnswer) {
        const updatedOptions = checked
          ? [...existingAnswer.selectedOptions, optionId]
          : existingAnswer.selectedOptions.filter((id) => id !== optionId);

        return [...otherAnswers, { questionId, selectedOptions: updatedOptions }];
      }

      return [...otherAnswers, { questionId, selectedOptions: [optionId] }];
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    questions.forEach((question) => {
      const userAnswer = answers.find((a) => a.questionId === question._id);
      if (!userAnswer) return;

      const correctOptions = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt._id);

      const isCorrect =
        question.type === "single"
          ? userAnswer.selectedOptions[0] === correctOptions[0]
          : correctOptions.length === userAnswer.selectedOptions.length &&
            correctOptions.every((id) => userAnswer.selectedOptions.includes(id));

      if (isCorrect) correctAnswers++;
    });

    return (correctAnswers / totalQuestions) * 100;
  };

  const saveProgress = async (finalScore) => {
    try {
      const response = await fetch("http://localhost:5000/api/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          courseId,
          lessonId: lesson_id,
          score: finalScore,
          completed: finalScore >= 50, // Only mark as completed if score >= 50%
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save progress");
      }

      return true;
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Failed to save quiz progress");
      return false;
    }
  };

  const handleSubmit = async () => {
    if (answers.length < questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);

    // Only show answers and save progress if score is 50% or higher
    const canShowAnswers = finalScore >= 50;
    setShowAnswers(canShowAnswers);

    // Save progress and trigger onComplete if enrolled and score >= 50%
    if (isEnrolled && canShowAnswers) {
      const progressSaved = await saveProgress(finalScore);
      if (progressSaved) {
        onComplete(); // Trigger onComplete only if progress is saved successfully
      }
    }

    if (finalScore >= 70) {
      toast.success(`Quiz passed! Your score: ${finalScore.toFixed(1)}%`, {
        description: "Great job! You've successfully completed the quiz.",
      });
    } else if (finalScore >= 50) {
      toast.warning(`Quiz score: ${finalScore.toFixed(1)}%`, {
        description: "You passed but consider reviewing the material.",
      });
    } else {
      toast.error(`Quiz failed! Your score: ${finalScore.toFixed(1)}%`, {
        description: "Please review the material and try again.",
      });
    }
  };

  const getQuestionResult = (questionId) => {
    if (!submitted || score < 50) return null;

    const question = questions.find((q) => q._id === questionId);
    const userAnswer = answers.find((a) => a.questionId === questionId);

    if (!question || !userAnswer) return null;

    const correctOptions = question.options
      .filter((opt) => opt.isCorrect)
      .map((opt) => opt._id);

    const isCorrect =
      question.type === "single"
        ? userAnswer.selectedOptions[0] === correctOptions[0]
        : correctOptions.length === userAnswer.selectedOptions.length &&
          correctOptions.every((id) => userAnswer.selectedOptions.includes(id));

    return isCorrect;
  };

  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  if (enrollmentLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-fidel-500" />
        <p className="text-sm text-muted-foreground">Loading quiz questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Quiz Assessment</h2>
        {!submitted && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">
              Answered: {answers.length}/{questions.length}
            </span>
            <Progress
              value={(answers.length / questions.length) * 100}
              className="h-2 w-full sm:w-32"
            />
          </div>
        )}
      </div>

      {/* Questions Container */}
      <div className="space-y-4 md:space-y-6 overflow-y-auto" style={{ maxHeight: "50vh" }}>
        {questions.map((question, qIndex) => {
          const questionResult = getQuestionResult(question._id);
          const answer = answers.find((a) => a.questionId === question._id);

          return (
            <Card key={question._id} className="p-4 sm:p-6 transition-all hover:shadow-md">
              <div className="flex items-start mb-3 sm:mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="bg-fidel-100 text-fidel-700 dark:bg-fidel-900 dark:text-fidel-100 rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-medium flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <h4 className="font-medium text-base sm:text-lg">{question.question}</h4>
                  </div>
                  {submitted && score >= 50 && (
                    <div className="mt-1 sm:mt-2 ml-8 sm:ml-10 flex items-center">
                      {questionResult ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Check size={16} className="mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm font-medium">Correct</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <X size={16} className="mr-1 sm:mr-2" />
                          <span className="text-xs sm:text-sm font-medium">Incorrect</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pl-8 sm:pl-10 space-y-2 sm:space-y-3">
                {question.type === "single" ? (
                  <RadioGroup
                    disabled={submitted}
                    value={answer?.selectedOptions?.[0]?.toString() || ""}
                    onValueChange={(value) => handleSingleChoice(question._id, value)}
                  >
                    {question.options.map((option) => (
                      <div
                        key={option._id}
                        className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors ${
                          showAnswers && option.isCorrect
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : showAnswers &&
                              answer?.selectedOptions?.includes(option._id) &&
                              !option.isCorrect
                            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "hover:bg-accent"
                        }`}
                      >
                        <RadioGroupItem
                          value={option._id.toString()}
                          id={`q${question._id}-o${option._id}`}
                        />
                        <Label
                          htmlFor={`q${question._id}-o${option._id}`}
                          className="text-sm sm:text-base cursor-pointer w-full"
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            {showAnswers && option.isCorrect && (
                              <Check size={16} className="text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-2 sm:space-y-3">
                    {question.options.map((option) => (
                      <div
                        key={option._id}
                        className={`flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg transition-colors ${
                          showAnswers && option.isCorrect
                            ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                            : showAnswers &&
                              answer?.selectedOptions?.includes(option._id) &&
                              !option.isCorrect
                            ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                            : "hover:bg-accent"
                        }`}
                      >
                        <Checkbox
                          id={`q${question._id}-o${option._id}`}
                          checked={answer?.selectedOptions?.includes(option._id) || false}
                          onCheckedChange={(checked) =>
                            handleMultipleChoice(question._id, option._id, checked)
                          }
                          disabled={submitted}
                        />
                        <Label
                          htmlFor={`q${question._id}-o${option._id}`}
                          className="text-sm sm:text-base cursor-pointer w-full"
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            {showAnswers && option.isCorrect && (
                              <Check size={16} className="text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background pt-3 pb-4 sm:pt-4 sm:pb-6 border-t">
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            className="w-full py-4 sm:py-6 text-base sm:text-lg"
            disabled={answers.length < questions.length}
          >
            {answers.length < questions.length ? (
              <span className="text-xs sm:text-sm">
                Complete all questions to submit ({questions.length - answers.length} remaining)
              </span>
            ) : (
              <span>Submit Quiz</span>
            )}
          </Button>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="p-4 sm:p-6 bg-fidel-50 dark:bg-fidel-900/10 rounded-lg border border-fidel-100 dark:border-fidel-900/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                <div className="flex-1">
                  <h3 className="font-medium text-fidel-800 dark:text-fidel-200 mb-1 text-base sm:text-lg">
                    Quiz Results
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {score >= 70
                      ? "Congratulations! You've passed this quiz."
                      : score >= 50
                      ? "You passed but consider reviewing the material."
                      : "You didn't pass. Please review and try again."}
                  </p>
                  {!isEnrolled && score >= 50 && (
                    <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400 mt-1 sm:mt-2">
                      Note: Your progress wasn't saved because you're not enrolled in this course.
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-center">
                    <p
                      className={`text-2xl sm:text-3xl font-bold ${
                        score >= 70
                          ? "text-green-600 dark:text-green-400"
                          : score >= 50
                          ? "text-yellow-600 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {score.toFixed(0)}%
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {score >= 70 ? "Excellent" : score >= 50 ? "Passing" : "Failed"}
                    </p>
                  </div>
                  <div
                    className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center ${
                      score >= 70
                        ? "bg-green-100 dark:bg-green-900/20"
                        : score >= 50
                        ? "bg-yellow-100 dark:bg-yellow-900/20"
                        : "bg-red-100 dark:bg-red-900/20"
                    }`}
                  >
                    {score >= 70 ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                    ) : score >= 50 ? (
                      <Check className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                    ) : (
                      <X className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
              {score >= 50 ? (
                <Button variant="outline" className="h-10 sm:h-12" onClick={toggleShowAnswers}>
                  {showAnswers ? "Hide Answers" : "Show Correct Answers"}
                  <ChevronRight
                    size={16}
                    className={`ml-1 sm:ml-2 transition-transform ${showAnswers ? "rotate-90" : ""}`}
                  />
                </Button>
              ) : (
                <Button variant="outline" className="h-10 sm:h-12" onClick={resetQuiz}>
                  <RotateCw size={16} className="mr-1 sm:mr-2" />
                  Try Again
                </Button>
              )}

              <Button
                onClick={() => {
                  // Only trigger onComplete if score >= 50% and progress was saved
                  if (score < 50) {
                    onComplete();
                  }
                  // Note: onComplete is already called in handleSubmit for passing scores
                }}
                className={`h-10 sm:h-12 text-base sm:text-lg ${
                  score >= 50
                    ? "bg-fidel-600 hover:bg-fidel-700"
                    : "bg-gray-600 hover:bg-gray-700"
                }`}
              >
                {score >= 50 ? "Continue Learning" : "Back to Lesson"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;