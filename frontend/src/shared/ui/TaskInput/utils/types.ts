type TaskInputVariant = 'add-subtask' | 'add-task';
type InputType = 'text' | 'date';

export interface TaskInputProps {
  label: string;
  className?: string;
  type?: InputType;
  value?: string;
  placeholder?: string;
  variant?: TaskInputVariant;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
}
