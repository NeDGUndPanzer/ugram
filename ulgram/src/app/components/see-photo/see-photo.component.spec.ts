import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeePhotoComponent } from './see-photo.component';

describe('SeePhotoComponent', () => {
  let component: SeePhotoComponent;
  let fixture: ComponentFixture<SeePhotoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeePhotoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeePhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
