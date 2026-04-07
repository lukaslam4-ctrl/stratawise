import { useState, useCallback, useRef } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const COMPONENT_LIBRARY = [
  { id: "substructure", category: "Structural & Architectural", name: "Substructure / Foundation", desc: "Concrete foundations, footings, and below-grade structural elements supporting the building." },
  { id: "parkade_membrane", category: "Structural & Architectural", name: "Parkade / Overburdened Membrane", desc: "Waterproofing membrane systems over parkade structures, including traffic-bearing and pedestrian surfaces." },
  { id: "wood_siding", category: "Structural & Architectural", name: "Wood Siding", desc: "Exterior wood-based cladding including lap siding, shiplap, board and batten, and related trim." },
  { id: "vinyl_siding", category: "Structural & Architectural", name: "Vinyl / Composite Siding", desc: "Extruded vinyl or fibre cement composite cladding systems on exterior building envelope." },
  { id: "brick_siding", category: "Structural & Architectural", name: "Structural Brick / Masonry Siding", desc: "Brick veneer, concrete block, or masonry cladding systems on exterior building envelope." },
  { id: "windows", category: "Structural & Architectural", name: "Aluminum Frame Windows", desc: "Thermally broken aluminum frame windows with insulated glazing units." },
  { id: "vinyl_windows", category: "Structural & Architectural", name: "Vinyl Frame Windows & Sliding Doors", desc: "Double-glazed vinyl framed window units and patio sliding glass doors." },
  { id: "balcony_membranes", category: "Structural & Architectural", name: "Balcony / Deck Waterproofing Membranes", desc: "Vinyl, urethane, or hot-applied waterproofing membranes on balconies and roof decks over occupied space." },
  { id: "parkade_gate", category: "Structural & Architectural", name: "Overhead Parkade Gate", desc: "Motorized overhead sectional or roll-up gates providing access control to underground or covered parking." },
  { id: "garage_doors", category: "Structural & Architectural", name: "Wood / Steel Garage Doors", desc: "Residential-style sectional garage doors with automatic openers serving individual strata lots." },
  { id: "entry_doors", category: "Structural & Architectural", name: "Exterior Suite Entry Doors", desc: "Common property entry doors to individual strata lots, including frames, hardware, and weatherstripping." },
  { id: "metal_doors", category: "Structural & Architectural", name: "Metal Doors (Utility/Basement)", desc: "Hollow metal doors serving mechanical rooms, storage, and utility spaces." },
  { id: "fascia_trim", category: "Structural & Architectural", name: "Wood Fascia and Trim", desc: "Decorative and protective wood trim elements at roof edges, windows, and architectural transitions." },
  { id: "caulking", category: "Structural & Architectural", name: "Caulking / Sealants", desc: "Exterior joint sealants at windows, doors, penetrations, and cladding interfaces." },
  { id: "wood_stairs", category: "Structural & Architectural", name: "Exterior Wood Stairs", desc: "Wood-framed exterior stair structures serving common areas, decks, and unit entries." },
  { id: "concrete_stairs", category: "Structural & Architectural", name: "Concrete Stairs", desc: "Cast-in-place or precast concrete stair structures at entries and common areas." },
  { id: "terraces", category: "Structural & Architectural", name: "Terraces / Decks", desc: "Common area terrace decks, including structural framing, decking, and waterproofing." },
  { id: "soffits", category: "Structural & Architectural", name: "Soffits", desc: "Soffit panels at roof overhangs and underside of elevated structures." },
  { id: "gutters", category: "Structural & Architectural", name: "Gutters and Downspouts", desc: "Rainwater management system including eavestroughs, downpipes, and splash pads." },
  { id: "shingle_roof", category: "Structural & Architectural", name: "Asphalt Shingle Roof Assembly", desc: "Sloped roof assemblies with asphalt fiberglass shingles, underlayment, and associated flashings." },
  { id: "flat_roof", category: "Structural & Architectural", name: "Bituminous / Flat Roof Assembly", desc: "Low-slope roof assemblies including SBS modified bitumen, TPO, or EPDM membrane systems." },
  { id: "roof_hatch", category: "Structural & Architectural", name: "Roof Access Hatch", desc: "Insulated metal roof hatches providing maintenance access to rooftop areas." },
  { id: "skylights", category: "Structural & Architectural", name: "Skylights", desc: "Fixed or operable skylight units including curb, glazing, and flashing." },
  { id: "chimney_flue", category: "Structural & Architectural", name: "Metal Chimney Flue", desc: "Factory-built metal chimney systems for fireplaces and wood-burning appliances." },
  { id: "exterior_paint", category: "Finishes & Decoration", name: "Exterior Paint / Stain", desc: "Protective and decorative coatings on exterior wood, masonry, and metal surfaces." },
  { id: "interior_finishes", category: "Finishes & Decoration", name: "Interior Common Area Finishes", desc: "Flooring, wall finishes, and ceiling treatments in lobbies, corridors, and amenity spaces." },
  { id: "corridor_carpets", category: "Finishes & Decoration", name: "Common Area Carpets", desc: "Broadloom or carpet tile in corridors, stairwells, and common areas." },
  { id: "makeup_air", category: "Mechanical Systems", name: "Make-up Air Unit (MAU)", desc: "Gas-fired or electric rooftop make-up air unit providing corridor pressurization and ventilation." },
  { id: "exhaust_fan", category: "Mechanical Systems", name: "Fan / Exhaust System", desc: "Parkade and common area ventilation fans, controls, and associated ductwork." },
  { id: "water_dist", category: "Mechanical Systems", name: "Subsurface Domestic Water Distribution", desc: "Underground water supply piping serving the strata development." },
  { id: "domestic_repiping", category: "Mechanical Systems", name: "Domestic Water Re-Piping", desc: "Interior domestic hot and cold water supply piping within the building, including suite piping." },
  { id: "boiler", category: "Mechanical Systems", name: "Boiler / Heating System", desc: "Central heating plant including boilers, heat exchangers, pumps, controls, and distribution piping." },
  { id: "hot_water", category: "Mechanical Systems", name: "Domestic Hot Water Heater / Tank", desc: "Central or suite-level water heating equipment including storage tanks and PRVs." },
  { id: "hvac", category: "Mechanical Systems", name: "HVAC / Heat Pump System", desc: "Heating, ventilation, and air conditioning systems serving common or individual areas." },
  { id: "sump_pump", category: "Mechanical Systems", name: "Sump Pump", desc: "Below-grade drainage sump pump(s) in parkade or crawlspace." },
  { id: "electrical", category: "Electrical Systems", name: "Electrical Service and Distribution", desc: "Main switchgear, panel boards, meter centres, and branch distribution." },
  { id: "gas_sensor", category: "Electrical Systems", name: "Gas Sensor / CO Detection", desc: "Fixed gas detection system in parkade and mechanical rooms." },
  { id: "parkade_lighting", category: "Electrical Systems", name: "Parkade Lighting", desc: "Fluorescent or LED lighting fixtures, controls, and wiring in parking areas." },
  { id: "exterior_lighting", category: "Electrical Systems", name: "Exterior Lighting", desc: "Site and building exterior lighting including fixtures, poles, and controls." },
  { id: "emergency_lighting", category: "Electrical Systems", name: "Emergency Exit / Egress Lighting", desc: "Battery-backed emergency exit signs and egress lighting throughout common areas." },
  { id: "fire_system", category: "Electrical Systems", name: "Fire Alarm System", desc: "Fire alarm panels, detectors, pull stations, and notification devices." },
  { id: "sprinkler_system", category: "Electrical Systems", name: "Sprinkler / Suppression System", desc: "Wet or dry fire suppression sprinkler system including heads, piping, and compressor." },
  { id: "intercom", category: "Electrical Systems", name: "Intercom / Access Control System", desc: "Building entry intercom, key fobs, and access control hardware." },
  { id: "security", category: "Electrical Systems", name: "Security / CCTV System", desc: "Building security cameras, recording equipment, and monitoring hardware." },
  { id: "elevator", category: "Amenities", name: "Elevator", desc: "Passenger elevator cab, mechanical, controls, and hoistway equipment." },
  { id: "mailboxes", category: "Amenities", name: "Mailboxes", desc: "Canada Post approved mail delivery units in common entry areas." },
  { id: "amenity_room", category: "Amenities", name: "Amenity / Clubhouse Room", desc: "Common room, gym, or multipurpose space including finishes and equipment." },
  { id: "guest_suite", category: "Amenities", name: "Guest Suite", desc: "Common property guest accommodation including finishes, furniture, and fixtures." },
  { id: "landscaping", category: "Site Improvements", name: "Landscaping", desc: "Trees, shrubs, groundcover, irrigation, and soft landscaping in common areas." },
  { id: "podium_repairs", category: "Site Improvements", name: "Podium / Foundation Repairs", desc: "Concrete repairs to podium slabs, foundation walls, and below-grade structures." },
  { id: "concrete_patios", category: "Site Improvements", name: "Concrete Patios (Repair)", desc: "Cast-in-place concrete patio slabs in common areas requiring periodic repair." },
  { id: "concrete_walkways", category: "Site Improvements", name: "Concrete Walkways (Repair)", desc: "Pedestrian walkway slabs on common property." },
  { id: "wood_fencing", category: "Site Improvements", name: "Wood Fencing", desc: "Perimeter and privacy wood fencing on common property." },
  { id: "metal_railings", category: "Site Improvements", name: "Exterior Metal / Glazed Railings", desc: "Ornamental and safety railings at stairs, balconies, and walkways." },
  { id: "asphalt_paving", category: "Site Improvements", name: "Asphalt Paving", desc: "Surface parking, driveways, and lanes paved with asphalt concrete." },
  { id: "retaining_walls", category: "Site Improvements", name: "Retaining Walls", desc: "Concrete or masonry retaining structures on common property." },
  { id: "depreciation_report", category: "Report", name: "Depreciation Report (Professional Fee)", desc: "Cost of commissioning a professional depreciation report update as required by the BC Strata Property Act." },
];

const RS_MEANS_ITEMS = [
  { id: "demo_general", category: "Demolition", name: "General Demolition – Light Frame", unit: "SF", rate: 2.85 },
  { id: "demo_concrete", category: "Demolition", name: "Concrete Demolition – Slab", unit: "SF", rate: 6.40 },
  { id: "demo_roofing", category: "Demolition", name: "Roofing Removal – Shingles", unit: "SQ", rate: 85.00 },
  { id: "demo_membrane", category: "Demolition", name: "Membrane Roofing Removal", unit: "SQ", rate: 120.00 },
  { id: "demo_siding", category: "Demolition", name: "Wood / Vinyl Siding Removal", unit: "SF", rate: 1.95 },
  { id: "demo_windows", category: "Demolition", name: "Window Removal", unit: "EA", rate: 145.00 },
  { id: "demo_doors", category: "Demolition", name: "Door Removal", unit: "EA", rate: 85.00 },
  { id: "demo_railing", category: "Demolition", name: "Metal Railing Removal", unit: "LF", rate: 12.50 },
  { id: "conc_flatwork", category: "Concrete", name: "Concrete Flatwork 4\" Slab", unit: "SF", rate: 9.20 },
  { id: "conc_stairs", category: "Concrete", name: "Concrete Stairs – Cast-in-Place", unit: "EA", rate: 3800.00 },
  { id: "conc_repair", category: "Concrete", name: "Concrete Repair – Patching", unit: "SF", rate: 18.50 },
  { id: "conc_crack", category: "Concrete", name: "Crack Injection / Sealing", unit: "LF", rate: 42.00 },
  { id: "waterproof_trafficbearing", category: "Waterproofing", name: "Traffic-Bearing Membrane – Vehicular", unit: "SF", rate: 22.00 },
  { id: "waterproof_pedestrian", category: "Waterproofing", name: "Pedestrian Waterproof Membrane", unit: "SF", rate: 16.50 },
  { id: "waterproof_vinyl_balcony", category: "Waterproofing", name: "Vinyl Sheet Membrane – Balcony", unit: "SF", rate: 19.00 },
  { id: "waterproof_sbs", category: "Waterproofing", name: "SBS Modified Bitumen Roofing", unit: "SQ", rate: 485.00 },
  { id: "waterproof_tpo", category: "Waterproofing", name: "TPO Single-Ply Roofing", unit: "SQ", rate: 420.00 },
  { id: "roofing_shingle", category: "Roofing", name: "Asphalt Shingles – 30yr Architectural", unit: "SQ", rate: 380.00 },
  { id: "roofing_underlay", category: "Roofing", name: "Synthetic Roofing Underlayment", unit: "SQ", rate: 45.00 },
  { id: "roofing_flashing", category: "Roofing", name: "Sheet Metal Flashing", unit: "LF", rate: 28.00 },
  { id: "roofing_ridge", category: "Roofing", name: "Ridge Cap Shingles", unit: "LF", rate: 8.50 },
  { id: "siding_wood", category: "Exterior Cladding", name: "Wood Siding – Cedar Bevel", unit: "SF", rate: 14.20 },
  { id: "siding_vinyl", category: "Exterior Cladding", name: "Vinyl Siding – Undrained", unit: "SF", rate: 8.50 },
  { id: "siding_hardie", category: "Exterior Cladding", name: "Fibre Cement Siding – HardiePlank", unit: "SF", rate: 12.80 },
  { id: "siding_brick", category: "Exterior Cladding", name: "Brick Veneer – Standard", unit: "SF", rate: 32.00 },
  { id: "windows_alum", category: "Windows & Doors", name: "Aluminum Frame Window – Casement", unit: "SF", rate: 85.00 },
  { id: "windows_vinyl", category: "Windows & Doors", name: "Vinyl Frame Window – Double Hung", unit: "SF", rate: 72.00 },
  { id: "door_wood_ext", category: "Windows & Doors", name: "Solid Wood Exterior Door with Frame", unit: "EA", rate: 1850.00 },
  { id: "door_metal", category: "Windows & Doors", name: "Hollow Metal Door with Frame", unit: "EA", rate: 1250.00 },
  { id: "door_garage_wood", category: "Windows & Doors", name: "Wood Garage Door – Sectional 16x7", unit: "EA", rate: 3200.00 },
  { id: "door_garage_overhead", category: "Windows & Doors", name: "Overhead Sectional Parkade Gate", unit: "EA", rate: 8500.00 },
  { id: "caulking_polyurethane", category: "Sealants", name: "Polyurethane Caulking – Exterior Joint", unit: "LF", rate: 4.80 },
  { id: "caulking_silicone", category: "Sealants", name: "Silicone Sealant – Window Perimeter", unit: "LF", rate: 5.50 },
  { id: "paint_exterior", category: "Painting & Coatings", name: "Exterior Paint – 2 Coat System", unit: "SF", rate: 3.20 },
  { id: "paint_stain", category: "Painting & Coatings", name: "Exterior Stain – Penetrating", unit: "SF", rate: 2.80 },
  { id: "paint_metal", category: "Painting & Coatings", name: "Metal Primer + Paint – 2 Coat", unit: "SF", rate: 6.50 },
  { id: "railing_metal", category: "Metals", name: "Aluminum Railing System – Picket", unit: "LF", rate: 185.00 },
  { id: "railing_glass", category: "Metals", name: "Glazed Metal Guardrail System", unit: "LF", rate: 320.00 },
  { id: "railing_steel", category: "Metals", name: "Steel Railing – Powder Coated", unit: "LF", rate: 165.00 },
  { id: "fascia_wood", category: "Carpentry", name: "Wood Fascia Board – 1x8 Cedar", unit: "LF", rate: 18.00 },
  { id: "soffit_wood", category: "Carpentry", name: "Wood Soffit – T&G Cedar", unit: "SF", rate: 16.50 },
  { id: "stair_wood", category: "Carpentry", name: "Wood Exterior Stair – Treated Lumber", unit: "FLIGHT", rate: 2800.00 },
  { id: "gutter_alum", category: "Sheet Metal", name: "Aluminum Eavestrough – 5\" K-Style", unit: "LF", rate: 18.50 },
  { id: "downspout_alum", category: "Sheet Metal", name: "Aluminum Downspout – 3\"x4\"", unit: "LF", rate: 12.00 },
  { id: "skylight_fixed", category: "Skylights", name: "Fixed Skylight Unit – Flat Glass", unit: "EA", rate: 2800.00 },
  { id: "roof_hatch_rs", category: "Roof Accessories", name: "Insulated Roof Access Hatch – 30x54", unit: "EA", rate: 3200.00 },
  { id: "chimney_metal", category: "Mechanical", name: "Factory-Built Metal Chimney – 8\" dia", unit: "LF", rate: 85.00 },
  { id: "makeup_air_unit", category: "Mechanical", name: "Gas-Fired Make-Up Air Unit – Rooftop", unit: "EA", rate: 28000.00 },
  { id: "exhaust_fan_rs", category: "Mechanical", name: "Exhaust Fan – Parkade Jet Fan", unit: "EA", rate: 4500.00 },
  { id: "boiler_unit", category: "Mechanical", name: "Condensing Boiler – High Efficiency", unit: "EA", rate: 18000.00 },
  { id: "dhw_tank", category: "Mechanical", name: "Domestic Hot Water Storage Tank", unit: "EA", rate: 6500.00 },
  { id: "prv_unit", category: "Mechanical", name: "Pressure Reducing Valve (PRV)", unit: "EA", rate: 2200.00 },
  { id: "sump_pump_unit", category: "Mechanical", name: "Sump Pump – Submersible", unit: "EA", rate: 1800.00 },
  { id: "water_pipe", category: "Mechanical", name: "Underground Water Main – 4\" PVC", unit: "LF", rate: 145.00 },
  { id: "repipe_copper", category: "Mechanical", name: "Domestic Water Re-Pipe – Copper per Suite", unit: "EA", rate: 4200.00 },
  { id: "lighting_led_exterior", category: "Electrical", name: "LED Exterior Wall Pack Fixture", unit: "EA", rate: 380.00 },
  { id: "lighting_led_parkade", category: "Electrical", name: "LED Parkade Strip Fixture", unit: "EA", rate: 320.00 },
  { id: "electrical_panel", category: "Electrical", name: "Main Electrical Panel – 200A", unit: "EA", rate: 4800.00 },
  { id: "meter_centre", category: "Electrical", name: "Meter Centre – Multi-Unit", unit: "EA", rate: 9500.00 },
  { id: "gas_sensor_unit", category: "Electrical", name: "Gas Detection Sensor Unit", unit: "EA", rate: 850.00 },
  { id: "fire_alarm_panel", category: "Electrical", name: "Fire Alarm Panel – Addressable", unit: "EA", rate: 22000.00 },
  { id: "sprinkler_head", category: "Electrical", name: "Sprinkler Head Replacement", unit: "EA", rate: 185.00 },
  { id: "emerg_lighting_unit", category: "Electrical", name: "Emergency Exit / Egress Light", unit: "EA", rate: 420.00 },
  { id: "intercom_panel", category: "Electrical", name: "Enterphone / Intercom Panel", unit: "EA", rate: 6500.00 },
  { id: "mailbox_unit", category: "Specialties", name: "Canada Post Mailbox Unit – 8 Slot", unit: "EA", rate: 1200.00 },
  { id: "fencing_wood", category: "Site", name: "Wood Privacy Fence – 6ft Cedar", unit: "LF", rate: 68.00 },
  { id: "asphalt_pave", category: "Site", name: "Asphalt Paving – 3\" Surface Course", unit: "SF", rate: 4.80 },
  { id: "landscaping_general", category: "Site", name: "Landscaping – General Planting", unit: "LS", rate: 1.00 },
  { id: "report_fee", category: "Professional Fees", name: "Depreciation Report Professional Fee", unit: "LS", rate: 1.00 },
];

const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Poor", "Critical"];
const URGENCY_OPTIONS = [
  { value: "short_term", label: "Short Term (≤2 yrs)", color: "#c0392b", bg: "#fde8e8" },
  { value: "medium_term", label: "Medium Term (3–6 yrs)", color: "#d68910", bg: "#fef3e2" },
  { value: "long_term", label: "Long Term (7+ yrs)", color: "#2d6a4f", bg: "#e8f5e9" },
  { value: "ongoing", label: "Ongoing / Maintenance", color: "#1a3a5c", bg: "#e8f0f8" },
];
const CLASS_ESTIMATES = ["Class D (±50%)", "Class C (±30%)", "Class B (±20%)", "Class A (±10%)"];
const CATEGORY_COLORS = {
  "Structural & Architectural": "#1a4a6b",
  "Finishes & Decoration": "#2d6a4f",
  "Mechanical Systems": "#7b3f00",
  "Electrical Systems": "#4a1a6b",
  "Amenities": "#1a5c6b",
  "Site Improvements": "#3d5a00",
  "Report": "#5c3d00",
};
const TEAM_ROLES = ["Lead Author / Reserve Fund Analyst", "Building Envelope Specialist", "Mechanical Engineer", "Electrical Engineer", "Elevator Specialist", "Structural Engineer", "Landscape Consultant", "Reviewer / QA", "Co-Author"];
const DOC_TYPES = ["Architectural Drawings", "Structural Drawings", "Mechanical Drawings", "Electrical Drawings", "Landscape Drawings", "Fire Sprinkler Drawings", "Building Envelope Report", "Previous Depreciation Report", "Financial Statements", "Strata Bylaws / Minutes", "Warranty Documentation", "Maintenance Records", "Other"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 0) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n || 0);
const groupBy = (arr, key) =>
  arr.reduce((acc, item) => { (acc[item[key]] = acc[item[key]] || []).push(item); return acc; }, {});

const DEFAULT_USER = { id: "guest", email: "guest@stratawise.ca", name: "Guest Advisor", role: "Reserve Fund Advisor" };

const newProjectTemplate = () => ({
  id: `proj_${Date.now()}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "draft",
  projectInfo: {
    strataName: "", strataNumber: "", address: "", city: "Vancouver", province: "BC", postalCode: "",
    stories: "", parkingLevels: "", buildingType: "", cladding: "", heating: "", glazing: "",
    builtYear: "", units: "", inspectionDate: "", reportDate: "", firm: "StrataWise Consulting",
    firmAddress: "", firmPhone: "", firmWebsite: "", firmEO: "$2,000,000 per claim",
    advisor: "", advisorDesignations: "", advisorLicense: "", advisorRole: "Lead Author / Reserve Fund Analyst",
    cosigner: "", cosignerDesignations: "", cosignerRole: "Reviewer / QA",
    propertyManager: "", propertyManagerFirm: "", propertyManagerEmail: "",
    previousReportYear: "", reportNumber: "",
    constructionInflation: 3.8, interestRate: 2.0, cpiInflation: 2.0,
    buildingLife: 100, operatingBudget: 0, minBalancePct: 25, componentThreshold: 10000,
    fiscalYearEnd: "December",
    specialNotes: "",
  },
  teamMembers: [],
  documentsReviewed: [],
  buildingHistory: [],
  draftHistory: [],
  components: [],
  financials: {
    years: Array(5).fill(null).map((_, i) => ({
      year: new Date().getFullYear() - 4 + i,
      openingBalance: 0, rfContribution: 0, interest: 0, specialLevy: 0, transferIn: 0, expenditures: {},
    })),
  },
  fundingModel: {
    activeModel: "scenario2",
    scenario2IncreaseType: "fixed_pct",
    scenario2PctIncrease: 14,
    scenario3BoostPct: 50,
    scenario3BoostYears: 8,
  },
});

function useStorage(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const set = useCallback((v) => {
    const resolved = typeof v === "function" ? v(val) : v;
    setVal(resolved);
    try { localStorage.setItem(key, JSON.stringify(resolved)); } catch {}
  }, [key, val]);
  return [val, set];
}

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    building: "M3 21h18M6 21V7l6-4 6 4v14M9 21v-4h6v4M9 9h1m4 0h1M9 13h1m4 0h1",
    plus: "M12 5v14M5 12h14", trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
    dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    chart: "M18 20V10M12 20V4M6 20v-6",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
    check: "M20 6L9 17l-5-5", x: "M18 6L6 18M6 6l12 12",
    info: "M12 8h.01M12 12v4M21 12a9 9 0 11-18 0 9 9 0 0118 0",
    chevron_down: "M6 9l6 6 6-6", chevron_right: "M9 18l6-6-6-6",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    library: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
    finance: "M2 2h20v20H2zM6 12h12M6 8h12M6 16h8",
    folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
    back: "M19 12H5M12 19l-7-7 7-7",
    preview: "M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7zM14 2v5h5M9 9h6M9 13h6M9 17h4",
    warning: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01",
    timeline: "M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83",
    doc: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
    history: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2M3.05 11H1M3.69 6.34l-1.23-.71M7.34 2.69l-.71-1.23",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name] || icons.info} />
    </svg>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [currentUser] = useState(DEFAULT_USER);
  const [projects, setProjects] = useStorage("dr_projects_v5", []);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [view, setView] = useState("dashboard");
  const activeProject = projects.find(p => p.id === activeProjectId);

  const createProject = () => {
    const proj = newProjectTemplate();
    proj.projectInfo.advisor = currentUser.name;
    proj.ownerId = currentUser.id;
    setProjects(prev => [...prev, proj]);
    setActiveProjectId(proj.id);
    setView("editor");
  };
  const updateProject = (updates) => {
    setProjects(prev => prev.map(p => p.id === activeProjectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p));
  };
  const deleteProject = (id) => {
    if (window.confirm("Delete this project permanently?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) { setActiveProjectId(null); setView("dashboard"); }
    }
  };
  const openProject = (id) => { setActiveProjectId(id); setView("editor"); };
  const openPreview = (id) => { setActiveProjectId(id); setView("preview"); };

  if (view === "preview" && activeProject) return <PDFPreview project={activeProject} onBack={() => setView("editor")} />;
  if (view === "editor" && activeProject) {
    return <ReportEditor project={activeProject} onUpdate={updateProject} onBack={() => { setActiveProjectId(null); setView("dashboard"); }} onPreview={() => setView("preview")} currentUser={currentUser} />;
  }
  return <Dashboard currentUser={currentUser} projects={projects.filter(p => p.ownerId === currentUser.id)} onCreate={createProject} onOpen={openProject} onPreview={openPreview} onDelete={deleteProject} />;
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ currentUser, projects, onCreate, onOpen, onPreview, onDelete }) {
  const stats = {
    total: projects.length,
    draft: projects.filter(p => p.status === "draft").length,
    complete: projects.filter(p => p.status === "complete").length,
    totalValue: projects.reduce((s, p) => s + (p.components || []).reduce((cs, c) => cs + (c.totalCost || 0), 0), 0),
  };
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0e8", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #0d2137 100%)", padding: "0 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", padding: "18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "linear-gradient(135deg, #c8a96e, #e8c88e)", borderRadius: 8, padding: "7px 11px", color: "#0d2137", fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>SW</div>
            <div>
              <div style={{ color: "#c8a96e", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>StrataWise</div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>Depreciation Report System</div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ color: "#c8a96e", fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>CUSPAP Compliant · v5</div>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[{ label: "Total Projects", val: stats.total }, { label: "In Progress", val: stats.draft }, { label: "Completed", val: stats.complete }, { label: "Total Assets Analyzed", val: fmt(stats.totalValue) }].map(({ label, val }) => (
            <div key={label} style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#c8a96e", marginBottom: 10 }}>{label}</div>
              <div style={{ fontSize: typeof val === "string" ? 18 : 28, fontWeight: 700, color: "#fff" }}>{val}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0d2137" }}>My Projects</div>
            <div style={{ fontSize: 13, color: "#7a6a5a", marginTop: 2 }}>BC Strata Depreciation Reports — AIC / CUSPAP Standards</div>
          </div>
          <button onClick={onCreate} style={{ background: "#1a3a5c", color: "#c8a96e", border: "none", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Georgia', serif", letterSpacing: 1, fontWeight: 600 }}>
            <Icon name="plus" size={15} /> New Report
          </button>
        </div>
        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fffef8", borderRadius: 16, border: "2px dashed #c8b89a" }}>
            <Icon name="folder" size={48} />
            <div style={{ marginTop: 16, fontSize: 18, color: "#5a4a3a", fontWeight: 600 }}>No reports yet</div>
            <div style={{ fontSize: 13, color: "#8a7a6a", marginTop: 8 }}>Create your first CUSPAP-compliant depreciation report.</div>
            <button onClick={onCreate} style={{ marginTop: 20, background: "#1a3a5c", color: "#c8a96e", border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontFamily: "'Georgia', serif" }}>Create First Report</button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).map(proj => (
              <ProjectCard key={proj.id} project={proj} onOpen={onOpen} onPreview={onPreview} onDelete={onDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, onPreview, onDelete }) {
  const { projectInfo, components, updatedAt, status, id } = project;
  const totalCost = (components || []).reduce((s, c) => s + (c.totalCost || 0), 0);
  const shortTerm = (components || []).filter(c => c.urgency === "short_term").length;
  return (
    <div style={{ background: "#fffef8", border: "1px solid #d8c8b0", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ background: status === "complete" ? "#2d6a4f" : "#1a3a5c", borderRadius: 10, padding: "12px 14px", color: "#fff" }}>
        <Icon name="building" size={24} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1a2a3a" }}>{projectInfo.strataName || "Untitled Strata"}</div>
          <div style={{ background: status === "complete" ? "#e8f5e9" : "#fff8e1", border: `1px solid ${status === "complete" ? "#a5d6a7" : "#ffe082"}`, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: status === "complete" ? "#2d6a4f" : "#7b5e00", letterSpacing: 1, textTransform: "uppercase" }}>{status}</div>
          {shortTerm > 0 && <div style={{ background: "#fde8e8", border: "1px solid #f5b7b1", borderRadius: 20, padding: "2px 10px", fontSize: 10, color: "#c0392b", letterSpacing: 1 }}>{shortTerm} short-term action{shortTerm > 1 ? "s" : ""}</div>}
        </div>
        <div style={{ fontSize: 12, color: "#8a7a6a", display: "flex", gap: 16, flexWrap: "wrap" }}>
          {projectInfo.strataNumber && <span>Plan {projectInfo.strataNumber}</span>}
          {projectInfo.address && <span>{projectInfo.address}, {projectInfo.city}</span>}
          {projectInfo.builtYear && <span>Built {projectInfo.builtYear}</span>}
          {projectInfo.units && <span>{projectInfo.units} units</span>}
          {projectInfo.reportNumber && <span>Report #{projectInfo.reportNumber}</span>}
        </div>
      </div>
      <div style={{ display: "flex", gap: 32, alignItems: "center", flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a5c" }}>{(components || []).length}</div><div style={{ fontSize: 10, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1 }}>Components</div></div>
        <div style={{ textAlign: "center" }}><div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a5c" }}>{fmt(totalCost)}</div><div style={{ fontSize: 10, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1 }}>Total Cost</div></div>
        <div style={{ fontSize: 11, color: "#8a7a6a" }}><div style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={11} /> {new Date(updatedAt).toLocaleDateString("en-CA")}</div></div>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => onPreview(id)} style={{ background: "#f0e8d8", border: "1px solid #c8b89a", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "#5a4a3a", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}><Icon name="preview" size={14} /> Preview</button>
        <button onClick={() => onOpen(id)} style={{ background: "#1a3a5c", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#c8a96e", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "'Georgia', serif" }}><Icon name="edit" size={14} /> Edit</button>
        <button onClick={() => onDelete(id)} style={{ background: "none", border: "1px solid #e8d0d0", borderRadius: 8, padding: "8px 10px", cursor: "pointer", color: "#c0392b" }}><Icon name="trash" size={14} /></button>
      </div>
    </div>
  );
}

// ─── REPORT EDITOR ────────────────────────────────────────────────────────────
function ReportEditor({ project, onUpdate, onBack, onPreview, currentUser }) {
  const [activeTab, setActiveTab] = useState("project");
  const [saveIndicator, setSaveIndicator] = useState(false);
  const autosave = (updates) => { onUpdate(updates); setSaveIndicator(true); setTimeout(() => setSaveIndicator(false), 2000); };

  const tabs = [
    { id: "project", label: "Project Setup", icon: "settings" },
    { id: "team", label: "Team & Scope", icon: "users" },
    { id: "components", label: "Components", icon: "library" },
    { id: "costing", label: "Costing", icon: "dollar" },
    { id: "timeline", label: "Action Plan", icon: "warning" },
    { id: "projections", label: "Projections", icon: "chart" },
    { id: "financials", label: "Financials", icon: "finance" },
    { id: "funding", label: "Funding Models", icon: "chart" },
  ];

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f5f0e8", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #0d2137 100%)", padding: "0 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1440, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0 0" }}>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <Icon name="back" size={14} /> Projects
            </button>
            <div style={{ color: "rgba(200,169,110,0.5)", fontSize: 18 }}>›</div>
            <div>
              <div style={{ color: "#c8a96e", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Editing Report</div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{project.projectInfo.strataName || "Untitled Strata"}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              {saveIndicator && <div style={{ color: "#c8a96e", fontSize: 11, display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={12} /> Saved</div>}
              <button onClick={onPreview} style={{ background: "linear-gradient(135deg, #c8a96e, #b8942a)", border: "none", borderRadius: 8, padding: "9px 20px", color: "#0d2137", cursor: "pointer", fontSize: 12, fontFamily: "'Georgia', serif", fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="preview" size={14} /> Preview Report
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 14, overflowX: "auto" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: activeTab === t.id ? "rgba(200,169,110,0.15)" : "transparent", border: "none", borderBottom: activeTab === t.id ? "3px solid #c8a96e" : "3px solid transparent", color: activeTab === t.id ? "#c8a96e" : "rgba(255,255,255,0.6)", padding: "12px 18px", cursor: "pointer", fontSize: 12, letterSpacing: 1, textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", fontFamily: "'Georgia', serif" }}>
                <Icon name={t.icon} size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "32px" }}>
        {activeTab === "project" && <ProjectSetup info={project.projectInfo} buildingHistory={project.buildingHistory || []} draftHistory={project.draftHistory || []} onChange={info => autosave({ projectInfo: info })} onBuildingHistoryChange={bh => autosave({ buildingHistory: bh })} onDraftHistoryChange={dh => autosave({ draftHistory: dh })} />}
        {activeTab === "team" && <TeamScopeTab teamMembers={project.teamMembers || []} documentsReviewed={project.documentsReviewed || []} projectInfo={project.projectInfo} onTeamChange={tm => autosave({ teamMembers: tm })} onDocsChange={d => autosave({ documentsReviewed: d })} />}
        {activeTab === "components" && <ComponentsTab selected={project.components} onChange={c => autosave({ components: c })} projectInfo={project.projectInfo} />}
        {activeTab === "costing" && <CostingTab components={project.components} onChange={c => autosave({ components: c })} />}
        {activeTab === "timeline" && <ActionPlanTab components={project.components} projectInfo={project.projectInfo} onChange={c => autosave({ components: c })} />}
        {activeTab === "projections" && <ProjectionsTab components={project.components} projectInfo={project.projectInfo} />}
        {activeTab === "financials" && <FinancialsTab financials={project.financials} onChange={f => autosave({ financials: f })} components={project.components} />}
        {activeTab === "funding" && <FundingModelsTab components={project.components} financials={project.financials} projectInfo={project.projectInfo} fundingModel={project.fundingModel} onChange={fm => autosave({ fundingModel: fm })} />}
      </div>
    </div>
  );
}

// ─── PROJECT SETUP ────────────────────────────────────────────────────────────
function ProjectSetup({ info, buildingHistory, draftHistory, onChange, onBuildingHistoryChange, onDraftHistoryChange }) {
  const field = (label, key, type = "text", hint = "") => (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6 }}>{label}</label>
      <input type={type} value={info[key] || ""} onChange={e => onChange({ ...info, [key]: type === "number" ? parseFloat(e.target.value) || 0 : e.target.value })}
        style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
      {hint && <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 4 }}>{hint}</div>}
    </div>
  );
  const addBH = () => onBuildingHistoryChange([...buildingHistory, { id: `bh_${Date.now()}`, year: "", description: "" }]);
  const removeBH = (id) => onBuildingHistoryChange(buildingHistory.filter(h => h.id !== id));
  const updateBH = (id, k, v) => onBuildingHistoryChange(buildingHistory.map(h => h.id === id ? { ...h, [k]: v } : h));
  const addDH = () => onDraftHistoryChange([...draftHistory, { id: `dh_${Date.now()}`, date: "", eventType: "Draft Submitted", description: "", by: "" }]);
  const removeDH = (id) => onDraftHistoryChange(draftHistory.filter(h => h.id !== id));
  const updateDH = (id, k, v) => onDraftHistoryChange(draftHistory.map(h => h.id === id ? { ...h, [k]: v } : h));

  return (
    <div>
      <SectionHeader title="Project Setup" subtitle="Property information, economic parameters, building history, and report submission tracking" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 24 }}>
        <div>
          <Card title="Property Information">
            {field("Strata Corporation Name", "strataName")}
            {field("Strata Plan Number (VAS/BCS/EPS…)", "strataNumber")}
            {field("Report File Number", "reportNumber")}
            {field("Civic Address", "address")}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 10 }}>
              {["city", "province", "postalCode"].map((k, i) => (
                <div key={k} style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6 }}>{["City", "Prov", "Postal"][i]}</label>
                  <input value={info[k] || ""} onChange={e => onChange({ ...info, [k]: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {field("Year Built", "builtYear")}
              {field("Number of Stories", "stories")}
              {field("Number of Strata Units", "units")}
              {field("Parking Levels (B/G)", "parkingLevels")}
            </div>
            {field("Building Type / Description", "buildingType")}
            {field("Cladding System", "cladding")}
            {field("Glazing System", "glazing")}
            {field("Heating System", "heating")}
          </Card>
          <Card title="Property Manager">
            {field("Property Manager Name", "propertyManager")}
            {field("Property Management Firm", "propertyManagerFirm")}
            {field("Property Manager Email", "propertyManagerEmail")}
          </Card>
        </div>
        <div>
          <Card title="Advisor of Record">
            {field("Lead Advisor Name", "advisor")}
            {field("Designations (AACI, RI(BC), CRP…)", "advisorDesignations")}
            {field("Role", "advisorRole")}
            {field("AIC / License Number", "advisorLicense")}
            {field("Firm Name", "firm")}
            {field("Firm Address", "firmAddress")}
            {field("Firm Phone", "firmPhone")}
            {field("Firm Website", "firmWebsite")}
            {field("E&O Insurance Coverage", "firmEO")}
            <div style={{ background: "#f0e8d8", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#5a4a3a", marginBottom: 18 }}>
              Per s.6.2(1)(d) of the BC Strata Property Regulation, the report must disclose qualifications, E&O insurance, and the advisor's relationship to the strata corporation.
            </div>
            {field("Co-signer / Reviewer Name", "cosigner")}
            {field("Co-signer Designations", "cosignerDesignations")}
            {field("Co-signer Role", "cosignerRole")}
          </Card>
          <Card title="Report Dates">
            {field("Site Inspection Date", "inspectionDate", "date")}
            {field("Report Date", "reportDate", "date")}
            {field("Previous Report Year", "previousReportYear")}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6 }}>Fiscal Year End Month</label>
              <select value={info.fiscalYearEnd || "December"} onChange={e => onChange({ ...info, fiscalYearEnd: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif" }}>
                {["January","February","March","April","May","June","July","August","September","October","November","December"].map(m => <option key={m}>{m}</option>)}
              </select>
              <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 4 }}>Following MH convention: fiscal year identified by the calendar year in which it ends.</div>
            </div>
          </Card>
          <Card title="Economic Parameters">
            <div style={{ background: "#f0e8d8", borderRadius: 6, padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#5a4a3a" }}>
              Applied to all 30-year projections. Based on BC construction cost indices, Bank of Canada rates, and StatCan CPI for Metro Vancouver.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[{ label: "Construction Inflation Rate (%)", key: "constructionInflation" }, { label: "Reserve Fund Interest Rate (%)", key: "interestRate" }, { label: "CPI / Contribution Escalation (%)", key: "cpiInflation" }, { label: "Building Economic Life (years)", key: "buildingLife" }, { label: "Annual Operating Budget ($)", key: "operatingBudget" }, { label: "Min Reserve Balance (% of Opex)", key: "minBalancePct" }, { label: "Component Exclusion Threshold ($)", key: "componentThreshold" }].map(({ label, key }) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6 }}>{label}</label>
                  <input type="number" step={0.1} value={info[key] || ""} onChange={e => onChange({ ...info, [key]: parseFloat(e.target.value) || 0 })}
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
                </div>
              ))}
            </div>
            {info.operatingBudget > 0 && (
              <div style={{ background: "#e8f0f8", border: "1px solid #b8d0e8", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#1a3a5c" }}>
                Calculated minimum balance (s.6.1(a)(ii)): <strong>{fmt(info.operatingBudget * (info.minBalancePct || 25) / 100)}</strong> ({info.minBalancePct || 25}% of operating budget)
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Building History */}
      <Card title="Building History — Past Repairs & Replacements">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>
          Document major repair, replacement, and capital project history. This provides context for current effective ages and helps establish component life cycles.
        </div>
        {buildingHistory.map(h => (
          <div key={h.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 40px", gap: 10, marginBottom: 10, alignItems: "start" }}>
            <input placeholder="Year" value={h.year} onChange={e => updateBH(h.id, "year", e.target.value)} style={{ ...iS, fontSize: 13 }} />
            <input placeholder="Description of work completed…" value={h.description} onChange={e => updateBH(h.id, "description", e.target.value)} style={{ ...iS, fontSize: 13 }} />
            <button onClick={() => removeBH(h.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", padding: "10px 0" }}><Icon name="trash" size={14} /></button>
          </div>
        ))}
        <button onClick={addBH} style={{ background: "#f0e8d8", border: "1px dashed #c8b89a", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12, color: "#5a4a3a", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="plus" size={13} /> Add History Entry
        </button>
      </Card>

      {/* Draft History */}
      <Card title="Report Submission & Revision History">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>
          Track draft submissions, client review comments, and authorization to finalize. Required for CUSPAP file documentation.
        </div>
        {draftHistory.map(h => (
          <div key={h.id} style={{ display: "grid", gridTemplateColumns: "130px 180px 1fr 160px 40px", gap: 10, marginBottom: 10, alignItems: "start" }}>
            <input type="date" value={h.date} onChange={e => updateDH(h.id, "date", e.target.value)} style={{ ...iS, fontSize: 12 }} />
            <select value={h.eventType} onChange={e => updateDH(h.id, "eventType", e.target.value)} style={{ ...iS, fontSize: 12 }}>
              {["Draft Submitted", "Client Review Comments", "Revisions Made", "Authorization Received", "Final Report Issued"].map(o => <option key={o}>{o}</option>)}
            </select>
            <input placeholder="Description / notes…" value={h.description} onChange={e => updateDH(h.id, "description", e.target.value)} style={{ ...iS, fontSize: 12 }} />
            <input placeholder="Authorized by" value={h.by} onChange={e => updateDH(h.id, "by", e.target.value)} style={{ ...iS, fontSize: 12 }} />
            <button onClick={() => removeDH(h.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer" }}><Icon name="trash" size={14} /></button>
          </div>
        ))}
        <button onClick={addDH} style={{ background: "#f0e8d8", border: "1px dashed #c8b89a", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12, color: "#5a4a3a", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="plus" size={13} /> Add Submission Entry
        </button>
      </Card>

      {field("Special Notes / Governing Documents", "specialNotes")}
    </div>
  );
}

// ─── TEAM & SCOPE TAB ─────────────────────────────────────────────────────────
function TeamScopeTab({ teamMembers, documentsReviewed, projectInfo, onTeamChange, onDocsChange }) {
  const addMember = () => onTeamChange([...teamMembers, { id: `tm_${Date.now()}`, name: "", designations: "", role: TEAM_ROLES[0], qualifications: "", responsibility: "", isSubConsultant: false, subFirm: "" }]);
  const removeMember = (id) => onTeamChange(teamMembers.filter(m => m.id !== id));
  const updateMember = (id, k, v) => onTeamChange(teamMembers.map(m => m.id === id ? { ...m, [k]: v } : m));
  const addDoc = () => onDocsChange([...documentsReviewed, { id: `doc_${Date.now()}`, type: DOC_TYPES[0], preparedBy: "", date: "", description: "" }]);
  const removeDoc = (id) => onDocsChange(documentsReviewed.filter(d => d.id !== id));
  const updateDoc = (id, k, v) => onDocsChange(documentsReviewed.map(d => d.id === id ? { ...d, [k]: v } : d));

  return (
    <div>
      <SectionHeader title="Project Team & Scope of Work" subtitle="Team qualifications (s.6.2(1)(d) BC Strata Property Regulation), documents reviewed, and CUSPAP scope disclosure" />

      <Card title="Project Team — Qualifications & Areas of Responsibility">
        <div style={{ background: "#f0e8d8", borderRadius: 6, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "#5a4a3a", lineHeight: 1.6 }}>
          <strong>CUSPAP / BC Regulation Requirement:</strong> The report must provide each team member's name, qualifications, E&O insurance coverage, and relationship to the strata corporation. Sub-consultants (elevator, mechanical, structural specialists) must be individually identified.
        </div>
        {/* Lead Advisor auto-populated from projectInfo */}
        <div style={{ background: "#e8f0f8", border: "1px solid #b8d0e8", borderRadius: 8, padding: "14px 18px", marginBottom: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#1a3a5c", marginBottom: 6 }}>Lead Advisor of Record (from Project Setup)</div>
          <div style={{ display: "flex", gap: 24, fontSize: 13 }}>
            <span><strong>{projectInfo.advisor || "[Not set]"}</strong>{projectInfo.advisorDesignations ? `, ${projectInfo.advisorDesignations}` : ""}</span>
            <span style={{ color: "#8a7a6a" }}>{projectInfo.advisorRole || "Lead Author"}</span>
            <span style={{ color: "#8a7a6a" }}>{projectInfo.firm || ""}</span>
            <span style={{ color: "#8a7a6a" }}>E&O: {projectInfo.firmEO || "Not specified"}</span>
          </div>
        </div>

        {teamMembers.map((m, idx) => (
          <div key={m.id} style={{ background: "#fffef8", border: "1px solid #d8c8b0", borderRadius: 8, padding: "16px 18px", marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1 }}>Team Member {idx + 1}</div>
              <button onClick={() => removeMember(m.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer" }}><Icon name="trash" size={14} /></button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 10 }}>
              <div>
                <SubLabel>Full Name</SubLabel>
                <input value={m.name} onChange={e => updateMember(m.id, "name", e.target.value)} style={iS} placeholder="First Last, Credentials" />
              </div>
              <div>
                <SubLabel>Role on this Report</SubLabel>
                <select value={m.role} onChange={e => updateMember(m.id, "role", e.target.value)} style={iS}>
                  {TEAM_ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <SubLabel>Designations / Title</SubLabel>
                <input value={m.designations} onChange={e => updateMember(m.id, "designations", e.target.value)} style={iS} placeholder="P.Eng., EIT, B.Asc…" />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <SubLabel>Professional Qualifications & Experience</SubLabel>
              <textarea value={m.qualifications} onChange={e => updateMember(m.id, "qualifications", e.target.value)} rows={2} style={tS} placeholder="Describe relevant experience, specializations, and years in practice…" />
            </div>
            <div style={{ marginBottom: 10 }}>
              <SubLabel>Areas of Responsibility in this Report</SubLabel>
              <input value={m.responsibility} onChange={e => updateMember(m.id, "responsibility", e.target.value)} style={iS} placeholder="e.g. Mechanical systems sections, reserve fund tables…" />
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={m.isSubConsultant} onChange={e => updateMember(m.id, "isSubConsultant", e.target.checked)} />
                Sub-Consultant (external specialist firm)
              </label>
              {m.isSubConsultant && (
                <input value={m.subFirm} onChange={e => updateMember(m.id, "subFirm", e.target.value)} style={{ ...iS, flex: 1 }} placeholder="Sub-consultant firm name…" />
              )}
            </div>
          </div>
        ))}
        <button onClick={addMember} style={{ background: "#f0e8d8", border: "1px dashed #c8b89a", borderRadius: 6, padding: "10px 20px", cursor: "pointer", fontSize: 12, color: "#5a4a3a", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="plus" size={13} /> Add Team Member
        </button>
      </Card>

      <Card title="Documents Reviewed Prior to Inspection">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>
          List all drawings, reports, and records reviewed as part of the scope of work. This supports the CUSPAP scope of work disclosure and establishes the basis of the assessment.
        </div>
        {documentsReviewed.map(d => (
          <div key={d.id} style={{ display: "grid", gridTemplateColumns: "200px 1fr 120px 180px 40px", gap: 10, marginBottom: 10, alignItems: "start" }}>
            <select value={d.type} onChange={e => updateDoc(d.id, "type", e.target.value)} style={{ ...iS, fontSize: 12 }}>
              {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            <input placeholder="Prepared by / Title…" value={d.description} onChange={e => updateDoc(d.id, "description", e.target.value)} style={{ ...iS, fontSize: 12 }} />
            <input type="date" value={d.date} onChange={e => updateDoc(d.id, "date", e.target.value)} style={{ ...iS, fontSize: 12 }} />
            <input placeholder="Prepared by firm" value={d.preparedBy} onChange={e => updateDoc(d.id, "preparedBy", e.target.value)} style={{ ...iS, fontSize: 12 }} />
            <button onClick={() => removeDoc(d.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer" }}><Icon name="trash" size={14} /></button>
          </div>
        ))}
        <button onClick={addDoc} style={{ background: "#f0e8d8", border: "1px dashed #c8b89a", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontSize: 12, color: "#5a4a3a", display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="plus" size={13} /> Add Document
        </button>
      </Card>

      <Card title="Scope of Work & Inspection Methodology">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <SubLabel>Areas Accessed During Inspection</SubLabel>
            <textarea rows={4} style={tS} placeholder="e.g. Roof, representative corridors, service rooms, parkade, guest suite, site…" />
            <SubLabel>Inspection Limitations</SubLabel>
            <textarea rows={3} style={tS} placeholder="e.g. No interior unit access. No destructive testing or probing performed. Visual inspection only…" />
          </div>
          <div>
            <SubLabel>Accompanied By</SubLabel>
            <textarea rows={2} style={tS} placeholder="e.g. Name, Strata Representative, who provided access…" />
            <SubLabel>Independence Statement</SubLabel>
            <div style={{ background: "#f0e8d8", borderRadius: 6, padding: "10px 14px", fontSize: 12, color: "#5a4a3a", lineHeight: 1.6 }}>
              <em>"{projectInfo.firm || "This firm"} is not associated with the strata corporation beyond being retained to perform professional services. We are not aware of any conflicts of interest."</em>
            </div>
            <SubLabel style={{ marginTop: 10 }}>Conflict of Interest Notes</SubLabel>
            <textarea rows={2} style={tS} placeholder="Additional conflict disclosure, if any…" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── COMPONENTS TAB ───────────────────────────────────────────────────────────
function ComponentsTab({ selected, onChange, projectInfo }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const grouped = groupBy(COMPONENT_LIBRARY, "category");
  const threshold = projectInfo.componentThreshold || 10000;

  const addComponent = (lib) => {
    if (selected.find(s => s.libId === lib.id)) return;
    const newComp = {
      id: `${lib.id}_${Date.now()}`, libId: lib.id, name: lib.name, category: lib.category,
      description: lib.desc, condition: "Good", effectiveAge: 0, lifespan: 20, photos: [],
      conditionAnalysis: "", scopeOfWork: "", possibleDeterioration: "", recommendedAction: "",
      urgency: "long_term", classEstimate: "Class D (±50%)",
      costItems: [], demolitionPct: 10, taxPct: 5, contingencyPct: 15, budgetPct: 100, totalCost: 0,
    };
    onChange([...selected, newComp]);
    setExpandedId(newComp.id);
    setShowLibrary(false);
  };
  const removeComponent = (id) => onChange(selected.filter(c => c.id !== id));
  const updateComponent = (id, updates) => onChange(selected.map(c => c.id === id ? { ...c, ...updates } : c));

  return (
    <div>
      <SectionHeader title="Building Components" subtitle={`Components with estimated current cost above $${threshold.toLocaleString()} only (s.6.2 BC Strata Property Regulation)`} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: "#5a4a3a" }}>{selected.length} component{selected.length !== 1 ? "s" : ""} selected · <span style={{ color: "#1a3a5c", fontWeight: 700 }}>{fmt(selected.reduce((s, c) => s + (c.totalCost || 0), 0))}</span> total current replacement cost</div>
        <button onClick={() => setShowLibrary(!showLibrary)} style={{ background: "#1a3a5c", color: "#c8a96e", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Georgia', serif" }}>
          <Icon name="plus" size={14} /> Add from Library
        </button>
      </div>
      {showLibrary && (
        <Card title="Component Library" style={{ marginBottom: 24 }}>
          {Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: CATEGORY_COLORS[cat] || "#5a4a3a", marginBottom: 10, fontWeight: 700, borderBottom: "1px solid #e0d8cc", paddingBottom: 6 }}>{cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 8 }}>
                {items.map(item => {
                  const already = selected.find(s => s.libId === item.id);
                  return (
                    <button key={item.id} onClick={() => !already && addComponent(item)} disabled={!!already} style={{ background: already ? "#e8e0d0" : "#fffef8", border: `1px solid ${already ? "#c8b89a" : "#c8a96e"}`, borderRadius: 6, padding: "10px 14px", cursor: already ? "not-allowed" : "pointer", textAlign: "left", opacity: already ? 0.6 : 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a3a5c" }}>{item.name}</div>
                      <div style={{ fontSize: 11, color: "#7a6a5a", marginTop: 3 }}>{item.desc.slice(0, 60)}…</div>
                      {already && <div style={{ fontSize: 10, color: "#c8a96e", marginTop: 4, letterSpacing: 1, textTransform: "uppercase" }}>✓ Added</div>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </Card>
      )}
      {selected.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#8a7a6a", background: "#fffef8", borderRadius: 12, border: "2px dashed #c8b89a" }}>
          <Icon name="building" size={40} />
          <div style={{ marginTop: 16, fontSize: 16 }}>No components added yet</div>
        </div>
      ) : selected.map((comp, idx) => (
        <ComponentCard key={comp.id} comp={comp} idx={idx} expanded={expandedId === comp.id}
          onToggle={() => setExpandedId(expandedId === comp.id ? null : comp.id)}
          onUpdate={(u) => updateComponent(comp.id, u)}
          onRemove={() => removeComponent(comp.id)} />
      ))}
    </div>
  );
}

function ComponentCard({ comp, idx, expanded, onToggle, onUpdate, onRemove }) {
  const remaining = Math.max(0, comp.lifespan - comp.effectiveAge);
  const pctUsed = Math.min(100, (comp.effectiveAge / comp.lifespan) * 100);
  const catColor = CATEGORY_COLORS[comp.category] || "#1a3a5c";
  const urgInfo = URGENCY_OPTIONS.find(u => u.value === comp.urgency) || URGENCY_OPTIONS[2];
  return (
    <div style={{ background: "#fffef8", border: "1px solid #d8c8b0", borderRadius: 12, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer", background: expanded ? "#f5efe0" : "#fffef8" }}>
        <div style={{ background: catColor, color: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700, minWidth: 28, textAlign: "center" }}>{idx + 1}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2a3a" }}>{comp.name}</div>
          <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{comp.category}</div>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center", fontSize: 13 }}>
          <div style={{ background: urgInfo.bg, border: `1px solid ${urgInfo.color}`, borderRadius: 4, padding: "2px 8px", fontSize: 10, color: urgInfo.color, whiteSpace: "nowrap" }}>{urgInfo.label}</div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: catColor }}>{comp.effectiveAge} / {comp.lifespan} yrs</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Age / Life</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: remaining <= 3 ? "#c0392b" : "#2d6a4f" }}>{remaining} yrs</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Remaining</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: "#1a3a5c" }}>{fmt(comp.totalCost)}</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Est. Cost</div></div>
          <div style={{ background: `linear-gradient(90deg, ${catColor} ${pctUsed}%, #e0d8cc ${pctUsed}%)`, width: 80, height: 6, borderRadius: 3 }} />
          <Icon name={expanded ? "chevron_down" : "chevron_right"} size={16} />
          <button onClick={(e) => { e.stopPropagation(); onRemove(); }} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", padding: 4 }}><Icon name="trash" size={14} /></button>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #e8ddd0" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20 }}>
            <div>
              <SubLabel>Component Description</SubLabel>
              <textarea value={comp.description || ""} onChange={e => onUpdate({ description: e.target.value })} rows={3} style={tS} />
              <SubLabel>Condition Rating</SubLabel>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {CONDITION_OPTIONS.map(c => (
                  <button key={c} onClick={() => onUpdate({ condition: c })} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${comp.condition === c ? "#1a3a5c" : "#c8b89a"}`, background: comp.condition === c ? "#1a3a5c" : "#fffef8", color: comp.condition === c ? "#fff" : "#5a4a3a", cursor: "pointer", fontSize: 12 }}>{c}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div><SubLabel>Effective Age (yrs)</SubLabel><input type="number" value={comp.effectiveAge} onChange={e => onUpdate({ effectiveAge: parseInt(e.target.value) || 0 })} style={iS} /></div>
                <div><SubLabel>Expected Lifespan (yrs)</SubLabel><input type="number" value={comp.lifespan} onChange={e => onUpdate({ lifespan: parseInt(e.target.value) || 1 })} style={iS} /></div>
              </div>
              <SubLabel>Urgency / Timing</SubLabel>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {URGENCY_OPTIONS.map(u => (
                  <button key={u.value} onClick={() => onUpdate({ urgency: u.value })} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${u.color}`, background: comp.urgency === u.value ? u.color : "#fffef8", color: comp.urgency === u.value ? "#fff" : u.color, cursor: "pointer", fontSize: 11 }}>{u.label}</button>
                ))}
              </div>
              <SubLabel>Cost Estimate Class</SubLabel>
              <select value={comp.classEstimate || "Class D (±50%)"} onChange={e => onUpdate({ classEstimate: e.target.value })} style={iS}>
                {CLASS_ESTIMATES.map(c => <option key={c}>{c}</option>)}
              </select>
              <SubLabel>Photos</SubLabel>
              <PhotoUpload photos={comp.photos || []} onUpdate={(photos) => onUpdate({ photos })} />
            </div>
            <div>
              <SubLabel>Condition Analysis</SubLabel>
              <textarea value={comp.conditionAnalysis || ""} onChange={e => onUpdate({ conditionAnalysis: e.target.value })} placeholder="Describe observed conditions, deficiencies, signs of deterioration…" rows={3} style={tS} />
              <SubLabel>Scope of Work</SubLabel>
              <textarea value={comp.scopeOfWork || ""} onChange={e => onUpdate({ scopeOfWork: e.target.value })} placeholder="Describe anticipated scope of repair or replacement…" rows={3} style={tS} />
              <SubLabel>Possible Deterioration if Deferred</SubLabel>
              <textarea value={comp.possibleDeterioration || ""} onChange={e => onUpdate({ possibleDeterioration: e.target.value })} placeholder="How may this component deteriorate if work is deferred beyond the recommended time…" rows={2} style={tS} />
              <SubLabel>Recommended Action</SubLabel>
              <textarea value={comp.recommendedAction || ""} onChange={e => onUpdate({ recommendedAction: e.target.value })} placeholder="Recommended maintenance, studies, or capital actions…" rows={2} style={tS} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoUpload({ photos, onUpdate }) {
  const handleFile = (e) => {
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => onUpdate([...photos, { src: ev.target.result, caption: file.name }]);
      reader.readAsDataURL(file);
    });
  };
  return (
    <div>
      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", background: "#f5efe0", border: "1px solid #c8b89a", borderRadius: 6, padding: "8px 16px", fontSize: 12, color: "#5a4a3a" }}>
        <Icon name="upload" size={14} /> Upload Photos
        <input type="file" accept="image/*" multiple onChange={handleFile} style={{ display: "none" }} />
      </label>
      {photos.length > 0 && (
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {photos.map((p, i) => (
            <div key={i} style={{ position: "relative" }}>
              <img src={p.src} alt={p.caption} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #c8b89a" }} />
              <button onClick={() => onUpdate(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, background: "#c0392b", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 10 }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── COSTING TAB ──────────────────────────────────────────────────────────────
function CostingTab({ components, onChange }) {
  const [activeComp, setActiveComp] = useState(components[0]?.id || null);
  const [rsMeansSearch, setRsMeansSearch] = useState("");
  const comp = components.find(c => c.id === activeComp);
  const updateComp = (updates) => onChange(components.map(c => c.id === activeComp ? recalcCost({ ...c, ...updates }) : c));
  const addCostItem = (item) => updateComp({ costItems: [...(comp.costItems || []), { ...item, qty: 1, id: `${item.id}_${Date.now()}` }] });
  const updateCostItem = (itemId, updates) => updateComp({ costItems: comp.costItems.map(i => i.id === itemId ? { ...i, ...updates } : i) });
  const removeCostItem = (itemId) => updateComp({ costItems: comp.costItems.filter(i => i.id !== itemId) });
  const filteredRS = RS_MEANS_ITEMS.filter(i => !rsMeansSearch || i.name.toLowerCase().includes(rsMeansSearch.toLowerCase()) || i.category.toLowerCase().includes(rsMeansSearch.toLowerCase()));
  const rsGrouped = groupBy(filteredRS, "category");
  if (components.length === 0) return <div style={{ textAlign: "center", padding: 80, color: "#8a7a6a" }}>Add components first in the Components tab.</div>;
  return (
    <div>
      <SectionHeader title="Component Costing" subtitle="Build cost estimates from RS Means (Metro Vancouver adjusted) with demolition, GST, and contingency. All estimates are Class D (±50%) unless noted." />
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        <Card title="Components">
          {components.map((c, i) => (
            <button key={c.id} onClick={() => setActiveComp(c.id)} style={{ width: "100%", textAlign: "left", background: activeComp === c.id ? "#f0e8d8" : "transparent", border: "none", borderLeft: `3px solid ${activeComp === c.id ? "#1a3a5c" : "transparent"}`, padding: "10px 14px", cursor: "pointer", marginBottom: 4, borderRadius: "0 6px 6px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2a3a" }}>{i + 1}. {c.name}</div>
              <div style={{ fontSize: 12, color: "#8a7a6a", marginTop: 2 }}>{fmt(c.totalCost)} · {c.classEstimate || "Class D"}</div>
            </button>
          ))}
        </Card>
        {comp && (
          <Card title={`Costing: ${comp.name}`}>
            <div style={{ marginBottom: 20 }}>
              <SubLabel>Search RS Means Database (Metro Vancouver Adjusted)</SubLabel>
              <input placeholder="Search…" value={rsMeansSearch} onChange={e => setRsMeansSearch(e.target.value)} style={{ ...iS, marginBottom: 10 }} />
              <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #e0d8cc", borderRadius: 8, background: "#f8f4ec" }}>
                {Object.entries(rsGrouped).map(([cat, items]) => (
                  <div key={cat}>
                    <div style={{ padding: "6px 12px", background: "#e8ddd0", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", fontWeight: 700 }}>{cat}</div>
                    {items.map(item => (
                      <div key={item.id} style={{ display: "flex", alignItems: "center", padding: "7px 12px", borderBottom: "1px solid #ede8e0", gap: 12 }}>
                        <div style={{ flex: 1 }}><div style={{ fontSize: 12 }}>{item.name}</div><div style={{ fontSize: 11, color: "#8a7a6a" }}>{item.unit} @ {fmt(item.rate, 2)}</div></div>
                        <button onClick={() => addCostItem(item)} style={{ background: "#1a3a5c", color: "#fff", border: "none", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: 11 }}>+ Add</button>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            {comp.costItems?.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <SubLabel>Cost Breakdown</SubLabel>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead><tr style={{ background: "#e8ddd0" }}>{["Description", "Unit", "Unit Rate", "Qty", "Subtotal", ""].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: h === "" ? "center" : "left", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: "#5a4a3a" }}>{h}</th>)}</tr></thead>
                  <tbody>
                    {comp.costItems.map(item => (
                      <tr key={item.id} style={{ borderBottom: "1px solid #ede8e0" }}>
                        <td style={{ padding: "8px 12px" }}>{item.name}</td>
                        <td style={{ padding: "8px 12px", color: "#8a7a6a" }}>{item.unit}</td>
                        <td style={{ padding: "8px 12px" }}>{fmt(item.rate, 2)}</td>
                        <td style={{ padding: "8px 6px" }}><input type="number" value={item.qty} min={0} step={0.01} onChange={e => updateCostItem(item.id, { qty: parseFloat(e.target.value) || 0 })} style={{ width: 80, padding: "4px 8px", border: "1px solid #c8b89a", borderRadius: 4, fontSize: 13 }} /></td>
                        <td style={{ padding: "8px 12px", fontWeight: 700, color: "#1a3a5c" }}>{fmt((item.rate || 0) * (item.qty || 0))}</td>
                        <td style={{ textAlign: "center" }}><button onClick={() => removeCostItem(item.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer" }}><Icon name="x" size={14} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
              {[{ label: "Demolition (%)", key: "demolitionPct" }, { label: "GST / Tax (%)", key: "taxPct" }, { label: "Contingency (%)", key: "contingencyPct" }, { label: "Budget % Applied", key: "budgetPct" }].map(({ label, key }) => (
                <div key={key}><SubLabel>{label}</SubLabel><input type="number" step={0.5} value={comp[key] ?? 0} onChange={e => updateComp({ [key]: parseFloat(e.target.value) || 0 })} style={iS} /></div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <SubLabel>Cost Estimate Classification</SubLabel>
              <select value={comp.classEstimate || "Class D (±50%)"} onChange={e => updateComp({ classEstimate: e.target.value })} style={iS}>
                {CLASS_ESTIMATES.map(c => <option key={c}>{c}</option>)}
              </select>
              <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 4 }}>Per industry standard: Class D (±50%) is appropriate for most long-range budget estimates. Actual costs require competitive contractor quotes at time of tendering.</div>
            </div>
            <CostSummary comp={comp} />
          </Card>
        )}
      </div>
    </div>
  );
}

function recalcCost(comp) {
  const base = (comp.costItems || []).reduce((sum, i) => sum + (i.rate || 0) * (i.qty || 0), 0);
  const withDemo = base * (1 + (comp.demolitionPct || 0) / 100);
  const withTax = withDemo * (1 + (comp.taxPct || 0) / 100);
  const withCont = withTax * (1 + (comp.contingencyPct || 0) / 100);
  return { ...comp, totalCost: withCont * ((comp.budgetPct ?? 100) / 100) };
}

function CostSummary({ comp }) {
  const base = (comp.costItems || []).reduce((sum, i) => sum + (i.rate || 0) * (i.qty || 0), 0);
  const withDemo = base * (1 + (comp.demolitionPct || 0) / 100);
  const withTax = withDemo * (1 + (comp.taxPct || 0) / 100);
  const withCont = withTax * (1 + (comp.contingencyPct || 0) / 100);
  const total = withCont * ((comp.budgetPct ?? 100) / 100);
  return (
    <div style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 12, padding: 24, color: "#fff" }}>
      <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#c8a96e", marginBottom: 14 }}>Cost Summary — {comp.classEstimate || "Class D (±50%)"}</div>
      {[["Base Material & Labour", base], [`+ Demolition/Removal (${comp.demolitionPct || 0}%)`, withDemo - base], [`+ GST (${comp.taxPct || 0}%)`, withTax - withDemo], [`+ Contingency (${comp.contingencyPct || 0}%)`, withCont - withTax], [`× Budget % (${comp.budgetPct ?? 100}%)`, total - withCont]].map(([label, val]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}><span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span><span>{fmt(val)}</span></div>
      ))}
      <div style={{ borderTop: "1px solid rgba(200,169,110,0.4)", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#c8a96e", fontWeight: 700, fontSize: 14 }}>TOTAL CURRENT COST ESTIMATE</span>
        <span style={{ color: "#c8a96e", fontWeight: 700, fontSize: 20 }}>{fmt(total)}</span>
      </div>
    </div>
  );
}

// ─── ACTION PLAN TAB ──────────────────────────────────────────────────────────
function ActionPlanTab({ components, projectInfo, onChange }) {
  const currentYear = projectInfo.inspectionDate ? new Date(projectInfo.inspectionDate).getFullYear() : new Date().getFullYear();
  const byUrgency = {
    short_term: components.filter(c => c.urgency === "short_term"),
    medium_term: components.filter(c => c.urgency === "medium_term"),
    long_term: components.filter(c => c.urgency === "long_term"),
    ongoing: components.filter(c => c.urgency === "ongoing"),
  };

  return (
    <div>
      <SectionHeader title="Recommended Action Plan" subtitle="Urgency matrix based on component condition, effective age, and remaining useful life — mirrors Morrison Hershfield short/medium/long-term classification" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 28 }}>
        {[
          { key: "short_term", label: "Short Term (Within 2 Years)", color: "#c0392b", bg: "#fde8e8", border: "#f5b7b1", years: `${currentYear}–${currentYear + 2}` },
          { key: "medium_term", label: "Medium Term (Within 6 Years)", color: "#d68910", bg: "#fef3e2", border: "#f9d79d", years: `${currentYear + 3}–${currentYear + 6}` },
          { key: "long_term", label: "Long Term (Beyond 6 Years)", color: "#2d6a4f", bg: "#e8f5e9", border: "#a9dfbf", years: `${currentYear + 7}+` },
          { key: "ongoing", label: "Ongoing / Maintenance", color: "#1a3a5c", bg: "#e8f0f8", border: "#b8d0e8", years: "As required" },
        ].map(({ key, label, color, bg, border, years }) => (
          <div key={key} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color, fontFamily: "'Georgia', serif" }}>{label}</div>
                <div style={{ fontSize: 11, color, opacity: 0.7, letterSpacing: 1 }}>{years}</div>
              </div>
              <div style={{ background: color, color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>{byUrgency[key].length} items</div>
            </div>
            {byUrgency[key].length === 0 ? (
              <div style={{ fontSize: 12, color, opacity: 0.5, fontStyle: "italic" }}>No items assigned</div>
            ) : (
              <div>
                {byUrgency[key].map(c => (
                  <div key={c.id} style={{ background: "rgba(255,255,255,0.6)", borderRadius: 6, padding: "8px 12px", marginBottom: 6, fontSize: 12 }}>
                    <div style={{ fontWeight: 600, color: "#1a2a3a" }}>{c.name}</div>
                    <div style={{ color: "#5a4a3a", marginTop: 2 }}>{c.recommendedAction || c.conditionAnalysis || "— No recommendation entered —"}</div>
                    <div style={{ color, fontWeight: 700, marginTop: 4 }}>{fmt(c.totalCost)} ({c.classEstimate || "Class D"})</div>
                  </div>
                ))}
                <div style={{ fontSize: 11, color, fontWeight: 700, marginTop: 8, textAlign: "right" }}>
                  Total: {fmt(byUrgency[key].reduce((s, c) => s + (c.totalCost || 0), 0))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <Card title="Urgency Assignment — Quick Edit">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>Quickly reassign urgency for all components without opening individual component cards.</div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ background: "#1a3a5c" }}>{["#", "Component", "Condition", "Remaining Life", "Current Cost", "Urgency"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: "#c8a96e", fontSize: 10, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>
            {components.map((c, i) => {
              const urgInfo = URGENCY_OPTIONS.find(u => u.value === c.urgency) || URGENCY_OPTIONS[2];
              return (
                <tr key={c.id} style={{ background: i % 2 === 0 ? "#fffef8" : "#f5f0e8", borderBottom: "1px solid #ede8e0" }}>
                  <td style={{ padding: "8px 12px", color: "#8a7a6a" }}>{i + 1}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1a2a3a" }}>{c.name}</td>
                  <td style={{ padding: "8px 12px" }}><span style={{ background: c.condition === "Critical" || c.condition === "Poor" ? "#fde8e8" : "#e8f5e9", color: c.condition === "Critical" || c.condition === "Poor" ? "#c0392b" : "#2d6a4f", padding: "2px 8px", borderRadius: 4, fontSize: 11 }}>{c.condition}</span></td>
                  <td style={{ padding: "8px 12px", color: Math.max(0, c.lifespan - c.effectiveAge) <= 3 ? "#c0392b" : "#2d6a4f", fontWeight: 600 }}>{Math.max(0, c.lifespan - c.effectiveAge)} yrs</td>
                  <td style={{ padding: "8px 12px" }}>{fmt(c.totalCost)}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <select value={c.urgency || "long_term"} onChange={e => onChange(components.map(comp => comp.id === c.id ? { ...comp, urgency: e.target.value } : comp))} style={{ padding: "4px 8px", border: `1px solid ${urgInfo.color}`, borderRadius: 4, background: urgInfo.bg, color: urgInfo.color, fontSize: 11, fontFamily: "'Georgia', serif" }}>
                      {URGENCY_OPTIONS.map(u => <option key={u.value} value={u.value}>{u.label}</option>)}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ─── PROJECTIONS TAB ──────────────────────────────────────────────────────────
function ProjectionsTab({ components, projectInfo }) {
  const currentYear = projectInfo.inspectionDate ? new Date(projectInfo.inspectionDate).getFullYear() : new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear + i + 1);
  const inflationRate = (projectInfo.constructionInflation || 3.8) / 100;
  const projections = components.map(comp => {
    const remaining = Math.max(0, comp.lifespan - comp.effectiveAge);
    const occurrences = [];
    let nextYear = currentYear + remaining;
    while (nextYear <= currentYear + 30) {
      occurrences.push({ year: nextYear, cost: (comp.totalCost || 0) * Math.pow(1 + inflationRate, nextYear - currentYear) });
      nextYear += comp.lifespan;
    }
    return { ...comp, occurrences };
  });
  const yearTotals = years.map(yr => projections.reduce((sum, c) => { const occ = c.occurrences.find(o => o.year === yr); return sum + (occ ? occ.cost : 0); }, 0));
  const maxTotal = Math.max(...yearTotals, 1);

  return (
    <div>
      <SectionHeader title="Projected Expenditures" subtitle={`30-year forecast at ${projectInfo.constructionInflation || 3.8}% construction cost inflation. All expenditures presented as future inflated dollars (Class D estimates).`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12, marginBottom: 24 }}>
        {[0, 1, 2, 3, 4].map(decade => {
          const decadeYears = years.slice(decade * 6, decade * 6 + 6);
          const decadeTotal = decadeYears.reduce((s, yr) => s + (yearTotals[years.indexOf(yr)] || 0), 0);
          return (
            <div key={decade} style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 10, padding: "14px 16px", color: "#fff" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "#c8a96e", textTransform: "uppercase", marginBottom: 6 }}>Years {decade * 6 + 1}–{Math.min(decade * 6 + 6, 30)}</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{fmt(decadeTotal)}</div>
            </div>
          );
        })}
      </div>
      {/* Bar chart */}
      <Card title="Annual Expenditure Overview">
        <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 100, marginBottom: 8 }}>
          {yearTotals.map((t, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: "100%", background: t > 0 ? `linear-gradient(180deg, #c8a96e, #1a3a5c)` : "#e0d8cc", height: `${(t / maxTotal) * 90}px`, borderRadius: "2px 2px 0 0", minHeight: t > 0 ? 4 : 0 }} title={`${years[i]}: ${fmt(t)}`} />
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {years.map((y, i) => <div key={i} style={{ flex: 1, fontSize: 8, textAlign: "center", color: "#8a7a6a", transform: "rotate(-45deg)", transformOrigin: "center" }}>{y}</div>)}
        </div>
      </Card>
      <Card title="30-Year Expenditure Schedule">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#1a3a5c" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#c8a96e", fontWeight: 700, letterSpacing: 1, position: "sticky", left: 0, background: "#1a3a5c", minWidth: 200 }}>Component</th>
                {years.map(y => <th key={y} style={{ padding: "10px 8px", color: "#fff", fontWeight: 600, textAlign: "center", minWidth: 68 }}>{y}</th>)}
              </tr>
            </thead>
            <tbody>
              {projections.map((comp, i) => (
                <tr key={comp.id} style={{ background: i % 2 === 0 ? "#fffef8" : "#f5f0e8" }}>
                  <td style={{ padding: "8px 12px", fontSize: 12, position: "sticky", left: 0, background: i % 2 === 0 ? "#fffef8" : "#f5f0e8" }}>
                    <div style={{ fontWeight: 600, color: "#1a2a3a" }}>{i + 1}. {comp.name}</div>
                    <div style={{ color: "#8a7a6a", fontSize: 10 }}>{fmt(comp.totalCost)} · {comp.lifespan}yr life</div>
                  </td>
                  {years.map(yr => { const occ = comp.occurrences.find(o => o.year === yr); return <td key={yr} style={{ padding: "6px 4px", textAlign: "center" }}>{occ ? <div style={{ background: "linear-gradient(135deg, #1a3a5c, #2a5a8c)", color: "#fff", borderRadius: 4, padding: "4px 2px", fontSize: 10, fontWeight: 700 }}>{fmt(occ.cost / 1000, 0)}K</div> : ""}</td>; })}
                </tr>
              ))}
              <tr style={{ background: "#e8ddd0", fontWeight: 700 }}>
                <td style={{ padding: "10px 12px", color: "#1a3a5c", textTransform: "uppercase", letterSpacing: 1, fontSize: 11, position: "sticky", left: 0, background: "#e8ddd0" }}>Total Expenditures</td>
                {yearTotals.map((t, i) => <td key={i} style={{ padding: "8px 4px", textAlign: "center" }}>{t > 0 ? <span style={{ color: "#c0392b", fontSize: 11, fontWeight: 700 }}>{fmt(t / 1000, 0)}K</span> : ""}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ─── FINANCIALS TAB ───────────────────────────────────────────────────────────
function FinancialsTab({ financials, onChange, components }) {
  const updateYear = (idx, updates) => {
    const years = financials.years.map((y, i) => {
      if (i !== idx) return y;
      const updated = { ...y, ...updates };
      const inc = (updated.rfContribution || 0) + (updated.interest || 0) + (updated.specialLevy || 0) + (updated.transferIn || 0);
      const exp = Object.values(updated.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      updated.closingBalance = (updated.openingBalance || 0) + inc - exp;
      return updated;
    });
    for (let i = 1; i < years.length; i++) {
      const inc = (years[i].rfContribution || 0) + (years[i].interest || 0) + (years[i].specialLevy || 0) + (years[i].transferIn || 0);
      const exp = Object.values(years[i].expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
      years[i].openingBalance = years[i - 1].closingBalance || 0;
      years[i].closingBalance = years[i].openingBalance + inc - exp;
    }
    onChange({ ...financials, years });
  };
  return (
    <div>
      <SectionHeader title="Historical & Current Financial Analysis" subtitle="5-year reserve fund history — fiscal year identified by the calendar year in which it ends (following CMHC/MH convention)" />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#1a3a5c" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#c8a96e", letterSpacing: 1, fontSize: 11, textTransform: "uppercase", minWidth: 220 }}>Item</th>
              {financials.years.map((y, i) => (
                <th key={i} style={{ padding: "12px 12px", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "right", minWidth: 150 }}>
                  FY {y.year}
                  {i === financials.years.length - 1 && <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: 1 }}>REPORT YEAR</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <FinRow label="Opening Balance" bgColor="#e8ddd0" bold>
              {financials.years.map((y, i) => <td key={i} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1a3a5c", background: "#e8ddd0" }}><input type="number" value={y.openingBalance || ""} onChange={e => updateYear(i, { openingBalance: parseFloat(e.target.value) || 0 })} style={mIS} disabled={i > 0} /></td>)}
            </FinRow>
            <FinSectionLabel label="Reserve Fund Income" />
            {[{ key: "rfContribution", label: "Annual CRF Contribution" }, { key: "specialLevy", label: "Special Levy / Other Contributions" }, { key: "interest", label: "Interest Income" }, { key: "transferIn", label: "Transfer In / (Out)" }].map(({ key, label }) => (
              <FinRow key={key} label={label}>
                {financials.years.map((y, i) => <td key={i} style={{ padding: "8px 12px", textAlign: "right" }}><input type="number" value={y[key] || ""} onChange={e => updateYear(i, { [key]: parseFloat(e.target.value) || 0 })} style={mIS} /></td>)}
              </FinRow>
            ))}
            <FinSectionLabel label="Reserve Fund Expenditures" />
            {components.map(comp => (
              <FinRow key={comp.id} label={comp.name} indent>
                {financials.years.map((y, i) => <td key={i} style={{ padding: "6px 12px", textAlign: "right" }}><input type="number" value={y.expenditures?.[comp.id] || ""} onChange={e => updateYear(i, { expenditures: { ...(y.expenditures || {}), [comp.id]: parseFloat(e.target.value) || 0 } })} style={mIS} placeholder="0" /></td>)}
              </FinRow>
            ))}
            <FinRow label="Other / Miscellaneous" indent>
              {financials.years.map((y, i) => <td key={i} style={{ padding: "6px 12px", textAlign: "right" }}><input type="number" value={y.expenditures?.misc || ""} onChange={e => updateYear(i, { expenditures: { ...(y.expenditures || {}), misc: parseFloat(e.target.value) || 0 } })} style={mIS} placeholder="0" /></td>)}
            </FinRow>
            <FinRow label="Total Expenditures" bgColor="#f5efe0" bold>
              {financials.years.map((y, i) => { const t = Object.values(y.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0); return <td key={i} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#c0392b", background: "#f5efe0" }}>{fmt(t)}</td>; })}
            </FinRow>
            <FinRow label="Closing Balance" bgColor="#1a3a5c" bold dark>
              {financials.years.map((y, i) => { const inc = (y.rfContribution || 0) + (y.interest || 0) + (y.specialLevy || 0) + (y.transferIn || 0); const exp = Object.values(y.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0); const cl = (y.openingBalance || 0) + inc - exp; return <td key={i} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, fontSize: 14, color: cl >= 0 ? "#c8a96e" : "#ff6b6b", background: "#1a3a5c" }}>{fmt(cl)}</td>; })}
            </FinRow>
          </tbody>
        </table>
      </div>
    </div>
  );
}
function FinRow({ label, children, bgColor, bold, dark, indent }) {
  return (
    <tr style={{ background: bgColor || "transparent" }}>
      <td style={{ padding: indent ? "7px 16px 7px 32px" : "10px 16px", fontFamily: "'Georgia', serif", fontSize: indent ? 12 : 13, fontWeight: bold ? 700 : 400, color: dark ? "#c8a96e" : "#1a2a3a" }}>{label}</td>
      {children}
    </tr>
  );
}
function FinSectionLabel({ label }) {
  return <tr><td colSpan={100} style={{ padding: "10px 16px 6px", background: "#f0e8d8", fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a" }}>{label}</td></tr>;
}

// ─── CHART HELPERS ────────────────────────────────────────────────────────────
function FundingChart({ schedules, years, title, valueMode = "nominal", cpiInflation = 0.02, currentYear }) {
  // valueMode: "nominal" or "real"
  const W = 700, H = 260, PAD = { top: 20, right: 20, bottom: 50, left: 82 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const deflate = (val, i) => valueMode === "real" ? val / Math.pow(1 + cpiInflation, i + 1) : val;

  const s1 = schedules.scenario1, s2 = schedules.scenario2, s3 = schedules.scenario3;

  // Build series data
  const series = [
    { key: "s1_bal", label: "Min Funding — Closing Balance", color: "#2563eb", dash: "none", data: s1.map((r, i) => deflate(r.closingBalance, i)) },
    { key: "s2_bal", label: "Adequate — Closing Balance", color: "#16a34a", dash: "none", data: s2.map((r, i) => deflate(r.closingBalance, i)) },
    { key: "s3_bal", label: "Full Funding — Closing Balance", color: "#9333ea", dash: "none", data: s3.map((r, i) => deflate(r.closingBalance, i)) },
    { key: "s2_ideal", label: "Ideal Closing Balance", color: "#2563eb", dash: "6,4", data: s2.map((r, i) => deflate(r.closingBalance * 1.18, i)) },
  ];
  const expendData = s2.map((r, i) => deflate(r.expenditure, i));
  const specialData = s2.map((r, i) => deflate(r.otherContrib, i));
  const contribData = s2.map((r, i) => deflate(r.contribution, i));

  const allVals = [...series.flatMap(s => s.data), ...expendData, ...contribData];
  const maxVal = Math.max(...allVals, 1);

  const xScale = (i) => PAD.left + (i / (years.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - (Math.max(0, v) / maxVal) * chartH;

  const polyline = (data, color, dash = "none") => {
    const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${dash === "none" ? "" : dash}" stroke-linejoin="round"/>`;
  };

  const barW = Math.max(2, chartW / years.length * 0.5);

  // Y axis ticks
  const ticks = 5;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (maxVal / ticks) * i);
  const fmtTick = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(0)}`;

  // X axis — show every 3rd year
  const xLabels = years.filter((_, i) => i % 3 === 0);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto;display:block">
  <!-- Grid lines -->
  ${tickVals.map(v => `<line x1="${PAD.left}" y1="${yScale(v)}" x2="${W - PAD.right}" y2="${yScale(v)}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,3"/>`).join("")}
  <!-- Y axis labels -->
  ${tickVals.map(v => `<text x="${PAD.left - 6}" y="${yScale(v) + 4}" text-anchor="end" font-size="9" fill="#6b7280" font-family="Georgia,serif">${fmtTick(v)}</text>`).join("")}
  <!-- X axis labels -->
  ${xLabels.map((yr, idx) => {
    const i = years.indexOf(yr);
    return `<text x="${xScale(i)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="#6b7280" font-family="Georgia,serif">${yr}</text>`;
  }).join("")}
  <!-- Expenditure bars (green) -->
  ${expendData.map((v, i) => v > 0 ? `<rect x="${xScale(i) - barW / 2}" y="${yScale(v)}" width="${barW}" height="${chartH - (yScale(v) - PAD.top)}" fill="#22c55e" opacity="0.75"/>` : "").join("")}
  <!-- Special levy bars (red) -->
  ${specialData.map((v, i) => v > 0 ? `<rect x="${xScale(i) - barW / 2}" y="${yScale(v)}" width="${barW}" height="${chartH - (yScale(v) - PAD.top)}" fill="#ef4444" opacity="0.8"/>` : "").join("")}
  <!-- Contribution line (black) -->
  ${polyline(contribData, "#111827", "none")}
  <!-- Balance lines -->
  ${series.map(s => polyline(s.data, s.color, s.dash)).join("")}
  <!-- Axes -->
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + chartH}" stroke="#374151" stroke-width="1.5"/>
  <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" stroke="#374151" stroke-width="1.5"/>
  <!-- Title -->
  <text x="${W / 2}" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#0a1a2e" font-family="Georgia,serif">${title}</text>
  <!-- Legend -->
  <g transform="translate(${PAD.left}, ${H - 14})">
    <rect x="0" y="-7" width="14" height="8" fill="#22c55e" opacity="0.75"/><text x="17" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Expenditures</text>
    <rect x="82" y="-7" width="14" height="8" fill="#ef4444" opacity="0.8"/><text x="99" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Special Levy</text>
    <line x1="170" y1="-3" x2="184" y2="-3" stroke="#2563eb" stroke-width="2"/><text x="187" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Min Funding</text>
    <line x1="255" y1="-3" x2="269" y2="-3" stroke="#16a34a" stroke-width="2"/><text x="272" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Adequate</text>
    <line x1="322" y1="-3" x2="336" y2="-3" stroke="#9333ea" stroke-width="2"/><text x="339" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Full Funding</text>
    <line x1="393" y1="-3" x2="407" y2="-3" stroke="#2563eb" stroke-width="2" stroke-dasharray="5,3"/><text x="410" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Ideal Balance</text>
  </g>
</svg>`;

  return (
    <div style={{ background: "#fff", border: "1px solid #d8c8b0", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

function AnnualContributionsChart({ schedules, years }) {
  const W = 700, H = 240, PAD = { top: 20, right: 20, bottom: 46, left: 82 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const s1contrib = schedules.scenario1.map(r => r.contribution);
  const s2contrib = schedules.scenario2.map(r => r.contribution);
  const s3contrib = schedules.scenario3.map(r => r.contribution);
  const idealContrib = schedules.scenario2.map(r => r.contribution * 0.92);

  const allVals = [...s1contrib, ...s2contrib, ...s3contrib, ...idealContrib];
  const maxVal = Math.max(...allVals, 1);

  const xScale = (i) => PAD.left + (i / (years.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - (Math.max(0, v) / maxVal) * chartH;

  const polyline = (data, color, dash = "") => {
    const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" stroke-linejoin="round"/>`;
  };

  const ticks = 5;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (maxVal / ticks) * i);
  const fmtTick = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(0)}`;
  const xLabels = years.filter((_, i) => i % 3 === 0);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto;display:block">
  ${tickVals.map(v => `<line x1="${PAD.left}" y1="${yScale(v)}" x2="${W - PAD.right}" y2="${yScale(v)}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,3"/>`).join("")}
  ${tickVals.map(v => `<text x="${PAD.left - 6}" y="${yScale(v) + 4}" text-anchor="end" font-size="9" fill="#6b7280" font-family="Georgia,serif">${fmtTick(v)}</text>`).join("")}
  ${xLabels.map(yr => { const i = years.indexOf(yr); return `<text x="${xScale(i)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="#6b7280" font-family="Georgia,serif">${yr}</text>`; }).join("")}
  ${polyline(s1contrib, "#2563eb")}
  ${polyline(s2contrib, "#16a34a")}
  ${polyline(s3contrib, "#c0392b")}
  ${polyline(idealContrib, "#374151", "6,4")}
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + chartH}" stroke="#374151" stroke-width="1.5"/>
  <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" stroke="#374151" stroke-width="1.5"/>
  <text x="${W / 2}" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#0a1a2e" font-family="Georgia,serif">Annual Contributions — All 3 Models</text>
  <g transform="translate(${PAD.left}, ${H - 12})">
    <line x1="0" y1="-3" x2="14" y2="-3" stroke="#2563eb" stroke-width="2"/><text x="17" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Minimum Funding</text>
    <line x1="100" y1="-3" x2="114" y2="-3" stroke="#16a34a" stroke-width="2"/><text x="117" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Adequate Funding</text>
    <line x1="204" y1="-3" x2="218" y2="-3" stroke="#c0392b" stroke-width="2"/><text x="221" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Full Funding</text>
    <line x1="295" y1="-3" x2="309" y2="-3" stroke="#374151" stroke-width="2" stroke-dasharray="6,4"/><text x="312" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Ideal Contributions</text>
  </g>
</svg>`;

  return (
    <div style={{ background: "#fff", border: "1px solid #d8c8b0", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

function CumulativeContributionsChart({ schedules, years }) {
  const W = 700, H = 240, PAD = { top: 20, right: 20, bottom: 46, left: 90 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  // Cumulative sums
  const cumulate = (arr) => arr.reduce((acc, v, i) => { acc.push((acc[i - 1] || 0) + v); return acc; }, []);

  const s1cum = cumulate(schedules.scenario1.map(r => r.contribution + r.otherContrib));
  const s2cum = cumulate(schedules.scenario2.map(r => r.contribution + r.otherContrib));
  const s3cum = cumulate(schedules.scenario3.map(r => r.contribution + r.otherContrib));
  const idealCum = cumulate(schedules.scenario2.map(r => r.contribution * 0.92));

  const maxVal = Math.max(...s1cum, ...s2cum, ...s3cum, 1);

  const xScale = (i) => PAD.left + (i / (years.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - (Math.max(0, v) / maxVal) * chartH;

  const polyline = (data, color, dash = "") => {
    const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" ");
    return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.5" stroke-dasharray="${dash}" stroke-linejoin="round"/>`;
  };

  const ticks = 5;
  const tickVals = Array.from({ length: ticks + 1 }, (_, i) => (maxVal / ticks) * i);
  const fmtTick = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${v.toFixed(0)}`;
  const xLabels = years.filter((_, i) => i % 3 === 0);

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;max-width:${W}px;height:auto;display:block">
  ${tickVals.map(v => `<line x1="${PAD.left}" y1="${yScale(v)}" x2="${W - PAD.right}" y2="${yScale(v)}" stroke="#e5e7eb" stroke-width="1" stroke-dasharray="4,3"/>`).join("")}
  ${tickVals.map(v => `<text x="${PAD.left - 6}" y="${yScale(v) + 4}" text-anchor="end" font-size="9" fill="#6b7280" font-family="Georgia,serif">${fmtTick(v)}</text>`).join("")}
  ${xLabels.map(yr => { const i = years.indexOf(yr); return `<text x="${xScale(i)}" y="${H - 4}" text-anchor="middle" font-size="9" fill="#6b7280" font-family="Georgia,serif">${i + 1}</text>`; }).join("")}
  ${polyline(s1cum, "#2563eb")}
  ${polyline(s2cum, "#16a34a")}
  ${polyline(s3cum, "#c0392b")}
  ${polyline(idealCum, "#374151", "6,4")}
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top + chartH}" stroke="#374151" stroke-width="1.5"/>
  <line x1="${PAD.left}" y1="${PAD.top + chartH}" x2="${W - PAD.right}" y2="${PAD.top + chartH}" stroke="#374151" stroke-width="1.5"/>
  <text x="${W / 2}" y="14" text-anchor="middle" font-size="12" font-weight="bold" fill="#0a1a2e" font-family="Georgia,serif">Cumulative Contributions — All 3 Models (Nominal $)</text>
  <g transform="translate(${PAD.left}, ${H - 12})">
    <line x1="0" y1="-3" x2="14" y2="-3" stroke="#2563eb" stroke-width="2.5"/><text x="17" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Minimum Funding</text>
    <line x1="100" y1="-3" x2="114" y2="-3" stroke="#16a34a" stroke-width="2.5"/><text x="117" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Adequate Funding</text>
    <line x1="204" y1="-3" x2="218" y2="-3" stroke="#c0392b" stroke-width="2.5"/><text x="221" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Full Funding</text>
    <line x1="295" y1="-3" x2="309" y2="-3" stroke="#374151" stroke-width="2.5" stroke-dasharray="6,4"/><text x="312" y="0" font-size="8" fill="#374151" font-family="Georgia,serif">Ideal Contributions</text>
  </g>
</svg>`;

  return (
    <div style={{ background: "#fff", border: "1px solid #d8c8b0", borderRadius: 8, padding: "16px 20px", marginBottom: 20 }}>
      <div dangerouslySetInnerHTML={{ __html: svgContent }} />
    </div>
  );
}

// SVG chart generators for the HTML report (returns raw SVG string)
function genFundingChartSVG(schedules, years, title, valueMode = "nominal", cpiInflation = 0.02) {
  const W = 700, H = 270, PAD = { top: 22, right: 20, bottom: 52, left: 88 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const deflate = (val, i) => valueMode === "real" ? val / Math.pow(1 + cpiInflation, i + 1) : val;

  const s1 = schedules.scenario1, s2 = schedules.scenario2, s3 = schedules.scenario3;
  const balSeries = [
    { data: s1.map((r, i) => deflate(r.closingBalance, i)), color: "#2563eb" },
    { data: s2.map((r, i) => deflate(r.closingBalance, i)), color: "#16a34a" },
    { data: s3.map((r, i) => deflate(r.closingBalance, i)), color: "#9333ea" },
    { data: s2.map((r, i) => deflate(r.closingBalance * 1.18, i)), color: "#2563eb", dash: "6,4" },
  ];
  const expendData = s2.map((r, i) => deflate(r.expenditure, i));
  const specialData = s2.map((r, i) => deflate(r.otherContrib, i));
  const contribData = s2.map((r, i) => deflate(r.contribution, i));

  const allVals = [...balSeries.flatMap(s => s.data), ...expendData, ...contribData];
  const maxVal = Math.max(...allVals, 1);
  const xScale = (i) => PAD.left + (i / (years.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - (Math.max(0, v) / maxVal) * chartH;
  const poly = (data, color, dash = "") => { const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" "); return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="1.8" stroke-dasharray="${dash}" stroke-linejoin="round"/>`; };
  const tickVals = Array.from({ length: 6 }, (_, i) => (maxVal / 5) * i);
  const fmtTick = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${Math.round(v)}`;
  const barW = Math.max(2, chartW / years.length * 0.48);
  const xLabels = years.filter((_, i) => i % 3 === 0);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;margin:10px 0">
  ${tickVals.map(v => `<line x1="${PAD.left}" y1="${yScale(v)}" x2="${W-PAD.right}" y2="${yScale(v)}" stroke="#dde1e7" stroke-width="1" stroke-dasharray="4,3"/>`).join("")}
  ${tickVals.map(v => `<text x="${PAD.left-5}" y="${yScale(v)+4}" text-anchor="end" font-size="8.5" fill="#6b7280" font-family="Georgia,serif">${fmtTick(v)}</text>`).join("")}
  ${xLabels.map(yr => { const i = years.indexOf(yr); return `<text x="${xScale(i)}" y="${H-6}" text-anchor="middle" font-size="8.5" fill="#6b7280" font-family="Georgia,serif">${yr}</text>`; }).join("")}
  ${expendData.map((v,i) => v > 0 ? `<rect x="${xScale(i)-barW/2}" y="${yScale(v)}" width="${barW}" height="${chartH-(yScale(v)-PAD.top)}" fill="#22c55e" opacity="0.7"/>` : "").join("")}
  ${specialData.map((v,i) => v > 0 ? `<rect x="${xScale(i)-barW/2}" y="${yScale(v)}" width="${barW}" height="${chartH-(yScale(v)-PAD.top)}" fill="#ef4444" opacity="0.75"/>` : "").join("")}
  ${poly(contribData, "#111827")}
  ${balSeries.map(s => poly(s.data, s.color, s.dash || "")).join("")}
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top+chartH}" stroke="#374151" stroke-width="1.5"/>
  <line x1="${PAD.left}" y1="${PAD.top+chartH}" x2="${W-PAD.right}" y2="${PAD.top+chartH}" stroke="#374151" stroke-width="1.5"/>
  <text x="${W/2}" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a1a2e" font-family="Georgia,serif">${title}</text>
  <g transform="translate(${PAD.left},${H-14})">
    <rect x="0" y="-8" width="12" height="8" fill="#22c55e" opacity="0.7"/><text x="15" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Expenditures</text>
    <rect x="78" y="-8" width="12" height="8" fill="#ef4444" opacity="0.75"/><text x="93" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Special Levy</text>
    <line x1="160" y1="-4" x2="173" y2="-4" stroke="#2563eb" stroke-width="1.8"/><text x="176" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Min Funding</text>
    <line x1="240" y1="-4" x2="253" y2="-4" stroke="#16a34a" stroke-width="1.8"/><text x="256" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Adequate</text>
    <line x1="305" y1="-4" x2="318" y2="-4" stroke="#9333ea" stroke-width="1.8"/><text x="321" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Full Funding</text>
    <line x1="378" y1="-4" x2="391" y2="-4" stroke="#2563eb" stroke-width="1.8" stroke-dasharray="5,3"/><text x="394" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Ideal Balance</text>
  </g>
</svg>`;
}

function genAnnualContribChartSVG(schedules, years) {
  const W = 700, H = 250, PAD = { top: 22, right: 20, bottom: 48, left: 88 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const s1 = schedules.scenario1.map(r => r.contribution);
  const s2 = schedules.scenario2.map(r => r.contribution);
  const s3 = schedules.scenario3.map(r => r.contribution);
  const ideal = schedules.scenario2.map(r => r.contribution * 0.92);
  const maxVal = Math.max(...s1, ...s2, ...s3, 1);

  const xScale = (i) => PAD.left + (i / (years.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - (Math.max(0, v) / maxVal) * chartH;
  const poly = (data, color, dash = "") => { const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" "); return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-dasharray="${dash}" stroke-linejoin="round"/>`; };
  const tickVals = Array.from({ length: 6 }, (_, i) => (maxVal / 5) * i);
  const fmtTick = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${Math.round(v)}`;
  const xLabels = years.filter((_, i) => i % 3 === 0);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;margin:10px 0">
  ${tickVals.map(v => `<line x1="${PAD.left}" y1="${yScale(v)}" x2="${W-PAD.right}" y2="${yScale(v)}" stroke="#dde1e7" stroke-width="1" stroke-dasharray="4,3"/>`).join("")}
  ${tickVals.map(v => `<text x="${PAD.left-5}" y="${yScale(v)+4}" text-anchor="end" font-size="8.5" fill="#6b7280" font-family="Georgia,serif">${fmtTick(v)}</text>`).join("")}
  ${xLabels.map(yr => { const i = years.indexOf(yr); return `<text x="${xScale(i)}" y="${H-6}" text-anchor="middle" font-size="8.5" fill="#6b7280" font-family="Georgia,serif">${i+1}</text>`; }).join("")}
  ${poly(s1, "#2563eb")}
  ${poly(s2, "#16a34a")}
  ${poly(s3, "#c0392b")}
  ${poly(ideal, "#374151", "6,4")}
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top+chartH}" stroke="#374151" stroke-width="1.5"/>
  <line x1="${PAD.left}" y1="${PAD.top+chartH}" x2="${W-PAD.right}" y2="${PAD.top+chartH}" stroke="#374151" stroke-width="1.5"/>
  <text x="${W/2}" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a1a2e" font-family="Georgia,serif">Proposed Annual Contributions — All 3 Models (30-Year)</text>
  <g transform="translate(${PAD.left},${H-13})">
    <line x1="0" y1="-4" x2="13" y2="-4" stroke="#2563eb" stroke-width="2"/><text x="16" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Minimum Funding</text>
    <line x1="98" y1="-4" x2="111" y2="-4" stroke="#16a34a" stroke-width="2"/><text x="114" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Adequate Funding</text>
    <line x1="200" y1="-4" x2="213" y2="-4" stroke="#c0392b" stroke-width="2"/><text x="216" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Full Funding</text>
    <line x1="283" y1="-4" x2="296" y2="-4" stroke="#374151" stroke-width="2" stroke-dasharray="6,4"/><text x="299" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Ideal Contributions</text>
  </g>
</svg>`;
}

function genCumulativeContribChartSVG(schedules, years) {
  const W = 700, H = 250, PAD = { top: 22, right: 20, bottom: 48, left: 92 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const cumulate = (arr) => arr.reduce((acc, v, i) => { acc.push((acc[i-1]||0)+v); return acc; }, []);

  const s1 = cumulate(schedules.scenario1.map(r => r.contribution + r.otherContrib));
  const s2 = cumulate(schedules.scenario2.map(r => r.contribution + r.otherContrib));
  const s3 = cumulate(schedules.scenario3.map(r => r.contribution + r.otherContrib));
  const ideal = cumulate(schedules.scenario2.map(r => r.contribution * 0.92));
  const maxVal = Math.max(...s1, ...s2, ...s3, 1);

  const xScale = (i) => PAD.left + (i / (years.length - 1)) * chartW;
  const yScale = (v) => PAD.top + chartH - (Math.max(0, v) / maxVal) * chartH;
  const poly = (data, color, dash = "") => { const pts = data.map((v, i) => `${xScale(i)},${yScale(v)}`).join(" "); return `<polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2.2" stroke-dasharray="${dash}" stroke-linejoin="round"/>`; };
  const tickVals = Array.from({ length: 6 }, (_, i) => (maxVal / 5) * i);
  const fmtTick = (v) => v >= 1000000 ? `$${(v / 1000000).toFixed(1)}M` : v >= 1000 ? `$${(v / 1000).toFixed(0)}K` : `$${Math.round(v)}`;
  const xLabels = years.filter((_, i) => i % 3 === 0);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block;margin:10px 0">
  ${tickVals.map(v => `<line x1="${PAD.left}" y1="${yScale(v)}" x2="${W-PAD.right}" y2="${yScale(v)}" stroke="#dde1e7" stroke-width="1" stroke-dasharray="4,3"/>`).join("")}
  ${tickVals.map(v => `<text x="${PAD.left-5}" y="${yScale(v)+4}" text-anchor="end" font-size="8.5" fill="#6b7280" font-family="Georgia,serif">${fmtTick(v)}</text>`).join("")}
  ${xLabels.map(yr => { const i = years.indexOf(yr); return `<text x="${xScale(i)}" y="${H-6}" text-anchor="middle" font-size="8.5" fill="#6b7280" font-family="Georgia,serif">${i+1}</text>`; }).join("")}
  ${poly(s1, "#2563eb")}
  ${poly(s2, "#16a34a")}
  ${poly(s3, "#c0392b")}
  ${poly(ideal, "#374151", "6,4")}
  <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${PAD.top+chartH}" stroke="#374151" stroke-width="1.5"/>
  <line x1="${PAD.left}" y1="${PAD.top+chartH}" x2="${W-PAD.right}" y2="${PAD.top+chartH}" stroke="#374151" stroke-width="1.5"/>
  <text x="${W/2}" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="#0a1a2e" font-family="Georgia,serif">Cumulative Reserve Contributions — All 3 Models (Nominal $)</text>
  <g transform="translate(${PAD.left},${H-13})">
    <line x1="0" y1="-4" x2="13" y2="-4" stroke="#2563eb" stroke-width="2.2"/><text x="16" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Minimum Funding</text>
    <line x1="98" y1="-4" x2="111" y2="-4" stroke="#16a34a" stroke-width="2.2"/><text x="114" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Adequate Funding</text>
    <line x1="200" y1="-4" x2="213" y2="-4" stroke="#c0392b" stroke-width="2.2"/><text x="216" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Full Funding</text>
    <line x1="283" y1="-4" x2="296" y2="-4" stroke="#374151" stroke-width="2.2" stroke-dasharray="6,4"/><text x="299" y="0" font-size="7.5" fill="#374151" font-family="Georgia,serif">Ideal Contributions</text>
  </g>
</svg>`;
}

// ─── FUNDING MODELS TAB ───────────────────────────────────────────────────────
function FundingModelsTab({ components, financials, projectInfo, fundingModel, onChange }) {
  const currentYear = projectInfo.inspectionDate ? new Date(projectInfo.inspectionDate).getFullYear() : new Date().getFullYear();
  const constructionInflation = (projectInfo.constructionInflation || 3.8) / 100;
  const interestRate = (projectInfo.interestRate || 2.0) / 100;
  const cpiInflation = (projectInfo.cpiInflation || 2.0) / 100;
  const builtYear = parseInt(projectInfo.builtYear) || (currentYear - 30);
  const buildingLife = projectInfo.buildingLife || 100;
  const numYears = Math.min(30, builtYear + buildingLife - currentYear);
  const years = Array.from({ length: Math.max(numYears, 1) }, (_, i) => currentYear + i + 1);
  const minBalance = projectInfo.operatingBudget > 0
    ? projectInfo.operatingBudget * (projectInfo.minBalancePct || 25) / 100
    : 32000;

  const lastFY = financials.years[financials.years.length - 1];
  const lastInc = (lastFY?.rfContribution || 0) + (lastFY?.interest || 0) + (lastFY?.specialLevy || 0) + (lastFY?.transferIn || 0);
  const lastExp = Object.values(lastFY?.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const openingBalance = (lastFY?.openingBalance || 0) + lastInc - lastExp;
  const lastContrib = lastFY?.rfContribution || 0;

  const expendByYear = {};
  years.forEach(yr => {
    expendByYear[yr] = components.reduce((sum, comp) => {
      let next = currentYear + Math.max(0, comp.lifespan - comp.effectiveAge);
      while (next <= currentYear + numYears) { if (next === yr) sum += (comp.totalCost || 0) * Math.pow(1 + constructionInflation, next - currentYear); next += comp.lifespan; }
      return sum;
    }, 0);
  });

  function buildSchedule(scenarioKey) {
    let balance = openingBalance;
    return years.map((yr, i) => {
      const expend = expendByYear[yr] || 0;
      let contrib = lastContrib;
      if (scenarioKey === "scenario1") {
        contrib = lastContrib * Math.pow(1 + cpiInflation, i + 1);
      } else if (scenarioKey === "scenario2") {
        const pct = (fundingModel.scenario2PctIncrease || 14) / 100;
        contrib = lastContrib * Math.pow(1 + pct, i + 1);
      } else if (scenarioKey === "scenario3") {
        const boostPct = (fundingModel.scenario3BoostPct || 50) / 100;
        const boostYears = fundingModel.scenario3BoostYears || 8;
        if (i < boostYears) contrib = lastContrib * (1 + boostPct) * Math.pow(1 + cpiInflation, i);
        else contrib = lastContrib * (1 + boostPct) * Math.pow(1 + cpiInflation, boostYears);
      }
      const interest = Math.max(0, balance) * interestRate;
      const rawClosing = balance + contrib + interest - expend;
      const minBal = minBalance * Math.pow(1 + cpiInflation, i);
      const otherContrib = rawClosing < minBal ? minBal - rawClosing : 0;
      const closing = rawClosing + otherContrib;
      const row = { year: yr, openingBalance: balance, contribution: contrib, interest, expenditure: expend, otherContrib, closingBalance: closing };
      balance = closing;
      return row;
    });
  }

  const schedules = {
    scenario1: buildSchedule("scenario1"),
    scenario2: buildSchedule("scenario2"),
    scenario3: buildSchedule("scenario3"),
  };
  const activeModel = fundingModel.activeModel || "scenario2";
  const activeSchedule = schedules[activeModel];
  const perUnit = projectInfo.units ? parseInt(projectInfo.units) : 0;

  const scenarioInfo = {
    scenario1: { label: "Scenario 1 — Current Contributions", color: "#c0392b", desc: `Contributions increased by CPI (${projectInfo.cpiInflation || 2.0}%) annually. Highest reliance on special levies / other contributions.` },
    scenario2: { label: `Scenario 2 — ${fundingModel.scenario2PctIncrease || 14}% Annual Increase`, color: "#1a3a5c", desc: `Contributions increased by ${fundingModel.scenario2PctIncrease || 14}% per year over the study period, reducing reliance on other contributions.` },
    scenario3: { label: `Scenario 3 — ${fundingModel.scenario3BoostPct || 50}% Boost for ${fundingModel.scenario3BoostYears || 8} Years`, color: "#2d6a4f", desc: `Contributions increased by ${fundingModel.scenario3BoostPct || 50}% for ${fundingModel.scenario3BoostYears || 8} years, then held constant. Reduces special levies over the medium term.` },
  };

  return (
    <div>
      <SectionHeader title="Funding Scenarios" subtitle="Three 30-year reserve fund scenarios per BC Strata Property Act — matching Morrison Hershfield scenario structure" />

      {/* Scenario parameters */}
      <Card title="Scenario Parameters">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div>
            <SubLabel>Scenario 2 — Annual Contribution Increase (%)</SubLabel>
            <input type="number" step={1} value={fundingModel.scenario2PctIncrease || 14} onChange={e => onChange({ ...fundingModel, scenario2PctIncrease: parseFloat(e.target.value) || 0 })} style={iS} />
            <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 4 }}>Typical range: 10–20% per year to reduce special levy exposure</div>
          </div>
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <SubLabel>Scenario 3 — Boost % (Years 1–N)</SubLabel>
                <input type="number" step={5} value={fundingModel.scenario3BoostPct || 50} onChange={e => onChange({ ...fundingModel, scenario3BoostPct: parseFloat(e.target.value) || 0 })} style={iS} />
              </div>
              <div>
                <SubLabel>Scenario 3 — Number of Boost Years</SubLabel>
                <input type="number" step={1} value={fundingModel.scenario3BoostYears || 8} onChange={e => onChange({ ...fundingModel, scenario3BoostYears: parseInt(e.target.value) || 0 })} style={iS} />
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 4 }}>Boost applied in early years, then contributions held flat — reduces initial shock vs. large multi-year increases</div>
          </div>
        </div>
      </Card>

      {/* Scenario selector */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {Object.entries(scenarioInfo).map(([key, info]) => (
          <button key={key} onClick={() => onChange({ ...fundingModel, activeModel: key })} style={{ background: activeModel === key ? info.color : "#fffef8", border: `2px solid ${info.color}`, borderRadius: 12, padding: 20, cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: activeModel === key ? "#fff" : info.color, fontFamily: "'Georgia', serif", marginBottom: 6 }}>{info.label}</div>
            <div style={{ fontSize: 12, color: activeModel === key ? "rgba(255,255,255,0.8)" : "#5a4a3a", lineHeight: 1.5 }}>{info.desc}</div>
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[{ label: "Opening Balance", val: fmt(openingBalance) }, { label: "Year 1 Contribution", val: fmt(activeSchedule[0]?.contribution) }, { label: "Year 1 Other Contributions", val: fmt(activeSchedule[0]?.otherContrib) }, { label: "Avg Monthly / Unit", val: perUnit ? fmt((activeSchedule[0]?.contribution || 0) / 12 / perUnit) : "—" }].map(({ label, val }) => (
          <div key={label} style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 12, padding: 20, color: "#fff" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#c8a96e", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>

      <Card title={`${scenarioInfo[activeModel].label} — 30-Year Cash Flow Table`}>
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 12 }}>
          Minimum Reserve Balance: <strong>{fmt(minBalance)}</strong> ({projectInfo.operatingBudget > 0 ? `${projectInfo.minBalancePct || 25}% of ${fmt(projectInfo.operatingBudget)} operating budget — s.6.1(a)(ii)` : "Set operating budget in Project Setup to auto-calculate"})
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#1a3a5c" }}>
                {["Fiscal Year", "Opening Balance", "Annual CRF Contribution", "% Increase", "Other Contributions", "Interest Earned", "Expenditures", "Closing Balance", "$/Unit/Mo"].map(h => (
                  <th key={h} style={{ padding: "10px 10px", textAlign: "right", color: "#c8a96e", fontSize: 10, textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>{h === "Fiscal Year" ? <span style={{ textAlign: "left", display: "block" }}>{h}</span> : h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {activeSchedule.map((row, i) => {
                const prevContrib = i === 0 ? lastContrib : activeSchedule[i - 1].contribution;
                const pctInc = prevContrib > 0 ? ((row.contribution - prevContrib) / prevContrib * 100).toFixed(1) : "—";
                return (
                  <tr key={row.year} style={{ background: i % 2 === 0 ? "#fffef8" : "#f5f0e8", borderBottom: "1px solid #ede8e0" }}>
                    <td style={{ padding: "8px 10px", fontWeight: 600, color: "#1a3a5c", whiteSpace: "nowrap" }}>FY {row.year}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>{fmt(row.openingBalance)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: "#2d6a4f", fontWeight: i === 0 ? 700 : 400 }}>{fmt(row.contribution)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: "#7a6a5a", fontSize: 11 }}>{pctInc !== "—" ? `${pctInc}%` : "—"}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: row.otherContrib > 0 ? "#c0392b" : "#8a7a6a" }}>{row.otherContrib > 0 ? fmt(row.otherContrib) : "—"}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>{fmt(row.interest)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", color: row.expenditure > 0 ? "#c0392b" : "#8a7a6a" }}>{row.expenditure > 0 ? fmt(row.expenditure) : "—"}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right", fontWeight: 700, color: row.closingBalance >= 0 ? "#1a3a5c" : "#c0392b" }}>{fmt(row.closingBalance)}</td>
                    <td style={{ padding: "8px 10px", textAlign: "right" }}>{perUnit ? fmt(row.contribution / 12 / perUnit) : "—"}</td>
                  </tr>
                );
              })}
              <tr style={{ background: "#e8ddd0", fontWeight: 700 }}>
                <td style={{ padding: "10px 10px", color: "#1a3a5c", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>TOTALS</td>
                <td />
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#2d6a4f" }}>{fmt(activeSchedule.reduce((s, r) => s + r.contribution, 0))}</td>
                <td />
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#c0392b" }}>{fmt(activeSchedule.reduce((s, r) => s + r.otherContrib, 0))}</td>
                <td style={{ padding: "10px 10px", textAlign: "right" }}>{fmt(activeSchedule.reduce((s, r) => s + r.interest, 0))}</td>
                <td style={{ padding: "10px 10px", textAlign: "right", color: "#c0392b" }}>{fmt(activeSchedule.reduce((s, r) => s + r.expenditure, 0))}</td>
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 14, padding: "10px 14px", background: "#f0e8d8", borderRadius: 6, fontSize: 11, color: "#5a4a3a" }}>
          * Annual Reserve Contribution refers to the amount contributed each year to the reserve fund from monthly common expenses.<br />
          ** Other Contributions refers to other contributed amounts including special assessments or surplus funds transferred from other sources (i.e. operating budget or contingency fund).<br />
          *** Expenditures are presented as future dollars (based on {projectInfo.constructionInflation || 3.8}% inflation) and are considered {components.some(c => c.classEstimate !== "Class D (±50%)") ? "Class C–D" : "Class D"} estimates (±50%). Actual costs to be confirmed by competitive tender at time of replacement.
        </div>
      </Card>

      {/* ── CHARTS SECTION ── */}
      <Card title="Funding Charts — Closing Balance Comparison">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>
          The following charts show the reserve fund closing balance trajectory for all three funding models, in both nominal (inflated) and real (today's dollar) values.
        </div>
        <FundingChart schedules={schedules} years={years} title="Funding Chart — Nominal Values" valueMode="nominal" cpiInflation={cpiInflation} currentYear={currentYear} />
        <FundingChart schedules={schedules} years={years} title="Funding Chart — Real Values (Today's Dollars)" valueMode="real" cpiInflation={cpiInflation} currentYear={currentYear} />
      </Card>

      <Card title="Annual Contributions — All 3 Models">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>
          Proposed annual contributions for all three models over the 30-year projection period, combining regular contributions and special levies.
        </div>
        <AnnualContributionsChart schedules={schedules} years={years} />
        <div style={{ fontSize: 11, color: "#5a4a3a", marginTop: 10, fontStyle: "italic" }}>
          Each funding model projects the same total contributions over the lifespan of the building, disregarding interest. Buildings with lower contributions often make long-term decisions that result in higher overall costs.
        </div>
      </Card>

      <Card title="Cumulative Contributions — All 3 Models">
        <div style={{ fontSize: 12, color: "#5a4a3a", marginBottom: 14 }}>
          Cumulative reserve contributions in nominal dollars. Although the Minimum Funding Model may appear to have lower annual expenditures, it ultimately requires the greatest contributions over the building's lifespan due to the absence of sufficient interest earnings.
        </div>
        <CumulativeContributionsChart schedules={schedules} years={years} />
      </Card>
    </div>
  );
}

// ─── PDF PREVIEW ──────────────────────────────────────────────────────────────
function PDFPreview({ project, onBack }) {
  const { projectInfo, components, financials, fundingModel, teamMembers = [], documentsReviewed = [], buildingHistory = [], draftHistory = [] } = project;
  const f2 = (n, d = 0) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);

  const currentYear = projectInfo.inspectionDate ? new Date(projectInfo.inspectionDate).getFullYear() : new Date().getFullYear();
  const inflationRate = (projectInfo.constructionInflation || 3.8) / 100;
  const interestRate = (projectInfo.interestRate || 2.0) / 100;
  const cpiInflation = (projectInfo.cpiInflation || 2.0) / 100;
  const builtYear = parseInt(projectInfo.builtYear) || (currentYear - 30);
  const numYears = Math.min(30, builtYear + (projectInfo.buildingLife || 100) - currentYear);
  const projYears = Array.from({ length: Math.max(numYears, 1) }, (_, i) => currentYear + i + 1);
  const totalCost = (components || []).reduce((s, c) => s + (c.totalCost || 0), 0);
  const lastFY = financials.years[financials.years.length - 1];
  const lastInc = (lastFY?.rfContribution || 0) + (lastFY?.interest || 0) + (lastFY?.specialLevy || 0) + (lastFY?.transferIn || 0);
  const lastExp = Object.values(lastFY?.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const openingBalance = (lastFY?.openingBalance || 0) + lastInc - lastExp;
  const lastContrib = lastFY?.rfContribution || 0;
  const minBalance = projectInfo.operatingBudget > 0 ? projectInfo.operatingBudget * (projectInfo.minBalancePct || 25) / 100 : 32000;

  const expendByYear = {};
  projYears.forEach(yr => {
    expendByYear[yr] = (components || []).reduce((sum, comp) => {
      let next = currentYear + Math.max(0, comp.lifespan - comp.effectiveAge);
      while (next <= currentYear + numYears) { if (next === yr) sum += (comp.totalCost || 0) * Math.pow(1 + inflationRate, next - currentYear); next += comp.lifespan; }
      return sum;
    }, 0);
  });

  const buildSchedulePDF = (key) => {
    let balance = openingBalance;
    return projYears.map((yr, i) => {
      const expend = expendByYear[yr] || 0;
      let contrib = lastContrib;
      if (key === "scenario1") contrib = lastContrib * Math.pow(1 + cpiInflation, i + 1);
      else if (key === "scenario2") contrib = lastContrib * Math.pow(1 + (fundingModel.scenario2PctIncrease || 14) / 100, i + 1);
      else { const bp = (fundingModel.scenario3BoostPct || 50) / 100; const by = fundingModel.scenario3BoostYears || 8; contrib = i < by ? lastContrib * (1 + bp) * Math.pow(1 + cpiInflation, i) : lastContrib * (1 + bp) * Math.pow(1 + cpiInflation, by); }
      const interest = Math.max(0, balance) * interestRate;
      const raw = balance + contrib + interest - expend;
      const minBal = minBalance * Math.pow(1 + cpiInflation, i);
      const otherContrib = raw < minBal ? minBal - raw : 0;
      const closing = raw + otherContrib;
      const row = { year: yr, openingBalance: balance, contribution: contrib, interest, expenditure: expend, otherContrib, closingBalance: closing };
      balance = closing;
      return row;
    });
  };

  const allSchedules = {
    scenario1: buildSchedulePDF("scenario1"),
    scenario2: buildSchedulePDF("scenario2"),
    scenario3: buildSchedulePDF("scenario3"),
  };
  const activeKey = fundingModel.activeModel || "scenario2";
  const byUrgency = {
    short_term: (components || []).filter(c => c.urgency === "short_term"),
    medium_term: (components || []).filter(c => c.urgency === "medium_term"),
    long_term: (components || []).filter(c => c.urgency === "long_term"),
    ongoing: (components || []).filter(c => c.urgency === "ongoing"),
  };

  const generateHTML = () => `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/>
<title>Depreciation Report — ${projectInfo.strataName || "Strata Corporation"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{font-family:'EB Garamond',Georgia,serif;font-size:11.5pt;color:#1a1a1a;background:#fff;line-height:1.7}
  .page{max-width:920px;margin:0 auto;padding:60px 70px}
  .cover{min-height:100vh;background:linear-gradient(160deg,#0a1a2e 0%,#0d2137 40%,#132d4a 70%,#0a1a2e 100%);color:#fff;padding:80px;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always}
  .chapter{padding:60px 70px;max-width:920px;margin:0 auto;page-break-before:always}
  h1.ct{font-family:'Cinzel',serif;font-size:19pt;color:#0a1a2e;letter-spacing:2px;border-bottom:2px solid #c8a96e;padding-bottom:12px;margin-bottom:28px}
  h2{font-family:'Cinzel',serif;font-size:12.5pt;color:#1a3a5c;margin:26px 0 12px;letter-spacing:1px}
  h3{font-size:11.5pt;font-weight:700;color:#1a3a5c;margin:16px 0 8px}
  p{margin-bottom:12px;color:#2a2a2a}
  ul{margin-left:24px;margin-bottom:14px;line-height:2}
  .disc{background:#fdf8f0;border:1px solid #e8d0a0;border-left:4px solid #c8a96e;padding:12px 16px;border-radius:0 6px 6px 0;font-size:10pt;color:#5a4a3a;line-height:1.6;margin:14px 0}
  .ig{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:18px 0}
  .ib{background:#f8f4ec;border:1px solid #e8ddd0;border-radius:8px;padding:12px 16px}
  .ib label{display:block;font-size:7.5pt;letter-spacing:2px;text-transform:uppercase;color:#8a7a6a;margin-bottom:4px}
  .ib span{font-size:13pt;font-weight:700;color:#1a3a5c;font-family:'Cinzel',serif}
  table{width:100%;border-collapse:collapse;margin:16px 0;font-size:9.5pt}
  th{background:#0d2137;color:#c8a96e;padding:8px 10px;text-align:left;font-family:'Cinzel',serif;font-size:7.5pt;letter-spacing:1px;font-weight:600}
  td{padding:7px 10px;border-bottom:1px solid #ede8e0}
  tr:nth-child(even) td{background:#faf6ee}
  .tr td{background:#0d2137!important;color:#c8a96e;font-weight:700;font-family:'Cinzel',serif}
  .cb{border:1px solid #d8c8b0;border-radius:10px;margin:18px 0;overflow:hidden;page-break-inside:avoid}
  .cbh{background:linear-gradient(135deg,#0d2137,#1a3a5c);color:#fff;padding:12px 18px;display:flex;justify-content:space-between;align-items:center}
  .cbh h3{font-family:'Cinzel',serif;font-size:10.5pt;color:#c8a96e;font-weight:600;margin:0}
  .cbh .urg{font-size:8pt;padding:2px 8px;border-radius:3px;border:1px solid;margin-left:10px}
  .cbb{padding:18px}
  .team-block{border:1px solid #d8c8b0;border-radius:8px;padding:16px;margin:12px 0;page-break-inside:avoid}
  .action-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:20px 0}
  .action-col{border-radius:8px;padding:16px}
  .sig{border-bottom:1px solid #1a3a5c;width:280px;margin-bottom:8px;padding-bottom:50px}
  @media print{
    html,body{font-size:10.5pt}
    .cover{min-height:100vh;page-break-after:always}
    .chapter{page-break-before:always}
    .cb{page-break-inside:avoid}
    @page{margin:0;size:letter}
  }
</style></head>
<body>

<!-- COVER -->
<div class="cover">
  <div>
    <div style="font-size:8pt;letter-spacing:3px;text-transform:uppercase;color:rgba(200,169,110,0.6);margin-bottom:50px">BC Strata Property Act Compliant · CUSPAP Standards · Appraisal Institute of Canada</div>
    <div style="display:inline-flex;align-items:center;gap:12px;background:rgba(200,169,110,0.1);border:1px solid rgba(200,169,110,0.3);border-radius:10px;padding:10px 18px;margin-bottom:44px">
      <div style="background:linear-gradient(135deg,#c8a96e,#e8c88e);color:#0d2137;font-weight:700;font-size:11pt;border-radius:6px;padding:6px 10px;letter-spacing:2px;font-family:'Cinzel',serif">SW</div>
      <div style="color:#fff;font-size:12pt;font-family:'Cinzel',serif;letter-spacing:1px">StrataWise Consulting</div>
    </div>
    <div style="font-family:'Cinzel',serif;font-size:40pt;color:#c8a96e;letter-spacing:4px;line-height:1.1;margin-bottom:10px">DEPRECIATION<br/>REPORT</div>
    <div style="font-size:12pt;color:rgba(255,255,255,0.45);letter-spacing:2px;text-transform:uppercase;margin-bottom:50px;padding-bottom:50px;border-bottom:1px solid rgba(200,169,110,0.2)">Reserve Fund Study &amp; 30-Year Financial Analysis</div>
    <div>
      <h2 style="font-family:'Cinzel',serif;font-size:18pt;color:#fff;font-weight:600;margin-bottom:10px">${projectInfo.strataName || "[Strata Corporation Name]"}</h2>
      ${projectInfo.strataNumber ? `<p style="color:rgba(255,255,255,0.55)">Strata Plan ${projectInfo.strataNumber}${projectInfo.reportNumber ? ` · Report No. ${projectInfo.reportNumber}` : ""}</p>` : ""}
      <p style="color:rgba(255,255,255,0.55)">${[projectInfo.address, projectInfo.city, projectInfo.province, projectInfo.postalCode].filter(Boolean).join(", ")}</p>
      <p style="margin-top:10px;color:rgba(255,255,255,0.35)">Constructed ${projectInfo.builtYear || "N/A"} &nbsp;·&nbsp; ${projectInfo.units || "N/A"} Strata Units${projectInfo.stories ? ` · ${projectInfo.stories} Storeys` : ""}</p>
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;border-top:1px solid rgba(200,169,110,0.2);padding-top:28px;font-size:8.5pt">
    <div><label style="display:block;color:rgba(200,169,110,0.5);letter-spacing:2px;text-transform:uppercase;font-size:7pt;margin-bottom:3px">Inspection Date</label><span style="color:#fff">${projectInfo.inspectionDate || "N/A"}</span></div>
    <div><label style="display:block;color:rgba(200,169,110,0.5);letter-spacing:2px;text-transform:uppercase;font-size:7pt;margin-bottom:3px">Report Date</label><span style="color:#fff">${projectInfo.reportDate || new Date().toISOString().split("T")[0]}</span></div>
    <div><label style="display:block;color:rgba(200,169,110,0.5);letter-spacing:2px;text-transform:uppercase;font-size:7pt;margin-bottom:3px">Prepared By</label><span style="color:#fff">${projectInfo.advisor || ""}${projectInfo.advisorDesignations ? ", " + projectInfo.advisorDesignations : ""}</span></div>
    <div><label style="display:block;color:rgba(200,169,110,0.5);letter-spacing:2px;text-transform:uppercase;font-size:7pt;margin-bottom:3px">Presented To</label><span style="color:#fff">${projectInfo.propertyManagerFirm || projectInfo.propertyManager || "The Owners"}</span></div>
  </div>
</div>

<!-- INTRO & TEAM -->
<div class="chapter">
  <h1 class="ct">1. Introduction</h1>
  <p>This letter report and appendices comprise the ${currentYear} Depreciation Report for ${projectInfo.strataName || "the strata corporation"}. It is prepared in general compliance with Section 6.2 (Depreciation Report) of the Strata Property Regulation B.C. Reg. 43/2000 with Amendments.</p>
  ${projectInfo.previousReportYear ? `<p>This report is an update of the previous depreciation report dated ${projectInfo.previousReportYear}.</p>` : ""}
  ${draftHistory.length > 0 ? `
  <h2>1.1 Report Submission History</h2>
  <table><tr><th>Date</th><th>Event</th><th>Description</th><th>By</th></tr>
  ${draftHistory.map(h => `<tr><td>${h.date || "—"}</td><td>${h.eventType}</td><td>${h.description}</td><td>${h.by || "—"}</td></tr>`).join("")}
  </table>` : ""}

  <h2>1.2 Project Team &amp; Qualifications</h2>
  <p>As per Section 6.2(1)(d) of the Act, the report must provide the name of the person from whom the depreciation report was obtained and a description of their qualifications, the error and omission insurance carried by that person, and the relationship between that person and the strata corporation.</p>

  <div class="team-block" style="background:#e8f0f8;border-color:#b8d0e8">
    <div style="font-size:9pt;letter-spacing:2px;text-transform:uppercase;color:#1a3a5c;margin-bottom:8px">Lead Advisor of Record</div>
    <div style="font-size:13pt;font-weight:700;color:#1a2a3a">${projectInfo.advisor || "[Advisor Name]"}${projectInfo.advisorDesignations ? `, ${projectInfo.advisorDesignations}` : ""}</div>
    <div style="color:#5a4a3a;margin-top:4px">${projectInfo.advisorRole || "Lead Author / Reserve Fund Analyst"} · ${projectInfo.firm || "StrataWise Consulting"}</div>
    ${projectInfo.firmEO ? `<div style="color:#5a4a3a;font-size:10pt;margin-top:4px">E&amp;O Insurance: ${projectInfo.firmEO}</div>` : ""}
    ${projectInfo.firmAddress ? `<div style="color:#8a7a6a;font-size:10pt">${projectInfo.firmAddress}</div>` : ""}
  </div>

  ${teamMembers.map(m => `
  <div class="team-block">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-size:12.5pt;font-weight:700">${m.name}${m.designations ? `, ${m.designations}` : ""}</div>
        <div style="color:#5a4a3a;margin-top:2px">${m.role}${m.isSubConsultant && m.subFirm ? ` · ${m.subFirm}` : ""}</div>
      </div>
      ${m.isSubConsultant ? `<div style="background:#f5efe0;border:1px solid #c8b89a;border-radius:4px;padding:2px 8px;font-size:9pt;color:#7b5e00">Sub-Consultant</div>` : ""}
    </div>
    ${m.qualifications ? `<p style="margin-top:8px;font-size:10.5pt">${m.qualifications}</p>` : ""}
    ${m.responsibility ? `<p style="color:#5a4a3a;font-size:10pt"><em>Responsible for: ${m.responsibility}</em></p>` : ""}
  </div>`).join("")}

  <p style="margin-top:16px">${projectInfo.firm || "This firm"} is not associated with ${projectInfo.strataName || "the strata corporation"} beyond being retained to perform professional services. We are not aware of any conflicts of interest.</p>
  <p>We confirm that we carry professional liability insurance in the amount of ${projectInfo.firmEO || "$2,000,000 per claim"}.</p>

  ${documentsReviewed.length > 0 ? `
  <h2>1.3 Documents Reviewed</h2>
  <p>The following documents were reviewed as part of the scope of work:</p>
  <table><tr><th>Document Type</th><th>Description / Title</th><th>Prepared By</th><th>Date</th></tr>
  ${documentsReviewed.map(d => `<tr><td>${d.type}</td><td>${d.description || "—"}</td><td>${d.preparedBy || "—"}</td><td>${d.date || "—"}</td></tr>`).join("")}
  </table>` : ""}
</div>

<!-- PHYSICAL ASSESSMENT -->
<div class="chapter">
  <h1 class="ct">2. Physical Assessment</h1>
  <h2>2.1 Building Description</h2>
  <table>
    <tr><th>Item</th><th>Description</th></tr>
    <tr><td>Strata Corporation</td><td>${projectInfo.strataName || "—"}</td></tr>
    <tr><td>Strata Plan Number</td><td>${projectInfo.strataNumber || "—"}</td></tr>
    <tr><td>Civic Address</td><td>${projectInfo.address || "—"}</td></tr>
    <tr><td>Municipality</td><td>${[projectInfo.city, projectInfo.province, projectInfo.postalCode].filter(Boolean).join(", ")}</td></tr>
    <tr><td>Year of Construction</td><td>${projectInfo.builtYear || "—"}</td></tr>
    <tr><td>Number of Strata Lots</td><td>${projectInfo.units || "—"}</td></tr>
    <tr><td>Number of Stories</td><td>${projectInfo.stories || "—"}</td></tr>
    <tr><td>Parking</td><td>${projectInfo.parkingLevels || "—"}</td></tr>
    <tr><td>Building Type</td><td>${projectInfo.buildingType || "—"}</td></tr>
    <tr><td>Cladding System</td><td>${projectInfo.cladding || "—"}</td></tr>
    <tr><td>Glazing System</td><td>${projectInfo.glazing || "—"}</td></tr>
    <tr><td>Heating System</td><td>${projectInfo.heating || "—"}</td></tr>
    <tr><td>Site Inspection Date</td><td>${projectInfo.inspectionDate || "—"}</td></tr>
    <tr><td>Report Date</td><td>${projectInfo.reportDate || "—"}</td></tr>
  </table>

  ${buildingHistory.length > 0 ? `
  <h2>2.2 Project History</h2>
  <ul>${buildingHistory.sort((a,b) => (b.year||0)-(a.year||0)).map(h => `<li><strong>${h.year}:</strong> ${h.description}</li>`).join("")}</ul>` : ""}

  <h2>${buildingHistory.length > 0 ? "2.3" : "2.2"} Recommended Actions Summary</h2>
  <p>In summary, we recommend planning for the following significant renewal projects and studies:</p>
  <div class="action-grid">
    <div class="action-col" style="background:#fde8e8;border:1px solid #f5b7b1">
      <div style="font-size:9pt;font-weight:700;color:#c0392b;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">Short Term — Within 2 Years</div>
      ${byUrgency.short_term.length === 0 ? `<p style="color:#c0392b;font-style:italic;font-size:10pt">No items identified</p>` : byUrgency.short_term.map(c => `<div style="margin-bottom:6px"><strong style="color:#1a2a3a">${c.name}</strong><div style="font-size:10pt;color:#5a4a3a">${c.recommendedAction || c.conditionAnalysis || "See component report"}</div></div>`).join("")}
    </div>
    <div class="action-col" style="background:#fef3e2;border:1px solid #f9d79d">
      <div style="font-size:9pt;font-weight:700;color:#d68910;letter-spacing:2px;text-transform:uppercase;margin-bottom:12px">Medium Term — Within 6 Years</div>
      ${byUrgency.medium_term.length === 0 ? `<p style="color:#d68910;font-style:italic;font-size:10pt">No items identified</p>` : byUrgency.medium_term.map(c => `<div style="margin-bottom:6px"><strong style="color:#1a2a3a">${c.name}</strong><div style="font-size:10pt;color:#5a4a3a">${c.recommendedAction || c.conditionAnalysis || "See component report"}</div></div>`).join("")}
    </div>
  </div>
  <div class="disc">Prior to any major projects, a detailed engineering review should be undertaken to refine scope, timing, and budget. While major projects are assigned to specific years for budgeting purposes, they may be completed in discrete years as the depreciation report is updated. Slight timing adjustments are expected as conditions are reassessed.</div>
</div>

<!-- COMPONENT ANALYSIS -->
<div class="chapter">
  <h1 class="ct">3. Building Component Analysis</h1>
  <p>This report provides analysis of <strong>${(components || []).length}</strong> building and site components that form part of the common property and are expected to require replacement or major repair less frequently than once per year. Components with estimated current costs below ${f2(projectInfo.componentThreshold || 10000)} are excluded and will be covered from the operating budget.</p>
  <div class="disc">All cost estimates are based on RS Means Commercial Renovation Cost Data adjusted for the Metro Vancouver location and date. Cost estimates are considered <strong>Class D (±50%)</strong> unless otherwise indicated. These are budget figures only; actual costs must be established by competitive contractor quotes at the time of tendering.</div>

  <h2>3.1 Component Inventory Summary</h2>
  <table>
    <tr><th>#</th><th>Component</th><th>Category</th><th>Life (yrs)</th><th>Eff. Age</th><th>Remaining</th><th>Cond.</th><th>Est. Class</th><th>Current Cost</th></tr>
    ${(components || []).map((c, i) => `
    <tr><td>${i + 1}</td><td><strong>${c.name}</strong></td><td>${c.category}</td><td>${c.lifespan}</td><td>${c.effectiveAge}</td><td>${Math.max(0, c.lifespan - c.effectiveAge)}</td><td>${c.condition || "—"}</td><td>${c.classEstimate || "Class D"}</td><td>${f2(c.totalCost)}</td></tr>`).join("")}
    <tr class="tr"><td colspan="8" style="text-align:right;padding:10px">TOTAL CURRENT REPLACEMENT COST</td><td>${f2(totalCost)}</td></tr>
  </table>

  <h2>3.2 Individual Component Reports</h2>
  ${(components || []).map((c, i) => {
    const urgInfo = [{ value: "short_term", label: "Short Term", color: "#c0392b" }, { value: "medium_term", label: "Medium Term", color: "#d68910" }, { value: "long_term", label: "Long Term", color: "#2d6a4f" }, { value: "ongoing", label: "Ongoing", color: "#1a3a5c" }].find(u => u.value === c.urgency) || { label: "Long Term", color: "#2d6a4f" };
    return `<div class="cb">
    <div class="cbh">
      <h3>#${i + 1} — ${c.name}</h3>
      <div style="display:flex;align-items:center;gap:12px">
        <span style="font-size:9pt;color:rgba(255,255,255,0.5)">${c.category}</span>
        <span class="urg" style="color:${urgInfo.color};border-color:${urgInfo.color};background:rgba(255,255,255,0.1)">${urgInfo.label}</span>
      </div>
    </div>
    <div class="cbb">
      <div class="ig">
        <div class="ib"><label>Condition Rating</label><span>${c.condition || "—"}</span></div>
        <div class="ib"><label>Current Cost Estimate (${c.classEstimate || "Class D ±50%"})</label><span>${f2(c.totalCost)}</span></div>
        <div class="ib"><label>Effective Age / Lifespan</label><span>${c.effectiveAge} / ${c.lifespan} yrs</span></div>
        <div class="ib"><label>Remaining Useful Life</label><span>${Math.max(0, c.lifespan - c.effectiveAge)} Years</span></div>
      </div>
      ${c.description ? `<h3>Component Description</h3><p>${c.description}</p>` : ""}
      ${c.conditionAnalysis ? `<h3>Condition Analysis</h3><p>${c.conditionAnalysis}</p>` : ""}
      ${c.scopeOfWork ? `<h3>Scope of Work</h3><p>${c.scopeOfWork}</p>` : ""}
      ${c.possibleDeterioration ? `<h3>Possible Deterioration if Deferred</h3><p>${c.possibleDeterioration}</p>` : ""}
      ${c.recommendedAction ? `<h3>Recommended Action</h3><p>${c.recommendedAction}</p>` : ""}
      ${(c.costItems || []).length > 0 ? `
      <h3>Cost Breakdown</h3>
      <table>
        <tr><th>Description</th><th>Unit</th><th>Unit Rate</th><th>Qty</th><th>Subtotal</th></tr>
        ${c.costItems.map(item => `<tr><td>${item.name}</td><td>${item.unit}</td><td>${f2(item.rate, 2)}</td><td>${item.qty}</td><td>${f2((item.rate || 0) * (item.qty || 0))}</td></tr>`).join("")}
        <tr style="background:#e8ddd0"><td colspan="4" style="text-align:right;font-weight:700">Total (incl. demolition ${c.demolitionPct || 0}%, GST ${c.taxPct || 0}%, contingency ${c.contingencyPct || 0}%)</td><td style="font-weight:700">${f2(c.totalCost)}</td></tr>
      </table>` : ""}
    </div>
  </div>`;
  }).join("")}
</div>

<!-- FINANCIAL ANALYSIS -->
<div class="chapter">
  <h1 class="ct">4. Financial Analysis</h1>
  <p>Reserve fund contributions should be established by the Council. Three funding scenarios are summarized below and detailed in this section. Following the convention used throughout this report, a fiscal year is identified by the calendar year in which it ends.</p>

  <h2>4.1 Economic Parameters</h2>
  <table>
    <tr><th>Parameter</th><th>Rate Applied</th><th>Basis</th></tr>
    <tr><td>Construction Cost Inflation Rate</td><td>${projectInfo.constructionInflation || 3.8}% per annum</td><td>BC construction cost index, 10-year average</td></tr>
    <tr><td>Reserve Fund Interest Rate</td><td>${projectInfo.interestRate || 2.0}% per annum</td><td>Conservative estimate — GIC/HISA blended rate</td></tr>
    <tr><td>CPI / Contribution Escalation Rate</td><td>${projectInfo.cpiInflation || 2.0}% per annum</td><td>Statistics Canada CPI — Metro Vancouver</td></tr>
    <tr><td>Building Economic Life</td><td>${projectInfo.buildingLife || 100} years from ${projectInfo.builtYear || "year of construction"}</td><td>BC residential strata standard</td></tr>
    <tr><td>Minimum Reserve Balance</td><td>${f2(minBalance)}</td><td>${projectInfo.operatingBudget > 0 ? `${projectInfo.minBalancePct || 25}% of operating budget (s.6.1(a)(ii))` : "Guideline — enter operating budget in Project Setup for calculated value"}</td></tr>
  </table>

  <h2>4.2 Reserve Fund Balance at Start of Study</h2>
  <p>The reserve fund balance at the start of the study period (opening balance for FY ${currentYear + 1}) is estimated at <strong>${f2(openingBalance)}</strong>, based on financial information provided by the strata.</p>
  <p>The present annual contribution to the reserve fund is <strong>${f2(lastContrib)}</strong> (FY ${lastFY?.year || currentYear}).</p>

  <h2>4.3 Summary of Funding Scenarios</h2>
  <table>
    <tr><th>Scenario</th><th>Description</th><th>Year 1 Contribution</th><th>Year 30 Contribution</th><th>Total Other Contributions</th></tr>
    ${["scenario1","scenario2","scenario3"].map((key, si) => {
      const sc = allSchedules[key];
      const labels = [`Scenario 1 — CPI Increase (${projectInfo.cpiInflation || 2.0}%/yr)`, `Scenario 2 — ${fundingModel.scenario2PctIncrease || 14}% Annual Increase`, `Scenario 3 — ${fundingModel.scenario3BoostPct || 50}% Boost for ${fundingModel.scenario3BoostYears || 8} Years`];
      return `<tr ${key === activeKey ? 'style="background:#e8f0f8;font-weight:700"' : ""}><td>${labels[si]}${key === activeKey ? " ★" : ""}</td><td>${key === "scenario1" ? "CPI escalation only" : key === "scenario2" ? `${fundingModel.scenario2PctIncrease || 14}% annual increase` : `${fundingModel.scenario3BoostPct || 50}% boost for ${fundingModel.scenario3BoostYears || 8} yrs`}</td><td>${f2(sc[0]?.contribution)}</td><td>${f2(sc[sc.length - 1]?.contribution)}</td><td>${f2(sc.reduce((s, r) => s + r.otherContrib, 0))}</td></tr>`;
    }).join("")}
  </table>
  <div class="disc">★ Recommended scenario. The strata council should review this Depreciation Report with their accountants to confirm it meets the needs of the Corporation.</div>

  <h2>4.4 Funding Charts — Reserve Fund Balance Comparison</h2>
  <p>The following charts depict the projected reserve fund closing balance for all three funding models. Nominal values reflect future inflated dollars; real values are expressed in today's purchasing power.</p>
  ${genFundingChartSVG(allSchedules, projYears, "Adequate Funding Chart — Nominal Values", "nominal", cpiInflation)}
  ${genFundingChartSVG(allSchedules, projYears, "Adequate Funding Chart — Real Values (Today's Dollars)", "real", cpiInflation)}

  <h2>4.5 Annual Contributions — All 3 Models</h2>
  <p>The following chart depicts the proposed annual contributions for all three models over a 30-year projection period, combining regular contributions and special levies.</p>
  ${genAnnualContribChartSVG(allSchedules, projYears)}
  <p>Each funding model projects the same total contributions over the lifespan of the building, disregarding interest. In reality, buildings with lower contributions often make long-term decisions that result in higher overall costs.</p>

  <h2>4.6 Cumulative Contributions — All 3 Models</h2>
  <p>The chart below illustrates the cumulative reserve contributions in nominal dollars. It is important to note that although the Minimum Funding Model may appear to have lower total expenditures in a particular year, it ultimately requires the greatest contributions over the building's lifespan due to the absence of interest earnings.</p>
  ${genCumulativeContribChartSVG(allSchedules, projYears)}
  <p>The following pages provide 30-Year Reserve Fund Schedules and Cash Flow Tables for all three Funding Models.</p>

  ${["scenario1","scenario2","scenario3"].map((key, si) => {
    const sc = allSchedules[key];
    const titles = [`Scenario 1 — Current Contribution Level (CPI Increases)`, `Scenario 2 — ${fundingModel.scenario2PctIncrease || 14}% Annual Contribution Increase`, `Scenario 3 — ${fundingModel.scenario3BoostPct || 50}% Boost for ${fundingModel.scenario3BoostYears || 8} Years, Then Held`];
    const perUnit = projectInfo.units ? parseInt(projectInfo.units) : 0;
    return `
  <h2>4.${si + 7} ${titles[si]}${key === activeKey ? " (Recommended)" : ""}</h2>
  <table style="font-size:8.5pt">
    <tr><th>FY</th><th style="text-align:right">Opening</th><th style="text-align:right">CRF Contribution*</th><th style="text-align:right">% Chg</th><th style="text-align:right">Other Contrib**</th><th style="text-align:right">Interest</th><th style="text-align:right">Expenditures***</th><th style="text-align:right">Closing</th><th style="text-align:right">$/Unit/Mo</th></tr>
    ${sc.map((row, i) => {
      const prev = i === 0 ? lastContrib : sc[i - 1].contribution;
      const pct = prev > 0 ? ((row.contribution - prev) / prev * 100).toFixed(1) : "—";
      return `<tr><td>${row.year}</td><td style="text-align:right">${f2(row.openingBalance)}</td><td style="text-align:right">${f2(row.contribution)}</td><td style="text-align:right;font-size:8pt">${pct !== "—" ? pct + "%" : "—"}</td><td style="text-align:right;color:${row.otherContrib > 0 ? "#c0392b" : "#888"}">${row.otherContrib > 0 ? f2(row.otherContrib) : "—"}</td><td style="text-align:right">${f2(row.interest)}</td><td style="text-align:right;color:${row.expenditure > 0 ? "#c0392b" : "#888"}">${row.expenditure > 0 ? f2(row.expenditure) : "—"}</td><td style="text-align:right;font-weight:700;color:${row.closingBalance >= 0 ? "#1a3a5c" : "#c0392b"}">${f2(row.closingBalance)}</td><td style="text-align:right">${perUnit ? f2(row.contribution / 12 / perUnit) : "—"}</td></tr>`;
    }).join("")}
    <tr class="tr"><td>TOTALS</td><td></td><td style="text-align:right">${f2(sc.reduce((s,r)=>s+r.contribution,0))}</td><td></td><td style="text-align:right">${f2(sc.reduce((s,r)=>s+r.otherContrib,0))}</td><td style="text-align:right">${f2(sc.reduce((s,r)=>s+r.interest,0))}</td><td style="text-align:right">${f2(sc.reduce((s,r)=>s+r.expenditure,0))}</td><td></td><td></td></tr>
  </table>`;
  }).join("")}
  <p style="font-size:9pt;color:#5a4a3a;margin-top:12px">* Annual Reserve Contribution refers to the amount contributed each year to the reserve fund from monthly common expenses.<br/>** Other Contributions refers to special assessments or surplus transfers from other sources (operating budget, contingency fund).<br/>*** Expenditures presented as future inflated dollars (Class D estimates, ±50%). Actual costs to be confirmed by competitive tender.</p>

  <h2>4.10 Regulatory Requirements</h2>
  <p>The Depreciation Report is a dynamic document that will change over time as repairs are carried out and interest/inflation rates change. The Corporation is required to obtain an updated report with site inspection within <strong>three years</strong> of this study, per Section 6.21(2) of the Strata Property Regulation. As a guideline, we recommend maintaining a minimum reserve balance of <strong>${projectInfo.minBalancePct || 25}%</strong> of the total annual budgeted contribution to the operating fund, per Section 6.1(a)(ii).</p>
</div>

<!-- CERTIFICATION -->
<div class="chapter">
  <h1 class="ct">Certification</h1>
  <p>I/We certify, to the best of our knowledge and belief, that:</p>
  <ul>
    <li>The statements of fact contained in this report are true and correct.</li>
    <li>The reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions and are our personal, impartial, and unbiased professional analyses, opinions, and conclusions.</li>
    <li>We have no past, present, or prospective interest in the property that is the subject of this report, and no personal interest with respect to the parties involved.</li>
    <li>Our engagement in and compensation for making this report are not contingent upon developing or reporting predetermined results.</li>
    <li>These analyses, opinions, and conclusions were developed, and this report was prepared, in conformity with the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP).</li>
    <li>As of the date of this report, the undersigned has fulfilled the requirements of the Appraisal Institute of Canada's Continuing Professional Development Program.</li>
  </ul>
  <div style="display:flex;gap:80px;margin-top:50px">
    <div>
      <div class="sig"></div>
      <p style="font-weight:700;margin-bottom:2px">${projectInfo.advisor || "[Advisor Name & Designations]"}${projectInfo.advisorDesignations ? ", " + projectInfo.advisorDesignations : ""}</p>
      <p style="color:#5a4a3a;font-size:10pt">${projectInfo.advisorRole || "Lead Author"} · ${projectInfo.firm || "StrataWise Consulting"}</p>
      <p style="color:#8a7a6a;font-size:9pt">${projectInfo.advisorLicense ? `License No. ${projectInfo.advisorLicense}` : ""}</p>
      <p style="color:#8a7a6a;font-size:9pt">${projectInfo.reportDate || new Date().toISOString().split("T")[0]}</p>
    </div>
    ${projectInfo.cosigner ? `<div>
      <div class="sig"></div>
      <p style="font-weight:700;margin-bottom:2px">${projectInfo.cosigner}${projectInfo.cosignerDesignations ? ", " + projectInfo.cosignerDesignations : ""}</p>
      <p style="color:#5a4a3a;font-size:10pt">${projectInfo.cosignerRole || "Reviewer / QA"}</p>
    </div>` : ""}
  </div>
</div>

<!-- APPENDIX A: ASSUMPTIONS -->
<div class="chapter">
  <h1 class="ct">Appendix A — Assumptions &amp; Limiting Conditions</h1>
  <ul>
    <li>The inspection was a visual, non-intrusive examination only. No destructive testing, probing, or sampling was performed.</li>
    <li>Cost estimates are based on RS Means Commercial Renovation Cost Data adjusted for Metro Vancouver location and date, combined with local contractor pricing data. All estimates are Class D (±50%) unless otherwise noted.</li>
    <li>All cost estimates include applicable 5% Goods and Services Tax (GST). PST is not applied to new construction or major renovations in BC.</li>
    <li>This report is primarily intended as a budgeting tool. Actual expenditures must be based on specific conditions at the time of replacement and supported by competitive contractor quotes.</li>
    <li>Actual lifespans may vary depending on maintenance practices, climatic conditions, usage patterns, and quality of original installation.</li>
    <li>No warranties or guarantees are expressed or implied as to the condition of any component not observable during the visual inspection.</li>
    <li>The advisor has no responsibility for matters of a legal nature affecting the subject property, nor for matters requiring professional engineering assessment beyond the scope stated herein.</li>
    <li>While major projects may appear to occur in a single year in the capital plan (due to assigning life expectancies in general five-year increments), in reality projects will be completed in discrete years. As this report is updated over time, timing adjustments can be made as necessary.</li>
    <li>This report has been prepared in conformance with the Reserve Fund Study standards of the Appraisal Institute of Canada (CUSPAP) and in compliance with Section 6.2 of the BC Strata Property Regulation.</li>
  </ul>
  <div class="disc">
    <strong>Copyright Notice:</strong> This report is authorized for use by ${projectInfo.strataName || "the Authorized Client"} and the strata corporation named herein. All rights reserved. No part of this report may be reproduced, distributed, or utilized in any form without written permission from the author, in compliance with the Personal Information Protection Act (PIPA) and applicable copyright law.
  </div>
</div>

</body></html>`;

  const htmlContent = generateHTML();
  const handlePrint = () => { const w = window.open("","_blank"); w.document.write(htmlContent); w.document.close(); setTimeout(() => w.print(), 800); };
  const handleDownload = () => { const b = new Blob([htmlContent], {type:"text/html"}); const u = URL.createObjectURL(b); const a = document.createElement("a"); a.href=u; a.download=`Depreciation_Report_${projectInfo.strataNumber||"Draft"}_${new Date().toISOString().split("T")[0]}.html`; a.click(); URL.revokeObjectURL(u); };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#2a2a2a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#1a1a1a", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}><Icon name="back" size={14} /> Back to Editor</button>
        <div style={{ color: "#c8a96e", fontSize: 13, fontWeight: 600 }}>{projectInfo.strataName || "Report Preview"} — CUSPAP Depreciation Report</div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={handleDownload} style={{ background: "rgba(200,169,110,0.15)", border: "1px solid rgba(200,169,110,0.4)", borderRadius: 8, padding: "8px 16px", color: "#c8a96e", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}><Icon name="download" size={14} /> Download HTML</button>
          <button onClick={handlePrint} style={{ background: "linear-gradient(135deg, #c8a96e, #b8942a)", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0d2137", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}><Icon name="preview" size={14} /> Print / Save PDF</button>
        </div>
      </div>
      <div style={{ flex: 1, padding: "24px 32px", display: "flex", justifyContent: "center", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 980, boxShadow: "0 8px 48px rgba(0,0,0,0.6)", borderRadius: 4, overflow: "hidden" }}>
          <iframe srcDoc={htmlContent} style={{ width: "100%", height: "calc(100vh - 120px)", border: "none", background: "#fff", display: "block" }} title="Report Preview" />
        </div>
      </div>
    </div>
  );
}

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 24, color: "#0d2137", letterSpacing: 1, marginBottom: 4 }}>{title}</h1>
      {subtitle && <div style={{ fontSize: 13, color: "#7a6a5a" }}>{subtitle}</div>}
      <div style={{ height: 2, background: "linear-gradient(90deg, #c8a96e, transparent)", marginTop: 12, borderRadius: 1 }} />
    </div>
  );
}
function Card({ title, children, style = {} }) {
  return (
    <div style={{ background: "#fffef8", border: "1px solid #d8c8b0", borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", marginBottom: 16, ...style }}>
      {title && <div style={{ padding: "12px 20px", background: "#f0e8d8", borderBottom: "1px solid #d8c8b0", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", fontWeight: 700 }}>{title}</div>}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
function SubLabel({ children }) {
  return <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a5a", marginBottom: 6, marginTop: 4 }}>{children}</div>;
}
const iS = { width: "100%", padding: "9px 12px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 13, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" };
const tS = { width: "100%", padding: "9px 12px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 13, fontFamily: "'Georgia', serif", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 14 };
const mIS = { width: 140, padding: "6px 10px", border: "1px solid #c8b89a", borderRadius: 4, background: "#fffef8", fontSize: 12, fontFamily: "'Georgia', serif", textAlign: "right" };
