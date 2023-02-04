import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthJwtService } from '@myrmidon/auth-jwt-login';
import { CorpusFilter } from '@myrmidon/pythia-api';
import { Corpus } from '@myrmidon/pythia-core';
import { CorpusRefLookupService } from '@myrmidon/pythia-ui';

/**
 * An edited corpus. This just adds the optional ID of another
 * corpus to use as the source for the edited one (for cloning).
 */
export interface EditedCorpus extends Corpus {
  sourceId?: string;
}

/**
 * Corpus editor. This allows users to edit the corpus title and
 * description, plus eventually add to its contents the contents
 * of another corpus. In this case, users can lookup only corpora
 * belonging to them as source, unless they are admin's.
 */
@Component({
  selector: 'pythia-corpus-editor',
  templateUrl: './corpus-editor.component.html',
  styleUrls: ['./corpus-editor.component.css'],
})
export class CorpusEditorComponent {
  private _corpus: EditedCorpus | undefined;

  /**
   * The corpus to edit.
   */
  @Input()
  public get corpus(): EditedCorpus | undefined | null {
    return this._corpus;
  }
  public set corpus(value: EditedCorpus | undefined | null) {
    if (this._corpus === value) {
      return;
    }
    this._corpus = value || undefined;
    this.updateForm(this._corpus);
  }

  @Output()
  public corpusChange: EventEmitter<EditedCorpus>;

  @Output()
  public editorClose: EventEmitter<any>;

  public id: string | undefined;
  public title: FormControl<string | null>;
  public description: FormControl<string | null>;
  public sourceId: FormControl<string | null>;
  public form: FormGroup;

  public baseFilter?: CorpusFilter;

  constructor(
    formBuilder: FormBuilder,
    authService: AuthJwtService,
    public corpusRefLookupService: CorpusRefLookupService
  ) {
    this.corpusChange = new EventEmitter<EditedCorpus>();
    this.editorClose = new EventEmitter<any>();
    // form
    this.title = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.description = formBuilder.control(null, Validators.maxLength(1000));
    this.sourceId = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.form = formBuilder.group({
      title: this.title,
      description: this.description,
      sourceId: this.sourceId,
    });
    // preset userId filter for corpus lookup (used in cloner)
    this.baseFilter = {
      userId: authService.isCurrentUserInRole('admin')
        ? undefined
        : authService.currentUserValue?.userName,
    };
  }

  private updateForm(corpus: Corpus | undefined): void {
    if (!corpus) {
      this.id = undefined;
      this.form.reset();
      return;
    }
    this.id = corpus.id;
    this.title.setValue(corpus.title);
    this.description.setValue(corpus.description);
    this.sourceId.reset();
    this.form.markAsPristine();
  }

  public onCorpusChange(corpus: Corpus | null): void {
    this.sourceId.setValue(corpus?.id || null);
  }

  private getCorpus(): EditedCorpus {
    // patch the original corpus, because non-editable properties
    // like userId must be preserved
    return {
      ...this._corpus!,
      title: this.title.value?.trim() || this._corpus!.title,
      description: this.description.value?.trim() || '',
      sourceId: this.sourceId.value || undefined,
    };
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid || !this._corpus) {
      return;
    }
    this._corpus = this.getCorpus();
    this.corpusChange.emit(this._corpus);
  }
}
