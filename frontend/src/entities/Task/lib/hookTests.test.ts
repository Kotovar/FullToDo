import { act, renderHook } from '@testing-library/react';
import { createWrapper, createWrapperWithRouter } from '@shared/mocks';
import { notepadId, taskId } from 'shared/schemas';
import { useCreateTask, useTaskParams, useTaskDetail } from '..';

const getInitialDataCreateTask = async () => {
  const { result } = renderHook(
    () => useCreateTask({ notepadId, entity: 'task' }),
    {
      wrapper: createWrapper(),
    },
  );

  return result;
};

const getInitialDataTaskDetail = async () => {
  const { result } = renderHook(
    () => useTaskDetail({ notepadId, taskId, entity: 'task' }),
    {
      wrapper: createWrapper(),
    },
  );

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
    result.current.updateTask({ title: 'test' }, taskId, 'create');
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
