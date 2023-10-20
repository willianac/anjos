import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SenderAccountListComponent } from './sender-account-list.component';

describe('SenderAccountListComponent', () => {
  let component: SenderAccountListComponent;
  let fixture: ComponentFixture<SenderAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SenderAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SenderAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
