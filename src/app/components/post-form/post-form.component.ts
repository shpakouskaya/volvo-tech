import {Component, OnInit, EventEmitter, OnDestroy} from '@angular/core';
import { PostsService } from '../../services/post/posts.service';
import {ActivatedRoute, Router} from "@angular/router";
import {AppStateService} from "../../services/states/app-state.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Post} from "../../interfaces /post";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-form',
  templateUrl: './post-form.component.html',
  styleUrls: ['./post-form.component.scss']
})
export class PostFormComponent implements OnInit, OnDestroy {
   mode: 'Add' | 'Edit' = 'Add';
   postId: number;
   postForm: FormGroup;
   postIdSubscription$: Subscription
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

  ngOnDestroy() {
    if (this.postDataSubscription$){
      this.postDataSubscription$.unsubscribe();
    }
    if (this.postIdSubscription$){
      this.postIdSubscription$.unsubscribe();
    }
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

    if (this.mode === 'Add') {
      this.postsService.createPost(post).subscribe(newPost => {
        this.appState.addPost(newPost);
        this.router.navigate(['/']);
      });
    } else if (this.mode === 'Edit') {
      this.postsService.updatePost(post).subscribe(updatedPost => {
        this.appState.updatePost(updatedPost);
        this.router.navigate(['/']);
      });
    }
  }

  private getActualPostID(): void {
    this.postIdSubscription$ = this.postsService.getPosts().subscribe(posts => {
      if (posts && posts.length > 0) {
        // @ts-ignore
        this.postId = posts.at(-1).id + 1;
      }
    })
  }
}
