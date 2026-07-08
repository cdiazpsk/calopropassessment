export const SERVICE_CONFIG = {
  'Guestroom PM': {
    scores: [
      ['paint_score', 'Paint'],
      ['caulk_score', 'Caulking'],
      ['furniture_score', 'Furniture'],
      ['hvac_score', 'HVAC / PTAC'],
      ['plumbing_score', 'Plumbing'],
      ['doors_score', 'Doors'],
      ['logistics_score', 'Logistics'],
      ['room_release_score', 'Room Release']
    ],
    photos: [
      'Main Room',
      'Kitchen / Kitchenette (if applicable)',
      'Bedroom Area',
      'Bathroom',
      'Bathroom Caulking Close-up',
      'PTAC / VTAC / HVAC Unit',
      'Furniture Damage',
      'Entry Door',
      'Video Walkthrough'
    ]
  },

  'Public Areas': {
    scores: [
      ['main_area_paint_score', 'Main Area Paint'],
      ['public_caulk_score', 'Caulk'],
      ['drywall_score', 'Drywall'],
      ['baseboards_score', 'Baseboards'],
      ['exterior_condition_score', 'Exterior Condition / Sidewalk / Patio'],
      ['upholstery_score', 'Upholstery'],
      ['vinyl_wallpaper_score', 'Vinyl / Wallpaper']
    ],
    photos: [
      'Main Lobby',
      'Corridors',
      'Exterior / Sidewalk / Patio',
      'Lighting',
      'HVAC / Ceiling Diffusers',
      'Restrooms',
      'Elevators',
      'Dining / Breakfast Area',
      'Meeting Room / Common Area',
      'Other Public Area'
    ]
  },

  'Mechanical Systems': {
    scores: [
      ['hvac_equipment_score', 'HVAC Equipment'],
      ['ice_machine_score', 'Ice Machines'],
      ['walkin_cooler_score', 'Walk-in Coolers / Freezers'],
      ['reachin_equipment_score', 'Reach-ins'],
      ['kitchen_equipment_score', 'Kitchen Equipment'],
      ['laundry_equipment_score', 'Laundry Equipment'],
      ['mechanical_access_score', 'Mechanical Access / Serviceability']
    ],
    photos: [
      'HVAC Equipment',
      'Ice Machines',
      'Walk-in Cooler / Freezer',
      'Reach-in Equipment',
      'Kitchen Equipment',
      'Laundry Equipment',
      'Mechanical Room',
      'Condensers / Rooftop Units',
      'Equipment Data Plates',
      'Video Walkthrough'
    ]
  },

  'Capital Improvements': {
    scores: [
      ['paint_score', 'Paint / Finish Condition'],
      ['drywall_score', 'Drywall / Substrate'],
      ['flooring_score', 'Flooring'],
      ['baseboards_score', 'Baseboards / Trim'],
      ['fixtures_score', 'Fixtures'],
      ['exterior_condition_score', 'Exterior / Envelope'],
      ['logistics_score', 'Logistics / Access']
    ],
    photos: [
      'Primary Work Area',
      'Walls / Drywall',
      'Flooring',
      'Fixtures',
      'Exterior',
      'Access / Logistics',
      'Other Capital Scope',
      'Video Walkthrough'
    ]
  },

  'General Maintenance': {
    scores: [
      ['paint_score', 'Paint'],
      ['drywall_score', 'Drywall'],
      ['plumbing_score', 'Plumbing'],
      ['doors_score', 'Doors / Hardware'],
      ['fixtures_score', 'Fixtures'],
      ['logistics_score', 'Logistics']
    ],
    photos: [
      'Main Issue',
      'Close-up Detail',
      'Area Context',
      'Access / Logistics',
      'Other Issue',
      'Video Walkthrough'
    ]
  }
};

export const scoreDescriptions = {
  default: {
    5: 'Excellent - little or no visible work needed.',
    4: 'Good - minor touch-up or routine PM likely.',
    3: 'Fair - visible wear and moderate maintenance needed.',
    2: 'Poor - significant work likely, production may slow.',
    1: 'Very Poor - heavy repair, replacement, or custom scope likely.'
  },

  paint_score: {
    5: 'Recently painted or excellent condition.',
    4: 'Minor paint touch-ups only.',
    3: 'Moderate touch-ups required in common wear areas.',
    2: 'Heavy touch-ups required in many rooms.',
    1: 'Extensive repainting needed throughout the assessed areas.'
  },

  main_area_paint_score: {
    5: 'Public area paint presents very well with little or no work needed.',
    4: 'Minor touch-ups only in visible wear areas.',
    3: 'Moderate wear consistent with normal public area use.',
    2: 'Heavy touch-ups required across multiple public areas.',
    1: 'Extensive repainting likely required in major public areas.'
  },

  caulk_score: {
    5: 'Caulk is clean, intact, and requires little or no replacement.',
    4: 'Minor caulk touch-ups only.',
    3: 'Some caulk replacement needed during PM.',
    2: 'Significant cracking, separation, discoloration, or missing caulk.',
    1: 'Most areas require full caulk removal and replacement.'
  },

  public_caulk_score: {
    5: 'Public area caulk and sealant appear clean and intact.',
    4: 'Minor sealant touch-ups only.',
    3: 'Some public area caulk or sealant repair needed.',
    2: 'Multiple public areas show failing or discolored sealant.',
    1: 'Widespread public area caulk or sealant replacement likely required.'
  },

  furniture_score: {
    5: 'Furniture is in excellent condition with little or no maintenance needed.',
    4: 'Minor tightening or touch-up only.',
    3: 'Typical tightening, adjustment, or minor repair needed.',
    2: 'Many loose, damaged, or visibly worn items.',
    1: 'Extensive repair, refinishing, or replacement likely required.'
  },

  upholstery_score: {
    5: 'Upholstery is clean and presents well.',
    4: 'Minor spotting or touch-up cleaning only.',
    3: 'Moderate wear or cleaning needed in several areas.',
    2: 'Heavy staining, wear, or multiple damaged areas.',
    1: 'Replacement or major restoration likely required.'
  },

  vinyl_wallpaper_score: {
    5: 'Vinyl or wallpaper is clean, tight, and in excellent condition.',
    4: 'Minor peeling or touch-up only.',
    3: 'Moderate wear, seam issues, or localized repairs needed.',
    2: 'Multiple damaged, peeling, or stained areas.',
    1: 'Widespread replacement or major wall finish repair likely required.'
  },

  hvac_score: {
    5: 'Units appear clean, maintained, and operating well.',
    4: 'Minor servicing or filter cleaning only.',
    3: 'Standard preventative maintenance required.',
    2: 'Heavy cleaning or multiple service issues expected.',
    1: 'Numerous units may require repair, deep cleaning, or replacement review.'
  },

  hvac_equipment_score: {
    5: 'Mechanical equipment appears well maintained and operating properly.',
    4: 'Recently serviced with only minor PM needed.',
    3: 'Standard preventative maintenance is needed.',
    2: 'Heavy PM, cleaning, or multiple repairs are expected.',
    1: 'Significant repair or replacement may be required.'
  },

  ice_machine_score: {
    5: 'Ice machines appear clean, maintained, and operating properly.',
    4: 'Minor cleaning or filter/service check needed.',
    3: 'Standard preventative maintenance and sanitization needed.',
    2: 'Heavy cleaning, scale, leaks, or service issues expected.',
    1: 'Major cleaning, repair, or replacement evaluation likely required.'
  },

  walkin_cooler_score: {
    5: 'Walk-ins appear clean, holding temperature, and well maintained.',
    4: 'Minor PM or gasket adjustment only.',
    3: 'Standard refrigeration PM needed.',
    2: 'Heavy PM, gasket, fan, drain, or temperature concerns expected.',
    1: 'Major repair or reliability concern likely.'
  },

  reachin_equipment_score: {
    5: 'Reach-ins appear clean, maintained, and operating well.',
    4: 'Minor service or cleaning only.',
    3: 'Standard PM and coil cleaning likely needed.',
    2: 'Multiple units show service, cleaning, or reliability concerns.',
    1: 'Major repair or replacement review likely required.'
  },

  kitchen_equipment_score: {
    5: 'Kitchen equipment appears clean, maintained, and operating well.',
    4: 'Minor PM or adjustment only.',
    3: 'Standard PM and service review needed.',
    2: 'Multiple service issues or heavy cleaning likely.',
    1: 'Major repair, replacement, or specialty service likely required.'
  },

  laundry_equipment_score: {
    5: 'Laundry equipment appears clean, maintained, and operating well.',
    4: 'Minor PM or cleaning only.',
    3: 'Standard PM and lint/vent review needed.',
    2: 'Multiple units show wear, cleaning, or service concerns.',
    1: 'Major repair or replacement review likely required.'
  },

  mechanical_access_score: {
    5: 'Equipment access is clear and serviceable.',
    4: 'Minor access limitations only.',
    3: 'Some access coordination or staging may be needed.',
    2: 'Access limitations will slow production or service.',
    1: 'Poor access creates major service, safety, or production constraints.'
  },

  plumbing_score: {
    5: 'Fixtures and drains appear to be in excellent working condition.',
    4: 'Minor adjustments or routine checks only.',
    3: 'Typical PM with occasional fixture or drain repairs.',
    2: 'Frequent plumbing repairs or slow drains anticipated.',
    1: 'Widespread plumbing issues, leaks, or failed fixtures likely.'
  },

  doors_score: {
    5: 'Doors and hardware operate well and present cleanly.',
    4: 'Minor tightening or adjustment only.',
    3: 'Typical PM adjustments and hardware tightening needed.',
    2: 'Numerous doors, latches, hinges, or hardware items need repair.',
    1: 'Extensive door, frame, or hardware repair/replacement likely.'
  },

  drywall_score: {
    5: 'Drywall appears clean with little or no repair needed.',
    4: 'Minor patching or touch-up only.',
    3: 'Moderate patching and finish repair needed.',
    2: 'Multiple damaged areas or larger repairs expected.',
    1: 'Extensive drywall repair, replacement, or refinishing likely.'
  },

  baseboards_score: {
    5: 'Baseboards and trim are in excellent condition.',
    4: 'Minor touch-ups or reattachment only.',
    3: 'Moderate wear, paint touch-up, or repair needed.',
    2: 'Multiple damaged, loose, or heavily worn sections.',
    1: 'Widespread replacement or major trim repair likely.'
  },

  exterior_condition_score: {
    5: 'Exterior, sidewalks, or patio areas present very well.',
    4: 'Minor cleaning or touch-up repairs only.',
    3: 'Average condition with routine maintenance needed.',
    2: 'Heavy weathering, staining, or multiple deficiencies.',
    1: 'Major deterioration requiring significant repair or restoration.'
  },

  flooring_score: {
    5: 'Flooring is in excellent condition with little or no work needed.',
    4: 'Minor spot repair or cleaning only.',
    3: 'Moderate wear, cleaning, or localized repair needed.',
    2: 'Multiple damaged or worn areas likely require repair.',
    1: 'Replacement or major flooring work likely required.'
  },

  fixtures_score: {
    5: 'Fixtures are in excellent condition and operating well.',
    4: 'Minor adjustment or tightening only.',
    3: 'Standard PM adjustment or replacement of minor parts needed.',
    2: 'Multiple fixtures need repair or replacement.',
    1: 'Major fixture replacement or specialty repair likely.'
  },

  logistics_score: {
    5: 'Excellent access, staging, and coordination. Production should be efficient.',
    4: 'Good access and staging with minor coordination needs.',
    3: 'Some access, staging, or coordination issues may affect production.',
    2: 'Limited access or poor staging will likely reduce productivity.',
    1: 'Major logistics constraints will significantly impact schedule and labor.'
  },

  room_release_score: {
    5: 'Excellent floor-by-floor or block release allowing maximum production.',
    4: 'Good room release with grouped work areas.',
    3: 'Moderate room release with some grouping possible.',
    2: 'Limited room blocks available. Productivity will likely be affected.',
    1: 'Scattered rooms, frequent interruptions, or very limited daily access.'
  }
};

export function getScoreDescription(scoreKey, value) {
  return (scoreDescriptions[scoreKey] && scoreDescriptions[scoreKey][value]) || scoreDescriptions.default[value] || '';
}

export function getServiceConfig(serviceCategories = []) {
  return SERVICE_CONFIG[(serviceCategories || [])[0]] || SERVICE_CONFIG['Guestroom PM'];
}
