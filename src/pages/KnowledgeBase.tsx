import { useState } from "react";
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

const KnowledgeBase = () => {
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
    <DashboardLayout title="Knowledge Base" subtitle="Manage training data for AI agents">
      <div className="space-y-6 animate-fade-in">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{documents.length}</p>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{processedDocs}</p>
                  <p className="text-sm text-muted-foreground">Processed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary">
                  <Brain className="h-6 w-6 text-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalVectors.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Vector Embeddings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Processing</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="documents" className="space-y-6">
          <TabsList>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="training">Training Status</TabsTrigger>
          </TabsList>

          <TabsContent value="documents" className="space-y-4">
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