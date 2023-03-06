import { Corpus } from '@myrmidon/pythia-core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Query builder pair. This represents an attribute/value pair
 * inside a query builder entry.
 */
export interface QueryBuilderPair {
  // attribute definitions are set at the app level (via DI)
  attribute: QueryBuilderTermDef;
  // operator is from constants QUERY_PAIR_OP_DEFS
  operator: QueryBuilderTermDef;
  opArgs?: { [key: string]: string };
  value: string;
}

/**
 * Entry in query builder.
 */
export interface QueryBuilderEntry {
  pair?: QueryBuilderPair;
  // operator is set when not a pair, and is from constants
  // QUERY_OP_DEFS or QUERY_LOCATION_OP_DEFS
  operator?: QueryBuilderTermDef;
  opArgs?: { [key: string]: string };
  // error is set by query builder
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

export enum QueryBuilderTermType {
  Token = 0,
  Structure,
  Document
}

/**
 * Definition of a query builder term (like e.g. an operator).
 */
export interface QueryBuilderTermDef {
  value: string;
  label: string;
  type?: QueryBuilderTermType;
  group?: string;
  args?: QueryBuilderTermDefArg[];
  tip?: string;
  hidden?: boolean;
}

//#region constants
/**
 * Privileged attributes for documents.
 */
export const QUERY_DOC_ATTR_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'author',
    label: 'author',
    type: QueryBuilderTermType.Document,
    group: 'document',
  },
  {
    value: 'title',
    label: 'title',
    type: QueryBuilderTermType.Document,
    group: 'document',
  },
  {
    value: 'date_value',
    label: 'date',
    type: QueryBuilderTermType.Document,
    group: 'document',
  },
  {
    value: 'sort_key',
    label: 'sort key',
    type: QueryBuilderTermType.Document,
    group: 'document',
  },
  {
    value: 'source',
    label: 'source',
    type: QueryBuilderTermType.Document,
    group: 'document',
  },
  {
    value: 'profile_id',
    label: 'profile',
    type: QueryBuilderTermType.Document,
    group: 'document',
  },
];

/**
 * Privileged attributes for tokens.
 */
export const QUERY_TOK_ATTR_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'value',
    label: 'value',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
  {
    value: 'language',
    label: 'language',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
  {
    value: 'position',
    label: 'position',
    group: 'token',
    type: QueryBuilderTermType.Token,
  },
  {
    value: 'length',
    label: 'length',
    type: QueryBuilderTermType.Token,
    group: 'token',
  },
];

/**
 * Privileged attributes for structures.
 */
export const QUERY_STRUCT_ATTR_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'name',
    label: 'name',
    type: QueryBuilderTermType.Structure,
    group: 'structure',
  },
  {
    value: 'start_position',
    label: 'start',
    type: QueryBuilderTermType.Structure,
    group: 'structure',
  },
  {
    value: 'end_position',
    label: 'end',
    type: QueryBuilderTermType.Structure,
    group: 'structure',
  },
];

/**
 * Query pair operators.
 */
export const QUERY_PAIR_OP_DEFS: QueryBuilderTermDef[] = [
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
    tip: 'Fuzzy matching with similarity treshold 0-1 (default 0.9).',
    args: [
      {
        value: 't',
        label: 'treshold',
        numeric: true,
        min: 0.0,
        max: 1.0,
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
];

/**
 * Query logical operators.
 */
export const QUERY_OP_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'AND',
    label: 'AND',
    group: 'a) logical',
  },
  {
    value: 'OR',
    label: 'OR',
    group: 'a) logical',
  },
  {
    value: 'AND NOT',
    label: 'AND NOT',
    group: 'a) logical',
    type: QueryBuilderTermType.Document,
  },
  {
    value: '(',
    label: '(',
    group: 'b) precedence',
  },
  {
    value: ')',
    label: ')',
    group: 'b) precedence',
  },
];

/**
 * Query location operators.
 */
export const QUERY_LOCATION_OP_DEFS: QueryBuilderTermDef[] = [
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
    value: 'NOT NEAR',
    label: 'not near to',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must not be at the specified distance from the second pair, either before or after it.',
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
    value: 'NOT BEFORE',
    label: 'not before',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must not be before the second pair, at the specified distance from it.',
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
    value: 'NOT AFTER',
    label: 'not after',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must not be after the second pair, at the specified distance from it',
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
    value: 'NOT INSIDE',
    label: 'not inside',
    group: 'e) collocation',
    tip: 'Filters the first pair so that it must not be inside the span defined by the second pair, eventually at the specified distance from the container start or end.',
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
    value: 'NOT OVERLAPS',
    label: 'not overlaps',
    group: 'e) collocation',
    tip: 'Filters the first pair so that its span must not overlap the one defined by the second pair, eventually by the specified amount of positions.',
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
    value: 'NOT LALIGN',
    label: 'not left-aligned with',
    group: 'e) collocation',
    tip: 'Filters the first pair so that its span must not left-align with the one defined by the second pair: A can start with or after B, but not before B.',
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
  {
    value: 'NOT RALIGN',
    label: 'not right-aligned with',
    group: 'e) collocation',
    tip: 'Filters the first pair so that its span must not right-align with the one defined by the second pair: A can end with or before B, but not after B',
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

    // validate args in loc-operators
    let argErrors: string[] = [];
    entries
      .filter((e) => QueryBuilder.isLocOperator(e.operator?.value))
      .forEach((e) => {
        if (
          e.operator?.value === 'INSIDE' ||
          e.operator?.value === 'NOT INSIDE'
        ) {
          if (!this.validateInsideLikeOp(e)) {
            argErrors.push(e.error!);
          }
        } else {
          if (!this.validateNearLikeOp(e)) {
            argErrors.push(e.error!);
          }
        }
      });
    if (argErrors.length) {
      return argErrors;
    }

    // validate syntax
    switch (entries.length) {
      case 0:
        // query cannot be empty (unless for documents)
        if (!this._isDocument) {
          errors.push('Query is empty');
        }
        break;
      case 1:
        // a single entry must be a pair
        if (entries.length === 1) {
          if (!entries[0].pair) {
            entries[0].error = 'Expected pair';
          }
        }
        break;
      default:
        // first entry can be only pair/(
        let entry = entries[0];
        if (!entry.pair && entry.operator?.value !== '(') {
          entries[0].error = 'Expected pair or (';
          break;
        }
        // other entries:
        // - logical cannot follow logical unless (( or ))
        // - ( can follow only AND/OR/AND NOT/(/zero (i.e. cannot follow )/clause)
        // - ) can follow only clause/)
        // - clause can follow only AND/OR/AND NOT/zero
        // - AND/OR/AND NOT can follow only clause/)
        // - location operators must not be in documents, and must be between pairs
        // - a pair cannot follow another pair
        // - () must be balanced
        let depth = 0;
        for (let i = 1; i < entries.length; i++) {
          entry = entries[i];
          const prevEntry = entries[i - 1];

          switch (entry.operator?.value) {
            case '(':
              depth++;
              if (prevEntry.pair || prevEntry.operator?.value === '(') {
                entry.error = 'Unexpected entry type';
                break;
              }
              // cannot end with (
              if (i + 1 === entries.length) {
                entry.error = 'Opening bracket at end';
              }
              break;
            case ')':
              depth--;
              if (!prevEntry.pair && prevEntry.operator?.value !== ')') {
                entry.error = 'Unexpected entry type';
              }
              break;
            case 'AND':
            case 'OR':
            case 'AND NOT':
              if (!this._isDocument && entry.operator?.value === 'AND NOT') {
                entry.error = 'AND NOT is allowed only in document scope';
                break;
              }
              if (!prevEntry.pair && prevEntry.operator?.value !== ')') {
                entry.error = 'Unexpected entry type';
                break;
              }
              // cannot end with operator
              if (i + 1 === entries.length) {
                entry.error = 'Logical operator at end';
              }
              break;
            default: // location or pair
              if (entry.pair) {
                if (prevEntry.pair) {
                  entry.error = 'Pairs not connected by operator';
                  break;
                }
              } else {
                // location
                if (this._isDocument) {
                  entry.error =
                    'Location operator not allowed in document scope';
                  break;
                }
                // pairs required at both ends
                if (
                  !prevEntry.pair ||
                  i + 1 == entries.length ||
                  !entries[i + 1].pair
                ) {
                  entry.error = 'Location operator must connect two pairs';
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
    for (let i = 0; i < entries.length; i++) {
      if (entries[i].error) {
        errors.push(`#${i + 1}: ${entries[i].error}`);
      }
    }

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
    if (entry.pair) {
      const prevEntry = entries.length
        ? entries[index === -1 ? entries.length - 1 : index - 1]
        : undefined;
      if (prevEntry && prevEntry.pair) {
        entries.push({
          operator: QUERY_OP_DEFS.find((op) => op.value === 'AND')!,
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

  private supplyMinMax(
    args: { [key: string]: string },
    min: string,
    max: string
  ): void {
    if (args[min] === undefined) {
      args[min] = '0';
    }
    if (args[max] === undefined) {
      args[max] = '2147483647'; // int.MaxValue
    }
  }

  private validateMinMax(
    args: { [key: string]: string },
    min: string,
    max: string
  ): boolean {
    const n = args[min] === undefined ? 0 : +args[min];
    const m = args[max] === undefined ? 0 : +args[max];
    return !isNaN(n) && !isNaN(m) && n <= m;
  }

  private validateNearLikeOp(entry: QueryBuilderEntry): boolean {
    if (!entry.opArgs) {
      entry.opArgs = {};
    }

    // n, m must be supplied with defaults (0-max) if missing
    this.supplyMinMax(entry.opArgs, 'n', 'm');
    // n cannot be > m
    if (this.validateMinMax(entry.opArgs, 'n', 'm')) {
      entry.error = 'Invalid value in n/m argument(s).';
    }

    // s cannot be used with NOT
    if (entry.opArgs['s'] && entry.operator?.value.startsWith('NOT ')) {
      entry.error = 'Argument s cannot be used with NOT.';
    }
    return entry.error ? true : false;
  }

  private validateInsideLikeOp(entry: QueryBuilderEntry): boolean {
    // ns, ms, ne, me must be supplied with defaults (0-max) if missing
    // ns cannot be > ms
    // ne cannot be > me
    // s cannot be used with NOT
    if (!entry.opArgs) {
      entry.opArgs = {};
    }

    // ns, ms must be supplied with defaults (0-max) if missing
    this.supplyMinMax(entry.opArgs, 'ns', 'ms');
    // ns cannot be > ms
    if (this.validateMinMax(entry.opArgs, 'ns', 'ms')) {
      entry.error = 'Invalid value in ns/ms argument(s).';
    }

    // ne, me must be supplied with defaults (0-max) if missing
    this.supplyMinMax(entry.opArgs, 'ne', 'me');
    // ne cannot be > me
    if (this.validateMinMax(entry.opArgs, 'ne', 'me')) {
      entry.error = 'Invalid value in ne/me argument(s).';
    }

    // s cannot be used with NOT
    if (entry.opArgs['s'] && entry.operator?.value.startsWith('NOT ')) {
      entry.error = 'Argument s cannot be used with NOT.';
    }

    return entry.error ? true : false;
  }

  private appendArgs(
    entry: QueryBuilderEntry,
    keys: string[],
    sb: string[]
  ): string[] {
    if (!entry?.opArgs) {
      return [];
    }
    const found: string[] = [];
    for (let i = 0; i < keys.length; i++) {
      if (i) {
        sb.push(',');
      }
      const v: string | undefined = entry.opArgs![keys[i]];
      if (v) {
        sb.push(v);
        found.push(keys[i]);
      }
    }
    return found;
  }

  private appendLocOp(entry: QueryBuilderEntry, sb: string[]) {
    sb.push(entry.operator!.value);
    sb.push('(');

    let keys: string[];
    if (
      entry.operator!.value === 'INSIDE' ||
      entry.operator!.value === 'NOT INSIDE'
    ) {
      // ns,ms,ne,me,(s)
      keys = ['ns', 'ms', 'ne', 'me', 's'];
    } else {
      // n,m,(s)
      keys = ['n', 'm', 's'];
    }
    this.appendArgs(entry, keys, sb);

    sb.push(')');
  }

  public static isLocOperator(operator?: string | null): boolean {
    if (!operator) {
      return false;
    }
    const op = operator.startsWith('NOT ') ? operator.substring(4) : operator;
    return (
      op === 'NEAR' ||
      op === 'BEFORE' ||
      op === 'AFTER' ||
      op === 'INSIDE' ||
      op === 'OVERLAPS' ||
      op === 'LALIGN' ||
      op === 'RALIGN'
    );
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

    const entries = [...this._entries$.value];
    const sb: string[] = [];

    if (this._isDocument) {
      sb.push('@');
    }

    for (let i = 0; i < entries.length; i++) {
      if (i > 0) {
        sb.push(' ');
      }
      if (entries[i].pair) {
        // (a) pair
        const pair = entries[i].pair!;
        sb.push('[');
        if (pair.attribute.type === QueryBuilderTermType.Structure) {
          sb.push('$');
        }
        sb.push(pair.attribute.value);
        sb.push(pair.operator.value);
        sb.push(`"${pair.value}"`);
        // special case for fuzzy (the only pair op with args):
        // syntax there is like [value%="chommoda:0.75"]
        if (pair.operator.value === '%=' && pair.opArgs && pair.opArgs['t']) {
          sb.push(':');
          sb.push(pair.opArgs['t']);
        }
        sb.push(']');
      } else {
        // (b) location or logical operator
        if (QueryBuilder.isLocOperator(entries[i].operator?.value)) {
          this.appendLocOp(entries[i], sb);
        } else {
          sb.push(entries[i].operator!.value);
        }
      }
    }
    if (this._isDocument) {
      sb.push(';\n');
    }

    return sb.join('');
  }
}
