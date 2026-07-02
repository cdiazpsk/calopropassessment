export const brandMap={
'Signia by Hilton':'Full Service','JW Marriott':'Full Service','Ritz-Carlton':'Full Service','Marriott Hotels':'Full Service','Hilton Hotels & Resorts':'Full Service','Westin':'Full Service','Sheraton':'Full Service','Renaissance':'Full Service','Waldorf Astoria':'Full Service','Conrad':'Full Service','Grand Hyatt':'Full Service','Hyatt Regency':'Full Service',
'DoubleTree':'Select Service','Courtyard':'Select Service','Hilton Garden Inn':'Select Service','Embassy Suites':'Select Service','Residence Inn':'Select Service','Hyatt Place':'Select Service','Hyatt House':'Select Service','Aloft':'Select Service','Four Points':'Select Service',
'Hampton Inn':'Limited Service','Fairfield Inn':'Limited Service','SpringHill Suites':'Limited Service','Home2 Suites':'Limited Service','Homewood Suites':'Limited Service','TownePlace Suites':'Limited Service','Tru by Hilton':'Limited Service','Spark by Hilton':'Limited Service','Holiday Inn Express':'Limited Service'};
export const brands=Object.keys(brandMap);
export function classifyBrand(brand){return brandMap[brand]||'Unclassified'}
