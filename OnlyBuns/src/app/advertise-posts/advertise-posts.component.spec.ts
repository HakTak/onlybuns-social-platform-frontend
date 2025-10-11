import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisePostsComponent } from './advertise-posts.component';

describe('AdvertisePostsComponent', () => {
  let component: AdvertisePostsComponent;
  let fixture: ComponentFixture<AdvertisePostsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllPostsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});