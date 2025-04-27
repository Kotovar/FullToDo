type TaskInputVariant = 'add-subtask' | 'add-task';
type InputType = 'text' | 'date';

export interface TaskInputProps {
  type?: InputType;
  value?: string;
  label: string;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  variant?: TaskInputVariant;
}
