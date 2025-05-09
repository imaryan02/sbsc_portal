
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// This is a placeholder component with mock data
// In a real application, these would be fetched from the API
const UpcomingReviews = () => {
  const reviews = [
    {
      id: '1',
      projectName: 'React E-commerce Dashboard',
      studentName: 'Alex Chen',
      dueText: 'Due Tomorrow',
      progress: 85,
    },
    {
      id: '2',
      projectName: 'Blog Platform API',
      studentName: 'Maria Garcia',
      dueText: 'Due in 3 days',
      progress: 45,
    },
    {
      id: '3',
      projectName: 'Todo App with React',
      studentName: 'Jordan Smith',
      dueText: 'Due in 5 days',
      progress: 20,
    },
  ];

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="space-y-2">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{review.projectName}</p>
              <p className="text-sm text-muted-foreground">{review.studentName}</p>
            </div>
            <Badge>{review.dueText}</Badge>
          </div>
          <Progress value={review.progress} className="h-2" />
          <p className="text-xs text-muted-foreground">{review.progress}% Complete</p>
        </div>
      ))}
    </div>
  );
};

export default UpcomingReviews;
