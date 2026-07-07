import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { serviceSupabase } from '../../../../lib/supabase';

export async function POST(req, { params }) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'Missing OPENAI_API_KEY.' }, { status: 500 });
    }

    const p = await params;
    const assessmentId = p.id;
    const s = serviceSupabase();

    const { data: assessment, error } = await s
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (error || !assessment) {
      return NextResponse.json({ error: 'Assessment not found.' }, { status: 404 });
    }

    const { data: files } = await s
      .from('assessment_files')
      .select('*')
      .eq('assessment_id', assessmentId);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
You are CaliberOS, an internal hospitality preconstruction, estimating, and operations assistant for Caliber Lodging.

Act like a senior project manager, estimator, and VP of Operations reviewing a hotel property assessment.

Hard pricing rules:
- Basic Guestroom PM floor is $175/room.
- If heavy caulking is selected, pricing cannot be below $195/room.
- If widespread paint touch-ups or corner-to-corner paint is selected, pricing cannot be below $210/room.
- If bathroom door repairs, shower pan repairs, grout refresh, drain issues, or “every room is different” is noted, pricing cannot be below $225/room.
- If “capital project needed” is selected, classify as Revitalization PM or Capital/Custom Review and pricing should generally be $225-$300/room or custom.
- Never output a recommended price range where the low end is below the stated “do not go below” number.
- If the expected margin is below 30%, increase the recommended price or classify as high-risk/custom. Do not present 18–25% margin as acceptable.

Score normalization:
- Assessment form scores are 1–5.
- Convert 1–5 scores to 100-point scale:
  1 = 20
  2 = 40
  3 = 60
  4 = 80
  5 = 100
- Never show 1, 2, 3, 4, or 5 as “x/100.”
- Overall score should reflect both condition and scope risk.

Room release logic:
- Rooms available per day is a cap, not always a limitation.
- If rooms_available_per_day is 30 and estimated production is 6/day, room release is not the limiting factor.
- In that case, list scope complexity, bathroom repairs, caulking, paint, and variability as limiting factors.

Crew sizing logic:
- For under 100 rooms with basic scope and 8–10 rooms/day, use 1 lead + 2 techs.
- For 100–150 rooms with basic scope, use 1 lead + 2 techs or 1 lead + 3 techs depending on scope.
- For heavy scope, widespread paint, heavy caulking, bathroom repairs, or 6–8 rooms/day production, 1 lead + 3 techs can be justified.
- Always explain why the crew size fits the scope and production target.

Be practical and commercially useful. Push back if the project sounds heavier than normal PM.
Focus on production cadence, gross margin, room release, labor efficiency, travel assumptions, client expectations, add-ons, and cost risk.

Assessment:
${JSON.stringify(assessment, null, 2)}

Uploaded files:
${JSON.stringify((files || []).map(f => ({ label: f.file_label, name: f.file_name, type: f.file_type })), null, 2)}

Return ONLY valid JSON with this exact shape:
{
  "summary": "one paragraph executive summary",
  "condition_score": 0,
  "estimated_rooms_per_day": 0,
  "recommended_program": "Standard PM",
  "recommended_pricing": "$",
  "recommended_addons": ["string"],
  "risks": ["string"],
  "questions": ["string"],
  "proposal_scope": "string",
  "property_health": {
    "overall": 0,
    "paint": 0,
    "caulking": 0,
    "furniture": 0,
    "hvac": 0,
    "doors": 0,
    "bathroom": 0,
    "production_readiness": 0
  },
  "cost_risks": [
    {"level": "High", "title": "string", "impact": "string", "mitigation": "string"}
  ],
  "profitability_analysis": {
    "margin_outlook": "Excellent",
    "expected_margin_range": "string",
    "recommended_price_per_room": "string",
    "do_not_go_below": "string",
    "reasoning": "string"
  },
  "production_analysis": {
    "estimated_rooms_per_day": 0,
    "limiting_factors": ["string"],
    "production_can_improve_to": "string",
    "conditions_to_improve": ["string"]
  },
  "opportunity_analysis": [
    {"opportunity": "string", "reason": "string", "priority": "High"}
  ],
  "cost_drivers": [
    {"category": "string", "percent": 0, "note": "string"}
  ],
  "operational_recommendations": ["string"],
  "estimate_confidence": {
    "score": 0,
    "level": "High",
    "basis": ["string"],
    "missing_items": ["string"]
  },
  "internal_recommendation": {
    "recommended_crew": "string",
    "crew_mix": ["string"],
    "estimated_duration": "string",
    "expected_revenue": "string",
    "expected_gross_margin": "string",
    "recommended_positioning": "string",
    "sales_notes": ["string"]
  }
}
`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    const result = JSON.parse(response.choices[0].message.content);

    const update = await s
      .from('assessments')
      .update({
        ai_summary: result.summary,
        ai_condition_score: result.condition_score,
        ai_estimated_rooms_per_day: result.estimated_rooms_per_day,
        ai_recommended_program: result.recommended_program,
        ai_recommended_pricing: result.recommended_pricing,
        ai_recommended_addons: result.recommended_addons,
        ai_risks: result.risks,
        ai_questions: result.questions,
        ai_proposal_scope: result.proposal_scope,
        ai_property_health: result.property_health,
        ai_cost_risks: result.cost_risks,
        ai_profitability_analysis: result.profitability_analysis,
        ai_production_analysis: result.production_analysis,
        ai_opportunity_analysis: result.opportunity_analysis,
        ai_cost_drivers: result.cost_drivers,
        ai_operational_recommendations: result.operational_recommendations,
        ai_estimate_confidence: result.estimate_confidence,
        ai_internal_recommendation: result.internal_recommendation
      })
      .eq('id', assessmentId);

    if (update.error) throw update.error;

    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ error: e.message || 'AI assessment failed.' }, { status: 500 });
  }
}
