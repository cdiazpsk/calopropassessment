const money = value => Math.round(value / 50) * 50;

const hasAny = (issues, values) => values.some(value => issues.includes(value));

function applyProjectFactors(form, low, high, service) {
  let factor = 1;
  const logistics = Number(form.logistics_score || form.mechanical_access_score || 3);

  if (!form.materials_owner_supplied && service !== 'Mechanical Systems') factor += 0.08;
  if (!form.comp_rooms_available) factor += 0.08;
  if (!form.meals_provided) factor += 0.02;
  if (logistics <= 2) factor += 0.1;
  if (service !== 'Guestroom PM' && form.occupied_work_allowed === false) factor += 0.08;
  if (service === 'Mechanical Systems' && form.shutdown_required) factor += 0.1;

  return {low: money(low * factor), high: money(high * factor)};
}

function result({low = null, high = null, unitLow = null, unitHigh = null, unit = 'project', basis, confidence = 'Moderate', custom = false}) {
  const range = custom ? 'Custom estimate required' : `$${low.toLocaleString()} to $${high.toLocaleString()}`;
  const unitRange = unitLow === null ? null : `$${unitLow.toLocaleString()} to $${unitHigh.toLocaleString()} per ${unit}`;
  return {
    estimate_type: custom ? 'Custom Estimate Required' : 'Preliminary Budget Range',
    preliminary_estimate_low: low,
    preliminary_estimate_high: high,
    estimate_unit: unit,
    estimate_unit_low: unitLow,
    estimate_unit_high: unitHigh,
    estimate_basis: basis,
    estimate_confidence: confidence,
    recommended_pricing: unitRange ? `${range} total (${unitRange})` : range,
    estimate_disclaimer: custom
      ? 'Caliber must validate measurements, materials, access, and trade requirements before pricing this scope.'
      : 'This is a preliminary planning range, not a proposal. Final pricing is subject to scope validation, quantities, access, materials, travel, and schedule.'
  };
}

export function calculateEstimate(form, readinessScore = 60) {
  const service = (form.service_categories || [])[0] || 'Guestroom PM';
  const issues = form.top_issues || [];

  if (service === 'Capital Improvements') {
    return result({custom: true, basis: 'Capital improvements require measured quantities, material selections, phasing, and a defined construction scope.', confidence: 'Pending field validation'});
  }

  if (service === 'Guestroom PM') {
    const rooms = Number(form.total_rooms || 0);
    const custom = hasAny(issues, ['Capital replacement needed']) || rooms <= 0;
    if (custom) return result({custom: true, basis: rooms <= 0 ? 'A verified guestroom count is required.' : 'The assessment indicates replacement or capital work outside a repeatable PM scope.', confidence: 'Pending field validation'});

    let unitLow = 175, unitHigh = 195, tier = 'basic preventative maintenance';
    if (readinessScore < 80) { unitLow = 195; unitHigh = 225; tier = 'deferred or heavier preventative maintenance'; }
    if (readinessScore < 60 || hasAny(issues, ['Corner-to-corner paint needed', 'Bathroom repairs', 'Every-room scope varies'])) {
      unitLow = 225; unitHigh = 300; tier = 'revitalization-level preventative maintenance';
    }
    const adjusted = applyProjectFactors(form, rooms * unitLow, rooms * unitHigh, service);
    return result({...adjusted, unitLow, unitHigh, unit: 'room', basis: `${rooms} guestrooms at the ${tier} pricing tier, adjusted for the submitted logistics and owner-provided support.`, confidence: 'Moderate'});
  }

  if (service === 'Mechanical Systems') {
    const custom = hasAny(issues, ['Equipment replacement likely', 'Electrical or control issues']) || readinessScore < 45;
    if (custom) return result({custom: true, basis: 'The assessment indicates diagnostic, electrical, controls, or equipment replacement work that cannot be responsibly priced as routine PM.', confidence: 'Pending equipment inspection'});

    const statedCount = Number.parseInt(String(form.scope_quantity || '').match(/\d+/)?.[0] || '0', 10);
    const count = statedCount > 0 ? statedCount : 1;
    let unitLow = 250, unitHigh = 400;
    if (readinessScore < 70 || hasAny(issues, ['Heavy coil, grease, or debris buildup', 'Scale or sanitation concerns', 'Corrosion or deteriorated components'])) {
      unitLow = 350; unitHigh = 650;
    }
    const adjusted = applyProjectFactors(form, Math.max(750, count * unitLow), Math.max(1500, count * unitHigh), service);
    return result({...adjusted, unitLow, unitHigh, unit: 'equipment item', basis: statedCount > 0 ? `${statedCount} reported equipment items with PM pricing adjusted for condition, access, and shutdown requirements.` : 'A minimum mechanical PM mobilization allowance because the equipment count was not clearly stated.', confidence: statedCount > 0 ? 'Moderate' : 'Low'});
  }

  if (service === 'Public Areas') {
    const custom = hasAny(issues, ['Capital replacement needed']) || readinessScore < 40;
    if (custom) return result({custom: true, basis: 'The public-area assessment indicates restoration or replacement work requiring measured quantities and finish selections.', confidence: 'Pending field validation'});
    let low = 2500, high = 6000, tier = 'light public-area maintenance';
    if (readinessScore < 80) { low = 6000; high = 15000; tier = 'moderate multi-area maintenance'; }
    if (readinessScore < 60) { low = 15000; high = 35000; tier = 'heavy public-area restoration'; }
    const adjusted = applyProjectFactors(form, low, high, service);
    return result({...adjusted, basis: `${tier} allowance based on reported area, condition, finishes, guest access, phasing, and owner-provided support.`, confidence: form.scope_quantity ? 'Moderate' : 'Low'});
  }

  const custom = hasAny(issues, ['Specialty trade needed']) || readinessScore < 40;
  if (custom) return result({custom: true, basis: 'The scope appears to require specialty trade pricing or detailed field verification beyond routine general maintenance.', confidence: 'Pending field validation'});
  let low = 750, high = 1500, tier = 'light defined maintenance';
  if (readinessScore < 80) { low = 1500; high = 5000; tier = 'moderate corrective maintenance'; }
  if (readinessScore < 60) { low = 5000; high = 15000; tier = 'heavy multi-task maintenance'; }
  const adjusted = applyProjectFactors(form, low, high, service);
  return result({...adjusted, basis: `${tier} allowance based on the submitted work area, issues, access, schedule, materials, and travel support.`, confidence: form.scope_quantity ? 'Moderate' : 'Low'});
}
