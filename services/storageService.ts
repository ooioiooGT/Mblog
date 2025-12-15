import { BlogPost, CreatePostDTO } from '../types';

// Robust API URL Detection:
// 1. Get the current protocol (http/https), hostname (localhost/ip), and port.
// 2. If the current port is '3001', we are serving the app from the backend itself (Production/Ubuntu), so use relative path '/api'.
// 3. Otherwise (Development), assume the backend is on port 3001 of the SAME hostname.
// This allows access via localhost, 127.0.0.1, OR network IP (192.168.x.x) without code changes.
const protocol = window.location.protocol;
const hostname = window.location.hostname;
const port = window.location.port;

const API_URL = port === '3001' 
  ? '/api' 
  : `${protocol}//${hostname}:3001/api`;

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const storageService = {
  async getPosts(searchQuery: string = ''): Promise<BlogPost[]> {
    try {
      const url = searchQuery 
        ? `${API_URL}/posts?q=${encodeURIComponent(searchQuery)}` 
        : `${API_URL}/posts`;
      
      const response = await fetch(url);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error: ${response.status} - ${errorText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts from API", error);
      return [];
    }
  },

  async getPostById(id: string): Promise<BlogPost | undefined> {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`);
      if (!response.ok) return undefined;
      const data = await response.json();
      return data || undefined;
    } catch (error) {
      console.error(`Failed to fetch post ${id}`, error);
      return undefined;
    }
  },

  async createPost(dto: CreatePostDTO): Promise<BlogPost> {
    let imageUrl = '';
    
    if (dto.imageFile) {
      try {
        imageUrl = await fileToBase64(dto.imageFile);
      } catch (e) {
        console.error("Failed to process image", e);
      }
    } else {
        imageUrl = `https://picsum.photos/800/400?random=${Math.random()}`;
    }

    const postPayload = {
      title: dto.title,
      content: dto.content,
      excerpt: dto.content.substring(0, 150) + '...',
      imageUrl,
      createdAt: Date.now(),
      author: 'Admin'
    };

    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save post: ${response.status} - ${errorText}`);
    }

    return await response.json();
  },

  async deletePost(id: string): Promise<void> {
    try {
      await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  }
};