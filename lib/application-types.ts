export type ApplicationQuestionType = 'richtext' | 'text' | 'textarea' | 'checkboxes' | 'select';

export type ApplicationQuestion = {
  id: string;
  label: string;
  hint: string;
  type: ApplicationQuestionType;
  required: boolean;
  options: string[];
};

export type ApplicationDefinition = {
  id: string;
  slug: string;
  title: string;
  description: string;
  enabled: boolean;
  paid?: boolean;
  questions: ApplicationQuestion[];
};
