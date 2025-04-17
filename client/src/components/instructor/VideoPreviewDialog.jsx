import { PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';

const VideoPreviewDialog = ({ 
  open, 
  onOpenChange,
  video 
}) => {
  if (!video) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Video Preview</DialogTitle>
          <DialogDescription>{video.name}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 bg-slate-900 rounded-md aspect-video flex items-center justify-center">
          <div className="text-center p-6">
            <PlayCircle className="h-16 w-16 mx-auto mb-4 text-fidel-400" />
            <p className="text-white">Video preview placeholder</p>
            <p className="text-white/60 text-sm">{video.name}</p>
            <p className="text-white/60 text-sm mt-2">
              Duration: {video.duration}
            </p>
          </div>
        </div>

        <DialogClose asChild>
          <Button variant="outline" className="mt-2">
            Close Preview
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default VideoPreviewDialog;