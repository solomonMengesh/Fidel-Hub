import { UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import axios from 'axios';

const PublishTab = ({ courseData }) => {
  const [uploading, setUploading] = useState(false);

  const handlePublish = async () => {
    try {
      setUploading(true);

      // Prepare the data for submission (make sure courseData includes all necessary fields)
      const formData = new FormData();
      formData.append('title', courseData.title);
      formData.append('description', courseData.description);
      formData.append('prerequisites', courseData.prerequisites);
      formData.append('technicalRequirements', courseData.technicalRequirements);
      formData.append('price', courseData.price);
      formData.append('level', courseData.level);
      formData.append('category', courseData.category);
      // Add any additional data that your backend expects

      // API request to publish the course
      const token = localStorage.getItem('token');

      if (!token) {
        alert('You must be logged in to publish a course.');
        return;
      }

      // API request to publish the course
      const response = await axios.post(
        'http://localhost:5000/api/courses/create-course',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`,  // Add the token here
          },
        }
      );

      if (response.status === 200) {
        alert('Course published successfully!');
      } else {
        alert('Failed to publish the course.');
      }
    } catch (error) {
      console.error('Error publishing course:', error.response ? error.response.data : error);
      alert('Error publishing the course.');
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          <UploadCloud className="inline mr-2" size={18} />
          Ready to Publish?
        </h3>

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

        <Button
          type="button"
          size="lg"
          onClick={handlePublish}
          disabled={uploading}
        >
          {uploading ? 'Publishing...' : 'Create Course'}
        </Button>
      </div>
    </div>
  );
};

export default PublishTab;
