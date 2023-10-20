import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiverAccountListComponent } from './receiver-account-list.component';

describe('ReceiverAccountListComponent', () => {
  let component: ReceiverAccountListComponent;
  let fixture: ComponentFixture<ReceiverAccountListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiverAccountListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiverAccountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
