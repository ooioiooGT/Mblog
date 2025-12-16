export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl?: string; // Base64 string for local storage simplicity
  createdAt: number;
  author: string;
}

export interface CreatePostDTO {
  title: string;
  content: string;
  imageFile?: File;
}