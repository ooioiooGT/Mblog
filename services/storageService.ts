import { BlogPost, CreatePostDTO } from '../types';

const getApiUrl = () => {
  try {
    const { protocol, hostname, port } = window.location;
    if (port === '3001') return '/api';
    if (hostname === 'localhost' || hostname === '127.0.0.1') return 'http://localhost:3001/api';
    return '/api';
  } catch (e) {
    return '/api';
  }
};

const API_URL = getApiUrl();

/**
 * Processes the image on the client side:
 * 1. Resizes to a max dimension to reduce payload size
 * 2. Converts to JPEG for universal compatibility (fixing HEIC issues)
 * 3. Compresses to save storage/bandwidth
 */
const processImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Could not get canvas context');
        
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to JPEG with 0.7 quality
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

export const storageService = {
  async getPosts(searchQuery: string = ''): Promise<BlogPost[]> {
    try {
      const url = searchQuery 
        ? `${API_URL}/posts?q=${encodeURIComponent(searchQuery)}` 
        : `${API_URL}/posts`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server Error: ${response.status}`);
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
        imageUrl = await processImage(dto.imageFile);
      } catch (e) {
        console.error("Failed to process image, falling back to random", e);
        imageUrl = `https://picsum.photos/800/400?random=${Math.random()}`;
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postPayload),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || 'Failed to save post to server');
    }

    return await response.json();
  },

  async deletePost(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error("Failed to delete post", error);
      throw error;
    }
  }
};