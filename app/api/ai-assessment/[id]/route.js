import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { serviceSupabase } from '../../../../lib/supabase';

function normalizeTextArray(value) {
  if (Array.isArray(value)) {
    return value
      .map(item => String(item).trim())
      .filter(Boolean);
  }

  if (typeof value === 'string' && value.trim()) {
    return [value.trim()];
  }

  return [];
}

function normalizeObjectArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizeObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value
    : {};
}

export async function POST(request, { params }) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Missing OPENAI_API_KEY.' },
        { status: 500 }
      );
    }

    const resolvedParams = await params;
    const assessmentId = resolvedParams?.id;

    if (!assessmentId) {
      return NextResponse.json(
        { error: 'Missing assessment id.' },
        { status: 400 }
      );
    }

    const s = serviceSupabase();

    const { data: assessment, error: assessmentError } = await s
      .from('assessments')
      .select('*')
      .eq('id', assessmentId)
      .single();

    if (assessmentError || !assessment) {
      return NextResponse.json(
        { error: assessmentError?.message || 'Assessment not found.' },
        { status: 404 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
You are Caliber Property Assessment, an internal hospitality preconstruction, estimating, and operations assistant for Caliber Lodging.

Act like a senior project manager, estimator, and VP of Operations.

CALIBER OPERATING RULES

Pricing:
- The minimum pricing floor for basic guestroom PM is $175 per room.
- Never recommend a pricing range with a low end below $175 per room.
- Never recommend a low end below the stated do-not-go-below price.
- Basic PM should generally price between $175 and $195 per room.
- Heavy caulking or deferred maintenance should generally price between $195 and $225 per room.
- Widespread paint, corner-to-corner paint, bathroom repairs, door repairs, shower pan repairs, drain work, or capital-related scope should generally price between $225 and $300 per room or be classified as custom.
- If expected gross margin is below 30%, increase pricing or classify the project as high risk/custom.
- Target gross margin is generally 30% to 40%.

Crew sizing:
- Determine crew size using total room count, scope complexity, and rooms available per day.
- Under 100 rooms with basic PM and 8 to 10 rooms per day: recommend 1 lead plus 2 technicians.
- Between 100 and 150 rooms with basic PM: recommend 1 lead plus 2 technicians.
- Between 100 and 150 rooms with heavy caulking, widespread paint, bathroom repairs, drain issues, capital scope, or significant room-to-room variability: recommend 1 lead plus 3 technicians.
- Over 150 rooms or multi-crew projects may justify a larger team.
- Do not default to 1 lead plus 3 technicians.
- Project manager should be part-time or remote unless the project is multi-crew, capital, or unusually complex.
- Typical field schedule is 10-hour days.

Production:
- Rooms available per day is a production cap, not automatically a limitation.
- If 30 rooms are available and estimated production is 6 rooms per day, room release is not the limiting factor.
- In that case, scope complexity is the limiting factor.
- Basic PM may support 8 to 10 rooms per day.
- Heavy caulking, widespread paint, bathroom repairs, shower pan work, door repairs, drain work, or room-to-room variability may reduce production to 6 to 8 rooms per day.
- Always explain why the recommended production rate and crew size make sense together.

Scoring:
- User scores are submitted on a 1 to 5 scale.
- Convert scores to 100-point equivalents as follows:
  1 = 20
  2 = 40
  3 = 60
  4 = 80
  5 = 100
- Never display a raw score such as 3 as 3/100.
- Overall score should reflect condition, scope complexity, and operational risk.

Array requirements:
- All fields defined as arrays must always be returned as valid JSON arrays.
- Even if there is only one item, return an array with one item.
- Never return a plain string for:
  recommended_addons
  risks
  questions
  operational_recommendations
  crew_mix
  sales_notes
  limiting_factors
  conditions_to_improve
  basis
  missing_items

Assessment:
${JSON.stringify(assessment, null, 2)}

Return only valid JSON using this exact structure:

{
  "summary": "string",
  "condition_score": 0,
  "estimated_rooms_per_day": 0,
  "recommended_program": "string",
  "recommended_pricing": "string",
  "recommended_addons": ["string"],
  "risks": ["string"],
  "questions": ["string"],
  "proposal_scope": "string",

  "property_health": {
    "paint": 0,
    "caulking": 0,
    "furniture": 0,
    "hvac": 0,
    "doors": 0,
    "bathroom": 0,
    "production_readiness": 0,
    "overall": 0
  },

  "cost_risks": [
    {
      "level": "High",
      "title": "string",
      "impact": "string",
      "mitigation": "string"
    }
  ],

  "profitability_analysis": {
    "margin_outlook": "string",
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
    {
      "opportunity": "string",
      "reason": "string",
      "priority": "High"
    }
  ],

  "cost_drivers": [
    {
      "category": "string",
      "percent": 0,
      "note": "string"
    }
  ],

  "operational_recommendations": ["string"],

  "estimate_confidence": {
    "score": 0,
    "level": "string",
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
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      response_format: {
        type: 'json_object'
      }
    });

    const rawContent = response.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error('OpenAI returned an empty response.');
    }

    let result;

    try {
      result = JSON.parse(rawContent);
    } catch {
      throw new Error('OpenAI returned invalid JSON.');
    }

    const normalizedResult = {
      summary: result.summary || '',
      condition_score: Number(result.condition_score) || null,
      estimated_rooms_per_day:
        Number(result.estimated_rooms_per_day) || null,
      recommended_program: result.recommended_program || '',
      recommended_pricing: result.recommended_pricing || '',
      recommended_addons: normalizeTextArray(result.recommended_addons),
      risks: normalizeTextArray(result.risks),
      questions: normalizeTextArray(result.questions),
      proposal_scope: result.proposal_scope || '',
      property_health: normalizeObject(result.property_health),
      cost_risks: normalizeObjectArray(result.cost_risks),
      profitability_analysis: normalizeObject(
        result.profitability_analysis
      ),
      production_analysis: normalizeObject(
        result.production_analysis
      ),
      opportunity_analysis: normalizeObjectArray(
        result.opportunity_analysis
      ),
      cost_drivers: normalizeObjectArray(result.cost_drivers),
      operational_recommendations: normalizeTextArray(
        result.operational_recommendations
      ),
      estimate_confidence: normalizeObject(
        result.estimate_confidence
      ),
      internal_recommendation: normalizeObject(
        result.internal_recommendation
      )
    };

    const { error: updateError } = await s
      .from('assessments')
      .update({
        ai_summary: normalizedResult.summary,
        ai_condition_score: normalizedResult.condition_score,
        ai_estimated_rooms_per_day:
          normalizedResult.estimated_rooms_per_day,
        ai_recommended_program:
          normalizedResult.recommended_program,
        ai_recommended_pricing:
          normalizedResult.recommended_pricing,
        ai_recommended_addons:
          normalizedResult.recommended_addons,
        ai_risks:
          normalizedResult.risks,
        ai_questions:
          normalizedResult.questions,
        ai_proposal_scope:
          normalizedResult.proposal_scope,
        ai_property_health:
          normalizedResult.property_health,
        ai_cost_risks:
          normalizedResult.cost_risks,
        ai_profitability_analysis:
          normalizedResult.profitability_analysis,
        ai_production_analysis:
          normalizedResult.production_analysis,
        ai_opportunity_analysis:
          normalizedResult.opportunity_analysis,
        ai_cost_drivers:
          normalizedResult.cost_drivers,
        ai_operational_recommendations:
          normalizedResult.operational_recommendations,
        ai_estimate_confidence:
          normalizedResult.estimate_confidence,
        ai_internal_recommendation:
          normalizedResult.internal_recommendation
      })
      .eq('id', assessmentId);

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({
      ok: true,
      result: normalizedResult
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error.message || 'AI assessment failed.'
      },
      {
        status: 500
      }
    );
  }
}
