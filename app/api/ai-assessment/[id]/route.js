import {NextResponse} from 'next/server';
import OpenAI from 'openai';
import {serviceSupabase} from '../../../../lib/supabase';
import {getServiceConfig} from '../../../../lib/serviceConfig';

export async function POST(req,{params}){
 try{
  if(!process.env.OPENAI_API_KEY)return NextResponse.json({error:'Missing OPENAI_API_KEY.'},{status:500});
  const p=await params,s=serviceSupabase();
  const{data:a,error}=await s.from('assessments').select('*').eq('id',p.id).single();
  if(error||!a)return NextResponse.json({error:'Assessment not found.'},{status:404});
  const service=(a.service_categories||[])[0]||'Guestroom PM';
  const config=getServiceConfig(a.service_categories);
  const cleanAssessment=Object.fromEntries(Object.entries(a).filter(([key])=>!key.endsWith('_score')&&!key.startsWith('ai_')));
  cleanAssessment.ratings=Object.fromEntries(config.scores.map(([key,label])=>[label,a[key]]));
  if(service!=='Guestroom PM'){
   delete cleanAssessment.rooms_available_per_day;
   delete cleanAssessment.floor_release_available;
   delete cleanAssessment.room_release_notes;
  }
  const prompt=`You are Caliber Property Assessment, an internal hotel estimating assistant.

Selected service: ${service}

Context rules that override every other instruction:
- Analyze only the selected service, its selected area, its ratings, and its top issues.
- Never import guestroom language, room-release assumptions, per-room pricing, or guestroom PM items into Public Areas, Mechanical Systems, Capital Improvements, or General Maintenance.
- Use rooms available/day, floor release, rooms/day, and per-room pricing only for Guestroom PM.
- For Public Areas, discuss the named public areas, guest traffic, work-zone access, phasing, finishes, and measurable quantities. Use pricing by area, task, square foot, linear foot, or custom scope as appropriate.
- For Mechanical Systems, discuss equipment types and counts, service access, shutdowns, operating condition, parts, and specialty labor. Do not recommend guestroom PM.
- For Capital Improvements, treat the work as a renovation or capital project, never as PM. Discuss measured scope, demolition, materials, occupied-area phasing, schedule, specialty trades, and long-lead items. Use project, unit, or square-foot pricing only when supported by the assessment.
- For General Maintenance, use assessment_area and the actual issues to define the work. If the area is a lobby, corridor, restaurant, meeting room, exterior, back-of-house area, or other common area, do not mention guest rooms or room release.
- If quantity or measurement data is missing for a non-guestroom service, say that field verification is required and do not invent production or pricing quantities.
- estimated_rooms_per_day must be null for every service except Guestroom PM. For other services, describe the applicable production unit in production_analysis.
- The saved preliminary estimate is the pricing guardrail. Explain its basis, risks, and assumptions, but do not lower it or replace it with an invented range.
- If estimate_type is Custom Estimate Required, do not provide a dollar amount. Explain what Caliber must verify before issuing pricing.
- Always describe customer-facing pricing as a preliminary budget range, never a quote, contract price, or guaranteed cost.

Guestroom PM rules, applicable only when Selected service is Guestroom PM:
- Basic guestroom PM floor is $175/room.
- Never recommend a low end below the do-not-go-below price.
- If expected margin is below 30%, raise pricing or classify as custom/high risk.
- Under 100 rooms, basic PM, 8-10 rooms/day: 1 lead + 2 technicians.
- 100-150 rooms: 1 lead + 2 technicians for basic scope; 1 lead + 3 technicians for heavy scope.
- Heavy caulking, widespread paint, corner-to-corner paint, bathroom repairs, drain issues, or every-room variability justify slower production and possibly 1 lead + 3 technicians.
- Rooms available/day is a cap, not automatically a limitation.
- Convert 1-5 scores to 20/40/60/80/100.
- Never show raw 1-5 as x/100.
- Project management should be part-time or remote unless multi-crew or unusually complex. Capital projects may require dedicated project management.
- Target margin is 30-40%.
- Basic PM: $175-$195/room.
- Deferred/heavy caulk: $195-$225/room.
- Widespread paint/bathroom/shower-pan/door/drain/capital: $225-$300/room or custom.

Assessment:
${JSON.stringify(cleanAssessment,null,2)}

Return only JSON with: summary, condition_score, estimated_rooms_per_day, recommended_program, recommended_pricing, recommended_addons, risks, questions, proposal_scope, property_health, cost_risks, profitability_analysis, production_analysis, opportunity_analysis, cost_drivers, operational_recommendations, estimate_confidence, internal_recommendation.

Before returning, verify that every field uses ${service} terminology and that no irrelevant guestroom PM or room-release references remain.`;
  const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const r=await openai.chat.completions.create({model:'gpt-4.1-mini',messages:[{role:'user',content:prompt}],temperature:.2,response_format:{type:'json_object'}});
  const x=JSON.parse(r.choices[0].message.content);
  const up=await s.from('assessments').update({ai_summary:x.summary,ai_condition_score:x.condition_score,ai_estimated_rooms_per_day:x.estimated_rooms_per_day,ai_recommended_program:x.recommended_program,ai_recommended_pricing:x.recommended_pricing,ai_recommended_addons:x.recommended_addons,ai_risks:x.risks,ai_questions:x.questions,ai_proposal_scope:x.proposal_scope,ai_property_health:x.property_health,ai_cost_risks:x.cost_risks,ai_profitability_analysis:x.profitability_analysis,ai_production_analysis:x.production_analysis,ai_opportunity_analysis:x.opportunity_analysis,ai_cost_drivers:x.cost_drivers,ai_operational_recommendations:x.operational_recommendations,ai_estimate_confidence:x.estimate_confidence,ai_internal_recommendation:x.internal_recommendation}).eq('id',p.id);
  if(up.error)throw up.error;
  return NextResponse.json({ok:true,result:x});
 }catch(e){return NextResponse.json({error:e.message||'AI assessment failed.'},{status:500})}
}
