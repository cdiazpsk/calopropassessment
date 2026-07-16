alter table public.assessments
add column if not exists recommended_crew text,
add column if not exists main_area_paint_score integer,
add column if not exists public_caulk_score integer,
add column if not exists drywall_score integer,
add column if not exists baseboards_score integer,
add column if not exists exterior_condition_score integer,
add column if not exists upholstery_score integer,
add column if not exists vinyl_wallpaper_score integer,
add column if not exists hvac_equipment_score integer,
add column if not exists ice_machine_score integer,
add column if not exists walkin_cooler_score integer,
add column if not exists reachin_equipment_score integer,
add column if not exists kitchen_equipment_score integer,
add column if not exists laundry_equipment_score integer,
add column if not exists mechanical_access_score integer,
add column if not exists flooring_score integer,
add column if not exists fixtures_score integer;
notify pgrst,'reload schema';
