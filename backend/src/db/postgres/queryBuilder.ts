import type { TaskQueryParams } from '@sharedCommon/schemas';

/**
 * Колонки задачи для SELECT-запросов.
 * Алиасы нужны потому что pg возвращает имена колонок как есть (snake_case),
 * а тип Task ожидает camelCase.
 * Двойные кавычки в алиасах сохраняют регистр букв в PostgreSQL.
 */
export const TASK_COLUMNS = `
  _id::text,
  title,
  description,
  is_completed AS "isCompleted",
  created_date AS "createdDate",
  notepad_id::text AS "notepadId",
  due_date AS "dueDate"
`;

/**
 * Маппинг camelCase полей сортировки (из TaskQueryParams) в snake_case колонки БД.
 * Без него ORDER BY "dueDate" упал бы — такой колонки в таблице нет.
 */
const SORT_FIELD_MAP: Record<NonNullable<TaskQueryParams['sortBy']>, string> = {
  createdDate: 'created_date',
  dueDate: 'due_date',
};

type FilterResult = {
  whereSQL: string;
  values: unknown[];
};

/**
 * Строит WHERE-часть запроса и массив значений для параметризованного запроса.
 *
 * Значения передаются через $1, $2 и т.д. — это защита от SQL-инъекций:
 * pg подставляет их как безопасные литералы, а не вставляет напрямую в строку.
 *
 * @param params - параметры фильтрации из запроса
 * @param initialValues - начальные значения, если в запросе уже есть параметры до фильтров.
 *   Например, в getSingleNotepadTasks первым параметром идёт $1 = notepadId,
 *   поэтому фильтры должны начинаться с $2.
 */
export function buildTaskFilterSQL(
  params: TaskQueryParams,
  initialValues: unknown[] = [],
  notepadId?: string,
): FilterResult {
  const where: string[] = [];
  const values: unknown[] = [...initialValues];

  if (notepadId) {
    values.push(notepadId);
    where.push(`notepad_id = $${values.length}`);
  }

  if (params.isCompleted !== undefined) {
    values.push(params.isCompleted === 'true');
    where.push(`is_completed = $${values.length}`);
  }

  if (params.hasDueDate !== undefined) {
    where.push(
      params.hasDueDate === 'true'
        ? 'due_date IS NOT NULL'
        : 'due_date IS NULL',
    );
  }

  if (params.search?.trim()) {
    values.push(`%${params.search.toLowerCase().trim()}%`);
    where.push(
      `(LOWER(title) LIKE $${values.length} OR LOWER(description) LIKE $${values.length})`,
    );
  }

  const whereSQL = where.length > 0 ? `WHERE ${where.join(' AND ')}` : '';

  return { whereSQL, values };
}

/**
 * Строит ORDER BY часть запроса.
 *
 * Поле берётся только из проверенного маппинга SORT_FIELD_MAP —
 * прямая интерполяция безопасна, т.к. пользовательский ввод сюда не попадает.
 * По умолчанию сортировка по дате создания по убыванию (новые задачи первыми).
 */
export function buildOrderSQL(
  sortBy: TaskQueryParams['sortBy'],
  order: TaskQueryParams['order'],
): string {
  const field = (sortBy && SORT_FIELD_MAP[sortBy]) ?? 'created_date';
  const direction = order === 'asc' ? 'ASC' : 'DESC';
  return `ORDER BY ${field} ${direction}`;
}

/**
 * Строит LIMIT/OFFSET часть запроса для пагинации.
 *
 * LIMIT и OFFSET интерполируются напрямую (не через $n) — они числа,
 * не пользовательский текст, SQL-инъекция невозможна.
 *
 * @param page - номер страницы (начиная с 1)
 * @param limit - количество записей на странице
 */
export function buildPaginationSQL(page: number, limit: number): string {
  const offset = (page - 1) * limit;
  return `LIMIT ${limit} OFFSET ${offset}`;
}
