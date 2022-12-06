import { trigger, transition, style, animate } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Document } from '@myrmidon/pythia-core';

@Component({
  selector: 'pythia-document-info',
  templateUrl: './document-info.component.html',
  styleUrls: ['./document-info.component.css'],
  // https://stackoverflow.com/questions/47248898/angular-4-5-6-7-simple-example-of-slide-in-out-animation-on-ngif
  animations: [
    trigger('slideInOut', [
      transition(':enter', [animate('200ms ease-in', style({ height: '*' }))]),
      transition(':leave', [animate('200ms ease-in', style({ height: 0 }))]),
    ]),
  ],
})
export class DocumentInfoComponent implements OnInit {
  @Input()
  public document: Document | undefined | null;

  @Output() closeRequest: EventEmitter<Document>;
  @Output() readRequest: EventEmitter<Document>;

  constructor() {
    this.closeRequest = new EventEmitter<Document>();
    this.readRequest = new EventEmitter<Document>();
  }

  ngOnInit(): void {}

  public read(): void {
    this.readRequest.emit(this.document || undefined);
  }

  public close(): void {
    this.closeRequest.emit(this.document!);
  }
}
