// app/api/sell/proposals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { proposalsService } from '@/src/features/sales/lib/proposals.service';
import { CreateProposalSchema } from '@/src/features/sales/lib/proposals.schema';

export async function POST(request: NextRequest) {
  try {
    // TODO: Get orgId from session/auth - placeholder for now
    const orgId = 'placeholder-org-id'; // Replace with actual auth

    const body = await request.json();
    const validatedData = CreateProposalSchema.parse(body);

    const proposal = await proposalsService.createProposal({
      ...validatedData,
      orgId,
    });

    return NextResponse.json(proposal);
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 400 }
    );
  }
}

export async function GET() {
  try {
    // TODO: Get orgId from session/auth - placeholder for now
    const orgId = 'placeholder-org-id'; // Replace with actual auth

    const proposals = await proposalsService.getProposals(orgId);
    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}
