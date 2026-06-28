import type { ChatMessage, ConversationPhase } from '../types';

export interface ChatState {
  messages: ChatMessage[];
  phase: ConversationPhase;
  error: string | null;
  statusText: string;
}

export type ChatAction =
  | { type: 'ADD_MESSAGE'; message: ChatMessage }
  | { type: 'UPDATE_STREAMING_MESSAGE'; id: string; delta: string }
  | { type: 'FINALIZE_STREAMING_MESSAGE'; id: string }
  | {
      type: 'UPDATE_TOOL_STATUS';
      id: string;
      status: 'running' | 'success' | 'error';
      content?: string;
    }
  | { type: 'SET_PHASE'; phase: ConversationPhase }
  | { type: 'SET_STATUS'; statusText: string }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'RESET' };

export const initialState: ChatState = {
  messages: [],
  phase: 'idle',
  error: null,
  statusText: '',
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        error: null,
      };

    case 'UPDATE_STREAMING_MESSAGE': {
      const messages = state.messages.map(msg => {
        if (msg.id === action.id && msg.isStreaming) {
          return { ...msg, content: msg.content + action.delta };
        }
        return msg;
      });
      return { ...state, messages };
    }

    case 'FINALIZE_STREAMING_MESSAGE': {
      const messages = state.messages.map(msg => {
        if (msg.id === action.id) {
          return { ...msg, isStreaming: false };
        }
        return msg;
      });
      return { ...state, messages };
    }

    case 'UPDATE_TOOL_STATUS': {
      const messages = state.messages.map(msg => {
        if (msg.id === action.id) {
          return {
            ...msg,
            toolCallStatus: action.status,
            content: action.content ?? msg.content,
          };
        }
        return msg;
      });
      return { ...state, messages };
    }

    case 'SET_PHASE':
      return { ...state, phase: action.phase };

    case 'SET_STATUS':
      return { ...state, statusText: action.statusText };

    case 'SET_ERROR':
      return { ...state, error: action.error, phase: 'idle' };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
