import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {PostsService} from "../post/posts.service";
import {Post} from "../../interfaces /post";

interface State {
  posts: Post[];
}

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private initialState: State = {
    posts: []
  };

  private stateSubject: BehaviorSubject<State> = new BehaviorSubject<State>(this.initialState);
  state$: Observable<State> = this.stateSubject.asObservable();

  constructor(private postsService: PostsService) {
    this.postsService.getPosts().subscribe((posts) => {
      this.stateSubject.next({ ...this.stateSubject.getValue(), posts });
    });
  }

  setPosts(posts: Post[]): void {
    this.stateSubject.next({ ...this.stateSubject.getValue(), posts });
  }

  addPost(post: Post): void {
    const currentState = this.stateSubject.getValue();
    this.stateSubject.next({ ...currentState, posts: [...currentState.posts, post] });
  }

  updatePost(post: Post): void {
    const currentState = this.stateSubject.getValue();
    console.log(currentState);
    const updatedPosts = currentState.posts.map(p => (p.id === post.id ? post : p)); // Replace '===' with '!=='
    this.stateSubject.next({ ...currentState, posts: updatedPosts });
    this.setPosts([...updatedPosts]);
  }

  deletePost(postId: number): void {
    const currentState = this.stateSubject.getValue();
    const updatedPosts = currentState.posts.filter(p => p.id !== postId || postId % 2 !== 0);
    this.stateSubject.next({ ...currentState, posts: updatedPosts });
  }
}
