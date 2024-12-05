import '@angular/localize/init';

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
  opArgs?: QueryBuilderTermDefArg[];
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
  opArgs?: QueryBuilderTermDefArg[];
  // error is set by query builder
  error?: string;
}

/**
 * Definition of the argument of a query builder term.
 */
export interface QueryBuilderTermDefArg {
  id: string;
  label?: string;
  numeric?: boolean;
  required?: boolean;
  min?: number;
  max?: number;
  value?: string;
}

export enum QueryBuilderTermType {
  Token = 0,
  Structure,
  Document,
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
    label: $localize`author`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Document's author(s).`,
  },
  {
    value: 'title',
    label: $localize`title`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Document's title.`,
  },
  {
    value: 'date_value',
    label: $localize`date`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Numeric value calculated from document's date.`,
  },
  {
    value: 'sort_key',
    label: $localize`sort key`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Document's sort key.`,
  },
  {
    value: 'source',
    label: $localize`source`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Document's source.`,
  },
  {
    value: 'profile_id',
    label: $localize`profile`,
    type: QueryBuilderTermType.Document,
    group: $localize`document`,
    tip: $localize`Configuration profile used for document.`,
  },
];

/**
 * Privileged attributes for tokens.
 */
export const QUERY_TOK_ATTR_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'type',
    label: $localize`type`,
    type: QueryBuilderTermType.Token,
    group: $localize`span`,
    tip: $localize`Span's type.`,
  },
  {
    value: 'value',
    label: $localize`value`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Token's filtered literal value.`,
  },
  {
    value: 'language',
    label: $localize`language`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Token's optional language.`,
  },
  {
    value: 'pos',
    label: $localize`POS`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`UDP part of speech: "ADJ", "ADP", "ADV", "AUX", "CCONJ", "DET", "INTJ", "NOUN", "NUM", "PRON", "PROPN", "PUNCT", "SCONJ", "SYM", "VERB", "X".`,
  },
  {
    value: 'lemma',
    label: $localize`lemma`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Token's lemma.`,
  },
  {
    value: 'length',
    label: $localize`length`,
    type: QueryBuilderTermType.Token,
    group: $localize`token`,
    tip: $localize`Token's characters count.`,
  },
];

/**
 * Privileged attributes for structures.
 */
export const QUERY_STRUCT_ATTR_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'name',
    label: $localize`name`,
    type: QueryBuilderTermType.Structure,
    group: $localize`structure`,
    tip: $localize`Structure's name (e.g. snt, p).`,
  },
  {
    value: '_value',
    label: $localize`value`,
    type: QueryBuilderTermType.Structure,
    group: $localize`value`,
    tip: $localize`Structure's text value.`,
  },
];

/**
 * Query pair operators.
 */
export const QUERY_PAIR_OP_DEFS: QueryBuilderTermDef[] = [
  {
    value: '=',
    label: $localize`equals to`,
    group: $localize`a) standard`,
  },
  {
    value: '<>',
    label: $localize`not equals to`,
    group: $localize`a) standard`,
  },
  {
    value: '*=',
    label: $localize`contains`,
    group: $localize`a) standard`,
  },
  {
    value: '^=',
    label: $localize`starts with`,
    group: $localize`a) standard`,
  },
  {
    value: '$=',
    label: $localize`ends with`,
    group: $localize`a) standard`,
  },
  {
    value: '?=',
    label: $localize`matches (wildcards)`,
    group: $localize`b) expression`,
    tip: $localize`Wildcards: ?=any single character; *=any number of any characters.`,
  },
  {
    value: '~=',
    label: $localize`matches (regexp)`,
    group: $localize`b) expression`,
    tip: $localize`Regular expression.`,
  },
  {
    value: '%=',
    label: $localize`is similar to`,
    group: $localize`c) fuzzy`,
    tip: $localize`Fuzzy matching with similarity treshold 0-1 (default 0.9).`,
    args: [
      {
        id: 't',
        label: $localize`treshold`,
        numeric: true,
        min: 0.0,
        max: 1.0,
      },
    ],
  },
  {
    value: '<',
    label: $localize`less-than`,
    group: $localize`d) numeric`,
  },
  {
    value: '<=',
    label: $localize`d) less-than or equal`,
  },
  {
    value: '==',
    label: $localize`equal`,
    group: $localize`d) numeric`,
  },
  {
    value: '!=',
    label: $localize`not-equal`,
    group: $localize`d) numeric`,
  },
  {
    value: '>',
    label: $localize`greater-than`,
    group: $localize`d) numeric`,
  },
  {
    value: '>=',
    label: $localize`greater-than or equal`,
    group: $localize`d) numeric`,
  },
];

/**
 * Query logical operators.
 */
export const QUERY_OP_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'AND',
    label: `AND`,
    group: $localize`a) logical`,
  },
  {
    value: 'OR',
    label: `OR`,
    group: $localize`a) logical`,
  },
  {
    value: 'AND NOT',
    label: `AND NOT`,
    group: $localize`a) logical`,
    type: QueryBuilderTermType.Document,
  },
  {
    value: '(',
    label: `(`,
    group: $localize`b) precedence`,
  },
  {
    value: ')',
    label: `)`,
    group: $localize`b) precedence`,
  },
];

/**
 * Query location operators.
 */
export const QUERY_LOCATION_OP_DEFS: QueryBuilderTermDef[] = [
  {
    value: 'NEAR',
    label: $localize`near to`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must be at the specified distance from the second pair, either before or after it.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`in structure`,
      },
    ],
  },
  {
    value: 'NOT NEAR',
    label: $localize`not near to`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must not be at the specified distance from the second pair, either before or after it.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`in structure`,
      },
    ],
  },
  {
    value: 'BEFORE',
    label: $localize`before`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must be before the second pair, at the specified distance from it.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`in structure`,
      },
    ],
  },
  {
    value: 'NOT BEFORE',
    label: $localize`not before`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must not be before the second pair, at the specified distance from it.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`in structure`,
      },
    ],
  },
  {
    value: 'AFTER',
    label: $localize`after`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must be after the second pair, at the specified distance from it.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'NOT AFTER',
    label: $localize`not after`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must not be after the second pair, at the specified distance from it.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'INSIDE',
    label: $localize`inside`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must be inside the span defined by the second pair, optionally at the specified distance from the container start or end.`,
    args: [
      {
        id: 'ns',
        label: $localize`min.distance from start`,
        numeric: true,
        min: 0,
      },
      {
        id: 'ms',
        label: $localize`max distance from start`,
        numeric: true,
        min: 0,
      },
      {
        id: 'ne',
        label: $localize`min.distance from end`,
        numeric: true,
        min: 0,
      },
      {
        id: 'me',
        label: $localize`max distance from end`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'NOT INSIDE',
    label: $localize`not inside`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that it must not be inside the span defined by the second pair, optionally at the specified distance from the container start or end.`,
    args: [
      {
        id: 'ns',
        label: $localize`min.distance from start`,
        numeric: true,
        min: 0,
      },
      {
        id: 'ms',
        label: $localize`max distance from start`,
        numeric: true,
        min: 0,
      },
      {
        id: 'ne',
        label: $localize`min.distance from end`,
        numeric: true,
        min: 0,
      },
      {
        id: 'me',
        label: $localize`max distance from end`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'OVERLAPS',
    label: $localize`overlaps`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that its span must overlap the one defined by the second pair, optionally by the specified amount of positions.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'NOT OVERLAPS',
    label: $localize`not overlaps`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that its span must not overlap the one defined by the second pair, optionally by the specified amount of positions.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'LALIGN',
    label: $localize`left-aligned with`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that its span must left-align with the one defined by the second pair: A can start with or after B, but not before B.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'NOT LALIGN',
    label: $localize`not left-aligned with`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that its span must not left-align with the one defined by the second pair: A can start before B, but not with/after B.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'RALIGN',
    label: $localize`right-aligned with`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that its span must right-align with the one defined by the second pair: A can end with or before B, but not after B.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
      },
    ],
  },
  {
    value: 'NOT RALIGN',
    label: $localize`not right-aligned with`,
    group: $localize`e) collocation`,
    tip: $localize`Filters the first pair so that its span must not right-align with the one defined by the second pair: A can end after B, but not with/before B.`,
    args: [
      {
        id: 'n',
        label: $localize`min.distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 'm',
        label: $localize`max distance`,
        numeric: true,
        min: 0,
      },
      {
        id: 's',
        label: $localize`structure`,
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
          errors.push($localize`Query is empty`);
        }
        break;
      case 1:
        // a single entry must be a pair
        if (entries.length === 1) {
          if (!entries[0].pair) {
            entries[0].error = $localize`Expected pair`;
          }
        }
        break;
      default:
        // first entry can be only pair/(
        let entry = entries[0];
        if (!entry.pair && entry.operator?.value !== '(') {
          entries[0].error = $localize`Expected pair or (`;
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
                entry.error = $localize`Unexpected entry type`;
                break;
              }
              // cannot end with (
              if (i + 1 === entries.length) {
                entry.error = $localize`Opening bracket at end`;
              }
              break;
            case ')':
              depth--;
              if (!prevEntry.pair && prevEntry.operator?.value !== ')') {
                entry.error = $localize`Unexpected entry type`;
              }
              break;
            case 'AND':
            case 'OR':
            case 'AND NOT':
              if (!this._isDocument && entry.operator?.value === 'AND NOT') {
                entry.error = $localize`AND NOT is allowed only in document scope`;
                break;
              }
              if (!prevEntry.pair && prevEntry.operator?.value !== ')') {
                entry.error = $localize`Unexpected entry type`;
                break;
              }
              // cannot end with operator
              if (i + 1 === entries.length) {
                entry.error = $localize`Logical operator at end`;
              }
              break;
            default: // location or pair
              if (entry.pair) {
                if (prevEntry.pair) {
                  entry.error = $localize`Pairs not connected by operator`;
                  break;
                }
              } else {
                // location
                if (this._isDocument) {
                  entry.error = $localize`Location operator not allowed in document scope`;
                  break;
                }
                // pairs required at both ends
                if (
                  !prevEntry.pair ||
                  i + 1 == entries.length ||
                  !entries[i + 1].pair
                ) {
                  entry.error = $localize`Location operator must connect two pairs`;
                }
                break;
              }
          }
        }
        // balancement
        if (depth) {
          errors.push($localize`Unbalanced parentheses`);
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
    args: QueryBuilderTermDefArg[],
    min = 'n',
    max = 'm'
  ): void {
    let arg = args.find((a) => a.id === min);
    if (!arg) {
      args.push({
        id: min,
        value: '0',
      });
    }
    arg = args.find((a) => a.id === max);
    if (!arg) {
      args.push({
        id: max,
        value: '2147483647', // int.MaxValue
      });
    }
  }

  private validateMinMax(
    args: QueryBuilderTermDefArg[],
    min = 'n',
    max = 'm'
  ): boolean {
    let arg = args.find((a) => a.id === min);
    const n = !arg?.value ? 0 : +arg.value!;

    arg = args.find((a) => a.id === max);
    const m = !arg?.value ? 0 : +arg.value!;
    return !isNaN(n) && !isNaN(m) && n <= m;
  }

  private validateNearLikeOp(entry: QueryBuilderEntry): boolean {
    if (!entry.opArgs) {
      entry.opArgs = [];
    }
    entry.error = undefined;

    // n, m must be supplied with defaults (0-max) if missing
    this.supplyMinMax(entry.opArgs);
    // n cannot be > m
    if (!this.validateMinMax(entry.opArgs, 'n', 'm')) {
      entry.error = $localize`Invalid value in n/m argument(s).`;
    }

    // s cannot be used with NOT
    let arg = entry.opArgs.find((a) => a.id === 's');
    if (arg && entry.operator?.value.startsWith('NOT ')) {
      entry.error = $localize`Argument s cannot be used with NOT.`;
    }

    return entry.error ? false : true;
  }

  private validateInsideLikeOp(entry: QueryBuilderEntry): boolean {
    // ns, ms, ne, me must be supplied with defaults (0-max) if missing
    // ns cannot be > ms
    // ne cannot be > me
    // s cannot be used with NOT
    if (!entry.opArgs) {
      entry.opArgs = [];
    }
    entry.error = undefined;

    // ns, ms must be supplied with defaults (0-max) if missing
    this.supplyMinMax(entry.opArgs, 'ns', 'ms');
    // ns cannot be > ms
    if (!this.validateMinMax(entry.opArgs, 'ns', 'ms')) {
      entry.error = $localize`Invalid value in ns/ms argument(s).`;
    }

    // ne, me must be supplied with defaults (0-max) if missing
    this.supplyMinMax(entry.opArgs, 'ne', 'me');
    // ne cannot be > me
    if (!this.validateMinMax(entry.opArgs, 'ne', 'me')) {
      entry.error = $localize`Invalid value in ne/me argument(s).`;
    }

    // s cannot be used with NOT
    let arg = entry.opArgs.find((a) => a.id === 's');
    if (arg && entry.operator?.value.startsWith('NOT ')) {
      entry.error = $localize`Argument s cannot be used with NOT.`;
    }

    return entry.error ? false : true;
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
      const v: string | undefined = entry.opArgs.find(
        (a) => a.id === keys[i]
      )?.value;
      if (v) {
        if (i) {
          sb.push(',');
        }
        sb.push(keys[i]);
        sb.push('=');
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
        if (pair.operator.value === '%=') {
          const arg = pair.opArgs?.find((a) => a.id === 't');
          if (arg) {
            sb.push(':');
            sb.push(arg.value!);
          }
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
