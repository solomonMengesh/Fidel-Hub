import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox ";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Check, X, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

const QuizView = ({ lesson_id, onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showAnswers, setShowAnswers] = useState(false);

  // Fetching quiz questions from the API
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

  const handleSingleChoice = (questionId, optionId) => {
    setAnswers(prev => {
      const otherAnswers = prev.filter(a => a.questionId !== questionId);
      return [...otherAnswers, { questionId, selectedOptions: [optionId] }];
    });
  };

  const handleMultipleChoice = (questionId, optionId, checked) => {
    setAnswers(prev => {
      const existingAnswer = prev.find(a => a.questionId === questionId);
      const otherAnswers = prev.filter(a => a.questionId !== questionId);

      if (existingAnswer) {
        const updatedOptions = checked
          ? [...existingAnswer.selectedOptions, optionId]
          : existingAnswer.selectedOptions.filter(id => id !== optionId);

        return [...otherAnswers, { questionId, selectedOptions: updatedOptions }];
      }

      return [...otherAnswers, { questionId, selectedOptions: [optionId] }];
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    let totalQuestions = questions.length;

    questions.forEach(question => {
      const userAnswer = answers.find(a => a.questionId === question._id);
      if (!userAnswer) return;

      const correctOptions = question.options
        .filter(opt => opt.isCorrect)
        .map(opt => opt._id);

      const isCorrect = question.type === "single"
        ? userAnswer.selectedOptions[0] === correctOptions[0]
        : correctOptions.length === userAnswer.selectedOptions.length &&
          correctOptions.every(id => userAnswer.selectedOptions.includes(id));

      if (isCorrect) correctAnswers++;
    });

    return (correctAnswers / totalQuestions) * 100;
  };

  const handleSubmit = () => {
    if (answers.length < questions.length) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    const finalScore = calculateScore();
    setScore(finalScore);
    setSubmitted(true);
    setShowAnswers(true);

    if (finalScore >= 70) {
      toast.success(`Quiz passed! Your score: ${finalScore.toFixed(1)}%`, {
        description: "Great job! You've successfully completed the quiz.",
      });
    } else {
      toast.warning(`Quiz score: ${finalScore.toFixed(1)}%`, {
        description: "Review the material and try again to improve your score.",
      });
    }
  };

  const getQuestionResult = (questionId) => {
    if (!submitted) return null;

    const question = questions.find(q => q._id === questionId);
    const userAnswer = answers.find(a => a.questionId === questionId);

    if (!question || !userAnswer) return null;

    const correctOptions = question.options
      .filter(opt => opt.isCorrect)
      .map(opt => opt._id);

    const isCorrect = question.type === "single"
      ? userAnswer.selectedOptions[0] === correctOptions[0]
      : correctOptions.length === userAnswer.selectedOptions.length &&
        correctOptions.every(id => userAnswer.selectedOptions.includes(id));

    return isCorrect;
  };

  const toggleShowAnswers = () => {
    setShowAnswers(!showAnswers);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-fidel-500" />
        <p className="text-sm text-muted-foreground">Loading quiz questions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Quiz Assessment</h2>
        {!submitted && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Answered: {answers.length}/{questions.length}
            </span>
            <Progress 
              value={(answers.length / questions.length) * 100} 
              className="h-2 w-24 sm:w-32"
            />
          </div>
        )}
      </div>

      {/* Questions Container */}
      <div className="space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 220px)' }}>
        {questions.map((question, qIndex) => {
          const questionResult = getQuestionResult(question._id);
          const answer = answers.find(a => a.questionId === question._id);

          return (
            <Card key={question._id} className="p-6 transition-all hover:shadow-md">
              <div className="flex items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-fidel-100 text-fidel-700 dark:bg-fidel-900 dark:text-fidel-100 rounded-full w-7 h-7 flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {qIndex + 1}
                    </span>
                    <h4 className="font-medium text-lg">{question.question}</h4>
                  </div>
                  {submitted && (
                    <div className="mt-2 ml-10 flex items-center">
                      {questionResult ? (
                        <div className="flex items-center text-green-600 dark:text-green-400">
                          <Check size={18} className="mr-2" />
                          <span className="text-sm font-medium">Correct Answer</span>
                        </div>
                      ) : (
                        <div className="flex items-center text-red-600 dark:text-red-400">
                          <X size={18} className="mr-2" />
                          <span className="text-sm font-medium">Incorrect Answer</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pl-10 space-y-3">
                {question.type === "single" ? (
                  <RadioGroup
                    disabled={submitted}
                    value={answer?.selectedOptions?.[0]?.toString() || ""}
                    onValueChange={(value) => handleSingleChoice(question._id, value)}
                  >
                    {question.options.map((option) => (
                      <div
                        key={option._id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          showAnswers && option.isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : showAnswers &&
                              answer?.selectedOptions?.includes(option._id) &&
                              !option.isCorrect
                            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            : 'hover:bg-accent'
                        }`}
                      >
                        <RadioGroupItem
                          value={option._id.toString()}
                          id={`q${question._id}-o${option._id}`}
                        />
                        <Label 
                          htmlFor={`q${question._id}-o${option._id}`}
                          className="text-base cursor-pointer w-full"
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            {showAnswers && option.isCorrect && (
                              <Check size={18} className="text-green-500 flex-shrink-0" />
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <div
                        key={option._id}
                        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                          showAnswers && option.isCorrect
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : showAnswers &&
                              answer?.selectedOptions?.includes(option._id) &&
                              !option.isCorrect
                            ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                            : 'hover:bg-accent'
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
                          className="text-base cursor-pointer w-full"
                        >
                          <div className="flex items-center justify-between">
                            <span>{option.text}</span>
                            {showAnswers && option.isCorrect && (
                              <Check size={18} className="text-green-500 flex-shrink-0" />
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
      <div className="sticky bottom-0 bg-background pt-4 pb-6 border-t">
        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            className="w-full py-6 text-lg"
            disabled={answers.length < questions.length}
          >
            {answers.length < questions.length ? (
              <span>Complete all questions to submit ({questions.length - answers.length} remaining)</span>
            ) : (
              <span>Submit Quiz</span>
            )}
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="p-6 bg-fidel-50 dark:bg-fidel-900/10 rounded-lg border border-fidel-100 dark:border-fidel-900/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-medium text-fidel-800 dark:text-fidel-200 mb-1 text-lg">
                    Quiz Results
                  </h3>
                  <p className="text-muted-foreground">
                    {score >= 70 
                      ? "Congratulations! You've passed this quiz." 
                      : "Review the material and try again to improve your score."}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-fidel-600 dark:text-fidel-400">
                      {score.toFixed(0)}%
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {score >= 70 ? "Passing" : "Score"}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-fidel-100 dark:bg-fidel-900 flex items-center justify-center">
                    {score >= 70 ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <X className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-12"
                onClick={toggleShowAnswers}
              >
                {showAnswers ? "Hide Answers" : "Show Correct Answers"}
                <ChevronRight
                  size={18}
                  className={`ml-2 transition-transform ${showAnswers ? 'rotate-90' : ''}`}
                />
              </Button>

              <Button
                onClick={() => onComplete(score)}
                className="h-12 bg-fidel-600 hover:bg-fidel-700 text-lg"
              >
                Continue Learning
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizView;