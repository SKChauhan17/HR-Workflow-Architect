import { NextRequest, NextResponse } from 'next/server';
import { SimulationResponse, SimulationStep } from '@/types/workflow';

export async function POST(req: NextRequest) {
  try {
    const graphData = await req.json();
    
    // Simulate a network/processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const nodes = graphData.nodes || [];
    
    // Generate mock execution steps from the nodes
    const steps: SimulationStep[] = nodes.map((node: any, index: number) => ({
      stepId: node.id || `step-${index}`,
      status: 'success',
      message: `Successfully processed node: ${node.data?.title || node.id || 'Unknown'}`,
      timestamp: new Date().toISOString(),
    }));

    if (steps.length === 0) {
      steps.push({
        stepId: 'empty-graph',
        status: 'failed',
        message: 'No nodes found in the provided workflow graph.',
        timestamp: new Date().toISOString(),
      });
    }

    const response: SimulationResponse = {
      success: steps.every((s) => s.status === 'success'),
      steps,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { success: false, steps: [], error: 'Invalid request payload' },
      { status: 400 }
    );
  }
}
