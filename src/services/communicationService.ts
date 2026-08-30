import { ChatMessage, Conversation, NotificationItem, User } from '../types';
import { MOCK_CHAT_MESSAGES, MOCK_CONVERSATIONS, MOCK_NOTIFICATIONS } from '../mock/data';

class CommunicationService {
  private notifications: NotificationItem[] = [...MOCK_NOTIFICATIONS];
  private conversations: Conversation[] = [...MOCK_CONVERSATIONS];
  private messages: Record<string, ChatMessage[]> = { ...MOCK_CHAT_MESSAGES };

  async getNotifications(userId?: string): Promise<NotificationItem[]> {
    await new Promise((res) => setTimeout(res, 80));
    if (userId) {
      return this.notifications.filter((n) => n.userId === userId || n.type === 'System');
    }
    return [...this.notifications];
  }

  async markNotificationRead(id: string): Promise<void> {
    const item = this.notifications.find((n) => n.id === id);
    if (item) item.read = true;
  }

  async markAllNotificationsRead(): Promise<void> {
    this.notifications.forEach((n) => (n.read = true));
  }

  async getConversations(): Promise<Conversation[]> {
    await new Promise((res) => setTimeout(res, 80));
    return [...this.conversations];
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    await new Promise((res) => setTimeout(res, 80));
    return this.messages[conversationId] || [];
  }

  async sendMessage(conversationId: string, sender: User, text: string): Promise<ChatMessage> {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: sender.id,
      senderName: sender.name,
      senderRole: sender.role,
      senderOrg: sender.organization || sender.designation,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
    };

    if (!this.messages[conversationId]) {
      this.messages[conversationId] = [];
    }
    this.messages[conversationId].push(newMsg);

    const conv = this.conversations.find((c) => c.id === conversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.lastMessageTime = 'Just now';
    }

    return newMsg;
  }
}

export const communicationService = new CommunicationService();
