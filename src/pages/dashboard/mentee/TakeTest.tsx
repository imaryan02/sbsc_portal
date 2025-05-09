
import { useState } from "react";
import { Clock, AlertCircle, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";

interface Question {
  id: number;
  text: string;
  options: string[];
  correctOption?: number;
}

const TakeTest = () => {
  const { toast } = useToast();
  const [testStarted, setTestStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | undefined>>({});
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [testCompleted, setTestCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const [questions] = useState<Question[]>([
    {
      id: 1,
      text: "What is the correct way to create a React functional component?",
      options: [
        "function MyComponent() { return <div>Hello</div>; }",
        "class MyComponent { render() { return <div>Hello</div>; } }",
        "const MyComponent = () => { <div>Hello</div> }",
        "function MyComponent() { render(<div>Hello</div>); }"
      ],
      correctOption: 0
    },
    {
      id: 2,
      text: "Which hook would you use to perform side effects in a functional component?",
      options: [
        "useState()",
        "useEffect()",
        "useContext()",
        "useReducer()"
      ],
      correctOption: 1
    },
    {
      id: 3,
      text: "How do you properly update state that depends on the previous state in React?",
      options: [
        "setState(state + 1)",
        "setState(state => state + 1)",
        "setState(prevState + 1)",
        "setState({ ...state, value: state.value + 1 })"
      ],
      correctOption: 1
    },
    {
      id: 4,
      text: "What is the purpose of the 'key' prop when rendering lists in React?",
      options: [
        "It's used for styling elements in the list",
        "It helps React identify which items have changed, are added, or removed",
        "It's required for all JSX elements",
        "It provides accessibility features for screen readers"
      ],
      correctOption: 1
    },
    {
      id: 5,
      text: "What will the following code output?\n\nconst x = [1, 2, 3].map(num => num * 2);",
      options: [
        "[1, 4, 9]",
        "[2, 4, 6]",
        "[1, 2, 3, 1, 2, 3]",
        "Error: map is not a function"
      ],
      correctOption: 1
    }
  ]);
  
  const startTest = () => {
    setTestStarted(true);
    
    // Start timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // Clean up timer
    return () => clearInterval(timer);
  };
  
  const handleAnswer = (answer: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const submitTest = () => {
    setTestCompleted(true);
    
    // Calculate score
    let correctAnswers = 0;
    questions.forEach((question) => {
      if (answers[question.id] === question.correctOption) {
        correctAnswers++;
      }
    });
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    
    toast({
      title: "Test completed",
      description: `Your score: ${score}% (${correctAnswers}/${questions.length})`,
    });
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Take Assessment</h1>
          <p className="page-description">
            Complete the React skills assessment to track your progress
          </p>
        </div>
        
        {!testStarted ? (
          <Card>
            <CardHeader>
              <CardTitle>React Skills Assessment</CardTitle>
              <CardDescription>
                Test your knowledge of React fundamentals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-sm">
                  5 questions
                </Badge>
                <Badge variant="outline" className="text-sm">
                  30 minutes
                </Badge>
                <Badge variant="outline" className="text-sm">
                  Multiple choice
                </Badge>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Before you begin</AlertTitle>
                <AlertDescription>
                  Make sure you have 30 minutes of uninterrupted time. Once started, the test cannot be paused.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter>
              <Button onClick={startTest} className="w-full">
                Start Assessment
              </Button>
            </CardFooter>
          </Card>
        ) : testCompleted ? (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Completed</CardTitle>
              <CardDescription>
                Your assessment has been submitted successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {showResults ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <Badge className="px-3 py-1">
                      Score: {Math.round((Object.entries(answers).filter(
                        ([id, answer]) => answer === questions[parseInt(id) - 1].correctOption
                      ).length / questions.length) * 100)}%
                    </Badge>
                  </div>
                  
                  <Separator />
                  
                  {questions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Question {index + 1}</h3>
                        {answers[question.id] === question.correctOption ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                            Correct
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                            Incorrect
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm">{question.text}</p>
                      
                      <div className="space-y-1">
                        {question.options.map((option, optionIndex) => (
                          <div 
                            key={optionIndex} 
                            className={`p-2 text-sm rounded-md ${
                              optionIndex === question.correctOption 
                                ? "bg-green-100 text-green-800 border border-green-200" 
                                : optionIndex === answers[question.id] 
                                  ? "bg-red-100 text-red-800 border border-red-200" 
                                  : "bg-muted/40"
                            }`}
                          >
                            {option}
                            {optionIndex === question.correctOption && (
                              <Check className="h-4 w-4 inline ml-2 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {index < questions.length - 1 && <Separator className="my-4" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 text-primary">
                    <Check className="h-10 w-10" />
                  </div>
                  
                  <h3 className="text-xl font-medium">Assessment Submitted</h3>
                  
                  <p className="text-muted-foreground">
                    Your assessment has been submitted and will be reviewed by your mentor.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setShowResults(!showResults)}>
                {showResults ? "Hide Results" : "View Results"}
              </Button>
              <Button onClick={() => window.location.href = "/dashboard/mentee"}>
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className={`font-mono ${timeLeft < 300 ? "text-destructive font-bold" : ""}`}>
                  {formatTime(timeLeft)}
                </span>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {currentQuestion.text.split('\n').map((line, i) => (
                    <span key={i}>
                      {line}
                      {i < currentQuestion.text.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQuestion.id]?.toString()}
                  onValueChange={(value) => handleAnswer(parseInt(value))}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer rounded-md p-3 hover:bg-muted/60"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button onClick={submitTest}>
                    Submit Test
                  </Button>
                ) : (
                  <Button onClick={goToNextQuestion}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TakeTest;
