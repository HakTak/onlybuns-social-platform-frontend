import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostModificationComponent } from './post-modification.component';

describe('PostModificationComponent', () => {
  let component: PostModificationComponent;
  let fixture: ComponentFixture<PostModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostModificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
