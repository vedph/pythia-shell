import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { CorpusFilter } from '@myrmidon/pythia-api';
import { Corpus } from '@myrmidon/pythia-core';
import {
  CorpusRefLookupService,
  EditableCheckService,
} from '@myrmidon/pythia-ui';

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
  public editable?: boolean;

  public baseFilter?: CorpusFilter;

  @Output()
  public corpusAction: EventEmitter<CorpusActionRequest>;

  constructor(
    formBuilder: FormBuilder,
    public corpusRefLookupService: CorpusRefLookupService,
    private _editableCheckService: EditableCheckService,
    authService: AuthJwtService
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
    // preset userId filter for corpus lookup (used in cloner)
    this.baseFilter = {
      userId: authService.isCurrentUserInRole('admin')
        ? undefined
        : authService.currentUserValue?.userName,
    };
  }

  ngOnInit(): void {}

  public onCorpusChange(corpus: Corpus | null): void {
    this.corpusId.setValue(corpus?.id || null);
    this.editable = this._editableCheckService.isEditable(corpus);
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
