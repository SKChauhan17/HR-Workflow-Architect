import { NextResponse } from 'next/server';
import { ActionTemplate } from '@/types/workflow';

export async function GET() {
  const actions: ActionTemplate[] = [
    {
      id: 'send_email',
      label: 'Send Email',
      params: ['to', 'subject', 'body'],
    },
    {
      id: 'generate_offer_letter',
      label: 'Generate Offer Letter',
      params: ['candidate_name', 'salary', 'start_date'],
    },
    {
      id: 'notify_slack',
      label: 'Notify Slack Channel',
      params: ['channel', 'message'],
    },
    {
      id: 'trigger_bg_check',
      label: 'Trigger Background Check',
      params: ['candidate_id', 'provider'],
    },
  ];

  return NextResponse.json(actions);
}
