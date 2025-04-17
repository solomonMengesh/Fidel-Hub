import { FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from '@/components/ui/form';

const RequirementsTab = ({ form }) => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          <FileText className="inline mr-2" size={18} />
          Prerequisites & Requirements
        </h3>

        <div className="space-y-4">
          <div>
            <Label>What students need to know</Label>
            <Textarea
              placeholder="List any prerequisites for taking this course..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Technical requirements</Label>
            <Textarea
              placeholder="List any technical requirements for the course..."
              className="mt-1"
            />
          </div>

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Course Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="e.g. 49.99"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Set a price for your course
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default RequirementsTab;