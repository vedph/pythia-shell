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
  { value: 'atto', label: 'document', group: 'document' },
  { value: 'data', label: 'date', group: 'document' },
  { value: 'giudicante', label: 'judge', group: 'document' },
  { value: 'grado', label: 'degree', group: 'document' },
  { value: 'gruppo-atto', label: 'doc. group', group: 'document' },
  { value: 'gruppo-nr', label: 'group nr.', group: 'document' },
  { value: 'id', label: 'ID', group: 'document' },
  { value: 'materia', label: 'subject', group: 'document' },
  { value: 'nascita-avv', label: 'birth year', group: 'document' },
  { value: 'sede-giudicante', label: 'judgement place', group: 'document' },
  { value: 'sede-raccolta', label: 'collection place', group: 'document' },
  { value: 'sesso-avv', label: 'sex', group: 'document' },
  // occurrence
  { value: 'abbr', label: 'abbreviation', group: 'text' },
  { value: 'address', label: 'address', group: 'text' },
  { value: 'b', label: 'bold', group: 'text' },
  { value: 'clitic', label: 'clitic', group: 'POS' },
  { value: 'definite', label: 'definite', group: 'POS' },
  { value: 'degree', label: 'degree', group: 'POS' },
  { value: 'deprel', label: 'deprel', group: 'POS' },
  { value: 'email', label: 'email', group: 'text' },
  { value: 'foreign', label: 'foreign', group: 'text' },
  { value: 'gender', label: 'gender', group: 'POS' },
  { value: 'i', label: 'italic', group: 'text' },
  { value: 'lemma', label: 'lemma', group: 'POS' },
  { value: 'len', label: 'length', group: 'text' },
  { value: 'mood', label: 'mood', group: 'POS' },
  { value: 'n', label: 'digits', group: 'text' },
  { value: 'number', label: 'number', group: 'POS' },
  { value: 'numtype', label: 'number type', group: 'POS' },
  { value: 'org-f', label: 'org.name, fem.', group: 'text' },
  { value: 'org-m', label: 'org.name, masc.', group: 'text' },
  { value: 'person', label: 'person', group: 'text' },
  { value: 'pn-f', label: 'person name, fem.', group: 'text' },
  { value: 'pn-m', label: 'person name, masc.', group: 'text' },
  { value: 'pn-s', label: 'surname', group: 'text' },
  { value: 'polarity', label: 'polarity', group: 'POS' },
  { value: 'poss', label: 'poss', group: 'POS' },
  { value: 'prontype', label: 'prontype', group: 'POS' },
  { value: 'tense', label: 'tense', group: 'POS' },
  { value: 'tn', label: 'toponym', group: 'text' },
  { value: 'upos', label: 'upos', group: 'POS' },
  { value: 'verbform', label: 'verbform', group: 'POS' },
  // structure
  { value: 'p', label: 'paragraph', group: 'structure' },
];
