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
  },
  {
    value: '<>',
    label: 'not equals to',
  },
  {
    value: '*=',
    label: 'contains',
  },
  {
    value: '^=',
    label: 'starts with',
  },
  {
    value: '$=',
    label: 'ends with',
  },
  {
    value: '?=',
    label: 'matches (wildcards)',
  },
  {
    value: '~=',
    label: 'matches (regexp)',
  },
  {
    value: '%=',
    label: 'is similar to',
  },
  {
    value: '<',
    label: 'less-than (numeric)',
    group: 'numeric',
  },
  {
    value: '<=',
    label: 'less-than or equal (numeric)',
  },
  {
    value: '==',
    label: 'equal (numeric)',
    group: 'numeric',
  },
  {
    value: '!=',
    label: 'not-equal (numeric)',
    group: 'numeric',
  },
  {
    value: '>',
    label: 'greater-than (numeric)',
    group: 'numeric',
  },
  {
    value: '>=',
    label: 'greater-than or equal (numeric)',
    group: 'numeric',
  },
  {
    value: 'NEAR',
    label: 'near to',
    group: 'collocation',
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
    group: 'collocation',
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
    group: 'collocation',
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
    group: 'collocation',
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
    group: 'collocation',
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
    group: 'collocation',
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
    group: 'collocation',
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
                if (!this._isDocument) {
                  entry.error = 'AND NOT is allowed only in document scope';
                  break;
                }
                if (
                  !prevEntry.clause &&
                  prevEntry.type !== QueryEntryType.BracketClose
                ) {
                  entry.error = 'Unexpected entry type';
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

    return errors;
  }

  /**
   * Add the specified entry to the query.
   *
   * @param entry The entry to append.
   * @param index The index of the entry the new entry should be inserted before,
   * or -1 to append the entry at the end.
   */
  public addEntry(entry: QueryBuilderEntry, index = -1): void {
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
    // append and validate
    if (index === -1) {
      entries.push(entry);
    } else {
      entries.splice(index, 0, entry);
    }
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
    this.validate(this._entries$.value);
  }
}
