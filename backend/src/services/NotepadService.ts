import { TaskRepository } from '@repositories';
import {
  CreateNotepad,
  Notepad,
  NotepadWithoutTasks,
} from '@sharedCommon/schemas';

export class NotepadService {
  constructor(private repository: TaskRepository) {}

  async createNotepad(task: CreateNotepad): Promise<Notepad> {
    return await this.repository.createNotepad(task);
  }

  async getAllNotepads(): Promise<NotepadWithoutTasks[]> {
    return await this.repository.getAllNotepads();
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
  ): Promise<Notepad> {
    return await this.repository.updateNotepad(notepadId, updatedNotepadFields);
  }

  async deleteNotepad(notepadId: string): Promise<void> {
    return await this.repository.deleteNotepad(notepadId);
  }
}
