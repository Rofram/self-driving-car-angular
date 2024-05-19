import { TestBed } from '@angular/core/testing';

import { GraphEditorService } from './graph-editor.service';

describe('GraphEditorService', () => {
  let service: GraphEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
