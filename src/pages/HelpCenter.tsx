import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, MessageCircle, FileText, ExternalLink } from "lucide-react";

const helpArticles = [
  {
    id: "1",
    title: "Getting Started with ConX-AI",
    description: "Learn the basics of setting up and configuring your platform",
    category: "Setup",
    icon: BookOpen,
  },
  {
    id: "2",
    title: "Managing Client Accounts",
    description: "How to onboard, suspend, and manage enterprise clients",
    category: "Clients",
    icon: FileText,
  },
  {
    id: "3",
    title: "Configuring LLM Providers",
    description: "Set up and optimize AI model configurations",
    category: "Configuration",
    icon: FileText,
  },
  {
    id: "4",
    title: "Security Best Practices",
    description: "Ensure your platform meets enterprise security standards",
    category: "Security",
    icon: FileText,
  },
];

const HelpCenter = () => {
  return (
    <DashboardLayout title="Help Center" subtitle="Documentation and support resources">
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* Search */}
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">How can we help you?</h2>
              <p className="text-muted-foreground">Search our knowledge base or browse articles below</p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search for help..."
                  className="pl-9 bg-secondary/50 border-0"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Documentation</h3>
                  <p className="text-sm text-muted-foreground">Complete platform guides</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-card hover:shadow-elevated transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10">
                  <MessageCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Get help from our team</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Help Articles */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Popular Articles</CardTitle>
            <CardDescription>Frequently accessed help resources</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {helpArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-secondary/20 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <article.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{article.title}</p>
                      <p className="text-sm text-muted-foreground">{article.description}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default HelpCenter;