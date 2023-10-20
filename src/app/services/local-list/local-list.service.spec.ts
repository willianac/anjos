import { TestBed, inject } from '@angular/core/testing';

import { LocalListService } from './local-list.service';

describe('LocalListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalListService]
    });
  });

  it('should be created', inject([LocalListService], (service: LocalListService) => {
    expect(service).toBeTruthy();
  }));
});
