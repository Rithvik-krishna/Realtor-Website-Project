import { PropertyRepository } from '../properties/property.repository.js';
import { prisma } from '../../database/client.js';

export class AIService {
  private propertyRepo: PropertyRepository;

  constructor() {
    this.propertyRepo = new PropertyRepository();
  }

  /**
   * Parse natural language user query into structured search parameters
   * e.g. "Show me a modern detached house under $900,000 near a good school in Toronto"
   */
  async parseNaturalLanguageQuery(prompt: string) {
    const lower = prompt.toLowerCase();
    
    let propertyType: string | undefined = undefined;
    if (lower.includes('detached')) propertyType = 'DETACHED';
    else if (lower.includes('semi-detached') || lower.includes('semi detached')) propertyType = 'SEMI_DETACHED';
    else if (lower.includes('townhouse') || lower.includes('town home')) propertyType = 'TOWNHOUSE';
    else if (lower.includes('condo')) propertyType = 'CONDO_APARTMENT';

    let maxPrice: number | undefined = undefined;
    const priceMatch = lower.match(/under\s+\$?([0-9,]+)/i) || lower.match(/\$?([0-9,]+)\s*k/i);
    if (priceMatch) {
      let numStr = priceMatch[1].replace(/,/g, '');
      let val = parseFloat(numStr);
      if (lower.includes('k') && val < 10000) val = val * 1000;
      maxPrice = val;
    }

    let city: string | undefined = undefined;
    if (lower.includes('toronto')) city = 'Toronto';
    else if (lower.includes('brampton')) city = 'Brampton';
    else if (lower.includes('mississauga')) city = 'Mississauga';

    let bedrooms: number | undefined = undefined;
    const bedMatch = lower.match(/([0-9]+)\s*(bed|bedroom)/i);
    if (bedMatch) bedrooms = parseInt(bedMatch[1], 10);

    let lifestyleTag: string | undefined = undefined;
    if (lower.includes('school')) lifestyleTag = 'Family Friendly';
    else if (lower.includes('subway') || lower.includes('transit')) lifestyleTag = 'Near Transit';
    else if (lower.includes('downtown')) lifestyleTag = 'Downtown Living';

    const filters = {
      city,
      propertyType,
      maxPrice,
      bedrooms,
      lifestyleTag
    };

    // Query DB with extracted structured filters
    const { items, total } = await this.propertyRepo.findAll({
      city,
      propertyType,
      maxPrice,
      bedrooms,
      lifestyleTag,
      take: 10
    });

    return {
      prompt,
      filtersApplied: filters,
      matchedProperties: items,
      totalCount: total
    };
  }

  /**
   * AI Real Estate Assistant responding to user Q&A
   */
  async askAssistant(question: string, conversationId?: string, userId?: string) {
    const lower = question.toLowerCase();
    let answer = "";

    if (lower.includes('afford') || lower.includes('budget') || lower.includes('mortgage')) {
      answer = "To calculate affordability in Ontario, a general rule of thumb is keeping your gross debt service (GDS) ratio below 39% of your gross income. Closing costs typically range from 1.5% to 4% of the purchase price, which includes Land Transfer Tax, legal fees, and title insurance.";
    } else if (lower.includes('closing cost')) {
      answer = "In Ontario, closing costs include Ontario Land Transfer Tax (plus Toronto Land Transfer Tax if buying in Toronto), legal fees ($1,500 - $2,500), title insurance ($300 - $500), property tax adjustments, and home inspection fees.";
    } else if (lower.includes('brampton') || lower.includes('toronto')) {
      answer = "Brampton and Toronto offer dynamic real estate opportunities. Toronto features luxury high-rise condos and prime transit access, while Brampton provides spacious family detached homes with proximity to excellent schools and parks.";
    } else {
      answer = `Thank you for asking about "${question}". As your Canadian Real Estate AI Advisor, I can help you evaluate properties, estimate monthly mortgage payments, and guide you through Ontario's home buying and selling process.`;
    }

    // Persist conversation history if conversationId exists or create new
    let conversation;
    if (conversationId) {
      conversation = await prisma.aIConversation.findUnique({ where: { id: conversationId } });
    }
    if (!conversation) {
      conversation = await prisma.aIConversation.create({
        data: {
          userId,
          title: question.substring(0, 40)
        }
      });
    }

    await prisma.aIMessage.createMany({
      data: [
        { conversationId: conversation.id, sender: 'USER', content: question },
        { conversationId: conversation.id, sender: 'ASSISTANT', content: answer }
      ]
    });

    return {
      conversationId: conversation.id,
      question,
      answer
    };
  }
}
