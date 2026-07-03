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
  5: 'Excellent - little or no visible work needed.',
  4: 'Good - minor touch-up or routine PM likely.',
  3: 'Fair - visible wear and moderate maintenance needed.',
  2: 'Poor - significant work likely, production may slow.',
  1: 'Very Poor - heavy repair, replacement, or custom scope likely.'
};

export function getServiceConfig(serviceCategories = []) {
  return SERVICE_CONFIG[(serviceCategories || [])[0]] || SERVICE_CONFIG['Guestroom PM'];
}
