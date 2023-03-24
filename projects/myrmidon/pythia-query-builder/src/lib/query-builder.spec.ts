import { TestBed } from '@angular/core/testing';

import {
  QueryBuilder,
  QUERY_LOCATION_OP_DEFS,
  QUERY_OP_DEFS,
  QUERY_PAIR_OP_DEFS,
  QUERY_TOK_ATTR_DEFS,
} from './query-builder';

fdescribe('QueryBuilder', () => {
  let builder: QueryBuilder;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    builder = new QueryBuilder();
  });

  it('no entries should build empty', () => {
    expect(builder.build()).toBe('');
  });

  // X=Y
  it('should build "[value="a"]"', () => {
    builder.addEntry({
      pair: {
        attribute: QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!,
        operator: QUERY_PAIR_OP_DEFS.find((d) => d.value === '=')!,
        value: 'a',
      },
    });
    expect(builder.build()).toBe('[value="a"]');
  });

  // X%=Y:T
  it('should build "[value%="a":0.5]"', () => {
    const op = QUERY_PAIR_OP_DEFS.find((d) => d.value === '%=')!;
    builder.addEntry({
      pair: {
        attribute: QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!,
        operator: op,
        value: 'a',
        opArgs: [{ ...op.args![0], value: '0.5' }],
      },
    });
    expect(builder.build()).toBe('[value%="a":0.5]');
  });

  // X=Y OR X=Y
  it('should build "[value="a"] OR [value="b"]', () => {
    const attr = QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!;
    const op = QUERY_PAIR_OP_DEFS.find((d) => d.value === '=')!;

    builder.addEntry({
      pair: {
        attribute: attr,
        operator: op,
        value: 'a',
      },
    });
    builder.addEntry({
      operator: QUERY_OP_DEFS.find((d) => d.value === 'OR')!,
    });
    builder.addEntry({
      pair: {
        attribute: attr,
        operator: op,
        value: 'b',
      },
    });

    expect(builder.build()).toBe('[value="a"] OR [value="b"]');
  });

  // X=Y NEAR(n,m,s) X=Y
  it('should build "[value="a"] NEAR(n=0,m=1,s=sent) [value="b"]', () => {
    const attr = QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!;
    const eqOp = QUERY_PAIR_OP_DEFS.find((d) => d.value === '=')!;
    const nearOp = QUERY_LOCATION_OP_DEFS.find((d) => d.value === 'NEAR')!;

    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'a',
      },
    });
    builder.addEntry({
      operator: nearOp,
      opArgs: [
        { ...nearOp.args![0], value: '0' },
        { ...nearOp.args![1], value: '1' },
        { ...nearOp.args![2], value: 'sent' },
      ],
    });
    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'b',
      },
    });

    expect(builder.build()).toBe('[value="a"] NEAR(n=0,m=1,s=sent) [value="b"]');
  });

  // X=Y NEAR(n,m) X=Y
  it('should build "[value="a"] NEAR(n=0,m=1) [value="b"]', () => {
    const attr = QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!;
    const eqOp = QUERY_PAIR_OP_DEFS.find((d) => d.value === '=')!;
    const nearOp = QUERY_LOCATION_OP_DEFS.find((d) => d.value === 'NEAR')!;

    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'a',
      },
    });
    builder.addEntry({
      operator: nearOp,
      opArgs: [
        { ...nearOp.args![0], value: '0' },
        { ...nearOp.args![1], value: '1' },
      ],
    });
    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'b',
      },
    });

    expect(builder.build()).toBe('[value="a"] NEAR(n=0,m=1) [value="b"]');
  });

  // X=Y INSIDE(ns,ms,ne,me,s) X=Y
  it('should build "[value="a"] INSIDE(ns=0,ms=1,ne=2,me=3,s=sent) [value="b"]', () => {
    const attr = QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!;
    const eqOp = QUERY_PAIR_OP_DEFS.find((d) => d.value === '=')!;
    const nearOp = QUERY_LOCATION_OP_DEFS.find((d) => d.value === 'INSIDE')!;

    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'a',
      },
    });
    builder.addEntry({
      operator: nearOp,
      opArgs: [
        { ...nearOp.args![0], value: '0' },
        { ...nearOp.args![1], value: '1' },
        { ...nearOp.args![2], value: '2' },
        { ...nearOp.args![3], value: '3' },
        { ...nearOp.args![4], value: 'sent' },
      ],
    });
    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'b',
      },
    });

    expect(builder.build()).toBe(
      '[value="a"] INSIDE(ns=0,ms=1,ne=2,me=3,s=sent) [value="b"]'
    );
  });

  // X=Y INSIDE(ns,ms,ne,me) X=Y
  it('should build "[value="a"] INSIDE(ns=0,ms=1,ne=2,me=3) [value="b"]', () => {
    const attr = QUERY_TOK_ATTR_DEFS.find((d) => d.value === 'value')!;
    const eqOp = QUERY_PAIR_OP_DEFS.find((d) => d.value === '=')!;
    const nearOp = QUERY_LOCATION_OP_DEFS.find((d) => d.value === 'INSIDE')!;

    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'a',
      },
    });
    builder.addEntry({
      operator: nearOp,
      opArgs: [
        { ...nearOp.args![0], value: '0' },
        { ...nearOp.args![1], value: '1' },
        { ...nearOp.args![2], value: '2' },
        { ...nearOp.args![3], value: '3' },
      ],
    });
    builder.addEntry({
      pair: {
        attribute: attr,
        operator: eqOp,
        value: 'b',
      },
    });

    expect(builder.build()).toBe(
      '[value="a"] INSIDE(ns=0,ms=1,ne=2,me=3) [value="b"]'
    );
  });
});
