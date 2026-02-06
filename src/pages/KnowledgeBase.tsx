import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  Trash2,
  Search,
  Brain,
  Database,
  BookOpen,
  FileQuestion,
  Download,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  GraduationCap,
  Video,
  Award,
  PlayCircle,
  ExternalLink,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Document {
  id: string;
  name: string;
  type: "faq" | "pdf" | "manual" | "database";
  size: string;
  uploadedAt: string;
  status: "processed" | "processing" | "failed";
  client: string;
  vectorCount: number;
}

const documents: Document[] = [
  {
    id: "1",
    name: "Product FAQ v2.0.pdf",
    type: "faq",
    size: "2.4 MB",
    uploadedAt: "Jan 15, 2024",
    status: "processed",
    client: "Acme Corporation",
    vectorCount: 1245,
  },
  {
    id: "2",
    name: "Customer Support Manual.pdf",
    type: "manual",
    size: "15.8 MB",
    uploadedAt: "Jan 18, 2024",
    status: "processed",
    client: "TechFlow Inc",
    vectorCount: 8932,
  },
  {
    id: "3",
    name: "Technical Documentation.pdf",
    type: "pdf",
    size: "8.2 MB",
    uploadedAt: "Jan 20, 2024",
    status: "processing",
    client: "Global Services",
    vectorCount: 0,
  },
  {
    id: "4",
    name: "Product Database Export.json",
    type: "database",
    size: "45.1 MB",
    uploadedAt: "Jan 22, 2024",
    status: "processed",
    client: "HealthTech",
    vectorCount: 15420,
  },
  {
    id: "5",
    name: "Billing FAQ.docx",
    type: "faq",
    size: "890 KB",
    uploadedAt: "Jan 25, 2024",
    status: "failed",
    client: "RetailMax",
    vectorCount: 0,
  },
];

const typeIcons = {
  faq: FileQuestion,
  pdf: FileText,
  manual: BookOpen,
  database: Database,
};

const statusStyles = {
  processed: "bg-success/10 text-success",
  processing: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
};

const statusIcons = {
  processed: CheckCircle,
  processing: Clock,
  failed: AlertCircle,
};

// Tutorial data
const tutorials = [
  {
    id: "1",
    title: "Getting Started with CONX Platform",
    description: "Learn the basics of setting up and configuring your AI contact center",
    duration: "15 min",
    level: "Beginner",
    category: "Onboarding",
    views: 2450,
    thumbnail: "🎬",
  },
  {
    id: "2",
    title: "Advanced Flow Builder Techniques",
    description: "Master complex conversation flows and conditional routing",
    duration: "32 min",
    level: "Advanced",
    category: "Flow Builder",
    views: 1820,
    thumbnail: "🔧",
  },
  {
    id: "3",
    title: "Integrating CRM Systems",
    description: "Step-by-step guide to connecting Salesforce, HubSpot, and more",
    duration: "22 min",
    level: "Intermediate",
    category: "Integrations",
    views: 1540,
    thumbnail: "🔗",
  },
  {
    id: "4",
    title: "Analytics Dashboard Deep Dive",
    description: "Understand your metrics and optimize agent performance",
    duration: "28 min",
    level: "Intermediate",
    category: "Analytics",
    views: 980,
    thumbnail: "📊",
  },
  {
    id: "5",
    title: "Security Best Practices",
    description: "Configure RLS policies, compliance settings, and audit trails",
    duration: "18 min",
    level: "Advanced",
    category: "Security",
    views: 1120,
    thumbnail: "🔒",
  },
];

// Certification data
const certifications = [
  {
    id: "1",
    name: "CONX Platform Administrator",
    description: "Demonstrate expertise in platform configuration and management",
    modules: 8,
    duration: "4 hours",
    status: "available",
    badge: "🏆",
    enrolled: 156,
  },
  {
    id: "2",
    name: "AI Flow Builder Specialist",
    description: "Master conversation design and flow optimization",
    modules: 6,
    duration: "3 hours",
    status: "available",
    badge: "🎯",
    enrolled: 89,
  },
  {
    id: "3",
    name: "Integration Expert",
    description: "Expertise in connecting third-party systems and APIs",
    modules: 5,
    duration: "2.5 hours",
    status: "coming_soon",
    badge: "🔌",
    enrolled: 0,
  },
  {
    id: "4",
    name: "Security & Compliance Professional",
    description: "Advanced security configuration and compliance management",
    modules: 7,
    duration: "3.5 hours",
    status: "available",
    badge: "🛡️",
    enrolled: 67,
  },
];

// Documentation categories
const documentationCategories = [
  {
    id: "1",
    name: "Quick Start Guide",
    description: "Get up and running with CONX in minutes",
    articles: 12,
    icon: "🚀",
    updated: "2 days ago",
  },
  {
    id: "2",
    name: "API Reference",
    description: "Complete API documentation and endpoints",
    articles: 45,
    icon: "📡",
    updated: "1 day ago",
  },
  {
    id: "3",
    name: "User Guides",
    description: "Detailed guides for all platform features",
    articles: 28,
    icon: "📖",
    updated: "3 days ago",
  },
  {
    id: "4",
    name: "Best Practices",
    description: "Tips and recommendations for optimal setup",
    articles: 15,
    icon: "✨",
    updated: "1 week ago",
  },
  {
    id: "5",
    name: "Troubleshooting",
    description: "Common issues and solutions",
    articles: 22,
    icon: "🔧",
    updated: "5 days ago",
  },
  {
    id: "6",
    name: "Release Notes",
    description: "Latest updates and changelog",
    articles: 18,
    icon: "📋",
    updated: "Today",
  },
];

const KnowledgeBase = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") || "documentation";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success("File uploaded successfully", {
            description: "Document is now being processed for AI training",
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRetrain = (docId: string) => {
    toast.info("Retraining initiated", {
      description: "The AI model will be updated with the latest document changes",
    });
  };

  const handleDelete = (docId: string) => {
    toast.success("Document deleted", {
      description: "The document has been removed from the knowledge base",
    });
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = selectedClient === "all" || doc.client === selectedClient;
    return matchesSearch && matchesClient;
  });

  const totalVectors = documents.reduce((sum, doc) => sum + doc.vectorCount, 0);
  const processedDocs = documents.filter((d) => d.status === "processed").length;

  return (
    <DashboardLayout title="Knowledge Hub" subtitle="Documentation, tutorials, certifications, and training materials">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documentationCategories.reduce((sum, c) => sum + c.articles, 0)}</p>
                  <p className="text-sm text-muted-foreground">Documentation Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <Video className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{tutorials.length}</p>
                  <p className="text-sm text-muted-foreground">Video Tutorials</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <Award className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certifications.filter((c) => c.status === "available").length}</p>
                  <p className="text-sm text-muted-foreground">Certifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Brain className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalVectors.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Vector Embeddings</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="documentation">Documentation</TabsTrigger>
            <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
            <TabsTrigger value="certifications">Certifications</TabsTrigger>
            <TabsTrigger value="training-docs">Training Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="training">Training Status</TabsTrigger>
          </TabsList>

          {/* Documentation Tab */}
          <TabsContent value="documentation" className="space-y-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documentationCategories.map((category) => (
                <Card key={category.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{category.icon}</div>
                        <div>
                          <CardTitle className="text-lg">{category.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{category.articles} articles</p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Updated {category.updated}</span>
                      <Button variant="ghost" size="sm">
                        View Docs
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Tutorials Tab */}
          <TabsContent value="tutorials" className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tutorials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tutorials.map((tutorial) => (
                <Card key={tutorial.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="text-3xl">{tutorial.thumbnail}</div>
                      <Badge variant="secondary">{tutorial.category}</Badge>
                    </div>
                    <CardTitle className="text-lg leading-tight">{tutorial.title}</CardTitle>
                    <CardDescription>{tutorial.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {tutorial.duration}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          tutorial.level === "Beginner" && "border-success text-success",
                          tutorial.level === "Intermediate" && "border-warning text-warning",
                          tutorial.level === "Advanced" && "border-destructive text-destructive"
                        )}
                      >
                        {tutorial.level}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {tutorial.views.toLocaleString()}
                      </div>
                    </div>
                    <Button className="w-full">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Watch Tutorial
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Certifications Tab */}
          <TabsContent value="certifications" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {certifications.map((cert) => (
                <Card key={cert.id} className={cn(
                  "relative overflow-hidden",
                  cert.status === "coming_soon" && "opacity-70"
                )}>
                  {cert.status === "coming_soon" && (
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary">Coming Soon</Badge>
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{cert.badge}</div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{cert.name}</CardTitle>
                        <CardDescription className="mt-1">{cert.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-muted-foreground" />
                        <span>{cert.modules} modules</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{cert.duration}</span>
                      </div>
                      {cert.enrolled > 0 && (
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{cert.enrolled} enrolled</span>
                        </div>
                      )}
                    </div>
                    <Button 
                      className="w-full" 
                      disabled={cert.status === "coming_soon"}
                      onClick={() => toast.success(`Enrolled in ${cert.name}`)}
                    >
                      {cert.status === "coming_soon" ? (
                        "Coming Soon"
                      ) : (
                        <>
                          <Award className="h-4 w-4 mr-2" />
                          Start Certification
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="training-docs" className="space-y-4">
            {/* Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[300px] pl-9"
                  />
                </div>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Clients</SelectItem>
                    <SelectItem value="Acme Corporation">Acme Corporation</SelectItem>
                    <SelectItem value="TechFlow Inc">TechFlow Inc</SelectItem>
                    <SelectItem value="Global Services">Global Services</SelectItem>
                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                    <SelectItem value="RetailMax">RetailMax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Documents Table */}
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Vectors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => {
                    const TypeIcon = typeIcons[doc.type];
                    const StatusIcon = statusIcons[doc.status];
                    return (
                      <TableRow key={doc.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-secondary">
                              <TypeIcon className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-muted-foreground capitalize">{doc.type}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{doc.client}</TableCell>
                        <TableCell>{doc.size}</TableCell>
                        <TableCell>{doc.vectorCount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", statusStyles[doc.status])}>
                            <StatusIcon className="h-3 w-3" />
                            {doc.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{doc.uploadedAt}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRetrain(doc.id)}
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleDelete(doc.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Documents</CardTitle>
                  <CardDescription>
                    Upload FAQs, PDFs, manuals, or database exports for AI training
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                      "hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                    )}
                    onClick={handleFileUpload}
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      PDF, DOCX, JSON, CSV, TXT (max 50MB)
                    </p>
                  </div>

                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Assign to Client</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="acme">Acme Corporation</SelectItem>
                        <SelectItem value="techflow">TechFlow Inc</SelectItem>
                        <SelectItem value="global">Global Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="faq">FAQ Document</SelectItem>
                        <SelectItem value="manual">User Manual</SelectItem>
                        <SelectItem value="policy">Policy Document</SelectItem>
                        <SelectItem value="database">Database Export</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Supported Formats</CardTitle>
                  <CardDescription>
                    The AI can learn from various document formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { icon: FileQuestion, name: "FAQ Documents", formats: "PDF, DOCX, TXT", desc: "Question-answer pairs" },
                    { icon: BookOpen, name: "User Manuals", formats: "PDF, DOCX", desc: "Product documentation" },
                    { icon: FileText, name: "Policy Documents", formats: "PDF, DOCX, TXT", desc: "Terms, policies, guidelines" },
                    { icon: Database, name: "Database Exports", formats: "JSON, CSV", desc: "Structured data" },
                  ].map((format) => (
                    <div key={format.name} className="flex items-start gap-4 p-3 rounded-lg bg-secondary/30">
                      <div className="p-2 rounded-lg bg-background">
                        <format.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{format.name}</p>
                        <p className="text-sm text-muted-foreground">{format.desc}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">{format.formats}</Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Pipeline</CardTitle>
                <CardDescription>
                  Monitor document processing and AI model training status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { step: "Document Parsing", status: "complete", progress: 100 },
                    { step: "Text Extraction", status: "complete", progress: 100 },
                    { step: "Chunking & Embedding", status: "active", progress: 68 },
                    { step: "Vector Storage", status: "pending", progress: 0 },
                    { step: "Model Fine-tuning", status: "pending", progress: 0 },
                  ].map((step, index) => (
                    <div key={step.step} className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                          step.status === "complete" && "bg-success text-success-foreground",
                          step.status === "active" && "bg-primary text-primary-foreground",
                          step.status === "pending" && "bg-muted text-muted-foreground"
                        )}
                      >
                        {step.status === "complete" ? <CheckCircle className="h-4 w-4" /> : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{step.step}</span>
                          <span className="text-sm text-muted-foreground">{step.progress}%</span>
                        </div>
                        <Progress value={step.progress} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBase;