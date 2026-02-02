import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  Phone,
  MessageSquare,
  Mail,
  Shield,
  Fingerprint,
  AlertTriangle,
  Globe,
  Palette,
  Save,
} from "lucide-react";

const PlatformConfig = () => {
  return (
    <DashboardLayout title="Platform Configuration" subtitle="Global settings and feature management">
      <div className="space-y-6 animate-fade-in max-w-4xl">
        {/* LLM Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Brain className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>LLM Configuration</CardTitle>
                <CardDescription>Manage AI model providers and settings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="primary-llm">Primary LLM Provider</Label>
                <Select defaultValue="openai">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude 3.5</SelectItem>
                    <SelectItem value="opensource">Open Source (Llama 3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fallback-llm">Fallback LLM Provider</Label>
                <Select defaultValue="anthropic">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                    <SelectItem value="anthropic">Anthropic Claude 3.5</SelectItem>
                    <SelectItem value="opensource">Open Source (Llama 3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Latency-Based Fallback</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically switch providers when latency exceeds threshold
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Channel Configuration */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Omnichannel Configuration</CardTitle>
            <CardDescription>Enable or disable communication channels globally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                  <Phone className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Voice Calls</p>
                  <p className="text-sm text-muted-foreground">Inbound & outbound AI calling</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/10">
                  <MessageSquare className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Chat</p>
                  <p className="text-sm text-muted-foreground">Web, mobile, and messaging</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-warning/10">
                  <Mail className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Email Automation</p>
                  <p className="text-sm text-muted-foreground">AI-assisted replies and routing</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Feature Toggles */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Advanced Features</CardTitle>
            <CardDescription>Toggle premium and experimental features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base">Content Safety Filters</Label>
                  <p className="text-sm text-muted-foreground">Block unsafe, violent, or hateful content</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Fingerprint className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base">Voice Biometrics</Label>
                  <p className="text-sm text-muted-foreground">Enable voice-based authentication</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-warning/10 text-warning">Beta</Badge>
                <Switch />
              </div>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base">Fraud Detection</Label>
                  <p className="text-sm text-muted-foreground">Detect anomalies and suspicious activity</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base">Multi-Language Support</Label>
                  <p className="text-sm text-muted-foreground">EN, DE, CZ, SK, PL, HI</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Palette className="h-5 w-5 text-primary" />
                <div>
                  <Label className="text-base">White-Label Branding</Label>
                  <p className="text-sm text-muted-foreground">Custom logos, themes, and domains</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button className="gap-2">
            <Save className="h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlatformConfig;