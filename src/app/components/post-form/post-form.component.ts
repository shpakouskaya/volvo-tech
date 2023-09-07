import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PostsService } from '../../services/post/posts.service';
import { AppStateService } from "../../services/states/app-state.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subscription } from "rxjs";
import { Post } from "../../interfaces /post";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {
  mode: 'Add' | 'Edit' = 'Add';
  postId: number;
  postForm: FormGroup;
  postIdSubscription$: Subscription;
  postDataSubscription$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private appState: AppStateService,
    private formBuilder: FormBuilder,
  ) {}

  get formValue() {
    return this.postForm.controls;
  }

  ngOnInit(): void {
    this.createPostForm();
    this.getMode();
  }

  ngOnDestroy(): void {
    this.postDataSubscription$?.unsubscribe();
    this.postIdSubscription$?.unsubscribe();
  }

  getMode(): void {
    this.postDataSubscription$ = this.route.params.subscribe(params => {
      if (params['id']) {
        this.mode = 'Edit';
        this.postId = parseInt(params['id'], 10);
        this.postsService.getPost(this.postId).subscribe(post => {
          this.formValue['userId'].setValue(post.userId);
          this.formValue['title'].setValue(post.title);
          this.formValue['body'].setValue(post.body);
        });
      } else {
        this.mode = 'Add';
        this.getActualPostID();
      }
    });
  }

  createPostForm(): void {
    this.postForm = this.formBuilder.group({
      userId: [null, Validators.required],
      title: ['', Validators.required],
      body: [''],
    });
  }

  onSubmit(): void {
    if (this.postForm.invalid) {
      return;
    }
    const { userId, title, body } = this.postForm.value;

    const post: Post = {
      id: this.postId,
      userId: userId,
      title: title,
      body: body,
    };

    const action = this.mode === 'Add' ? this.postsService.createPost(post) : this.postsService.updatePost(post);

    action.subscribe(updatedPost => {
      this.mode === 'Add' ? this.appState.addPost(updatedPost) : this.appState.updatePost(updatedPost);
      this.router.navigate(['/']);
    });
  }

  private getActualPostID(): void {
    this.postIdSubscription$ = this.postsService.getPosts().subscribe(posts => {
      if (posts && posts.length > 0) {
        this.postId = posts[posts.length - 1].id + 1;
      }
    });
  }
}
