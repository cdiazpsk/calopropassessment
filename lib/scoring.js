import { classifyBrand } from './brands';
export function scoreAssessment(form){
 const fs=['paint_score','caulk_score','furniture_score','hvac_score','plumbing_score','doors_score','logistics_score','room_release_score'];
 let score=Math.round((fs.map(f=>Number(form[f]||3)).reduce((a,b)=>a+b,0)/fs.length)/5*100);
 const issues=form.top_issues||[]; if(issues.includes('Heavy caulking needed'))score-=7; if(issues.includes('Widespread paint touch-ups'))score-=7; if(issues.includes('Room release constraints'))score-=10;
 const type=classifyBrand(form.brand); let prod=type==='Full Service'?7:type==='Select Service'?8:10;
 let program='Standard PM', pricing='$175 to $185 per room';
 if(score<80){program='Deferred PM';prod=Math.max(6,prod-1);pricing='$195 to $225 per room'} if(score<60){program='Revitalization Review';prod=Math.max(4,prod-3);pricing='Custom pricing recommended'}
 const release=Number(form.rooms_available_per_day||0); if(release>0)prod=Math.min(prod,release);
 return {property_category:type,readiness_score:Math.max(0,Math.min(100,score)),recommended_program:program,estimated_rooms_per_day:prod,recommended_pricing:pricing}
}
