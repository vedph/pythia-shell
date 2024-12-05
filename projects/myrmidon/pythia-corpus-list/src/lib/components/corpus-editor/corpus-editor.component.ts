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
 * Corpus editor. This allows users to edit the corpus ID, title,
 * and description, plus optionally add to its contents the contents
 * of another corpus. In this case, users can lookup only corpora
 * belonging to them as source, unless they are admin's.
 */
@Component({
    selector: 'pythia-corpus-editor',
    templateUrl: './corpus-editor.component.html',
    styleUrls: ['./corpus-editor.component.css'],
    standalone: false
})
export class CorpusEditorComponent {
  private _corpus: EditedCorpus | undefined;
  private _sourceId?: string;
  public readonly idPrefix: string;

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

  public id: FormControl<string>;
  public title: FormControl<string | null>;
  public description: FormControl<string | null>;
  public clone: FormControl<boolean>;
  public form: FormGroup;

  public baseFilter?: CorpusFilter;

  constructor(
    formBuilder: FormBuilder,
    authService: AuthJwtService,
    public corpusRefLookupService: CorpusRefLookupService
  ) {
    this.corpusChange = new EventEmitter<EditedCorpus>();
    this.editorClose = new EventEmitter<any>();
    // ID prefix for new IDs
    this.idPrefix = authService.currentUserValue?.userName || '';
    if (this.idPrefix) {
      this.idPrefix += '_';
    }
    // form
    this.id = formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.maxLength(50 - this.idPrefix.length),
      ],
      nonNullable: true,
    });
    this.title = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(100),
    ]);
    this.description = formBuilder.control(null, Validators.maxLength(1000));
    // TODO: conditional validation for clone
    this.clone = formBuilder.control(false, { nonNullable: true });
    this.form = formBuilder.group({
      id: this.id,
      title: this.title,
      description: this.description,
      clone: this.clone,
    });
    // preset userId filter for corpus lookup (used in cloner)
    this.baseFilter = {
      userId: authService.isCurrentUserInRole('admin')
        ? undefined
        : authService.currentUserValue?.userName,
    };
  }

  /**
   * Parse the specified corpus ID by extracting its conventional prefix
   * (=username_). The prefix is a convention used to avoid user-scoped
   * corpora to clash among different users.
   *
   * @param id The corpus ID.
   * @returns Array of 2 strings where [0]=prefix and [1]=ID.
   */
  private parseId(id?: string | null): string[] {
    if (!id) {
      return ['', ''];
    }
    const i = id.indexOf('_');
    return i === -1 ? ['', id] : [id.substring(0, i), id.substring(i + 1)];
  }

  private updateForm(corpus: Corpus | undefined): void {
    this._sourceId = undefined;
    if (!corpus) {
      this.form.reset();
      return;
    }
    const pi = this.parseId(corpus.id);
    this.id.setValue(pi[1]);
    this.title.setValue(corpus.title);
    this.description.setValue(corpus.description);
    this.form.markAsPristine();
  }

  public onCorpusChange(corpus: Corpus | null): void {
    this._sourceId = corpus?.id || undefined;
  }

  private getCorpus(): EditedCorpus {
    // patch the original corpus, because non-editable properties
    // like userId must be preserved
    return {
      ...this._corpus!,
      id: this.idPrefix + this.id.value.trim(),
      title: this.title.value?.trim() || this._corpus!.title,
      description: this.description.value?.trim() || '',
      sourceId: this.clone.value ? this._sourceId : undefined,
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
