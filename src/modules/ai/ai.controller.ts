import { Request, Response, NextFunction } from 'express';
import { AIService } from './ai.service.js';
import { ResponseUtil } from '../../utils/response.util.js';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';

export class AIController {
  private aiService: AIService;

  constructor() {
    this.aiService = new AIService();
  }

  parseQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        return ResponseUtil.error(res, 'Prompt is required', 400);
      }
      const result = await this.aiService.parseNaturalLanguageQuery(prompt);
      return ResponseUtil.success(res, result, 'Natural language query processed', 200);
    } catch (error) {
      next(error);
    }
  };

  askAssistant = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { question, conversationId } = req.body;
      if (!question) {
        return ResponseUtil.error(res, 'Question is required', 400);
      }
      const userId = req.user?.id;
      const result = await this.aiService.askAssistant(question, conversationId, userId);
      return ResponseUtil.success(res, result, 'AI assistant response generated', 200);
    } catch (error) {
      next(error);
    }
  };
}
