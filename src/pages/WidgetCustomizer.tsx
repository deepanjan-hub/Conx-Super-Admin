import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Palette,
  Type,
  Move,
  Image,
  Copy,
  Check,
  RefreshCw,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface WidgetConfig {
  primaryColor: string;
  secondaryColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  borderRadius: number;
  position: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  greeting: string;
  placeholder: string;
  showBranding: boolean;
  enableSound: boolean;
  enableAnimations: boolean;
  botName: string;
  botAvatar: string;
}

const defaultConfig: WidgetConfig = {
  primaryColor: "#3b82f6",
  secondaryColor: "#1e40af",
  textColor: "#ffffff",
  backgroundColor: "#ffffff",
  fontFamily: "Inter",
  fontSize: 14,
  borderRadius: 16,
  position: "bottom-right",
  greeting: "Hello! How can I help you today?",
  placeholder: "Type your message...",
  showBranding: true,
  enableSound: true,
  enableAnimations: true,
  botName: "AI Assistant",
  botAvatar: "",
};

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Poppins",
  "Montserrat",
  "Source Sans Pro",
];

const positionOptions = [
  { value: "bottom-right", label: "Bottom Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "top-right", label: "Top Right" },
  { value: "top-left", label: "Top Left" },
];

const WidgetCustomizer = () => {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [copied, setCopied] = useState(false);
  const [selectedClient, setSelectedClient] = useState("acme");

  const updateConfig = (key: keyof WidgetConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const generateEmbedCode = () => {
    return `<!-- ConX-AI Chat Widget -->
<script>
  window.conxAIConfig = {
    clientId: "${selectedClient}",
    primaryColor: "${config.primaryColor}",
    position: "${config.position}",
    fontFamily: "${config.fontFamily}",
    fontSize: ${config.fontSize},
    borderRadius: ${config.borderRadius},
    greeting: "${config.greeting}",
    botName: "${config.botName}",
    showBranding: ${config.showBranding},
    enableSound: ${config.enableSound},
    enableAnimations: ${config.enableAnimations}
  };
</script>
<script src="https://cdn.conx-ai.com/widget.js" async></script>`;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generateEmbedCode());
    setCopied(true);
    toast.success("Embed code copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetDefaults = () => {
    setConfig(defaultConfig);
    toast.info("Widget settings reset to defaults");
  };

  const handleSaveConfig = () => {
    toast.success("Widget configuration saved", {
      description: `Settings saved for ${selectedClient}`,
    });
  };

  return (
    <DashboardLayout title="Widget Customizer" subtitle="Configure chat widget appearance">
      <div className="grid gap-6 lg:grid-cols-3 animate-fade-in">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Widget Configuration</CardTitle>
                  <CardDescription>Customize the chat widget for your clients</CardDescription>
                </div>
                <Select value={selectedClient} onValueChange={setSelectedClient}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="acme">Acme Corporation</SelectItem>
                    <SelectItem value="techflow">TechFlow Inc</SelectItem>
                    <SelectItem value="global">Global Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="colors" className="space-y-6">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="colors" className="gap-2">
                    <Palette className="h-4 w-4" />
                    Colors
                  </TabsTrigger>
                  <TabsTrigger value="typography" className="gap-2">
                    <Type className="h-4 w-4" />
                    Typography
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="gap-2">
                    <Move className="h-4 w-4" />
                    Layout
                  </TabsTrigger>
                  <TabsTrigger value="branding" className="gap-2">
                    <Image className="h-4 w-4" />
                    Branding
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="colors" className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Primary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.primaryColor}
                          onChange={(e) => updateConfig("primaryColor", e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={config.primaryColor}
                          onChange={(e) => updateConfig("primaryColor", e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Secondary Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={config.secondaryColor}
                          onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Text Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.textColor}
                          onChange={(e) => updateConfig("textColor", e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={config.textColor}
                          onChange={(e) => updateConfig("textColor", e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input
                          value={config.backgroundColor}
                          onChange={(e) => updateConfig("backgroundColor", e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select
                        value={config.fontFamily}
                        onValueChange={(v) => updateConfig("fontFamily", v)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {fontOptions.map((font) => (
                            <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                              {font}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Font Size</Label>
                        <span className="text-sm text-muted-foreground">{config.fontSize}px</span>
                      </div>
                      <Slider
                        value={[config.fontSize]}
                        onValueChange={([v]) => updateConfig("fontSize", v)}
                        min={12}
                        max={20}
                        step={1}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="layout" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Widget Position</Label>
                      <Select
                        value={config.position}
                        onValueChange={(v) => updateConfig("position", v as WidgetConfig["position"])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {positionOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Border Radius</Label>
                        <span className="text-sm text-muted-foreground">{config.borderRadius}px</span>
                      </div>
                      <Slider
                        value={[config.borderRadius]}
                        onValueChange={([v]) => updateConfig("borderRadius", v)}
                        min={0}
                        max={24}
                        step={2}
                      />
                    </div>
                    <Separator />
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Animations</p>
                          <p className="text-sm text-muted-foreground">Smooth transitions</p>
                        </div>
                        <Switch
                          checked={config.enableAnimations}
                          onCheckedChange={(v) => updateConfig("enableAnimations", v)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Sound</p>
                          <p className="text-sm text-muted-foreground">Message notification sound</p>
                        </div>
                        <Switch
                          checked={config.enableSound}
                          onCheckedChange={(v) => updateConfig("enableSound", v)}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="branding" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Bot Name</Label>
                      <Input
                        value={config.botName}
                        onChange={(e) => updateConfig("botName", e.target.value)}
                        placeholder="AI Assistant"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Greeting Message</Label>
                      <Input
                        value={config.greeting}
                        onChange={(e) => updateConfig("greeting", e.target.value)}
                        placeholder="Hello! How can I help you?"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Input Placeholder</Label>
                      <Input
                        value={config.placeholder}
                        onChange={(e) => updateConfig("placeholder", e.target.value)}
                        placeholder="Type your message..."
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Show ConX-AI Branding</p>
                        <p className="text-sm text-muted-foreground">Powered by ConX-AI badge</p>
                      </div>
                      <Switch
                        checked={config.showBranding}
                        onCheckedChange={(v) => updateConfig("showBranding", v)}
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Separator className="my-6" />

              <div className="flex items-center gap-3">
                <Button onClick={handleSaveConfig}>Save Configuration</Button>
                <Button variant="outline" onClick={handleResetDefaults} className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset Defaults
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Embed Code */}
          <Card>
            <CardHeader>
              <CardTitle>Embed Code</CardTitle>
              <CardDescription>Copy this code to add the chat widget to your website</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 rounded-lg bg-secondary/50 overflow-x-auto text-sm font-mono">
                  {generateEmbedCode()}
                </pre>
                <Button
                  size="sm"
                  className="absolute top-2 right-2 gap-1"
                  onClick={handleCopyCode}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Live Preview</CardTitle>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Eye className="h-4 w-4" />
                  Full Screen
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div
                className="relative bg-muted/50 rounded-lg overflow-hidden"
                style={{ height: "500px" }}
              >
                {/* Mock Website Background */}
                <div className="absolute inset-0 p-4">
                  <div className="h-4 w-32 bg-muted rounded mb-4" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-4/5 bg-muted rounded" />
                    <div className="h-3 w-3/4 bg-muted rounded" />
                  </div>
                </div>

                {/* Chat Widget Preview */}
                <div
                  className={cn(
                    "absolute",
                    config.position === "bottom-right" && "bottom-4 right-4",
                    config.position === "bottom-left" && "bottom-4 left-4",
                    config.position === "top-right" && "top-4 right-4",
                    config.position === "top-left" && "top-4 left-4"
                  )}
                >
                  {/* Chat Window */}
                  <div
                    className="w-72 shadow-xl"
                    style={{
                      borderRadius: `${config.borderRadius}px`,
                      backgroundColor: config.backgroundColor,
                      fontFamily: config.fontFamily,
                      fontSize: `${config.fontSize}px`,
                    }}
                  >
                    {/* Header */}
                    <div
                      className="p-4 flex items-center gap-3"
                      style={{
                        backgroundColor: config.primaryColor,
                        borderTopLeftRadius: `${config.borderRadius}px`,
                        borderTopRightRadius: `${config.borderRadius}px`,
                        color: config.textColor,
                      }}
                    >
                      <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                        <MessageCircle className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold">{config.botName}</p>
                        <p className="text-xs opacity-80">Online</p>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="p-4 space-y-3 min-h-[200px]">
                      <div
                        className="p-3 rounded-lg max-w-[85%]"
                        style={{
                          backgroundColor: config.primaryColor + "15",
                          borderRadius: `${config.borderRadius / 2}px`,
                        }}
                      >
                        <p className="text-sm">{config.greeting}</p>
                      </div>
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={config.placeholder}
                          className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none"
                          style={{ borderRadius: `${config.borderRadius / 2}px` }}
                          readOnly
                        />
                        <button
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: config.primaryColor, color: config.textColor }}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                      {config.showBranding && (
                        <p className="text-center text-xs text-muted-foreground mt-2">
                          Powered by ConX-AI
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default WidgetCustomizer;