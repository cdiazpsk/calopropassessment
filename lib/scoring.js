import { classifyBrand } from './brands';
import { getServiceConfig } from './serviceConfig';
import { calculateEstimate } from './pricing';

export function scoreAssessment(form){
  const config=getServiceConfig(form.service_categories);
  const service=(form.service_categories||[])[0]||'Guestroom PM';
  const keys=config.scores.map(([k])=>k);
  const vals=keys.map(k=>Number(form[k]||3));
  let score=Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)/5*100);
  const issues=form.top_issues||[];
  const severe=['Corner-to-corner paint needed','Capital replacement needed','Equipment replacement likely','Water intrusion concerns','Drywall or substrate failure','Widespread finish deterioration','Safety concern'];
  const heavyCount=issues.filter(i=>severe.includes(i)).length;
  score-=Math.min(20,heavyCount*8);
  if(service==='Guestroom PM'&&issues.includes('Room release constraints'))score-=10;
  const category=classifyBrand(form.brand);
  const rooms=Number(form.total_rooms||0);
  const release=Number(form.rooms_available_per_day||0);
  const isHeavy=heavyCount>=1||score<60;

  if(service!=='Guestroom PM'){
    const recommendations={
      'Public Areas':{standard:'Public Area Maintenance',heavy:'Public Area Restoration',pricing:'Custom estimate by area, quantity, access, and finish level',crew:isHeavy?'1 Lead + 3 Technicians':'1 Lead + 2 Technicians'},
      'Mechanical Systems':{standard:'Mechanical Service Assessment',heavy:'Mechanical Repair / Replacement Review',pricing:'Custom estimate by equipment type, count, access, and required parts',crew:isHeavy?'Mechanical Lead + 2 Technicians':'Mechanical Lead + 1 Technician'},
      'Capital Improvements':{standard:'Capital Improvement Project',heavy:'Capital Improvement Project',pricing:'Custom project estimate based on measured scope, materials, phasing, and schedule',crew:'Project-specific crew after scope validation'},
      'General Maintenance':{standard:'General Maintenance Scope',heavy:'Corrective Maintenance / Repair Scope',pricing:'Custom estimate by work area, task quantity, access, and materials',crew:isHeavy?'1 Lead + 2 Technicians':'1 Lead + 1 Technician'}
    };
    const rec=recommendations[service]||recommendations['General Maintenance'];
    const readinessScore=Math.max(0,Math.min(100,score));
    return{property_category:category,readiness_score:readinessScore,recommended_program:isHeavy?rec.heavy:rec.standard,estimated_rooms_per_day:null,recommended_crew:rec.crew,...calculateEstimate(form,readinessScore)};
  }

  let prod=isHeavy?6:score<70?8:category==='Full Service'?8:10;
  if(release>0)prod=Math.min(prod,release);
  let crew=(rooms>150||isHeavy||prod<=7)?'1 Lead + 3 Technicians':'1 Lead + 2 Technicians';
  let program='Standard PM',pricing='$175 to $195 per room';
  if(isHeavy||score<60){program='Revitalization Review';pricing='$225 to $275 per room'}
  else if(score<80){program='Deferred PM';pricing='$195 to $225 per room'}
  const readinessScore=Math.max(0,Math.min(100,score));
  return{property_category:category,readiness_score:readinessScore,recommended_program:program,estimated_rooms_per_day:prod,recommended_crew:crew,...calculateEstimate(form,readinessScore)}
}
