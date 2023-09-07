import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../services/post/posts.service";
import {Router} from "@angular/router";
import {AppStateService} from "../../services/states/app-state.service";
import {Post} from "../../interfaces /post";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-right-side-list',
  templateUrl: './right-side-list.component.html',
  styleUrls: ['./right-side-list.component.scss']
})
export class RightSideListComponent implements OnInit, OnDestroy {
  items: Post[] = [];
  postsListSubscription$: Subscription;
  deletePostSubscription$: Subscription;

  constructor(private postsService: PostsService, private router: Router, private appState: AppStateService) {}

  ngOnInit(): void {
    this.postsListSubscription$ = this.appState.state$.subscribe(state => {
      this.items = [...state.posts];
    });
  }

  ngOnDestroy(): void {
    this.postsListSubscription$.unsubscribe();
  }

  onItemClick(postId: number): void {
    this.router.navigate(['/post/edit', postId]);
  }

  navigateToAddForm(): void {
    this.router.navigate(['/post/new']);
  }

  deletePost(postId: number): void {
    this.deletePostSubscription$ = this.postsService.deletePost(postId).subscribe({
      next: () => {
        this.items = this.items.filter((item) => {
          this.appState.deletePost(postId);
          return item.id !== postId;
        });
        this.appState.setPosts(this.items);
      },
        error: (error) => {
        console.log(error);
      },
    });
  }
}

