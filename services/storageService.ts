import { BlogPost, CreatePostDTO } from '../types';

const STORAGE_KEY = 'react_blog_posts_v1';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to convert File to Base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Seed data if empty
const seedData: BlogPost[] = [
  {
    id: '1',
    title: 'Welcome to the Future of Blogging',
    content: 'This is a simulated full-stack environment running entirely in your browser. We are using LocalStorage to mimic a SQLite database and Base64 encoding to handle image "uploads" without a physical server. React 18 and Tailwind CSS power the frontend.',
    excerpt: 'This is a simulated full-stack environment running entirely in your browser...',
    createdAt: Date.now(),
    author: 'Admin',
    imageUrl: 'https://picsum.photos/800/400'
  },
  {
    id: '2',
    title: 'Understanding React Hooks',
    content: 'Hooks are a new addition in React 16.8. They let you use state and other React features without writing a class. The most common hooks are useState and useEffect, which manage local state and side effects respectively.',
    excerpt: 'Hooks are a new addition in React 16.8. They let you use state...',
    createdAt: Date.now() - 86400000,
    author: 'DevTeam',
    imageUrl: 'https://picsum.photos/800/401'
  }
];

export const storageService = {
  async getPosts(searchQuery: string = ''): Promise<BlogPost[]> {
    await delay(300); // Simulate API latency
    const stored = localStorage.getItem(STORAGE_KEY);
    let posts: BlogPost[] = stored ? JSON.parse(stored) : [];
    
    if (posts.length === 0 && !stored) {
      posts = seedData;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    if (!searchQuery) return posts.sort((a, b) => b.createdAt - a.createdAt);

    const lowerQuery = searchQuery.toLowerCase();
    return posts
      .filter(p => 
        p.title.toLowerCase().includes(lowerQuery) || 
        p.content.toLowerCase().includes(lowerQuery)
      )
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  async getPostById(id: string): Promise<BlogPost | undefined> {
    await delay(100);
    const stored = localStorage.getItem(STORAGE_KEY);
    const posts: BlogPost[] = stored ? JSON.parse(stored) : [];
    return posts.find(p => p.id === id);
  },

  async createPost(dto: CreatePostDTO): Promise<BlogPost> {
    await delay(600); // Simulate upload/processing time
    
    let imageUrl = '';
    if (dto.imageFile) {
      try {
        imageUrl = await fileToBase64(dto.imageFile);
      } catch (e) {
        console.error("Failed to process image", e);
        // Fallback or just empty
      }
    } else {
        // Random placeholder if no image provided
        imageUrl = `https://picsum.photos/800/400?random=${Math.random()}`;
    }

    const newPost: BlogPost = {
      id: crypto.randomUUID(),
      title: dto.title,
      content: dto.content,
      excerpt: dto.content.substring(0, 150) + '...',
      imageUrl,
      createdAt: Date.now(),
      author: 'Admin'
    };

    const stored = localStorage.getItem(STORAGE_KEY);
    const posts: BlogPost[] = stored ? JSON.parse(stored) : [];
    const updatedPosts = [newPost, ...posts];
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));
    return newPost;
  },

  async deletePost(id: string): Promise<void> {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const posts: BlogPost[] = JSON.parse(stored);
    const updated = posts.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};