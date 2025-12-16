import { BlogPost, CreatePostDTO } from '../types';

// Determine the API URL dynamically
const getApiUrl = () => {
  try {
    const { protocol, hostname, port } = window.location;

    // 1. Production (Same Origin):
    // If the frontend is loaded from port 3001, Node is serving it.
    // We use a relative path.
    if (port === '3001') {
      return '/api';
    }

    // 2. Development (Localhost):
    // If on localhost but NOT port 3001 (e.g., Vite on 3000), point to 3001.
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
       return 'http://localhost:3001/api';
    }

    // 3. Network Development / Production with Proxy:
    // If we are on a custom domain or IP (192.168.x.x), we generally assume 
    // relative path if it's production behind Nginx, OR we might be developing on network.
    // For safety in this specific "Host on Ubuntu" use case where Node serves static:
    return '/api';
    
  } catch (e) {
    return '/api';
  }
};

const API_URL = getApiUrl();

// Helper to convert File to Base64 (still needed to send image data to server)
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
        throw new Error(`Server Error: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch posts", error);
      return [];
    }
  },

  async getPostById(id: string): Promise<BlogPost | undefined> {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`);
      if (!response.ok) return undefined;
      return await response.json();
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
      throw new Error('Failed to save post to server');
    }

    return await response.json();
  },

  async deletePost(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error("Failed to delete post", error);
      throw error;
    }
  }
};