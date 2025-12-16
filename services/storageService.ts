import { BlogPost, CreatePostDTO } from '../types';

// Determine the API URL dynamically
const getApiUrl = () => {
  try {
    const { protocol, hostname, port } = window.location;

    // 1. Production: If serving from port 3001, the backend is serving the frontend.
    // Use relative path to avoid CORS and hostname issues.
    if (port === '3001') {
      return '/api';
    }

    // 2. Sandbox/Preview/Blob environments:
    // If the hostname is empty or protocol is blob/file (common in in-browser IDEs),
    // we default to standard localhost:3001.
    if (!hostname || protocol === 'blob:' || protocol === 'file:') {
      return 'http://localhost:3001/api';
    }

    // 3. Standard Development:
    // Frontend is likely on port 3000 (or similar), Backend on 3001.
    // We preserve the protocol (http/https) and hostname to support network access (e.g. 192.168.x.x).
    return `${protocol}//${hostname}:3001/api`;
  } catch (e) {
    // Fallback safety
    return 'http://localhost:3001/api';
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
      // Build query URL
      // Ensure API_URL doesn't end with slash if we append /posts, but logic above handles it (no trailing slash)
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
    
    // Process image client-side first
    if (dto.imageFile) {
      try {
        imageUrl = await fileToBase64(dto.imageFile);
      } catch (e) {
        console.error("Failed to process image", e);
      }
    } else {
        imageUrl = `https://picsum.photos/800/400?random=${Math.random()}`;
    }

    // Prepare payload
    const postPayload = {
      title: dto.title,
      content: dto.content,
      excerpt: dto.content.substring(0, 150) + '...',
      imageUrl,
      createdAt: Date.now(),
      author: 'Admin'
    };

    // Send to backend
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save post to server: ${response.status} - ${errorText}`);
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