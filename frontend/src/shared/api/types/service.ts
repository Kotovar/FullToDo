export abstract class BaseService {
  protected abstract handleResponse<T>(response: Response): Promise<T>;
  protected abstract handleError(error: unknown): Promise<never>;
}
