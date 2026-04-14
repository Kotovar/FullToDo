import { TaskRepository } from '@repositories';
import {
  CreateNotepad,
  Notepad,
  NotepadWithoutTasks,
} from '@sharedCommon/schemas';

export class NotepadService {
  constructor(private repository: TaskRepository) {}

  async createNotepad(
    notepad: CreateNotepad,
    userId: number,
  ): Promise<Notepad> {
    return await this.repository.createNotepad(notepad, userId);
  }

  async getAllNotepads(userId: number): Promise<NotepadWithoutTasks[]> {
    return await this.repository.getAllNotepads(userId);
  }

  async updateNotepad(
    notepadId: string,
    updatedNotepadFields: Partial<CreateNotepad>,
    userId: number,
  ): Promise<Notepad> {
    return await this.repository.updateNotepad(
      notepadId,
      updatedNotepadFields,
      userId,
    );
  }

  async deleteNotepad(notepadId: string, userId: number): Promise<void> {
    return await this.repository.deleteNotepad(notepadId, userId);
  }
}
