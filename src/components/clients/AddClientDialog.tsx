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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useClientStore } from "@/stores/clientStore";

interface AddClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddClientDialog = ({ open, onOpenChange }: AddClientDialogProps) => {
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
  });

  const validateForm = (): boolean => {
    if (!formData.companyName.trim()) {
      toast.error("Company name is required");
      return false;
    }
    if (!formData.adminEmail.trim() || !/\S+@\S+\.\S+/.test(formData.adminEmail)) {
      toast.error("Valid admin email is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    addClient({
      name: formData.companyName,
      email: formData.adminEmail,
      plan: "Starter",
      status: "Active",
      users: 1,
      conversations: "0",
      mrr: "$299",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    });
    
    toast.success(`${formData.companyName} has been created successfully!`, {
      description: `Invitation email sent to ${formData.adminEmail}`,
    });
    
    setIsSubmitting(false);
    onOpenChange(false);
    
    // Reset form
    setFormData({
      companyName: "",
      adminEmail: "",
      phone: "",
      website: "",
      industry: "",
      address: "",
      billingEmail: "",
    });
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>
            Enter company details to create a new client account
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Add Client"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
