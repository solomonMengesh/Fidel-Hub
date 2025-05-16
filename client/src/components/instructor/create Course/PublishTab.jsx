import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import axios from "axios";

const PublishTab = ({ courseId, modules, initialPublished }) => {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!courseId || modules.length === 0) {
      toast.error("Please create a course and at least one module before publishing.");
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.patch(
        `/api/courses/${courseId}/status`,
        { published: isPublished },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // adjust if using context or cookies
          },
        }
      );

      toast.success(res.data.message);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to update course status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Ready to Publish?</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Review your course information and curriculum before publishing
        </p>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 p-4 mb-6">
          <h4 className="font-medium mb-2">Publishing Checklist</h4>
          <ul className="space-y-1">
            <li className="flex items-center text-sm">
              <div className="h-4 w-4 rounded-full mr-2 bg-green-500"></div>
              Course title and description are complete
            </li>
            <li className="flex items-center text-sm">
              <div className="h-4 w-4 rounded-full mr-2 bg-green-500"></div>
              At least one module with content is created
            </li>
            <li className="flex items-center text-sm">
              <div className="h-4 w-4 rounded-full mr-2 bg-green-500"></div>
              Pricing information is set
            </li>
          </ul>
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <Label htmlFor="publish-switch">Publish</Label>
          <Switch
            id="publish-switch"
            checked={isPublished}
            onCheckedChange={(checked) => setIsPublished(checked)}
          />
          <span className="text-sm text-muted-foreground">
            {isPublished
              ? "This course will be published"
              : "This course will remain a draft"}
          </span>
        </div>

        <Button
          type="button"
          size="lg"
          disabled={isLoading}
          onClick={handleSave}
        >
          {isLoading
            ? "Saving..."
            : isPublished
            ? "Publish Course"
            : "Save as Draft"}
        </Button>
      </div>
    </div>
  );
};

export default PublishTab;
