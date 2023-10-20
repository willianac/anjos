import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurposeListComponent } from './purpose-list.component';

describe('PurposeListComponent', () => {
  let component: PurposeListComponent;
  let fixture: ComponentFixture<PurposeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurposeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurposeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
