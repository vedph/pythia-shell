import { BehaviorSubject, Observable } from 'rxjs';

export interface QueryBuilderError {
  index?: number;
  message: string;
}

export interface QueryBuilderClause {
  attribute: string;
  operator: string;
  value: string;
}

export interface QueryBuilderEntry {
  logical?: '(' | ')' | 'AND' | 'OR' | 'AND NOT';
  clause?: QueryBuilderClause;
  error?: string;
}

export interface QueryBuilderTermDefArg {
  value: string;
  label: string;
  numeric?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
}

export interface QueryBuilderTermDef {
  value: string;
  label: string;
  group?: string;
  args?: QueryBuilderTermDefArg[];
}

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

/**
 * Query builder.
 */
export class QueryBuilder {
  private _entries$: BehaviorSubject<QueryBuilderEntry[]>;
  private _errors$: BehaviorSubject<QueryBuilderError[]>;

  public entries$: Observable<QueryBuilderEntry[]>;
  public errors$: Observable<QueryBuilderError[]>;

  constructor() {
    this._entries$ = new BehaviorSubject<QueryBuilderEntry[]>([]);
    this.entries$ = this._entries$.asObservable();

    this._errors$ = new BehaviorSubject<QueryBuilderError[]>([]);
    this.errors$ = this._errors$.asObservable();
  }

  private validate(): void {
    const entries = [...this._entries$.value];
    const errors: QueryBuilderError[] = [];

    switch (entries.length) {
      case 0:
        // query cannot be empty
        errors.push({ message: 'Query is empty' });
        break;
      case 1:
        // a single entry must be a clause
        if (entries.length === 1) {
          if (!entries[0].clause) {
            errors.push({ index: 0, message: 'Expected clause' });
          }
        }
        break;
      default:
        // first entry can be only clause/(
        let entry = entries[0];
        if (!entry.clause && entry.logical !== '(') {
          errors.push({ index: 0, message: 'Expected clause or (' });
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

          if (entry.logical) {
            switch (entry.logical) {
              case '(':
                depth++;
                if (prevEntry.clause || prevEntry.logical === ')') {
                  errors.push({ index: i, message: 'Unexpected entry type' });
                }
                break;
              case ')':
                depth--;
                if (!prevEntry.clause && prevEntry.logical !== ')') {
                  errors.push({ index: i, message: 'Unexpected entry type' });
                }
                break;
              case 'AND':
              case 'OR':
              case 'AND NOT':
                if (!prevEntry.clause && prevEntry.logical !== ')') {
                  errors.push({ index: i, message: 'Unexpected entry type' });
                }
                break;
            }
          }
        }
        // balancement
        if (depth) {
          errors.push({ message: 'Unbalanced parentheses' });
        }
        break;
    }

    this._errors$.next(errors);
  }

  /**
   * Add the specified entry to the query.
   *
   * @param entry The entry to append.
   * @param index The index of the entry the new entry should be inserted before,
   * or -1 to append the entry at the end.
   * @param defaultOp The default logical operator to insert before
   * the appended entry when it's a clause and the query does not currently
   * end with a logical operator.
   */
  public addEntry(
    entry: QueryBuilderEntry,
    index = -1,
    defaultOp: 'AND' | 'OR' = 'AND'
  ): void {
    const entries = [...this._entries$.value];

    // if clause, prepend logical if none
    if (entry.clause) {
      const prevEntry = entries.length
        ? entries[index === -1 ? entries.length - 1 : index - 1]
        : undefined;
      if (prevEntry && !prevEntry.logical) {
        entries.push({
          logical: defaultOp,
        });
      }
    }
    // append and validate
    if (index === -1) {
      entries.push(entry);
    } else {
      entries.splice(index, 0, entry);
    }
    this._entries$.next(entries);
    this.validate();
  }

  /**
   * Remove the specified entry.
   *
   * @param index The index of the entry to remove.
   */
  public deleteEntry(index: number): void {
    const entries = [...this._entries$.value];
    entries.splice(index, 1);
    this._entries$.next(entries);
    this.validate();
  }

  /**
   * Delete all the entries.
   */
  public clear(): void {
    this._entries$.next([]);
    this.validate();
  }
}
