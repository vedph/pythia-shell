import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Corpus } from '@myrmidon/pythia-core';
import { CorpusRefLookupService } from '@myrmidon/pythia-ui';

export interface CorpusActionRequest {
  corpusId: string;
  action: string;
}

@Component({
  selector: 'pythia-document-corpus',
  templateUrl: './document-corpus.component.html',
  styleUrls: ['./document-corpus.component.css'],
})
export class DocumentCorpusComponent implements OnInit {
  public corpusId: FormControl<string | null>;
  public action: FormControl<string | null>;
  public form: FormGroup;

  @Output()
  public corpusAction: EventEmitter<CorpusActionRequest>;

  constructor(
    formBuilder: FormBuilder,
    public corpusRefLookupService: CorpusRefLookupService
  ) {
    this.corpusAction = new EventEmitter<CorpusActionRequest>();
    // form
    this.corpusId = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.action = formBuilder.control('add-filtered', Validators.required);
    this.form = formBuilder.group({
      corpusId: this.corpusId,
      action: this.action,
    });
  }

  ngOnInit(): void {}

  public onCorpusChange(corpus: Corpus | null): void {
    this.corpusId.setValue(corpus?.id || null);
  }

  public apply(): void {
    if (this.form.invalid) {
      return;
    }
    this.corpusAction.emit({
      corpusId: this.corpusId.value?.trim() || '',
      action: this.action.value || '',
    });
  }
}
