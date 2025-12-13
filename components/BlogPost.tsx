import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock } from 'lucide-react';
import { BlogPost as BlogPostType } from '../types';
import { storageService } from '../services/storageService';
import { Button } from './Button';

export const BlogPost: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      storageService.getPostById(id)
        .then(setPost)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded w-full mt-8"></div>
          <div className="space-y-2 mt-8">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900">Post not found</h2>
        <Button onClick={() => navigate('/')} className="mt-4" variant="secondary">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')} 
        className="mb-8 -ml-4 text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Articles
      </Button>

      <header className="mb-10 text-center">
        <div className="flex items-center justify-center gap-4 text-sm text-gray-500 mb-6">
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <User className="h-3.5 w-3.5" />
            {post.author}
          </span>
          <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full">
            <Clock className="h-3.5 w-3.5" />
            {Math.ceil(post.content.length / 500)} min read
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
          {post.title}
        </h1>
      </header>

      {post.imageUrl && (
        <div className="rounded-2xl overflow-hidden shadow-lg mb-10">
          <img 
            src={post.imageUrl} 
            alt={post.title} 
            className="w-full h-auto max-h-[600px] object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg prose-blue mx-auto text-gray-700 leading-relaxed">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
};