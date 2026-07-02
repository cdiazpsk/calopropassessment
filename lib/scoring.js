import { classifyBrand } from './brands';
export function scoreAssessment(form){
 const fields=['paint_score','caulk_score','furniture_score','hvac_score','plumbing_score','doors_score','logistics_score','room_release_score'];
 let score=Math.round((fields.map(f=>Number(form[f]||3)).reduce((a,b)=>a+b,0)/fields.length)/5*100);
 const issues=form.top_issues||[];
 if(issues.includes('Heavy caulking needed'))score-=7;
 if(issues.includes('Widespread paint touch-ups'))score-=7;
 if(issues.includes('Room release constraints'))score-=10;
 if(issues.includes('Mechanical concerns'))score-=6;
 const type=classifyBrand(form.brand);
 let prod=type==='Full Service'?7:type==='Select Service'?8:10;
 let program='Standard PM', pricing='$175 to $185 per room';
 if(score<80){program='Deferred PM';prod=Math.max(6,prod-1);pricing='$195 to $225 per room'}
 if(score<60){program='Revitalization Review';prod=Math.max(4,prod-3);pricing='Custom pricing recommended'}
 const release=Number(form.rooms_available_per_day||0); if(release>0)prod=Math.min(prod,release);
 return {property_category:type,readiness_score:Math.max(0,Math.min(100,score)),recommended_program:program,estimated_rooms_per_day:prod,recommended_pricing:pricing}
}
export const ratingDescriptions={
 paint:{5:'Clean finish with little or no visible damage.',4:'Minor scuffs or isolated touch-ups.',3:'Noticeable wear and typical touch-up needed.',2:'Widespread scuffs, damaged areas, or repaint risk.',1:'Heavy wall damage or complete wall painting anticipated.'},
 caulk:{5:'Clean, intact caulk with no separation.',4:'Minor discoloration or small touch-up areas.',3:'Typical replacement needed in several wet areas.',2:'Widespread separation, gaps, or heavy removal required.',1:'Failed caulk throughout, heavy remediation likely.'},
 furniture:{5:'Furniture is clean and generally intact.',4:'Minor nicks or marker touch-up only.',3:'Visible wear, scratches, loose components.',2:'Widespread damage or multiple repair points.',1:'Major damage, replacement or heavy repair likely.'},
 hvac:{5:'Unit appears clean and operating normally.',4:'Light dust, standard PM cleaning expected.',3:'Moderate buildup or routine service needed.',2:'Heavy buildup, slow cleaning, or deep clean risk.',1:'Severe dirt, damage, odor, or operational concern.'},
 plumbing:{5:'Fixtures clean, tight, no known leaks.',4:'Minor adjustments likely.',3:'Typical fixture tightening or minor leaks possible.',2:'Multiple plumbing concerns or slow drains.',1:'Active leaks, failed fixtures, or major issues.'},
 doors:{5:'Doors operate and finish is clean.',4:'Minor adjustment or touch-up.',3:'Typical hardware, latch, or paint touch-up needed.',2:'Multiple issues with doors, frames, or hardware.',1:'Major repair, repaint, or replacement likely.'},
 logistics:{5:'Rooms can be released in blocks by floor.',4:'Generally coordinated room access.',3:'Some scatter or access constraints.',2:'Fragmented release likely to slow production.',1:'Very limited access, high occupancy, or major coordination risk.'},
 room_release:{5:'10+ rooms/day available consistently.',4:'8 to 10 rooms/day available.',3:'6 to 8 rooms/day available.',2:'4 to 6 rooms/day or scattered access.',1:'Less than 4 rooms/day or unreliable release.'}
}
