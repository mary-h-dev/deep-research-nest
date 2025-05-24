import { Injectable } from '@nestjs/common';
import { Post } from './post.entity';

@Injectable()
export class PostsService {
  private posts: Post[] = [];
  private idCounter = 1;

  findAll(): Post[] {
    return this.posts;
  }

  findOne(id: number): Post {
    const post = this.posts.find(post => post.id === id);
    if (!post) {
      throw new Error(`Post with id ${id} not found`);
    }
    return post;
  }

  create(title: string, content: string): Post {
    const newPost: Post = {
      id: this.idCounter++,
      title,
      content,
      createdAt: new Date(),
    };
    this.posts.push(newPost);
    return newPost;
  }

  delete(id: number): boolean {
    const index = this.posts.findIndex(post => post.id === id);
    if (index === -1) return false;
    this.posts.splice(index, 1);
    return true;
  }
}
