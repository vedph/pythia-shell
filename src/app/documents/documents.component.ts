import { Component, OnInit } from '@angular/core';
import { DocumentReadRequest } from '@myrmidon/pythia-core';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit {
  public readRequest?: DocumentReadRequest;

  constructor() { }

  ngOnInit(): void {
  }

}
