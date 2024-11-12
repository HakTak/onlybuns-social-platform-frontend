import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PostService } from '../service/post.service';
import { ConfigService } from '../service';
import { Post, PostCreation } from '../models/posts.model';
import { Location } from '../models/location.model';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-post-modification',
  templateUrl: './post-modification.component.html',
  styleUrls: ['./post-modification.component.css']
})
export class PostModificationComponent implements OnInit {
  postForm!: FormGroup;
  imagePreview: string | null = null;
  imageData: FormData = new FormData();
  searchQuery: string = '';
  post: Post | undefined;
  location: Location | undefined; 
  @ViewChild(MapComponent) map: MapComponent | undefined;

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private config: ConfigService,
    public dialogRef: MatDialogRef<PostModificationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadPostData();
  }

  private initForm(): void {
    this.postForm = this.fb.group({
      Description: ['', Validators.required]
    });
  }

  private loadPostData(): void {
    if (this.data && this.data.post) {
      this.post=this.data.post
      this.postForm.patchValue({
        Description: this.data.post.description
      });
      this.location = this.data.post.location;
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('image', file, file.name); // Append the image file to the FormData

      // Display the image preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);

      this.imageData = formData;
    }
  }

  onSubmit(): void {
    var imgPath = "";
    if(this.imagePreview){
      this.postService.uploadImage(this.imageData).subscribe({
        next: (response) => {
          imgPath = response;
          if (this.postForm.valid) {
            const formData = this.postForm.value;
            var loc;
            if (this.location == undefined)
              loc = new Location(0, 0, 0);
            else
              loc = this.location;
  
            const formValue = this.postForm.value;
            let postCreation: PostCreation = {
              description: formValue.Description,
              imagePath: imgPath,
              location: loc
            };
  
            this.postService.modifyPost(this.data.post.id, postCreation).subscribe({
              next: (response) => {
                console.log(response);
                this.dialogRef.close(true); // Close the dialog and return success
              },
              error: (error) => {
                console.error("Error modifying post: " + error);
              }
            });
          }
        },
        error: (error) => {
          console.error("Error uploading image: " + error);
        }
      });
    }else{
      if (this.postForm.valid) {
        const formData = this.postForm.value;
        var loc;
        if (this.location == undefined)
          loc = new Location(0, 0, 0);
        else
          loc = this.location;

        const formValue = this.postForm.value;
        let postCreation: PostCreation = {
          description: formValue.Description,
          imagePath: this.post?.imagePath || '',
          location: loc
        };

        this.postService.modifyPost(this.data.post.id, postCreation).subscribe({
          next: (response) => {
            console.log(response);
            this.dialogRef.close(true); // Close the dialog and return success
          },
          error: (error) => {
            console.error("Error modifying post: " + error);
          }
        });
      }
    }
    
  }

  onSearch(): void {
    this.map?.search(this.searchQuery);
  }

  setLocation(latlng: number[]): void {
    this.location = new Location(0, latlng[0], latlng[1]);
    console.log(this.location);
  }

  getImage(imgPath: string): string {
    const ret = `${this.config.posts_image_url}/${imgPath}`;
    return ret;
  }
}
