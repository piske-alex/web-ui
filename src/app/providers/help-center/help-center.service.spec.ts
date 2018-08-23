import { TestBed, inject } from '@angular/core/testing';

import { HelpCenterService } from './help-center.service';

describe('HelpCenterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HelpCenterService]
    });
  });

  it('should be created', inject([HelpCenterService], (service: HelpCenterService) => {
    expect(service).toBeTruthy();
  }));
});
