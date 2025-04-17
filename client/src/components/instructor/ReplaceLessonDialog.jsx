import { Video, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

const ReplaceLessonDialog = ({ 
  open, 
  onOpenChange,
  onReplaceWithVideo,
  onReplaceWithQuiz 
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Replace Lesson</DialogTitle>
          <DialogDescription>
            Choose how you want to replace this lesson
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div
            className="border rounded-md p-4 hover:border-fidel-500 cursor-pointer transition-all"
            onClick={onReplaceWithVideo}
          >
            <Video size={24} className="mx-auto mb-2 text-fidel-500" />
            <h4 className="font-medium text-center">Replace with Video</h4>
            <p className="text-sm text-center text-muted-foreground mt-1">
              Upload a new video for this lesson
            </p>
          </div>

          <div
            className="border rounded-md p-4 hover:border-fidel-500 cursor-pointer transition-all"
            onClick={onReplaceWithQuiz}
          >
            <BarChart size={24} className="mx-auto mb-2 text-fidel-500" />
            <h4 className="font-medium text-center">Replace with Quiz</h4>
            <p className="text-sm text-center text-muted-foreground mt-1">
              Create a new quiz for this lesson
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReplaceLessonDialog;