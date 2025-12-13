import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Wand2, Save, X } from 'lucide-react';
import { storageService } from '../services/storageService';
import { geminiService } from '../services/geminiService';
import { Input, Textarea } from './Input';
import { Button } from './Button';

export const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const result = await geminiService.generateBlogContent(prompt);
      setTitle(result.title);
      setContent(result.content);
    } catch (error) {
      console.error("Failed to generate content", error);
      alert("Failed to generate content. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    setIsSubmitting(true);
    try {
      await storageService.createPost({
        title,
        content,
        imageFile
      });
      navigate('/');
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to publish post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
            <p className="text-sm text-gray-500">Manage your blog content from here.</p>
          </div>
          
          {/* AI Generator Section */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Topic for AI generation..."
                className="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <Wand2 className="absolute right-3 top-2.5 h-4 w-4 text-purple-500" />
            </div>
            <Button 
              type="button" 
              onClick={handleGenerate} 
              isLoading={isGenerating}
              disabled={!prompt}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Generate
            </Button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          <div className="space-y-4">
            <Input
              label="Post Title"
              placeholder="Enter an engaging title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors ${previewUrl ? 'bg-gray-50' : ''}`}>
                <div className="space-y-1 text-center">
                  {previewUrl ? (
                    <div className="relative inline-block">
                      <img src={previewUrl} alt="Preview" className="mx-auto h-48 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl(null);
                          setImageFile(undefined);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <Textarea
              label="Content"
              placeholder="Write your story here..."
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
            <Button type="button" variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              <Save className="h-4 w-4" />
              Publish Post
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};