import { useState } from "react";
import { Flow, FlowVersion } from "./types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Save,
  Upload,
  History,
  RotateCcw,
  GitBranch,
  MoreHorizontal,
  Check,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface FlowVersionControlProps {
  flow: Flow;
  onSave: (notes?: string) => void;
  onPublish: () => void;
  onRollback: (versionId: string) => void;
  isDirty: boolean;
}

export function FlowVersionControl({
  flow,
  onSave,
  onPublish,
  onRollback,
  isDirty,
}: FlowVersionControlProps) {
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [versionNotes, setVersionNotes] = useState("");

  const handleSave = () => {
    onSave(versionNotes);
    setVersionNotes("");
    toast.success("Flow saved as draft");
  };

  const handlePublish = () => {
    onPublish();
    setShowPublishDialog(false);
    toast.success("Flow published successfully!", {
      description: "Your changes are now live",
    });
  };

  return (
    <div className="flex items-center gap-2">
      {/* Status indicator */}
      <div className="flex items-center gap-2 mr-2">
        <Badge
          variant="outline"
          className={cn(
            "gap-1",
            flow.status === "published" && "border-success text-success",
            flow.status === "draft" && "border-warning text-warning",
            flow.status === "testing" && "border-blue-500 text-blue-500"
          )}
        >
          {flow.status === "published" && <Check className="h-3 w-3" />}
          {flow.status === "draft" && <Clock className="h-3 w-3" />}
          {flow.status === "testing" && <AlertCircle className="h-3 w-3" />}
          {flow.currentVersion}
          {isDirty && "*"}
        </Badge>
      </div>

      {/* Save button */}
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleSave}
        disabled={!isDirty}
      >
        <Save className="h-4 w-4" />
        Save Draft
      </Button>

      {/* Version history */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <History className="h-4 w-4" />
            History
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Version History
            </DialogTitle>
            <DialogDescription>
              View and restore previous versions of this flow
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[400px]">
            <div className="space-y-2">
              {flow.versions.map((version, index) => (
                <div
                  key={version.id}
                  className={cn(
                    "p-4 rounded-lg border transition-colors hover:bg-muted/50",
                    version.version === flow.currentVersion && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{version.version}</span>
                        {version.version === flow.currentVersion && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                        {index === 0 && flow.status === "published" && (
                          <Badge className="bg-success/10 text-success text-xs">
                            Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {format(new Date(version.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                      {version.notes && (
                        <p className="text-sm mt-2 text-muted-foreground">
                          "{version.notes}"
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {version.nodeCount} nodes • by {version.createdBy}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        {version.version !== flow.currentVersion && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onRollback(version.id)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Restore this version
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Publish button */}
      <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
        <DialogTrigger asChild>
          <Button size="sm" className="gap-2">
            <Upload className="h-4 w-4" />
            Publish
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish Flow</DialogTitle>
            <DialogDescription>
              This will make the current version live and available for use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Flow</span>
                <span className="font-medium">{flow.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Version</span>
                <span className="font-medium">{flow.currentVersion}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Nodes</span>
                <span className="font-medium">{flow.nodes.length}</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Version Notes (optional)</Label>
              <Textarea
                value={versionNotes}
                onChange={(e) => setVersionNotes(e.target.value)}
                placeholder="What changed in this version?"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handlePublish} className="gap-2">
              <Upload className="h-4 w-4" />
              Publish Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
