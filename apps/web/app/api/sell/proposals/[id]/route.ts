// app/api/sell/proposals/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proposalsService } from '@/src/features/sales/lib/proposals.service';
import { UpdateProposalSchema } from '@/src/features/sales/lib/proposals.schema';
import { db } from '@/src/shared';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    // TODO: Get orgId from session/auth and enforce org isolation
    const orgId = 'placeholder-org-id'; // Replace with actual auth

    const proposal = await proposalsService.getProposal(id);
    if (!proposal || proposal.orgId !== orgId) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error fetching proposal:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposal' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    // TODO: Get orgId from session/auth and enforce org isolation
    const orgId = 'placeholder-org-id'; // Replace with actual auth

    const body = await request.json();
    const validatedData = UpdateProposalSchema.parse(body);

    // Verify proposal exists and belongs to org
    const existingProposal = await proposalsService.getProposal(id);
    if (!existingProposal || existingProposal.orgId !== orgId) {
      return NextResponse.json({ error: 'Proposal not found' }, { status: 404 });
    }

    // Handle status updates separately if needed
    let updatedProposal;
    if (validatedData.status) {
      updatedProposal = await proposalsService.updateStatus(id, validatedData.status);
    } else {
      // For other updates, use direct DB update
      updatedProposal = await db.proposal.update({
        where: { id },
        data: validatedData,
      });
    }

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error('Error updating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to update proposal' },
      { status: 400 }
    );
  }
}
