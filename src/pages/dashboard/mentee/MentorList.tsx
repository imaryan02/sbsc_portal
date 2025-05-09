
import { useState } from "react";
import { Search, Star, Briefcase, Award, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useToast } from "@/hooks/use-toast";
import { Mentor } from "@/lib/types";

const MentorList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string | null>(null);
  
  const [mentors] = useState<Mentor[]>([
    {
      id: "mentor1",
      name: "Sarah Johnson",
      expertise: ["React", "JavaScript", "UI/UX"],
      bio: "Senior Frontend Developer with 8 years of experience. Specialized in React and modern JavaScript frameworks.",
      avatar: "/placeholder.svg",
      rating: 4.9
    },
    {
      id: "mentor2",
      name: "Michael Chang",
      expertise: ["Node.js", "Express", "MongoDB"],
      bio: "Fullstack developer focused on backend technologies. 6 years of experience building scalable web services.",
      avatar: "/placeholder.svg",
      rating: 4.7
    },
    {
      id: "mentor3",
      name: "Emma Rodriguez",
      expertise: ["React", "TypeScript", "GraphQL"],
      bio: "Lead Developer at TechCorp. Passionate about teaching and mentoring junior developers.",
      avatar: "/placeholder.svg",
      rating: 4.8
    },
    {
      id: "mentor4",
      name: "David Wilson",
      expertise: ["Python", "Django", "Data Science"],
      bio: "Data Scientist and Python expert. 5 years of experience in machine learning and web development.",
      avatar: "/placeholder.svg",
      rating: 4.6
    },
    {
      id: "mentor5",
      name: "Jessica Lee",
      expertise: ["Python", "TensorFlow", "AI"],
      bio: "AI Research Engineer with a passion for teaching. PhD in Computer Science specializing in machine learning.",
      avatar: "/placeholder.svg",
      rating: 4.9
    }
  ]);
  
  const allExpertise = Array.from(
    new Set(mentors.flatMap(mentor => mentor.expertise))
  ).sort();
  
  const handleSendRequest = (mentorId: string) => {
    toast({
      title: "Request sent",
      description: "Your mentorship request has been sent!",
    });
  };
  
  const filteredMentors = mentors.filter(mentor => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === "" || 
      mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mentor.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply expertise filter
    const matchesExpertise = 
      !selectedExpertise || 
      mentor.expertise.includes(selectedExpertise);
    
    return matchesSearch && matchesExpertise;
  });

  return (
    <DashboardLayout role="mentee">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Find a Mentor</h1>
          <p className="page-description">Browse and connect with expert mentors</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search mentors by name or expertise..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Badge 
              variant={!selectedExpertise ? "default" : "outline"} 
              className="cursor-pointer"
              onClick={() => setSelectedExpertise(null)}
            >
              All Skills
            </Badge>
            {allExpertise.map((skill) => (
              <Badge 
                key={skill} 
                variant={selectedExpertise === skill ? "default" : "outline"} 
                className="cursor-pointer"
                onClick={() => setSelectedExpertise(skill)}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          {filteredMentors.length > 0 ? (
            filteredMentors.map((mentor) => (
              <Card key={mentor.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center md:items-start space-y-2">
                      <Avatar className="h-20 w-20">
                        <AvatarImage src={mentor.avatar} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.charAt(0)}{mentor.name.split(" ")[1].charAt(0)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 font-medium">{mentor.rating}</span>
                      </div>
                      
                      <div className="hidden md:flex md:flex-col space-y-2">
                        <Button 
                          onClick={() => handleSendRequest(mentor.id)}
                          className="w-full"
                        >
                          Send Request
                        </Button>
                        <Button variant="outline" className="w-full">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 mb-2">
                        <h3 className="text-xl font-semibold">{mentor.name}</h3>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-wrap gap-1">
                          {mentor.expertise.map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{mentor.bio}</p>
                      
                      <div className="md:hidden flex space-x-2 mt-4">
                        <Button 
                          onClick={() => handleSendRequest(mentor.id)}
                          className="flex-1"
                        >
                          Send Request
                        </Button>
                        <Button variant="outline" className="flex-1">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No mentors match your search criteria.
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MentorList;
