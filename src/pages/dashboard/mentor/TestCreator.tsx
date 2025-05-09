
import { useState } from "react";
import { Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge"; // Added missing Badge import
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";

type QuestionType = 'multiple-choice' | 'text' | 'true-false';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
}

const TestCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [testTitle, setTestTitle] = useState("Technical Assessment");
  const [selectedProject, setSelectedProject] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [projects, setProjects] = useState<{id: string, title: string}[]>([
    { id: "1", title: "React Dashboard" },
    { id: "2", title: "E-commerce Platform" },
    { id: "3", title: "Mobile App Development" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const addQuestion = (type: QuestionType) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      text: "",
      options: type === 'multiple-choice' ? ["", "", "", ""] : undefined,
      correctAnswer: type === 'true-false' ? "true" : "",
    };
    
    setQuestions([...questions, newQuestion]);
  };
  
  const updateQuestion = (id: string, field: string, value: any) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === id) {
        return { ...q, [field]: value };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
  };
  
  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options) {
        const updatedOptions = [...q.options];
        updatedOptions[optionIndex] = value;
        return { ...q, options: updatedOptions };
      }
      return q;
    });
    
    setQuestions(updatedQuestions);
  };
  
  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };
  
  const saveTest = async () => {
    if (questions.length === 0) {
      toast({
        title: "Cannot save empty test",
        description: "Please add at least one question",
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedProject) {
      toast({
        title: "Project required",
        description: "Please select a project for this test",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Save the test to the database
      const { data, error } = await supabase
        .from('project_tests')
        .insert({
          project_id: selectedProject,
          questions: questions.map(q => ({
            type: q.type,
            text: q.text,
            options: q.options,
            correctAnswer: q.correctAnswer
          }))
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Test saved successfully",
        description: "Students can now take this test",
      });
      
      // Reset the form or redirect
      setQuestions([]);
      setTestTitle("Technical Assessment");
    } catch (error) {
      console.error('Error saving test:', error);
      toast({
        title: "Failed to save test",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role="mentor">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Test Creator</h1>
          <p className="page-description">
            Create technical assessments for your mentees
          </p>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>Basic details about this assessment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input 
                  id="title" 
                  value={testTitle} 
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="e.g., React Fundamentals Assessment"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="project">Associated Project</Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Questions</CardTitle>
                <CardDescription>Create different types of questions</CardDescription>
              </div>
              
              <div className="flex gap-2 mt-2 sm:mt-0">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addQuestion('multiple-choice')}
                >
                  <Plus className="mr-1 h-4 w-4" /> Multiple Choice
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addQuestion('text')}
                >
                  <Plus className="mr-1 h-4 w-4" /> Text
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => addQuestion('true-false')}
                >
                  <Plus className="mr-1 h-4 w-4" /> True/False
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {questions.length === 0 ? (
                  <div className="text-center py-10 border border-dashed rounded-lg">
                    <p className="text-muted-foreground">No questions added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Use the buttons above to add questions
                    </p>
                  </div>
                ) : (
                  questions.map((question, index) => (
                    <Card key={question.id} className="shadow-sm border-muted">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Q{index + 1}</span>
                            <Badge variant="outline">
                              {question.type === 'multiple-choice' 
                                ? 'Multiple Choice' 
                                : question.type === 'text' 
                                  ? 'Text' 
                                  : 'True/False'}
                            </Badge>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeQuestion(question.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="px-4 pb-4 pt-0 space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor={`question-${question.id}`}>Question</Label>
                          <Textarea 
                            id={`question-${question.id}`}
                            value={question.text}
                            onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                            placeholder="Enter your question here"
                          />
                        </div>
                        
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="space-y-3">
                            <Label>Answer Options</Label>
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <Input 
                                  value={option}
                                  onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="px-2"
                                  onClick={() => {
                                    if (question.correctAnswer === option) {
                                      updateQuestion(question.id, 'correctAnswer', '');
                                    }
                                    
                                    const updatedOptions = [...question.options!];
                                    updatedOptions.splice(optIndex, 1);
                                    updateQuestion(question.id, 'options', updatedOptions);
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant={question.correctAnswer === option ? "default" : "outline"}
                                  size="sm"
                                  className="px-2 min-w-[80px]"
                                  onClick={() => updateQuestion(question.id, 'correctAnswer', option)}
                                >
                                  {question.correctAnswer === option ? "Correct" : "Mark"}
                                </Button>
                              </div>
                            ))}
                            
                            {question.options.length < 8 && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => {
                                  const updatedOptions = [...question.options!];
                                  updatedOptions.push("");
                                  updateQuestion(question.id, 'options', updatedOptions);
                                }}
                              >
                                <Plus className="mr-1 h-4 w-4" /> Add Option
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {question.type === 'true-false' && (
                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <div className="flex gap-3">
                              <Button 
                                variant={question.correctAnswer === 'true' ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateQuestion(question.id, 'correctAnswer', 'true')}
                              >
                                True
                              </Button>
                              <Button 
                                variant={question.correctAnswer === 'false' ? "default" : "outline"}
                                size="sm"
                                onClick={() => updateQuestion(question.id, 'correctAnswer', 'false')}
                              >
                                False
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {question.type === 'text' && (
                          <div className="space-y-2">
                            <Label htmlFor={`answer-${question.id}`}>Expected Answer (Optional)</Label>
                            <Textarea 
                              id={`answer-${question.id}`}
                              value={question.correctAnswer || ''}
                              onChange={(e) => updateQuestion(question.id, 'correctAnswer', e.target.value)}
                              placeholder="Enter expected answer (for your reference)"
                            />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
            
            <CardFooter className="border-t p-4">
              <div className="flex justify-end gap-3 w-full">
                <Button 
                  variant="outline" 
                  onClick={() => setQuestions([])}
                  disabled={questions.length === 0 || isLoading}
                >
                  Clear All
                </Button>
                <Button 
                  onClick={saveTest}
                  disabled={questions.length === 0 || isLoading}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isLoading ? "Saving..." : "Save Test"}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TestCreator;
