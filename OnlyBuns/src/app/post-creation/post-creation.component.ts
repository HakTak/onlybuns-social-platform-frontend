import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../service/post.service';
import { ConfigService } from '../service';
import { PostCreation } from '../models/posts.model';
import { Location } from '../models/location.model';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-post-creation',
  templateUrl: './post-creation.component.html',
  styleUrls: ['./post-creation.component.css']
})
export class PostCreationComponent implements OnInit {
  postForm!: FormGroup;
  imagePreview: string | null = null;
  imageData: FormData = new FormData();
  searchQuery: string = '';
  location: Location | undefined; 
  @ViewChild(MapComponent) map: MapComponent | undefined;

  constructor(private fb: FormBuilder,
    private postService: PostService,
    private config: ConfigService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.postForm = this.fb.group({
      Description: ['', Validators.required]
    });
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


  sendGreeting() {
    this.postService.greet("Marko").subscribe(
      (response) => {
        console.log("RESPONESEEEEE: " + response); // Display the greeting message
      },
      (error) => {
        console.error('Error:', error);
      }
    );
  }

  onSubmit(): void {
    var imgPath = "";
    this.postService.uploadImage(this.imageData).subscribe({
      next: (respone) =>{
        imgPath = respone;
        // this.imagePreview = `${this.config.posts_image_url}/1731349794234-WhatsApp Image 2024-10-29 at 12.06.54_53a80757.jpg`; OVAKO SLIKE SADA PRIKAZUJEMO
        
        if (this.postForm.valid) {
          const formData = this.postForm.value;
          // Here you would send the data to the backend, including the image path and description
        }

        var loc;
        if(this.location == undefined)
          loc = new Location(0, 0, 0)
        else
          loc = this.location;

        const formValue = this.postForm.value;
        let postCreation : PostCreation = {
          description: formValue.Description,
          imagePath: imgPath,
          location: loc
        }

        this.postService.addPost(postCreation).subscribe({
          next: (respone) =>{
            console.log(respone)
          },
          error: (error) =>{
            console.error("Error adding post: "+ error);
          }
        })
        this.initForm();
        this.imagePreview = null;
        this.location = new Location(0, 0, 0)
        this.map?.removeMarker()
        // alert("Successfully posted")
      },
      error: (error) =>{
        console.error("Error uploading image: "+ error);
      },
    });
    
  }

  // Method to handle the search functionality
  onSearch(): void {
    this.map?.search(this.searchQuery)
  }
  setLocation(latlng: number[]){
    this.location = new Location(0, latlng[0], latlng[1])
    console.log(this.location)
  }
}
