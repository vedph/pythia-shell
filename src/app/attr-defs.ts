import { QueryBuilderTermDef } from 'projects/myrmidon/pythia-query-builder/src/public-api';

/**
 * List of attributes come from:
 *
 * select distinct(name)
 * from document_attribute
 * order by name;
 * select distinct(name)
 * from occurrence_attribute
 * order by name;
 * select distinct(name)
 * from structure_attribute
 * order by name;
 */
export const ATTR_DEFS: QueryBuilderTermDef[] = [
  // document
  { value: 'atto', label: 'act', group: 'c) document' },
  { value: 'data', label: 'date', group: 'c) document' },
  { value: 'giudicante', label: 'judge', group: 'c) document' },
  { value: 'grado', label: 'degree', group: 'c) document' },
  { value: 'gruppo-atto', label: 'doc. group', group: 'c) document' },
  { value: 'gruppo-nr', label: 'group nr.', group: 'c) document' },
  { value: 'id', label: 'ID', group: 'c) document' },
  { value: 'materia', label: 'subject', group: 'c) document' },
  { value: 'nascita-avv', label: 'birth year', group: 'c) document', tip: 'Author\'s birth year.' },
  { value: 'sede-giudicante', label: 'judgement place', group: 'c) document' },
  { value: 'sede-raccolta', label: 'collection place', group: 'c) document' },
  { value: 'sesso-avv', label: 'sex', group: 'c) document', tip: 'Author\'s sex: M, F, X.' },
  // occurrence
  { value: 'abbr', label: 'abbreviation', group: 'a) text' },
  { value: 'address', label: 'address', group: 'a) text' },
  { value: 'b', label: 'bold', group: 'a) text' },
  { value: 'clitic', label: 'clitic', group: 'b) POS' },
  { value: 'definite', label: 'definite', group: 'b) POS' },
  { value: 'degree', label: 'degree', group: 'b) POS' },
  { value: 'deprel', label: 'deprel', group: 'b) POS' },
  { value: 'email', label: 'email', group: 'a) text' },
  { value: 'foreign', label: 'foreign', group: 'a) text' },
  { value: 'gender', label: 'gender', group: 'b) POS' },
  { value: 'i', label: 'italic', group: 'a) text' },
  { value: 'lemma', label: 'lemma', group: 'b) POS' },
  { value: 'len', label: 'length', group: 'a) text' },
  { value: 'mood', label: 'mood', group: 'b) POS' },
  { value: 'n', label: 'digits', group: 'a) text' },
  { value: 'number', label: 'number', group: 'b) POS' },
  { value: 'numtype', label: 'number type', group: 'b) POS' },
  { value: 'org-f', label: 'org.name, f.', group: 'a) text' },
  { value: 'org-m', label: 'org.name, m.', group: 'a) text' },
  { value: 'person', label: 'person', group: 'a) text' },
  { value: 'pn-f', label: 'person name, f.', group: 'a) text' },
  { value: 'pn-m', label: 'person name, m.', group: 'a) text' },
  { value: 'pn-s', label: 'surname', group: 'a) text' },
  { value: 'polarity', label: 'polarity', group: 'b) POS' },
  { value: 'poss', label: 'poss', group: 'b) POS' },
  { value: 'prontype', label: 'prontype', group: 'b) POS' },
  { value: 'tense', label: 'tense', group: 'b) POS' },
  { value: 'tn', label: 'toponym', group: 'a) text' },
  { value: 'upos', label: 'upos', group: 'b) POS' },
  { value: 'verbform', label: 'verbform', group: 'b) POS' },
  // structure
  { value: 'p', label: 'paragraph', group: 'structure' },
];
