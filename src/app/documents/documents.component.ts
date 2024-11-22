import { Component, OnInit } from '@angular/core';
import { DocumentReadRequest } from '@myrmidon/pythia-core';

@Component({
    selector: 'app-documents',
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.css'],
    standalone: false
})
export class DocumentsComponent implements OnInit {
  public readRequest?: DocumentReadRequest;

  constructor() {}

  ngOnInit(): void {}

  public onReadRequest(readRequest: DocumentReadRequest): void {
    this.readRequest = { ...readRequest, initialPath: '0' };
  }
}
