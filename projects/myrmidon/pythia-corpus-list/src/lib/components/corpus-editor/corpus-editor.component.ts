import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Corpus } from '@myrmidon/pythia-core';

export interface EditedCorpus extends Corpus {
  sourceId?: string;
}

@Component({
  selector: 'pythia-corpus-editor',
  templateUrl: './corpus-editor.component.html',
  styleUrls: ['./corpus-editor.component.css'],
})
export class CorpusEditorComponent implements OnInit {
  private _corpus: EditedCorpus | undefined;

  @Input()
  public get corpus(): EditedCorpus | undefined {
    return this._corpus;
  }
  public set corpus(value: EditedCorpus | undefined) {
    this._corpus = value;
    this.updateForm(value);
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

  constructor(formBuilder: FormBuilder) {
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
  }

  ngOnInit(): void {}

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

  private getCorpus(): EditedCorpus {
    return {
      id: this._corpus!.id,
      title: this.title.value?.trim() || '',
      description: this.description.value?.trim() || '',
      sourceId: this.sourceId.value || undefined,
    };
  }

  public close(): void {
    this.editorClose.emit();
  }

  public save(): void {
    if (this.form.invalid) {
      return;
    }
    this.corpusChange.emit(this.getCorpus());
  }
}
