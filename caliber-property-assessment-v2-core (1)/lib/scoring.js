import { classifyBrand } from './brands';
import { getServiceConfig } from './serviceConfig';

export function scoreAssessment(form){
  const config=getServiceConfig(form.service_categories);
  const keys=config.scores.map(([k])=>k);
  const vals=keys.map(k=>Number(form[k]||3));
  let score=Math.round((vals.reduce((a,b)=>a+b,0)/vals.length)/5*100);
  const issues=form.top_issues||[];
  const heavy=['Heavy caulking needed','Widespread paint touch-ups','Corner-to-corner paint needed','Capital project needed','Drain issues'];
  const heavyCount=issues.filter(i=>heavy.includes(i)).length;
  if(issues.includes('Heavy caulking needed'))score-=7;
  if(issues.includes('Widespread paint touch-ups'))score-=7;
  if(issues.includes('Corner-to-corner paint needed'))score-=8;
  if(issues.includes('Capital project needed'))score-=10;
  if(issues.includes('Room release constraints'))score-=10;
  const category=classifyBrand(form.brand);
  const rooms=Number(form.total_rooms||0);
  const release=Number(form.rooms_available_per_day||0);
  const isHeavy=heavyCount>=2||issues.includes('Capital project needed');
  let prod=isHeavy?6:score<70?8:category==='Full Service'?8:10;
  if(release>0)prod=Math.min(prod,release);
  let crew=(rooms>150||isHeavy||prod<=7)?'1 Lead + 3 Technicians':'1 Lead + 2 Technicians';
  let program='Standard PM',pricing='$175 to $195 per room';
  if(isHeavy||score<60){program='Revitalization Review';pricing='$225 to $275 per room'}
  else if(score<80){program='Deferred PM';pricing='$195 to $225 per room'}
  return{property_category:category,readiness_score:Math.max(0,Math.min(100,score)),recommended_program:program,estimated_rooms_per_day:prod,recommended_pricing:pricing,recommended_crew:crew}
}
