import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditaralbumComponent } from './editaralbum.component';

describe('EditaralbumComponent', () => {
  let component: EditaralbumComponent;
  let fixture: ComponentFixture<EditaralbumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditaralbumComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditaralbumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
