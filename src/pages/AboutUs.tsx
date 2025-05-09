
import React from "react";
import { Link } from "react-router-dom";
import { 
  Users, 
  GraduationCap, 
  ExternalLink, 
  Github,
  Linkedin,
  Mail
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  links?: {
    github?: string;
    linkedin?: string;
    email?: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, bio, image, links }) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{role}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{bio}</p>
      </CardContent>
      {links && (
        <CardFooter className="flex gap-2">
          {links.github && (
            <Button variant="outline" size="icon" asChild>
              <a href={links.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
          )}
          {links.linkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </a>
            </Button>
          )}
          {links.email && (
            <Button variant="outline" size="icon" asChild>
              <a href={`mailto:${links.email}`}>
                <Mail className="h-4 w-4" />
                <span className="sr-only">Email</span>
              </a>
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">About Our Team</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals behind the Mentorship Platform
          </p>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <div className="px-4 text-muted-foreground font-medium">Our Mission</div>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="max-w-3xl mx-auto text-center">
            <p className="text-lg mb-6">
              Our mission is to connect aspiring mentees with experienced mentors, 
              facilitating knowledge transfer and professional growth through structured 
              projects and personalized guidance.
            </p>
            <p className="text-lg">
              We believe in creating an inclusive environment where learning is accessible to 
              everyone, regardless of background or experience level.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <div className="px-4 text-muted-foreground font-medium">Meet Our Team</div>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TeamMember
              name="Tanmay Joshi"
              role="Lead Developer"
              bio="Tanmay brings extensive experience in full-stack development and is passionate about creating intuitive user experiences."
              image="/placeholder.svg"
              links={{
                github: "https://github.com",
                linkedin: "https://linkedin.com",
                email: "tanmay@example.com"
              }}
            />
            <TeamMember
              name="Vanshikha Tahalwani"
              role="UX/UI Designer"
              bio="Vanshikha combines creativity with technical expertise to design beautiful and functional interfaces that users love."
              image="/placeholder.svg"
              links={{
                github: "https://github.com",
                linkedin: "https://linkedin.com",
                email: "vanshikha@example.com"
              }}
            />
            <TeamMember
              name="Devasis"
              role="Backend Architect"
              bio="Devasis specializes in building robust and scalable backend systems that power our mentorship platform."
              image="/placeholder.svg"
              links={{
                github: "https://github.com",
                linkedin: "https://linkedin.com",
                email: "devasis@example.com"
              }}
            />
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center justify-center mb-8">
            <div className="h-px bg-border flex-1"></div>
            <div className="px-4 text-muted-foreground font-medium">Our Values</div>
            <div className="h-px bg-border flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We believe the best results come from working together, sharing knowledge, and building on each other's strengths.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We continuously seek new and better ways to connect mentors and mentees and improve the learning experience.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Accessibility</CardTitle>
              </CardHeader>
              <CardContent>
                <p>We are committed to making mentorship accessible to everyone, breaking down barriers to knowledge and growth.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center">
          <Link to="/">
            <Button variant="default" className="gap-2">
              <GraduationCap className="h-4 w-4" />
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
