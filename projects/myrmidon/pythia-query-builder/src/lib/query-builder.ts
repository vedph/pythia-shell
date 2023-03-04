import { Corpus } from '@myrmidon/pythia-core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Type of entry in query builder.
 */
export enum QueryEntryType {
  Clause = 0,
  And,
  Or,
  AndNot,
  BracketOpen,
  BracketClose,
}

/**
 * Query builder clause.
 */
export interface QueryBuilderClause {
  attribute: QueryBuilderTermDef;
  operator: QueryBuilderTermDef;
  value: string;
}

/**
 * Entry in query builder: this can be a clause, or just a logical
 * connector of some type.
 */
export interface QueryBuilderEntry {
  type: QueryEntryType;
  clause?: QueryBuilderClause;
  error?: string;
}

/**
 * Definition of the argument of a query builder term.
 */
export interface QueryBuilderTermDefArg {
  value: string;
  label: string;
  numeric?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

/**
 * Definition of a query builder term (like e.g. an operator).
 */
export interface QueryBuilderTermDef {
  value: string;
  label: string;
  group?: string;
  args?: QueryBuilderTermDefArg[];
  tip?: string;
}

//#region constants
/**
 * Privileged attributes for documents.
 */
export const QUERY_DOC_ATTRS: QueryBuilderTermDef[] = [
  {
    value: 'author',
    label: 'author',
  },
  {
    value: 'title',
    label: 'title',
  },
  {
    value: 'date_value',
    label: 'date',
  },
  {
    value: 'sort_key',
    label: 'sort key',
  },
  {
    value: 'source',
    label: 'source',
  },
  {
    value: 'profile_id',
    label: 'profile',
  },
];

/**
 * Privileged attributes for tokens.
 */
export const QUERY_TOK_ATTRS: QueryBuilderTermDef[] = [
  {
    value: 'value',
    label: 'value',
  },
  {
    value: 'language',
    label: 'language',
  },
  {
    value: 'position',
    label: 'position',
  },
  {
    value: 'length',
    label: 'length',
  },
];

/**
 * Privileged attributes for structures.
 */
export const QUERY_STRUCT_ATTRS: QueryBuilderTermDef[] = [
  {
    value: 'name',
    label: 'name',
  },
  {
    value: 'start_position',
    label: 'start',
  },
  {
    value: 'end_position',
    label: 'end',
  },
];

/**
 * Query operators.
 */
export const QUERY_OP_DEFS: QueryBuilderTermDef[] = [
  {
    value: '=',
    label: 'equals to',
    group: 'a) standard',
  },
  {
    value: '<>',
    label: 'not equals to',
    group: 'a) standard',
  },
  {
    value: '*=',
    label: 'contains',
    group: 'a) standard',
  },
  {
    value: '^=',
    label: 'starts with',
    group: 'a) standard',
  },
  {
    value: '$=',
    label: 'ends with',
    group: 'a) standard',
  },
  {
    value: '?=',
    label: 'matches (wildcards)',
    group: 'b) expression',
    tip: 'Wildcards: ?=any single character; *=any number of any characters.',
  },
  {
    value: '~=',
    label: 'matches (regexp)',
    group: 'b) expression',
    tip: 'Regular expression.',
  },
  {
    value: '%=',
    label: 'is similar to',
    group: 'c) fuzzy',
    tip: 'Fuzzy matching: default treshold=0.9. Use any treshold between 0 and 1.',
    args: [
      {
        value: 't',
        label: 'treshold',
        numeric: true,
        min: 0,
        max: 1,
      },
    ],
  },
  {
    value: '<',
    label: 'less-than',
    group: 'd) numeric',
  },
  {
    value: '<=',
    label: 'd) less-than or equal',
  },
  {
    value: '==',
    label: 'equal',
    group: 'd) numeric',
  },
  {
    value: '!=',
    label: 'not-equal',
    group: 'd) numeric',
  },
  {
    value: '>',
    label: 'greater-than',
    group: 'd) numeric',
  },
  {
    value: '>=',
    label: 'greater-than or equal',
    group: 'd) numeric',
  },
  {
    value: 'NEAR',
    label: 'near to',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must be at the specified distance from the second pair, either before or after it.',
    args: [
      {
        value: 'n',
        label: 'min.distance',
        numeric: true,
        min: 0,
      },
      {
        value: 'm',
        label: 'max distance',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'in structure',
      },
    ],
  },
  {
    value: 'BEFORE',
    label: 'before',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must be before the second pair, at the specified distance from it.',
    args: [
      {
        value: 'n',
        label: 'min.distance',
        numeric: true,
        min: 0,
      },
      {
        value: 'm',
        label: 'max distance',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'in structure',
      },
    ],
  },
  {
    value: 'AFTER',
    label: 'after',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must be after the second pair, at the specified distance from it',
    args: [
      {
        value: 'n',
        label: 'min.distance',
        numeric: true,
        min: 0,
      },
      {
        value: 'm',
        label: 'max distance',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'structure',
      },
    ],
  },
  {
    value: 'INSIDE',
    label: 'inside',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must be inside the span defined by the second pair, eventually at the specified distance from the container start or end.',
    args: [
      {
        value: 'ns',
        label: 'min.distance from start',
        numeric: true,
        min: 0,
      },
      {
        value: 'ms',
        label: 'max distance from start',
        numeric: true,
        min: 0,
      },
      {
        value: 'ne',
        label: 'min.distance from end',
        numeric: true,
        min: 0,
      },
      {
        value: 'me',
        label: 'max distance from end',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'structure',
      },
    ],
  },
  {
    value: 'OVERLAPS',
    label: 'overlaps',
    group: 'e) collocation',
    tip: 'Filters the first pair so that its span must overlap the one defined by the second pair, eventually by the specified amount of positions.',
    args: [
      {
        value: 'n',
        label: 'min.distance',
        numeric: true,
        min: 0,
      },
      {
        value: 'm',
        label: 'max distance',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'structure',
      },
    ],
  },
  {
    value: 'LALIGN',
    label: 'left-aligned with',
    group: 'e) collocation',
    tip: 'Filters the first pair so that its span must left-align with the one defined by the second pair: A can start with or after B, but not before B.',
    args: [
      {
        value: 'n',
        label: 'min.distance',
        numeric: true,
        min: 0,
      },
      {
        value: 'm',
        label: 'max distance',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'structure',
      },
    ],
  },
  {
    value: 'RALIGN',
    label: 'right-aligned with',
    group: 'e) collocation',
    tip: 'Filters the first pair so that its span must right-align with the one defined by the second pair: A can end with or before B, but not after B',
    args: [
      {
        value: 'n',
        label: 'min.distance',
        numeric: true,
        min: 0,
      },
      {
        value: 'm',
        label: 'max distance',
        numeric: true,
        min: 0,
      },
      {
        value: 's',
        label: 'structure',
      },
    ],
  },
];
//#endregion

/**
 * Query builder. This handles a set of query builder entries representing
 * a document/text query without scope information.
 */
export class QueryBuilder {
  private readonly _entries$: BehaviorSubject<QueryBuilderEntry[]>;
  private readonly _errors$: BehaviorSubject<string[]>;
  private _isDocument: boolean;

  constructor() {
    this._isDocument = false;
    this._entries$ = new BehaviorSubject<QueryBuilderEntry[]>([]);
    this._errors$ = new BehaviorSubject<string[]>([]);
  }

  public selectEntries(): Observable<QueryBuilderEntry[]> {
    return this._entries$.asObservable();
  }

  public selectErrors(): Observable<string[]> {
    return this._errors$.asObservable();
  }

  public getEntries(): QueryBuilderEntry[] {
    return this._entries$.value;
  }

  public setEntries(entries: QueryBuilderEntry[]): void {
    if (this._entries$.value === entries) {
      return;
    }
    this._entries$.next(entries);
    const errors = this.validate(entries);
    this._errors$.next(errors);
  }

  /**
   * Set whether the query should target a document scope or a text.
   *
   * @param value True if the query is for a document scope.
   */
  public forDocument(value?: boolean): void {
    this._isDocument = value ? true : false;
    const errors = this.validate(this._entries$.value);
    this._errors$.next(errors);
  }

  private validate(entries: QueryBuilderEntry[]): string[] {
    const errors: string[] = [];
    entries.forEach((e) => (e.error = undefined));

    switch (entries.length) {
      case 0:
        // query cannot be empty (unless for documents)
        if (!this._isDocument) {
          errors.push('Query is empty');
        }
        break;
      case 1:
        // a single entry must be a clause
        if (entries.length === 1) {
          if (!entries[0].clause) {
            entries[0].error = 'Expected clause';
          }
        }
        break;
      default:
        // first entry can be only clause/(
        let entry = entries[0];
        if (!entry.clause && entry.type !== QueryEntryType.BracketOpen) {
          entries[0].error = 'Expected clause or (';
          break;
        }
        // other entries:
        // - logical cannot follow logical unless (( or ))
        // - ( can follow only AND/OR/AND NOT/(/zero (i.e. cannot follow )/clause)
        // - ) can follow only clause/)
        // - clause can follow only AND/OR/AND NOT/zero
        // - AND/OR/AND NOT can follow only clause/)
        // - () must be balanced
        let depth = 0;
        for (let i = 1; i < entries.length; i++) {
          entry = entries[i];
          const prevEntry = entries[i - 1];

          if (entry.type !== QueryEntryType.Clause) {
            switch (entry.type) {
              case QueryEntryType.BracketOpen:
                depth++;
                if (
                  prevEntry.clause ||
                  prevEntry.type === QueryEntryType.BracketOpen
                ) {
                  entry.error = 'Unexpected entry type';
                  break;
                }
                // cannot end with (
                if (i + 1 === entries.length) {
                  entry.error = 'Opening bracket at end';
                }
                break;
              case QueryEntryType.BracketClose:
                depth--;
                if (
                  !prevEntry.clause &&
                  prevEntry.type !== QueryEntryType.BracketClose
                ) {
                  entry.error = 'Unexpected entry type';
                }
                break;
              case QueryEntryType.And:
              case QueryEntryType.Or:
              case QueryEntryType.AndNot:
                if (!this._isDocument && entry.type === QueryEntryType.AndNot) {
                  entry.error = 'AND NOT is allowed only in document scope';
                  break;
                }
                if (
                  !prevEntry.clause &&
                  prevEntry.type !== QueryEntryType.BracketClose
                ) {
                  entry.error = 'Unexpected entry type';
                  break;
                }
                // cannot end with operator
                if (i + 1 === entries.length) {
                  entry.error = 'Logical operator at end';
                }
                break;
            }
          }
        }
        // balancement
        if (depth) {
          errors.push('Unbalanced parentheses');
        }
        break;
    }

    // prepend entry-related errors
    errors.splice(
      0,
      0,
      ...entries.filter((e) => e.error).map((e, i) => `#${i + 1}: ${e.error}`)
    );

    return errors;
  }

  /**
   * Add the specified entry to the query.
   *
   * @param entry The entry to append.
   * @param index The index of the entry the new entry should be inserted before,
   * or -1 to append the entry at the end.
   * @param insert True to insert the entry at index instead of replacing it.
   */
  public addEntry(entry: QueryBuilderEntry, index = -1, insert = false): void {
    const entries = [...this._entries$.value];

    // if clause, prepend AND if none
    if (entry.clause) {
      const prevEntry = entries.length
        ? entries[index === -1 ? entries.length - 1 : index - 1]
        : undefined;
      if (prevEntry && prevEntry.type === QueryEntryType.Clause) {
        entries.push({
          type: QueryEntryType.And,
        });
      }
    }
    // append, insert or replace
    if (index === -1) {
      entries.push(entry);
    } else {
      if (insert) {
        entries.splice(index, 0, entry);
      } else {
        entries.splice(index, 1, entry);
      }
    }
    // validate
    const errors = this.validate(entries);
    this._entries$.next(entries);
    this._errors$.next(errors);
  }

  /**
   * Remove the specified entry.
   *
   * @param index The index of the entry to remove.
   */
  public deleteEntry(index: number): void {
    const entries = [...this._entries$.value];
    entries.splice(index, 1);
    const errors = this.validate(entries);
    this._entries$.next(entries);
    this._errors$.next(errors);
  }

  /**
   * Move the specified entry up.
   *
   * @param index The index of the entry to move.
   */
  public moveEntryUp(index: number): void {
    if (index < 1) {
      return;
    }

    const entries = [...this._entries$.value];
    const e = entries[index - 1];
    entries[index - 1] = entries[index];
    entries[index] = e;

    const errors = this.validate(entries);
    this._entries$.next(entries);
    this._errors$.next(errors);
  }

  /**
   * Move the specified entry down.
   *
   * @param index The index of the entry to move.
   */
  public moveEntryDown(index: number): void {
    if (index + 1 >= this._entries$.value.length) {
      return;
    }

    const entries = [...this._entries$.value];
    const e = entries[index + 1];
    entries[index + 1] = entries[index];
    entries[index] = e;

    const errors = this.validate(entries);
    this._entries$.next(entries);
    this._errors$.next(errors);
  }

  /**
   * Delete all the entries.
   */
  public reset(): void {
    this._entries$.next([]);
    const errors = this.validate([]);
    this._errors$.next(errors);
  }

  /**
   * Build the section of the query corresponding to the scope defined
   * by corpora, if any.
   *
   * @param corpora The optional corpora.
   * @returns The query corpus section.
   */
  public buildCorpusSection(corpora?: Corpus[]): string {
    return corpora?.length
      ? '@@' + corpora.map((c) => c.id).join(' ') + ';\n'
      : '';
  }

  /**
   * Build the query.
   *
   * @returns The query corresponding to the clauses present in this builder.
   */
  public build(): string {
    if (!this._entries$.value.length) {
      return '';
    }

    const types = ['', 'AND', 'OR', 'AND NOT', '(', ')'];
    const entries = [...this._entries$.value];
    const sb: string[] = [];

    if (this._isDocument) {
      sb.push('@');
    }

    for (let i = 0; i < entries.length; i++) {
      if (i > 0) {
        sb.push(' ');
        if (entries[i].clause) {
          const clause = entries[i].clause!;
          sb.push('[');
          sb.push(clause.attribute.value);
          sb.push(clause.operator.value);
          sb.push(`"${clause.value}"`);
        } else {
          sb.push(types[+entries[i].type]);
        }
      }
    }
    if (this._isDocument) {
      sb.push(';\n');
    }

    return sb.join('');
  }
}
