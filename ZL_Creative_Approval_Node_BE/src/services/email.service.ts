import { sendResetEmail, sendWorkspaceAddedEmail } from "../utils/email.utils";

export class EmailService {
  async sendResetEmail(email: string, token: string): Promise<void> {
    await sendResetEmail(email, token);
  }

  async sendWorkspaceAddedEmail(
    email: string,
    workspaceName: string,
    accessDescription: string,
  ): Promise<void> {
    await sendWorkspaceAddedEmail(email, workspaceName, accessDescription);
  }
}
