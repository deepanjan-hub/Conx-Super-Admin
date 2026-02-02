import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  CreditCard,
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useClientStore } from "@/stores/clientStore";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const steps = [
  { id: 1, title: "Company Details", icon: Building2 },
  { id: 2, title: "Subscription", icon: CreditCard },
  { id: 3, title: "Configuration", icon: Settings },
  { id: 4, title: "Review", icon: CheckCircle },
];

const planPrices: Record<string, string> = {
  starter: "$299",
  professional: "$899",
  enterprise: "$2,499",
};

export const AddClientDialog = ({ open, onOpenChange }: AddClientDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const addClient = useClientStore((state) => state.addClient);
  
  const [formData, setFormData] = useState({
    companyName: "",
    adminEmail: "",
    phone: "",
    website: "",
    industry: "",
    address: "",
    billingEmail: "",
    plan: "professional",
    voiceEnabled: true,
    chatEnabled: true,
    emailEnabled: true,
    sentimentAnalysis: true,
    fraudDetection: false,
    multiLanguage: true,
    languages: ["en"],
  });

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.companyName.trim()) {
          toast.error("Company name is required");
          return false;
        }
        if (!formData.adminEmail.trim() || !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
          toast.error("Valid admin email is required");
          return false;
        }
        return true;
      case 2:
        if (!formData.plan) {
          toast.error("Please select a subscription plan");
          return false;
        }
        return true;
      case 3:
        if (!formData.voiceEnabled && !formData.chatEnabled && !formData.emailEnabled) {
          toast.error("At least one communication channel must be enabled");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        toast.success(`Step ${currentStep} completed`);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Add client to the store
    const planMap: Record<string, "Starter" | "Professional" | "Enterprise"> = {
      starter: "Starter",
      professional: "Professional",
      enterprise: "Enterprise",
    };
    
    addClient({
      name: formData.companyName,
      email: formData.adminEmail,
      plan: planMap[formData.plan],
      status: "Active",
      users: 1,
      conversations: "0",
      mrr: planPrices[formData.plan],
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
    
    toast.success(`${formData.companyName} has been created successfully!`, {
      description: `Invitation email sent to ${formData.adminEmail}`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setCurrentStep(1);
    setFormData({
      companyName: "",
      adminEmail: "",
      phone: "",
      website: "",
      industry: "",
      address: "",
      billingEmail: "",
      plan: "professional",
      voiceEnabled: true,
      chatEnabled: true,
      emailEnabled: true,
      sentimentAnalysis: true,
      fraudDetection: false,
      multiLanguage: true,
      languages: ["en"],
    });
  };

  const handleClose = () => {
    onOpenChange(false);
    setCurrentStep(1);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Set up a new enterprise client account with guided onboarding
          </DialogDescription>
        </DialogHeader>

        {/* Stepper */}
        <div className="flex items-center justify-between py-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={cn(
                  "flex items-center gap-2",
                  currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors",
                    currentStep >= step.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}
                >
                  {currentStep > step.id ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <step.icon className="h-4 w-4" />
                  )}
                </div>
                <span className="text-sm font-medium hidden sm:inline">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-8 sm:w-16 h-0.5 mx-2",
                    currentStep > step.id ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto pr-2">
          {/* Step 1: Company Details */}
          {currentStep === 1 && (
            <div className="space-y-4 py-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Acme Corporation"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Admin Email *</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    placeholder="admin@company.com"
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    placeholder="https://company.com"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData({ ...formData, industry: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingEmail">Billing Email</Label>
                  <Input
                    id="billingEmail"
                    type="email"
                    placeholder="billing@company.com"
                    value={formData.billingEmail}
                    onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter company address..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* Step 2: Subscription */}
          {currentStep === 2 && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Subscription Plan</Label>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      id: "starter",
                      name: "Starter",
                      price: "$299",
                      features: ["5 users", "10K conversations", "Chat & Email"],
                    },
                    {
                      id: "professional",
                      name: "Professional",
                      price: "$899",
                      features: ["25 users", "50K conversations", "All channels"],
                      popular: true,
                    },
                    {
                      id: "enterprise",
                      name: "Enterprise",
                      price: "$2,499",
                      features: ["200 users", "Unlimited", "Custom"],
                    },
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      className={cn(
                        "relative p-4 rounded-lg border-2 cursor-pointer transition-all",
                        formData.plan === plan.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/50"
                      )}
                      onClick={() => setFormData({ ...formData, plan: plan.id })}
                    >
                      {plan.popular && (
                        <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                          Popular
                        </Badge>
                      )}
                      <div className="text-center">
                        <p className="font-medium">{plan.name}</p>
                        <p className="text-2xl font-bold mt-2">{plan.price}</p>
                        <p className="text-xs text-muted-foreground">/month</p>
                      </div>
                      <ul className="mt-4 space-y-1">
                        {plan.features.map((feature) => (
                          <li key={feature} className="text-sm text-muted-foreground flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-success" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Configuration */}
          {currentStep === 3 && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <Label className="text-base">Communication Channels</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium">Voice Calls</p>
                      <p className="text-sm text-muted-foreground">Inbound & outbound AI calling</p>
                    </div>
                    <Switch
                      checked={formData.voiceEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, voiceEnabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium">Chat</p>
                      <p className="text-sm text-muted-foreground">Web, mobile, and messaging</p>
                    </div>
                    <Switch
                      checked={formData.chatEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, chatEnabled: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                    <div>
                      <p className="font-medium">Email Automation</p>
                      <p className="text-sm text-muted-foreground">AI-assisted replies</p>
                    </div>
                    <Switch
                      checked={formData.emailEnabled}
                      onCheckedChange={(checked) => setFormData({ ...formData, emailEnabled: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base">Advanced Features</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Sentiment Analysis</p>
                      <p className="text-sm text-muted-foreground">Real-time sentiment tagging</p>
                    </div>
                    <Switch
                      checked={formData.sentimentAnalysis}
                      onCheckedChange={(checked) => setFormData({ ...formData, sentimentAnalysis: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Fraud Detection</p>
                      <p className="text-sm text-muted-foreground">Anomaly detection</p>
                    </div>
                    <Switch
                      checked={formData.fraudDetection}
                      onCheckedChange={(checked) => setFormData({ ...formData, fraudDetection: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Multi-Language</p>
                      <p className="text-sm text-muted-foreground">EN, DE, CZ, SK, PL, HI</p>
                    </div>
                    <Switch
                      checked={formData.multiLanguage}
                      onCheckedChange={(checked) => setFormData({ ...formData, multiLanguage: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4 py-4">
              <div className="p-4 rounded-lg bg-secondary/30 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{formData.companyName || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Admin Email</p>
                    <p className="font-medium">{formData.adminEmail || "Not provided"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Plan</p>
                    <Badge className="mt-1">
                      {formData.plan.charAt(0).toUpperCase() + formData.plan.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Industry</p>
                    <p className="font-medium">{formData.industry || "Not provided"}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Enabled Channels</p>
                  <div className="flex gap-2">
                    {formData.voiceEnabled && <Badge variant="secondary">Voice</Badge>}
                    {formData.chatEnabled && <Badge variant="secondary">Chat</Badge>}
                    {formData.emailEnabled && <Badge variant="secondary">Email</Badge>}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Enabled Features</p>
                  <div className="flex gap-2 flex-wrap">
                    {formData.sentimentAnalysis && <Badge variant="secondary">Sentiment Analysis</Badge>}
                    {formData.fraudDetection && <Badge variant="secondary">Fraud Detection</Badge>}
                    {formData.multiLanguage && <Badge variant="secondary">Multi-Language</Badge>}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-primary">
                  An invitation email will be sent to <strong>{formData.adminEmail}</strong> with instructions to complete the onboarding process.
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="gap-2 mr-auto" disabled={isSubmitting}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          <Button variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          {currentStep < 4 ? (
            <Button onClick={handleNext} className="gap-2">
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Client"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};