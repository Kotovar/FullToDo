import { act, renderHook } from '@testing-library/react';
import { createWrapper, createWrapperWithRouter } from '@shared/mocks';
import { NOTEPAD_ID, TASK_ID } from 'shared/schemas';
import { useCreateTask, useTaskDetail } from '..';
import { useTaskParams } from '@shared/lib';

const getInitialDataCreateTask = async () => {
  const { result } = renderHook(
    () => useCreateTask({ notepadId: NOTEPAD_ID, entity: 'task' }),
    {
      wrapper: createWrapper(),
    },
  );

  return result;
};

const getInitialDataTaskDetail = async () => {
  const { result } = renderHook(() => useTaskDetail({ entity: 'task' }), {
    wrapper: createWrapper(),
  });

  return result;
};

const getInitialDataTaskParams = async () => {
  const { result } = renderHook(() => useTaskParams(), {
    wrapper: createWrapperWithRouter(),
  });

  return result;
};

describe('useCreateTask hook', () => {
  test('successful', async () => {
    const result = await getInitialDataCreateTask();
    result.current.createTask({ title: 'test' });
  });
});

describe('useTaskDetail hook', () => {
  test('successful', async () => {
    const result = await getInitialDataTaskDetail();
    result.current.updateTask({ title: 'test' }, TASK_ID, 'create');
  });
});

describe('useTaskParams hook', () => {
  test('successful', async () => {
    const result = await getInitialDataTaskParams();
    act(() =>
      result.current.setSearchParams(new URLSearchParams('undefined=123')),
    );

    expect(result.current.validParams.toString()).toBe('');

    act(() =>
      result.current.setSearchParams(new URLSearchParams('search=123')),
    );

    expect(result.current.validParams.toString()).toBe('search=123');
  });
});
