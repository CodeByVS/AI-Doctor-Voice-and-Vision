import type { SampleCase } from '../types';


export const DEFAULT_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';

export const SAMPLE_CASES: SampleCase[] = [
  {
    id: 'rash',
    name: 'Skin Rash',
    file: 'skin_rash.jpg',
    query: 'I have this red rash on my arm. It is itchy. What is your diagnosis and suggested remedies?',
    description: 'Dermal inflammation'
  },
  {
    id: 'acne',
    name: 'Acne',
    file: 'acne.jpg',
    query: 'I have severe acne breakout on my face. Can you suggest some remedies?',
    description: 'Acne consultation'
  },
  {
    id: 'dandruff',
    name: 'Scalp Flakes',
    file: 'dandruff-optimized.webp',
    query: 'My scalp is very dry and flaky. What could it be and what should I do?',
    description: 'Scalp check'
  }
];
