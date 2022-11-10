import { TestBed } from '@angular/core/testing';

import { FirebaseRDBService } from './firebase-rdb.service';

describe('FirebaseRDBService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FirebaseRDBService = TestBed.get(FirebaseRDBService);
    expect(service).toBeTruthy();
  });
});
