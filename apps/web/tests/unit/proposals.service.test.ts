// tests/unit/proposals.service.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the database
vi.mock('@/src/shared', () => ({
  db: {
    proposal: {
      create: vi.fn(),
      update: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

import { db } from '@/src/shared';
import { ProposalsService } from '@/src/features/sales/lib/proposals.service';

describe('ProposalsService', () => {
  let service: ProposalsService;

  beforeEach(() => {
    service = new ProposalsService();
    vi.clearAllMocks();
  });

  describe('createProposal', () => {
    it('should create a proposal with correct data', async () => {
      const mockData = {
        clientId: 'client-123',
        rfpContent: 'Test RFP content',
        orgId: 'org-456',
        dealId: 'deal-789',
      };

      const mockCreatedProposal = {
        id: 'proposal-123',
        ...mockData,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.proposal.create as any).mockResolvedValue(mockCreatedProposal);

      const result = await service.createProposal(mockData);

      expect(db.proposal.create).toHaveBeenCalledWith({
        data: {
          clientId: mockData.clientId,
          rfpContent: mockData.rfpContent,
          orgId: mockData.orgId,
          dealId: mockData.dealId,
          status: 'DRAFT',
        },
      });

      expect(result).toEqual(mockCreatedProposal);
    });

    it('should create a proposal without dealId', async () => {
      const mockData = {
        clientId: 'client-123',
        rfpContent: 'Test RFP content',
        orgId: 'org-456',
      };

      const mockCreatedProposal = {
        id: 'proposal-123',
        ...mockData,
        dealId: null,
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (db.proposal.create as any).mockResolvedValue(mockCreatedProposal);

      const result = await service.createProposal(mockData);

      expect(db.proposal.create).toHaveBeenCalledWith({
        data: {
          clientId: mockData.clientId,
          rfpContent: mockData.rfpContent,
          orgId: mockData.orgId,
          dealId: undefined,
          status: 'DRAFT',
        },
      });

      expect(result).toEqual(mockCreatedProposal);
    });
  });

  describe('generateProposalPDF', () => {
    it('should return a mock PDF URL', async () => {
      const result = await service.generateProposalPDF('proposal-123');

      expect(result).toBe('https://example.com/proposals/proposal-123/proposal.pdf');
    });
  });

  describe('updateStatus', () => {
    it('should update proposal status', async () => {
      const mockUpdatedProposal = {
        id: 'proposal-123',
        status: 'SENT',
        updatedAt: new Date(),
      };

      (db.proposal.update as any).mockResolvedValue(mockUpdatedProposal);

      const result = await service.updateStatus('proposal-123', 'SENT');

      expect(db.proposal.update).toHaveBeenCalledWith({
        where: { id: 'proposal-123' },
        data: { status: 'SENT' },
      });

      expect(result).toEqual(mockUpdatedProposal);
    });
  });

  describe('getProposal', () => {
    it('should return proposal with relations', async () => {
      const mockProposal = {
        id: 'proposal-123',
        clientId: 'client-123',
        client: { id: 'client-123', name: 'Test Client' },
        deal: null,
      };

      (db.proposal.findUnique as any).mockResolvedValue(mockProposal);

      const result = await service.getProposal('proposal-123');

      expect(db.proposal.findUnique).toHaveBeenCalledWith({
        where: { id: 'proposal-123' },
        include: {
          client: true,
          deal: true,
        },
      });

      expect(result).toEqual(mockProposal);
    });
  });

  describe('getProposals', () => {
    it('should return proposals for org with relations', async () => {
      const mockProposals = [
        {
          id: 'proposal-123',
          client: { id: 'client-123', name: 'Test Client' },
          deal: null,
        },
      ];

      (db.proposal.findMany as any).mockResolvedValue(mockProposals);

      const result = await service.getProposals('org-456');

      expect(db.proposal.findMany).toHaveBeenCalledWith({
        where: { orgId: 'org-456' },
        include: {
          client: true,
          deal: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      expect(result).toEqual(mockProposals);
    });
  });
});
