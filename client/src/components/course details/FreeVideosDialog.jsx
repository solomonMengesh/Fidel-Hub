import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import VideoPlayer from "@/components/video-player";

export const FreeVideosDialog = ({
  open,
  onOpenChange,
  freeVideoLessons,
  currentFreeVideoIndex,
  onNext,
  onPrev
}) => {
  const currentVideo = freeVideoLessons[currentFreeVideoIndex];
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <div className="flex justify-between items-center">
            <DialogTitle>
              Free Preview ({currentFreeVideoIndex + 1}/{freeVideoLessons.length})
            </DialogTitle>
             
          </div>
        </DialogHeader>
        
        <div className="p-6 pt-0 relative">
          {freeVideoLessons.length > 0 && (
            <>
              <div className="rounded-lg overflow-hidden mb-4">
                <VideoPlayer 
                  url={currentVideo.video.url}
                  width="100%"
                  height="450px"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  onClick={onPrev}
                  disabled={freeVideoLessons.length <= 1}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <div className="text-center">
                  <h3 className="font-medium">
                    {currentVideo.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {currentVideo.duration || 'N/A'}
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={onNext}
                  disabled={freeVideoLessons.length <= 1}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};