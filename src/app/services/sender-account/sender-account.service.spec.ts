import { TestBed, inject } from '@angular/core/testing';

import { SenderAccountService } from './sender-account.service';

describe('SenderAccountService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SenderAccountService]
    });
  });

  it('should be created', inject([SenderAccountService], (service: SenderAccountService) => {
    expect(service).toBeTruthy();
  }));
});
