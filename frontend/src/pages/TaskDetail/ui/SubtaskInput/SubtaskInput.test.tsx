import { screen } from '@testing-library/react';
import { renderWithRouter } from '@shared/testing';
import { SubtaskInput } from './SubtaskInput';

const props = {
  value: 'test',
  label: 'Добавить подзадачу',
  placeholder: 'Добавить подзадачу',
  onChange: vi.fn(),
  onClick: vi.fn(),
  onKeyDown: vi.fn(),
};

describe('SubtaskInput component', () => {
  test('корректно запускается', () => {
    renderWithRouter(<SubtaskInput {...props} />);

    const label = screen.getByLabelText(props.label, { selector: 'input' });

    expect(label).toBeInTheDocument();
  });
});
