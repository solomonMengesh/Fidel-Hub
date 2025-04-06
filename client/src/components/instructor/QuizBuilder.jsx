import React, { useState } from "react";
import {
  Plus,
  Trash,
  Check,
  X,
  Clock,
  Shuffle,
  HelpCircle,
  File,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const QuizBuilder = ({ initialQuiz, onSave }) => {
  const [quiz, setQuiz] = useState(
    initialQuiz || {
      id: `quiz-${Date.now()}`,
      title: "New Quiz",
      description: "Description of the quiz",
      timeLimit: 15,
      passingScore: 70,
      shuffleQuestions: true,
      showAnswers: true,
      questions: [],
    }
  );

  const [activeQuestion, setActiveQuestion] = useState(null);

  const addQuestion = () => {
    const newQuestion = {
      id: `question-${Date.now()}`,
      text: "New question",
      type: "single",
      options: [
        { id: `option-${Date.now()}-1`, text: "Option 1", isCorrect: false },
        { id: `option-${Date.now()}-2`, text: "Option 2", isCorrect: false },
      ],
      points: 1,
    };

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));

    setActiveQuestion(newQuestion.id);
  };

  const removeQuestion = (questionId) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }));

    if (activeQuestion === questionId) {
      setActiveQuestion(null);
    }
  };

  const updateQuizField = (field, value) => {
    setQuiz((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, [field]: value } : q
      ),
    }));
  };

  const addOption = (questionId) => {
    const newOption = {
      id: `option-${Date.now()}`,
      text: `Option ${Date.now().toString().slice(-3)}`,
      isCorrect: false,
    };

    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, options: [...q.options, newOption] } : q
      ),
    }));
  };

  const removeOption = (questionId, optionId) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((o) => o.id !== optionId),
            }
          : q
      ),
    }));
  };

  const updateOption = (questionId, optionId, field, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === optionId
                  ? { ...o, [field]: value }
                  : field === "isCorrect" && q.type === "single"
                  ? { ...o, isCorrect: false } // If single choice, deselect other options
                  : o
              ),
            }
          : q
      ),
    }));
  };

  const handleSave = () => {
    // Validation
    if (!quiz.title.trim()) {
      toast.error("Quiz title is required");
      return;
    }

    if (quiz.questions.length === 0) {
      toast.error("Add at least one question");
      return;
    }

    for (const question of quiz.questions) {
      if (!question.text.trim()) {
        toast.error("Question text cannot be empty");
        return;
      }

      if (question.options.length < 2) {
        toast.error("Each question must have at least 2 options");
        return;
      }

      const hasCorrectOption = question.options.some((o) => o.isCorrect);
      if (!hasCorrectOption) {
        toast.error("Each question must have at least one correct answer");
        return;
      }
    }

    onSave(quiz);
    toast.success("Quiz saved successfully");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quiz Details</CardTitle>
              <CardDescription>
                Set up the basic information for your quiz
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  value={quiz.title}
                  onChange={(e) => updateQuizField("title", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="quiz-description">Description</Label>
                <Textarea
                  id="quiz-description"
                  value={quiz.description}
                  onChange={(e) =>
                    updateQuizField("description", e.target.value)
                  }
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time-limit">Time Limit (minutes)</Label>
                  <Input
                    id="time-limit"
                    type="number"
                    min={1}
                    value={quiz.timeLimit}
                    onChange={(e) =>
                      updateQuizField(
                        "timeLimit",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="passing-score">Passing Score (%)</Label>
                  <Input
                    id="passing-score"
                    type="number"
                    min={1}
                    max={100}
                    value={quiz.passingScore}
                    onChange={(e) =>
                      updateQuizField(
                        "passingScore",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="shuffle-questions"
                    checked={quiz.shuffleQuestions}
                    onCheckedChange={(checked) =>
                      updateQuizField("shuffleQuestions", checked)
                    }
                  />
                  <Label htmlFor="shuffle-questions">Shuffle Questions</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-answers"
                    checked={quiz.showAnswers}
                    onCheckedChange={(checked) =>
                      updateQuizField("showAnswers", checked)
                    }
                  />
                  <Label htmlFor="show-answers">
                    Show Answers After Completion
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Add and manage quiz questions</CardDescription>
              </div>
              <Button onClick={addQuestion}>
                <Plus size={16} className="mr-1" />
                Add Question
              </Button>
            </CardHeader>
            <CardContent>
              {quiz.questions.length === 0 && (
                <div className="text-center py-8 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg">
                  <HelpCircle
                    size={36}
                    className="mx-auto text-muted-foreground mb-2"
                  />
                  <p className="text-muted-foreground">
                    No questions added yet
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={addQuestion}
                  >
                    <Plus size={16} className="mr-1" />
                    Add Your First Question
                  </Button>
                </div>
              )}

              {quiz.questions.length > 0 && (
                <Accordion
                  type="single"
                  collapsible
                  value={activeQuestion || undefined}
                  onValueChange={setActiveQuestion}
                  className="space-y-2"
                >
                  {quiz.questions.map((question, index) => (
                    <AccordionItem
                      key={question.id}
                      value={question.id}
                      className="border rounded-md px-1"
                    >
                      <div className="flex items-center justify-between">
                        <AccordionTrigger className="hover:no-underline">
                          <span className="font-medium text-left">
                            Question {index + 1}:{" "}
                            {question.text.length > 30
                              ? `${question.text.substring(0, 30)}...`
                              : question.text}
                          </span>
                        </AccordionTrigger>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeQuestion(question.id);
                          }}
                          className="h-8 w-8 p-0 mr-2 text-red-500 hover:text-red-700"
                        >
                          <Trash size={16} />
                        </Button>
                      </div>

                      <AccordionContent className="space-y-4 pt-2">
                        <div>
                          <Label htmlFor={`question-${question.id}`}>
                            Question Text
                          </Label>
                          <Textarea
                            id={`question-${question.id}`}
                            value={question.text}
                            onChange={(e) =>
                              updateQuestion(
                                question.id,
                                "text",
                                e.target.value
                              )
                            }
                            className="mt-1"
                          />
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div>
                              <Label htmlFor={`question-type-${question.id}`}>
                                Question Type
                              </Label>
                              <Select
                                value={question.type}
                                onValueChange={(value) =>
                                  updateQuestion(question.id, "type", value)
                                }
                              >
                                <SelectTrigger className="w-[180px] mt-1">
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="single">
                                    Single Choice
                                  </SelectItem>
                                  <SelectItem value="multiple">
                                    Multiple Choice
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label htmlFor={`question-points-${question.id}`}>
                                Points
                              </Label>
                              <Input
                                id={`question-points-${question.id}`}
                                type="number"
                                min={1}
                                value={question.points}
                                onChange={(e) =>
                                  updateQuestion(
                                    question.id,
                                    "points",
                                    parseInt(e.target.value) || 1
                                  )
                                }
                                className="w-20 mt-1"
                              />
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addOption(question.id)}
                          >
                            <Plus size={16} className="mr-1" />
                            Add Option
                          </Button>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Label>Answer Options</Label>
                          {question.type === "single" ? (
                            <RadioGroup
                              value={
                                question.options.find((o) => o.isCorrect)?.id ||
                                ""
                              }
                              onValueChange={(value) => {
                                question.options.forEach((option) => {
                                  updateOption(
                                    question.id,
                                    option.id,
                                    "isCorrect",
                                    option.id === value
                                  );
                                });
                              }}
                              className="space-y-2"
                            >
                              {question.options.map((option, optionIndex) => (
                                <div
                                  key={option.id}
                                  className="flex items-center space-x-2 rounded-md border p-3"
                                >
                                  <RadioGroupItem
                                    value={option.id}
                                    id={option.id}
                                  />
                                  <div className="flex-1 grid grid-cols-6 gap-2">
                                    <div className="col-span-5">
                                      <Input
                                        value={option.text}
                                        onChange={(e) =>
                                          updateOption(
                                            question.id,
                                            option.id,
                                            "text",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Option text"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeOption(question.id, option.id)
                                      }
                                      disabled={question.options.length <= 2}
                                      className="col-span-1 h-10 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <div className="space-y-2">
                              {question.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="flex items-center space-x-2 rounded-md border p-3"
                                >
                                  <Checkbox
                                    id={option.id}
                                    checked={option.isCorrect}
                                    onCheckedChange={(checked) =>
                                      updateOption(
                                        question.id,
                                        option.id,
                                        "isCorrect",
                                        !!checked
                                      )
                                    }
                                  />
                                  <div className="flex-1 grid grid-cols-6 gap-2">
                                    <div className="col-span-5">
                                      <Input
                                        value={option.text}
                                        onChange={(e) =>
                                          updateOption(
                                            question.id,
                                            option.id,
                                            "text",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Option text"
                                      />
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        removeOption(question.id, option.id)
                                      }
                                      disabled={question.options.length <= 2}
                                      className="col-span-1 h-10 p-0 text-red-500 hover:text-red-700"
                                    >
                                      <Trash size={16} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardFooter className="flex justify-end">
              <Button onClick={handleSave} className="w-full">
                Save Quiz
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizBuilder;
