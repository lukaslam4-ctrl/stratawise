import { useState, useEffect, useCallback, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const USER_ID = "default_user";

// ─── CONSTANTS ───────────────────────────────────────────────────────────────

const COMPONENT_LIBRARY = [
  { id: "substructure", category: "Structural & Architectural", name: "Substructure / Foundation", desc: "Concrete foundations, footings, and below-grade structural elements supporting the building." },
  { id: "parkade_membrane", category: "Structural & Architectural", name: "Parkade / Overburdened Membrane", desc: "Waterproofing membrane systems over parkade structures, including traffic-bearing and pedestrian surfaces." },
  { id: "wood_siding", category: "Structural & Architectural", name: "Wood Siding", desc: "Exterior wood-based cladding including lap siding, shiplap, board and batten, and related trim." },
  { id: "brick_siding", category: "Structural & Architectural", name: "Structural Brick / Masonry Siding", desc: "Brick veneer, concrete block, or masonry cladding systems on exterior building envelope." },
  { id: "windows", category: "Structural & Architectural", name: "Aluminum Frame Windows", desc: "Thermally broken aluminum frame windows with insulated glazing units." },
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
  { id: "exhaust_fan", category: "Mechanical Systems", name: "Fan / Exhaust System", desc: "Parkade and common area ventilation fans, controls, and associated ductwork." },
  { id: "water_dist", category: "Mechanical Systems", name: "Subsurface Domestic Water Distribution", desc: "Underground water supply piping serving the strata development." },
  { id: "boiler", category: "Mechanical Systems", name: "Boiler / Heating System", desc: "Central heating plant including boilers, pumps, controls, and distribution piping." },
  { id: "hot_water", category: "Mechanical Systems", name: "Domestic Hot Water Heater", desc: "Central or suite-level water heating equipment." },
  { id: "hvac", category: "Mechanical Systems", name: "HVAC / Heat Pump System", desc: "Heating, ventilation, and air conditioning systems serving common or individual areas." },
  { id: "electrical", category: "Electrical Systems", name: "Electrical Service and Distribution", desc: "Main switchgear, panel boards, metering, and branch distribution." },
  { id: "gas_sensor", category: "Electrical Systems", name: "Gas Sensor / CO Detection", desc: "Fixed gas detection system in parkade and mechanical rooms." },
  { id: "parkade_lighting", category: "Electrical Systems", name: "Parkade Lighting", desc: "Fluorescent or LED lighting fixtures, controls, and wiring in parking areas." },
  { id: "exterior_lighting", category: "Electrical Systems", name: "Exterior Lighting", desc: "Site and building exterior lighting including fixtures, poles, and controls." },
  { id: "fire_system", category: "Electrical Systems", name: "Fire Alarm / Suppression System", desc: "Fire alarm panels, detectors, pull stations, and sprinkler systems." },
  { id: "intercom", category: "Electrical Systems", name: "Intercom / Access Control System", desc: "Building entry intercom, key fobs, and access control hardware." },
  { id: "elevator", category: "Amenities", name: "Elevator", desc: "Passenger elevator cab, mechanical, controls, and hoistway equipment." },
  { id: "mailboxes", category: "Amenities", name: "Mailboxes", desc: "Canada Post approved mail delivery units in common entry areas." },
  { id: "amenity_room", category: "Amenities", name: "Amenity / Clubhouse Room", desc: "Common room, gym, or multipurpose space including finishes and equipment." },
  { id: "landscaping", category: "Site Improvements", name: "Landscaping", desc: "Trees, shrubs, groundcover, irrigation, and soft landscaping in common areas." },
  { id: "concrete_patios", category: "Site Improvements", name: "Concrete Patios (Repair)", desc: "Cast-in-place concrete patio slabs in common areas requiring periodic repair." },
  { id: "concrete_walkways", category: "Site Improvements", name: "Concrete Walkways (Repair)", desc: "Pedestrian walkway slabs on common property." },
  { id: "wood_fencing", category: "Site Improvements", name: "Wood Fencing", desc: "Perimeter and privacy wood fencing on common property." },
  { id: "metal_railings", category: "Site Improvements", name: "Exterior Metal Railings", desc: "Ornamental and safety railings at stairs, balconies, and walkways." },
  { id: "asphalt_paving", category: "Site Improvements", name: "Asphalt Paving", desc: "Surface parking, driveways, and lanes paved with asphalt concrete." },
  { id: "retaining_walls", category: "Site Improvements", name: "Retaining Walls", desc: "Concrete or masonry retaining structures on common property." },
  { id: "depreciation_report", category: "Report", name: "Depreciation Report (Professional Fee)", desc: "Cost of commissioning a professional depreciation report update as required by the BC Strata Property Act." },
];

const RS_MEANS_ITEMS = [
  { id: "demo_general", category: "Demolition", name: "General Demolition – Light Frame", unit: "SF", rate: 2.85 },
  { id: "demo_concrete", category: "Demolition", name: "Concrete Demolition – Slab", unit: "SF", rate: 6.40 },
  { id: "demo_roofing", category: "Demolition", name: "Roofing Removal – Shingles", unit: "SQ", rate: 85.00 },
  { id: "demo_membrane", category: "Demolition", name: "Membrane Roofing Removal", unit: "SQ", rate: 120.00 },
  { id: "demo_siding", category: "Demolition", name: "Wood Siding Removal", unit: "SF", rate: 1.95 },
  { id: "demo_windows", category: "Demolition", name: "Window Removal", unit: "EA", rate: 145.00 },
  { id: "demo_doors", category: "Demolition", name: "Door Removal", unit: "EA", rate: 85.00 },
  { id: "demo_railing", category: "Demolition", name: "Metal Railing Removal", unit: "LF", rate: 12.50 },
  { id: "conc_flatwork", category: "Concrete", name: "Concrete Flatwork 4\" Slab", unit: "SF", rate: 9.20 },
  { id: "conc_stairs", category: "Concrete", name: "Concrete Stairs – Cast-in-Place", unit: "EA", rate: 3800.00 },
  { id: "conc_repair", category: "Concrete", name: "Concrete Repair – Patching", unit: "SF", rate: 18.50 },
  { id: "waterproof_trafficbearing", category: "Waterproofing", name: "Traffic-Bearing Membrane – Vehicular", unit: "SF", rate: 22.00 },
  { id: "waterproof_pedestrian", category: "Waterproofing", name: "Pedestrian Waterproof Membrane", unit: "SF", rate: 16.50 },
  { id: "waterproof_sbs", category: "Waterproofing", name: "SBS Modified Bitumen Roofing", unit: "SQ", rate: 485.00 },
  { id: "waterproof_tpo", category: "Waterproofing", name: "TPO Single-Ply Roofing", unit: "SQ", rate: 420.00 },
  { id: "roofing_shingle", category: "Roofing", name: "Asphalt Shingles – 30yr Architectural", unit: "SQ", rate: 380.00 },
  { id: "roofing_underlay", category: "Roofing", name: "Synthetic Roofing Underlayment", unit: "SQ", rate: 45.00 },
  { id: "roofing_flashing", category: "Roofing", name: "Sheet Metal Flashing", unit: "LF", rate: 28.00 },
  { id: "roofing_ridge", category: "Roofing", name: "Ridge Cap Shingles", unit: "LF", rate: 8.50 },
  { id: "siding_wood", category: "Exterior Cladding", name: "Wood Siding – Cedar Bevel", unit: "SF", rate: 14.20 },
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
  { id: "railing_steel", category: "Metals", name: "Steel Railing – Powder Coated", unit: "LF", rate: 165.00 },
  { id: "fascia_wood", category: "Carpentry", name: "Wood Fascia Board – 1x8 Cedar", unit: "LF", rate: 18.00 },
  { id: "soffit_wood", category: "Carpentry", name: "Wood Soffit – T&G Cedar", unit: "SF", rate: 16.50 },
  { id: "stair_wood", category: "Carpentry", name: "Wood Exterior Stair – Treated Lumber", unit: "FLIGHT", rate: 2800.00 },
  { id: "gutter_alum", category: "Sheet Metal", name: "Aluminum Eavestrough – 5\" K-Style", unit: "LF", rate: 18.50 },
  { id: "downspout_alum", category: "Sheet Metal", name: "Aluminum Downspout – 3\"x4\"", unit: "LF", rate: 12.00 },
  { id: "skylight_fixed", category: "Skylights", name: "Fixed Skylight Unit – Flat Glass", unit: "EA", rate: 2800.00 },
  { id: "roof_hatch_rs", category: "Roof Accessories", name: "Insulated Roof Access Hatch – 30x54", unit: "EA", rate: 3200.00 },
  { id: "chimney_metal", category: "Mechanical", name: "Factory-Built Metal Chimney – 8\" dia", unit: "LF", rate: 85.00 },
  { id: "exhaust_fan_rs", category: "Mechanical", name: "Exhaust Fan – Parkade Jet Fan", unit: "EA", rate: 4500.00 },
  { id: "water_pipe", category: "Mechanical", name: "Underground Water Main – 4\" PVC", unit: "LF", rate: 145.00 },
  { id: "lighting_led_exterior", category: "Electrical", name: "LED Exterior Wall Pack Fixture", unit: "EA", rate: 380.00 },
  { id: "lighting_led_parkade", category: "Electrical", name: "LED Parkade Strip Fixture", unit: "EA", rate: 320.00 },
  { id: "electrical_panel", category: "Electrical", name: "Main Electrical Panel – 200A", unit: "EA", rate: 4800.00 },
  { id: "gas_sensor_unit", category: "Electrical", name: "Gas Detection Sensor Unit", unit: "EA", rate: 850.00 },
  { id: "mailbox_unit", category: "Specialties", name: "Canada Post Mailbox Unit – 8 Slot", unit: "EA", rate: 1200.00 },
  { id: "fencing_wood", category: "Site", name: "Wood Privacy Fence – 6ft Cedar", unit: "LF", rate: 68.00 },
  { id: "asphalt_pave", category: "Site", name: "Asphalt Paving – 3\" Surface Course", unit: "SF", rate: 4.80 },
  { id: "landscaping_general", category: "Site", name: "Landscaping – General Planting", unit: "LS", rate: 1.00 },
  { id: "report_fee", category: "Professional Fees", name: "Depreciation Report Professional Fee", unit: "LS", rate: 1.00 },
];

const CONDITION_OPTIONS = ["Excellent", "Good", "Fair", "Poor", "Critical"];
const CATEGORY_COLORS = {
  "Structural & Architectural": "#1a4a6b",
  "Finishes & Decoration": "#2d6a4f",
  "Mechanical Systems": "#7b3f00",
  "Electrical Systems": "#4a1a6b",
  "Amenities": "#1a5c6b",
  "Site Improvements": "#3d5a00",
  "Report": "#5c3d00",
};

// ─── MOCK USERS ───────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "u1", email: "advisor1@stratawise.ca", password: "password1", name: "Sarah Chen, AACI", role: "Senior Advisor" },
  { id: "u2", email: "advisor2@stratawise.ca", password: "password2", name: "James Park, CRP", role: "Reserve Fund Advisor" },
  { id: "u3", email: "advisor3@stratawise.ca", password: "password3", name: "Mei Lin, RI(BC)", role: "Reserve Fund Advisor" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n, decimals = 0) =>
  new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n || 0);

const groupBy = (arr, key) =>
  arr.reduce((acc, item) => { (acc[item[key]] = acc[item[key]] || []).push(item); return acc; }, {});

const newProjectTemplate = () => ({
  id: `proj_${Date.now()}`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  status: "draft",
  projectInfo: {
    strataName: "", strataNumber: "", address: "", city: "Vancouver", province: "BC", postalCode: "",
    builtYear: "", units: "", inspectionDate: "", reportDate: "", advisor: "", firm: "StrataWise Consulting",
    advisorDesignations: "", advisorLicense: "", cosigner: "", cosignerDesignations: "",
    firmPhone: "", firmWebsite: "", firmAddress: "",
    propertyManager: "", propertyManagerAddress: "",
    previousReportYear: "", governingDocumentsNotes: "",
    constructionInflation: 3.8, interestRate: 3.1, cpiInflation: 2.0, buildingLife: 100, minBalance: 32000,
    fiscalMonthStart: "January",
  },
  components: [],
  financials: {
    openingYear: new Date().getFullYear() - 4,
    years: Array(5).fill(null).map((_, i) => ({
      year: new Date().getFullYear() - 4 + i,
      openingBalance: 0, rfContribution: 0, interest: 0, specialLevy: 0, transferIn: 0, expenditures: {},
    })),
  },
  fundingModel: { activeModel: "adequate" },
});

function useStorage(key, init) {
  const [val, setVal] = useState(init);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("projects")
      .select("data")
      .eq("user_id", USER_ID)
      .eq("id", key)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setVal(data.data);
        setLoaded(true);
      });
  }, [key]);

  const set = useCallback((v) => {
    const resolved = typeof v === "function" ? v(val) : v;
    setVal(resolved);
    supabase.from("projects").upsert({
      id: key,
      user_id: USER_ID,
      data: resolved,
      updated_at: new Date().toISOString(),
    });
  }, [key, val]);

  return [val, set];
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16 }) => {
  const icons = {
    building: "M3 21h18M6 21V7l6-4 6 4v14M9 21v-4h6v4M9 9h1m4 0h1M9 13h1m4 0h1",
    plus: "M12 5v14M5 12h14",
    trash: "M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6",
    upload: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12",
    dollar: "M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
    chart: "M18 20V10M12 20V4M6 20v-6",
    settings: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z",
    download: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3",
    check: "M20 6L9 17l-5-5",
    x: "M18 6L6 18M6 6l12 12",
    info: "M12 8h.01M12 12v4M21 12a9 9 0 11-18 0 9 9 0 0118 0",
    chevron_down: "M6 9l6 6 6-6",
    chevron_right: "M9 18l6-6-6-6",
    edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
    library: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2zM9 22V12h6v10",
    finance: "M2 2h20v20H2zM6 12h12M6 8h12M6 16h8",
    logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    folder: "M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
    lock: "M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2zM7 11V7a5 5 0 0110 0v4",
    user: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 100 8 4 4 0 000-8z",
    calendar: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
    clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
    back: "M19 12H5M12 19l-7-7 7-7",
    preview: "M15 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7zM14 2v5h5M9 9h6M9 13h6M9 17h4",
    save: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2zM17 21v-8H7v8M7 3v5h8",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={icons[name] || icons.info} />
    </svg>
  );
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const DEFAULT_USER = { id: "guest", email: "guest@stratawise.ca", name: "Guest Advisor", role: "Reserve Fund Advisor" };

export default function App() {
  const [currentUser] = useState(DEFAULT_USER);
  const [projects, setProjects] = useStorage("dr_projects", []);
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [view, setView] = useState("dashboard"); // dashboard | editor | preview

  const activeProject = projects.find(p => p.id === activeProjectId);

  const handleLogout = () => { setActiveProjectId(null); setView("dashboard"); };

  const createProject = () => {
    const proj = newProjectTemplate();
    proj.projectInfo.advisor = currentUser.name;
    proj.ownerId = currentUser.id;
    setProjects(prev => [...prev, proj]);
    setActiveProjectId(proj.id);
    setView("editor");
  };

  const updateProject = (updates) => {
    setProjects(prev => prev.map(p =>
      p.id === activeProjectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
    ));
  };

  const deleteProject = (id) => {
    if (window.confirm("Delete this project permanently?")) {
      setProjects(prev => prev.filter(p => p.id !== id));
      if (activeProjectId === id) { setActiveProjectId(null); setView("dashboard"); }
    }
  };

  const openProject = (id) => { setActiveProjectId(id); setView("editor"); };
  const openPreview = (id) => { setActiveProjectId(id); setView("preview"); };

  if (view === "preview" && activeProject) {
    return <PDFPreview project={activeProject} onBack={() => setView("editor")} />;
  }

  if (view === "editor" && activeProject) {
    return (
      <ReportEditor
        project={activeProject}
        onUpdate={updateProject}
        onBack={() => { setActiveProjectId(null); setView("dashboard"); }}
        onPreview={() => setView("preview")}
        currentUser={currentUser}
      />
    );
  }

  return (
    <Dashboard
      currentUser={currentUser}
      projects={projects.filter(p => p.ownerId === currentUser.id)}
      onLogout={handleLogout}
      onCreate={createProject}
      onOpen={openProject}
      onPreview={openPreview}
      onDelete={deleteProject}
    />
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) { onLogin(user); }
    else { setError("Invalid email or password."); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #0a1a2e 0%, #0d2137 50%, #0a1a2e 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div style={{ width: 440, padding: "0 20px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ background: "linear-gradient(135deg, #c8a96e, #e8c88e)", borderRadius: 10, padding: "10px 14px", color: "#0d2137", fontWeight: 700, fontSize: 14, letterSpacing: 2 }}>SW</div>
            <div>
              <div style={{ color: "#c8a96e", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>BC Strata</div>
              <div style={{ color: "#fff", fontSize: 22, fontWeight: 700, letterSpacing: 1 }}>StrataWise</div>
            </div>
          </div>
          <div style={{ color: "rgba(200,169,110,0.6)", fontSize: 12, letterSpacing: 2, textTransform: "uppercase" }}>Depreciation Report System</div>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(200,169,110,0.2)", borderRadius: 16, padding: 40, backdropFilter: "blur(10px)" }}>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Sign In</div>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 13, marginBottom: 28 }}>Reserve Fund Advisor Portal</div>

          {error && (
            <div style={{ background: "rgba(192,57,43,0.15)", border: "1px solid rgba(192,57,43,0.4)", borderRadius: 8, padding: "10px 14px", color: "#ff8a7a", fontSize: 13, marginBottom: 20 }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", color: "rgba(200,169,110,0.8)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="advisor@stratawise.ca"
                style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,169,110,0.25)", borderRadius: 8, color: "#fff", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", color: "rgba(200,169,110,0.8)", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  style={{ width: "100%", padding: "12px 48px 12px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(200,169,110,0.25)", borderRadius: 8, color: "#fff", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer" }}>
                  <Icon name="eye" size={16} />
                </button>
              </div>
            </div>
            <button type="submit" style={{ width: "100%", padding: "14px", background: "linear-gradient(135deg, #c8a96e, #b8942a)", border: "none", borderRadius: 8, color: "#0d2137", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Georgia', serif", letterSpacing: 1 }}>
              Sign In to Portal
            </button>
          </form>

          <div style={{ marginTop: 28, padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>Demo Credentials</div>
            {MOCK_USERS.map(u => (
              <div key={u.id} style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>
                <span style={{ color: "rgba(200,169,110,0.6)" }}>{u.email}</span> · password: {u.password.replace(/./g, "•")} ({u.name.split(",")[0]})
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ currentUser, projects, onLogout, onCreate, onOpen, onPreview, onDelete }) {
  const stats = {
    total: projects.length,
    draft: projects.filter(p => p.status === "draft").length,
    complete: projects.filter(p => p.status === "complete").length,
    totalValue: projects.reduce((s, p) => s + (p.components || []).reduce((cs, c) => cs + (c.totalCost || 0), 0), 0),
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f5f0e8", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #0d2137 100%)", padding: "0 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1300, margin: "0 auto", display: "flex", alignItems: "center", padding: "18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ background: "linear-gradient(135deg, #c8a96e, #e8c88e)", borderRadius: 8, padding: "7px 11px", color: "#0d2137", fontWeight: 700, fontSize: 11, letterSpacing: 2 }}>SW</div>
            <div>
              <div style={{ color: "#c8a96e", fontSize: 10, letterSpacing: 3, textTransform: "uppercase" }}>StrataWise</div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700, letterSpacing: 0.5 }}>Depreciation Report System</div>
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: "#fff", fontSize: 13, fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ color: "rgba(200,169,110,0.7)", fontSize: 11 }}>{currentUser.role}</div>
            </div>
            <button onClick={onLogout} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 14px", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <Icon name="logout" size={14} /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1300, margin: "0 auto", padding: "32px" }}>
        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Total Projects", val: stats.total, color: "#1a3a5c" },
            { label: "In Progress", val: stats.draft, color: "#7b3f00" },
            { label: "Completed", val: stats.complete, color: "#2d6a4f" },
            { label: "Total Assets Analyzed", val: fmt(stats.totalValue), color: "#4a1a6b" },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 12, padding: "20px 24px" }}>
              <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#c8a96e", marginBottom: 10 }}>{label}</div>
              <div style={{ fontSize: typeof val === "string" ? 18 : 28, fontWeight: 700, color: "#fff" }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Projects Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, color: "#0d2137" }}>My Projects</div>
            <div style={{ fontSize: 13, color: "#7a6a5a", marginTop: 2 }}>Depreciation reports assigned to {currentUser.name.split(",")[0]}</div>
          </div>
          <button onClick={onCreate} style={{ background: "#1a3a5c", color: "#c8a96e", border: "none", borderRadius: 10, padding: "12px 24px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 10, fontFamily: "'Georgia', serif", letterSpacing: 1, fontWeight: 600 }}>
            <Icon name="plus" size={15} /> New Report
          </button>
        </div>

        {/* Project List */}
        {projects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px", background: "#fffef8", borderRadius: 16, border: "2px dashed #c8b89a" }}>
            <Icon name="folder" size={48} />
            <div style={{ marginTop: 16, fontSize: 18, color: "#5a4a3a", fontWeight: 600 }}>No reports yet</div>
            <div style={{ fontSize: 13, color: "#8a7a6a", marginTop: 8 }}>Create your first depreciation report to get started.</div>
            <button onClick={onCreate} style={{ marginTop: 20, background: "#1a3a5c", color: "#c8a96e", border: "none", borderRadius: 8, padding: "12px 24px", cursor: "pointer", fontSize: 14, fontFamily: "'Georgia', serif" }}>
              Create First Report
            </button>
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
  const completedFields = [projectInfo.strataName, projectInfo.address, projectInfo.builtYear, projectInfo.units, components.length > 0].filter(Boolean).length;
  const completionPct = Math.round((completedFields / 5) * 100);

  return (
    <div style={{ background: "#fffef8", border: "1px solid #d8c8b0", borderRadius: 12, padding: "20px 24px", display: "flex", alignItems: "center", gap: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ background: status === "complete" ? "#2d6a4f" : "#1a3a5c", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 20 }}>
        <Icon name="building" size={24} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: "#1a2a3a", fontFamily: "'Georgia', serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {projectInfo.strataName || "Untitled Strata"}
          </div>
          <div style={{ background: status === "complete" ? "#e8f5e9" : "#fff8e1", border: `1px solid ${status === "complete" ? "#a5d6a7" : "#ffe082"}`, borderRadius: 20, padding: "2px 10px", fontSize: 10, color: status === "complete" ? "#2d6a4f" : "#7b5e00", letterSpacing: 1, textTransform: "uppercase", whiteSpace: "nowrap" }}>
            {status}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#8a7a6a", display: "flex", gap: 16, flexWrap: "wrap" }}>
          {projectInfo.strataNumber && <span>Plan {projectInfo.strataNumber}</span>}
          {projectInfo.address && <span>{projectInfo.address}, {projectInfo.city}</span>}
          {projectInfo.builtYear && <span>Built {projectInfo.builtYear}</span>}
          {projectInfo.units && <span>{projectInfo.units} units</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "center", flexShrink: 0 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a5c" }}>{components.length}</div>
          <div style={{ fontSize: 10, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1 }}>Components</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a5c" }}>{fmt(totalCost)}</div>
          <div style={{ fontSize: 10, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1 }}>Total Cost</div>
        </div>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#1a3a5c" }}>{completionPct}%</div>
          <div style={{ fontSize: 10, color: "#8a7a6a", textTransform: "uppercase", letterSpacing: 1 }}>Complete</div>
          <div style={{ width: 60, height: 4, background: "#e0d8cc", borderRadius: 2, marginTop: 4, overflow: "hidden" }}>
            <div style={{ width: `${completionPct}%`, height: "100%", background: completionPct === 100 ? "#2d6a4f" : "#c8a96e", borderRadius: 2 }} />
          </div>
        </div>
        <div style={{ fontSize: 11, color: "#8a7a6a", textAlign: "right" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Icon name="clock" size={11} /> {new Date(updatedAt).toLocaleDateString("en-CA")}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={() => onPreview(id)} title="Preview Report" style={{ background: "#f0e8d8", border: "1px solid #c8b89a", borderRadius: 8, padding: "8px 12px", cursor: "pointer", color: "#5a4a3a", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
          <Icon name="preview" size={14} /> Preview
        </button>
        <button onClick={() => onOpen(id)} style={{ background: "#1a3a5c", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", color: "#c8a96e", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontFamily: "'Georgia', serif" }}>
          <Icon name="edit" size={14} /> Edit
        </button>
        <button onClick={() => onDelete(id)} style={{ background: "none", border: "1px solid #e8d0d0", borderRadius: 8, padding: "8px 10px", cursor: "pointer", color: "#c0392b" }}>
          <Icon name="trash" size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── REPORT EDITOR ────────────────────────────────────────────────────────────
function ReportEditor({ project, onUpdate, onBack, onPreview, currentUser }) {
  const [activeTab, setActiveTab] = useState("project");
  const [saveIndicator, setSaveIndicator] = useState(false);

  const autosave = (updates) => {
    onUpdate(updates);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 2000);
  };

  const setProjectInfo = (info) => autosave({ projectInfo: info });
  const setComponents = (components) => autosave({ components });
  const setFinancials = (financials) => autosave({ financials });
  const setFundingModel = (fundingModel) => autosave({ fundingModel });

  const tabs = [
    { id: "project", label: "Project Setup", icon: "settings" },
    { id: "components", label: "Components", icon: "library" },
    { id: "costing", label: "Costing", icon: "dollar" },
    { id: "projections", label: "Projections", icon: "chart" },
    { id: "financials", label: "Financials", icon: "finance" },
    { id: "funding", label: "Funding Models", icon: "chart" },
  ];

  const strataName = project.projectInfo.strataName || "Untitled Strata";

  return (
    <div style={{ fontFamily: "'Georgia', 'Times New Roman', serif", background: "#f5f0e8", minHeight: "100vh", color: "#1a1a1a" }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #0d2137 0%, #1a3a5c 50%, #0d2137 100%)", padding: "0 32px", boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 0 0" }}>
            <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "7px 14px", color: "rgba(255,255,255,0.6)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
              <Icon name="back" size={14} /> Projects
            </button>
            <div style={{ color: "rgba(200,169,110,0.5)", fontSize: 18 }}>›</div>
            <div>
              <div style={{ color: "#c8a96e", fontSize: 11, letterSpacing: 2, textTransform: "uppercase" }}>Editing Report</div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{strataName}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
              {saveIndicator && <div style={{ color: "#c8a96e", fontSize: 11, letterSpacing: 1, display: "flex", alignItems: "center", gap: 6 }}><Icon name="check" size={12} /> Saved</div>}
              <button onClick={onPreview} style={{ background: "linear-gradient(135deg, #c8a96e, #b8942a)", border: "none", borderRadius: 8, padding: "9px 20px", color: "#0d2137", cursor: "pointer", fontSize: 12, fontFamily: "'Georgia', serif", letterSpacing: 1, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="preview" size={14} /> Preview Report
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 0, marginTop: 14, overflowX: "auto" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                background: activeTab === t.id ? "rgba(200,169,110,0.15)" : "transparent",
                border: "none", borderBottom: activeTab === t.id ? "3px solid #c8a96e" : "3px solid transparent",
                color: activeTab === t.id ? "#c8a96e" : "rgba(255,255,255,0.6)",
                padding: "12px 20px", cursor: "pointer", fontSize: 12, letterSpacing: 1,
                textTransform: "uppercase", display: "flex", alignItems: "center", gap: 8,
                whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: "'Georgia', serif",
              }}>
                <Icon name={t.icon} size={13} /> {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "32px" }}>
        {activeTab === "project" && <ProjectSetup info={project.projectInfo} onChange={setProjectInfo} />}
        {activeTab === "components" && <ComponentsTab selected={project.components} onChange={setComponents} />}
        {activeTab === "costing" && <CostingTab components={project.components} onChange={setComponents} />}
        {activeTab === "projections" && <ProjectionsTab components={project.components} projectInfo={project.projectInfo} />}
        {activeTab === "financials" && <FinancialsTab financials={project.financials} onChange={setFinancials} components={project.components} />}
        {activeTab === "funding" && <FundingModelsTab components={project.components} financials={project.financials} projectInfo={project.projectInfo} fundingModel={project.fundingModel} onChange={setFundingModel} />}
      </div>
    </div>
  );
}

// ─── PDF PREVIEW ──────────────────────────────────────────────────────────────
function PDFPreview({ project, onBack }) {
  const { projectInfo, components, financials, fundingModel } = project;

  const fmt2 = (n, d = 0) => new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);
  const fmtN = (n, d = 0) => new Intl.NumberFormat("en-CA", { minimumFractionDigits: d, maximumFractionDigits: d }).format(n || 0);

  const currentYear = projectInfo.inspectionDate ? new Date(projectInfo.inspectionDate).getFullYear() : new Date().getFullYear();
  const ci = (projectInfo.constructionInflation || 3.8) / 100;
  const ir = (projectInfo.interestRate || 3.1) / 100;
  const cpi = (projectInfo.cpiInflation || 2.0) / 100;
  const buildingLife = projectInfo.buildingLife || 100;
  const builtYear = parseInt(projectInfo.builtYear) || (currentYear - 38);
  const numYears = Math.min(30, builtYear + buildingLife - currentYear);
  const projYears = Array.from({ length: numYears }, (_, i) => currentYear + i + 1);
  const fy = projectInfo.fiscalMonthStart || "January";
  const fyShort = fy.slice(0,3);
  const fyLabel = (yr) => `${fyShort} ${yr}\u2014${fyShort} ${yr+1}`;

  const lastFinYear = financials.years[financials.years.length - 1];
  const lastInc = (lastFinYear?.rfContribution || 0) + (lastFinYear?.interest || 0) + (lastFinYear?.specialLevy || 0) + (lastFinYear?.transferIn || 0);
  const lastExp = Object.values(lastFinYear?.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const reportOpeningBalance = Math.round((lastFinYear?.openingBalance || 0) + lastInc - lastExp);
  const totalCost = (components || []).reduce((s, c) => s + (c.totalCost || 0), 0);

  // ── Expenditures by projected year ──
  const expendByYear = {};
  projYears.forEach(yr => {
    expendByYear[yr] = (components || []).reduce((sum, comp) => {
      let next = currentYear + Math.max(0, comp.lifespan - comp.effectiveAge);
      while (next <= currentYear + numYears) {
        if (next === yr) sum += (comp.totalCost || 0) * Math.pow(1 + ci, next - currentYear);
        next += comp.lifespan;
      }
      return sum;
    }, 0);
  });

  // ── Benchmark Analysis ──
  const fvgaf = (n, r, g) => Math.abs(r - g) < 0.0001 ? n * Math.pow(1+r, n-1) : (Math.pow(1+r,n) - Math.pow(1+g,n)) / (r - g);
  const benchRows = (components || []).map(comp => {
    const R = Math.max(0, comp.lifespan - comp.effectiveAge);
    const L = Math.max(1, comp.lifespan);
    const E = Math.max(0, comp.effectiveAge);
    const projNext = (comp.totalCost || 0) * Math.pow(1 + ci, R);
    const fvf = fvgaf(L, ir, cpi);
    const C0 = fvf > 0 ? (comp.totalCost || 0) / fvf : 0;
    const idealContrib = C0 * Math.pow(1 + cpi, E);
    const idealOpenBal = E > 0 ? C0 * fvgaf(E, ir, cpi) : 0;
    return { ...comp, projNext, idealContrib, idealOpenBal, R };
  });
  const totalIdealContrib = benchRows.reduce((s, r) => s + r.idealContrib, 0);
  const totalIdealOpenBal = benchRows.reduce((s, r) => s + r.idealOpenBal, 0);
  const totalProjNext = benchRows.reduce((s, r) => s + r.projNext, 0);

  // ── Adequate Funding schedule with Deficiency Analysis ──
  const lastContrib = lastFinYear?.rfContribution || totalIdealContrib * 0.15;
  const adequateSchedule = projYears.reduce((acc, year, i) => {
    const prevBalance = i === 0 ? reportOpeningBalance : acc[i - 1].closingBalance;
    const expend = expendByYear[year] || 0;
    const ramp = 0.15 + (0.85 * i / Math.max(projYears.length - 1, 1));
    let contrib = totalIdealContrib * ramp * Math.pow(1 + cpi, i);
    contrib = Math.max(contrib, lastContrib * Math.pow(1 + cpi, i + 1));
    const interest = Math.max(0, prevBalance - expend) * ir;
    const closing = prevBalance + contrib + interest - expend;
    const minBal = (projectInfo.minBalance || 32000) * Math.pow(1 + cpi, i);
    const specialLevy = closing < minBal ? minBal - closing : 0;
    const closingFinal = closing + specialLevy;
    // Ideal closing balance
    const idealClosing = totalIdealContrib > 0
      ? (i === 0 ? totalIdealOpenBal : acc[i-1].idealClosing) * (1 + ir) + totalIdealContrib * Math.pow(1 + cpi, i) - expend
      : 0;
    const deficiency = Math.max(0, idealClosing - closingFinal);
    const dcq = (contrib + interest) > 0 ? deficiency / (contrib + interest) : 0;
    acc.push({ year, openingBalance: prevBalance, contribution: contrib, interest, expenditure: expend,
               specialLevy, closingBalance: closingFinal, idealContrib: totalIdealContrib * Math.pow(1 + cpi, i),
               idealClosing, deficiency, dcq });
    return acc;
  }, []);

  // ── Generate HTML ──
  const generateHTML = () => {
    // Helper for component expenditure cells
    const compCells = (comp, years) => years.map(yr => {
      let next = currentYear + Math.max(0, comp.lifespan - comp.effectiveAge);
      let found = false;
      while (next <= currentYear + numYears) { if (next === yr) { found = true; break; } next += comp.lifespan; }
      const cost = found ? (comp.totalCost||0) * Math.pow(1+ci, yr - currentYear) : 0;
      return cost > 0
        ? `<td style="text-align:right;background:#eef2ff;font-weight:700;color:#1a3a5c;font-size:8pt">${fmt2(cost/1000,0)}K</td>`
        : `<td></td>`;
    }).join("");

    const histRows = financials.years.map(y => {
      const inc = (y.rfContribution||0)+(y.interest||0)+(y.specialLevy||0)+(y.transferIn||0);
      const exp = Object.values(y.expenditures||{}).reduce((a,b)=>a+(parseFloat(b)||0),0);
      const closing = (y.openingBalance||0)+inc-exp;
      return { ...y, totalExp: exp, closing };
    });

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Depreciation Report — ${projectInfo.strataName || "Strata Corporation"}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Cinzel:wght@400;600&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{font-family:'EB Garamond',Georgia,serif;font-size:11pt;color:#111;background:#fff;line-height:1.7}
  .page-header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #aaa;padding-bottom:6px;margin-bottom:28px;font-size:9pt;color:#555}
  .page-header strong{color:#111}
  .chapter{max-width:860px;margin:0 auto;padding:48px 60px;page-break-before:always}
  .chapter:first-of-type{page-break-before:avoid}
  h1.ch{font-family:'Cinzel',serif;font-size:14pt;color:#0a1a2e;border-bottom:2px solid #0a1a2e;padding-bottom:8px;margin-bottom:24px;letter-spacing:1px}
  h2.sec{font-family:'Cinzel',serif;font-size:11pt;color:#1a3a5c;margin:28px 0 12px;letter-spacing:0.5px}
  h3.sub{font-size:11pt;font-weight:700;color:#1a3a5c;margin:16px 0 6px}
  p{margin-bottom:12px;color:#222;font-size:11pt}
  ul{margin:0 0 14px 24px}
  ul li{margin-bottom:6px;font-size:11pt}
  /* Tables */
  table{width:100%;border-collapse:collapse;margin:14px 0;font-size:9.5pt}
  table.sm{font-size:8.5pt}
  th{background:#0d2137;color:#c8a96e;padding:7px 10px;text-align:left;font-family:'Cinzel',serif;font-size:7.5pt;letter-spacing:0.8px;white-space:nowrap}
  th.r{text-align:right}
  td{padding:6px 10px;border-bottom:1px solid #e8e0d0;vertical-align:top}
  td.r{text-align:right}
  tr:nth-child(even) td{background:#faf7f0}
  .tr-total td{background:#e8ddd0!important;font-weight:700;font-size:9pt}
  .tr-section td{background:#f0e8d8;font-weight:700;font-size:8pt;letter-spacing:1px;text-transform:uppercase;color:#5a4a3a;padding:7px 10px}
  .tr-dark td{background:#0d2137!important;color:#c8a96e;font-weight:700}
  /* Cover */
  .cover{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;padding:0;page-break-after:always;background:#fff}
  .cover-top{background:#0d2137;color:#fff;padding:40px 60px 50px}
  .cover-firm{font-size:10pt;letter-spacing:2px;color:rgba(200,169,110,0.8);margin-bottom:8px}
  .cover-firm-contact{font-size:9pt;color:rgba(255,255,255,0.5);margin-bottom:50px}
  .cover-title{font-family:'Cinzel',serif;font-size:38pt;color:#c8a96e;letter-spacing:5px;margin-bottom:6px;line-height:1.1}
  .cover-year{font-family:'Cinzel',serif;font-size:22pt;color:rgba(255,255,255,0.5);letter-spacing:4px;margin-bottom:40px}
  .cover-body{padding:50px 60px}
  .cover-prop-name{font-family:'Cinzel',serif;font-size:22pt;color:#0d2137;margin-bottom:8px}
  .cover-prop-addr{font-size:12pt;color:#3a3a3a;margin-bottom:4px}
  .cover-prop-detail{font-size:10pt;color:#7a6a5a;margin-bottom:30px}
  .cover-footer{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;border-top:1px solid #c8b89a;padding-top:20px;margin-top:20px}
  .cover-footer-item label{display:block;font-size:7.5pt;letter-spacing:2px;text-transform:uppercase;color:#8a7a6a;margin-bottom:4px}
  .cover-footer-item span{font-size:11pt;font-weight:700;color:#0d2137}
  /* Component block */
  .comp-block{border:1px solid #d0c8b8;border-radius:4px;margin:20px 0;page-break-inside:avoid;overflow:hidden}
  .comp-hdr{background:#0d2137;color:#fff;padding:10px 16px;display:flex;justify-content:space-between;align-items:baseline}
  .comp-hdr-title{font-family:'Cinzel',serif;font-size:10pt;color:#c8a96e;font-weight:600}
  .comp-hdr-cat{font-size:8.5pt;color:rgba(255,255,255,0.45)}
  .comp-stats{display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;border-bottom:1px solid #e8ddd0}
  .comp-stat{padding:12px 16px;border-right:1px solid #e8ddd0}
  .comp-stat:last-child{border-right:none}
  .comp-stat label{display:block;font-size:7pt;letter-spacing:2px;text-transform:uppercase;color:#8a7a6a;margin-bottom:3px}
  .comp-stat span{font-size:14pt;font-weight:700;color:#0d2137;font-family:'Cinzel',serif}
  .comp-stat small{display:block;font-size:8pt;color:#8a7a6a;margin-top:2px}
  .comp-body{padding:16px}
  .comp-row{display:grid;grid-template-columns:140px 1fr;gap:10px;margin-bottom:10px;font-size:10.5pt}
  .comp-row-label{font-weight:700;color:#1a3a5c;padding-top:1px}
  /* Disclaimer */
  .note{background:#fdf8f0;border-left:3px solid #c8a96e;padding:10px 14px;font-size:9.5pt;color:#4a3a2a;margin:14px 0;line-height:1.6}
  /* Sig */
  .sig-line{border-bottom:1px solid #0d2137;padding-bottom:50px;width:280px;margin-bottom:6px}
  /* TOC */
  .toc-row{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dotted #d0c8b8;font-size:10.5pt}
  .toc-indent{padding-left:20px}
  .toc-section{margin:14px 0 6px;font-family:'Cinzel',serif;font-size:10pt;font-weight:600;color:#1a3a5c;letter-spacing:0.5px}
  @media print{
    html,body{font-size:10pt}
    .cover{page-break-after:always}
    .chapter{page-break-before:always}
    .comp-block{page-break-inside:avoid}
    @page{margin:15mm 18mm;size:letter}
  }
</style>
</head>
<body>

<!-- ══ COVER ══ -->
<div class="cover">
  <div class="cover-top">
    <div class="cover-firm">${projectInfo.firm || "StrataWise Consulting"}</div>
    <div class="cover-firm-contact">${[projectInfo.firmPhone, projectInfo.firmWebsite].filter(Boolean).join("  ·  ")}</div>
    <div class="cover-title">DEPRECIATION<br>REPORT</div>
    <div class="cover-year">${new Date(projectInfo.reportDate || Date.now()).getFullYear()}</div>
  </div>
  <div class="cover-body">
    <div class="cover-prop-name">${projectInfo.strataName || "[Strata Corporation Name]"}</div>
    ${projectInfo.strataNumber ? `<div class="cover-prop-addr">${projectInfo.strataNumber}</div>` : ""}
    <div class="cover-prop-addr">${[projectInfo.address, projectInfo.city, projectInfo.province, projectInfo.postalCode].filter(Boolean).join(", ")}</div>
    <div class="cover-prop-detail">Constructed ${projectInfo.builtYear || "N/A"}${projectInfo.units ? `  ·  ${projectInfo.units} Strata Units` : ""}</div>
    <div style="margin-top:8px;font-size:10pt;color:#5a4a3a">powered by StrataWise Consulting</div>
    <div class="cover-footer">
      <div class="cover-footer-item"><label>Inspection Date</label><span>${projectInfo.inspectionDate || "—"}</span></div>
      <div class="cover-footer-item"><label>Report Date</label><span>${projectInfo.reportDate || "—"}</span></div>
      <div class="cover-footer-item"><label>Prepared By</label><span>${projectInfo.advisor || "—"}</span></div>
    </div>
  </div>
</div>

<!-- ══ TRANSMITTAL LETTER ══ -->
<div class="chapter" style="page-break-before:always">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <div style="margin-bottom:24px">
    <div style="font-weight:700;font-size:11pt">${projectInfo.strataName || "[Strata Corporation]"}</div>
    ${projectInfo.strataNumber ? `<div>${projectInfo.strataNumber}</div>` : ""}
    <div>${[projectInfo.address, projectInfo.city, projectInfo.province, projectInfo.postalCode].filter(Boolean).join(", ")}</div>
  </div>
  <p>We are pleased to present to you this depreciation report, which has been completed in compliance with the BC Strata Property Act as amended to date. This comprehensive report provides current and future reserve expenditure estimates, as well as recommendations for reserve fund actions. This depreciation report is a complex document, and we encourage you to review it in detail.</p>
  <p>We recommend that the strata corporation adopts the Reserve Fund plan outlined in this report, with contributions adjusted to ${fmt2(adequateSchedule[1]?.contribution || adequateSchedule[0]?.contribution || 0)} for the ${fyLabel(adequateSchedule[1]?.year || currentYear+1)} fiscal year, and further increased as per the recommendations in Section 5.3. Please note that the legislation does not specifically require the strata corporation to follow our specific funding plan, but it must meet or exceed the minimum legislated requirements in accordance with Part 6.1 of the Strata Property Regulation.</p>
  <p>We would be pleased to offer you depreciation report updating services as required. Please note that the strata corporation is obligated to update the Depreciation Report at least once every five years as per Part 6.21(2) of the Strata Property Regulation, unless future amendments require an alternate schedule of updates.</p>
  <p>Thank you for entrusting us to produce this report. If you have any questions or require further assistance, please do not hesitate to contact us.</p>
  <p style="margin-top:20px">Respectfully submitted,</p>
  <div style="display:flex;gap:80px;margin-top:50px">
    <div>
      <div class="sig-line"></div>
      <div style="font-weight:700">${projectInfo.advisor || "[Lead Advisor]"}${projectInfo.advisorDesignations ? `, ${projectInfo.advisorDesignations}` : ""}</div>
      ${projectInfo.advisorLicense ? `<div style="font-size:9.5pt;color:#5a4a3a">AIC #${projectInfo.advisorLicense}</div>` : ""}
    </div>
    ${projectInfo.cosigner ? `<div>
      <div class="sig-line"></div>
      <div style="font-weight:700">${projectInfo.cosigner}${projectInfo.cosignerDesignations ? `, ${projectInfo.cosignerDesignations}` : ""}</div>
    </div>` : ""}
  </div>
</div>

<!-- ══ COPYRIGHT ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <p>Copyright © ${new Date(projectInfo.reportDate||Date.now()).getFullYear()} ${projectInfo.firm || "StrataWise Consulting"}</p>
  <p>This report is authorized for use by ${projectInfo.strataName || "the Authorized Client"} (the 'Authorized Client') and the strata corporation (the 'Authorized User'). The Authorized Use of this report is to provide guidance to the Authorized Client and Authorized User on recommended reserve fund contributions over the next five years.</p>
  <p>All rights reserved. No part of this report may be reproduced, distributed, or utilized in any form or by any means—whether graphic, electronic, or mechanical, including photocopying, recording, or information storage and retrieval—without written permission from the author. Such permissions must comply with the Personal Information Protection Act (PIPA) and our Privacy Policy.</p>
  <p>The Authorized Client may, however, reproduce this report in full or in part to share necessary information with the strata council, unit owners, and other parties who have a legitimate interest in the project.</p>
  <p>For accuracy and security, no electronic copy of this report should be considered reliable unless it bears a valid digital signature from the author, without any alterations post-certification. If a digitally signed electronic copy is required for third-party use in conjunction with a Form B Information Certificate, the user is advised to request this copy directly from the author to ensure the depreciation report is complete, current, and authentic.</p>
</div>

<!-- ══ TABLE OF CONTENTS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Table of Contents</h1>
  <div class="toc-row"><span style="font-weight:700">Executive Summary of Facts and Conclusions</span><span></span></div>
  <div class="toc-row"><span style="font-weight:700">Certification</span><span></span></div>
  <div class="toc-section">Main Body</div>
  <div class="toc-row"><span>1. Report Overview</span><span></span></div>
  <div class="toc-row toc-indent"><span>1.1 Purpose of the Report</span><span></span></div>
  <div class="toc-row toc-indent"><span>1.2 Methodology</span><span></span></div>
  <div class="toc-row"><span>2. Property Information</span><span></span></div>
  <div class="toc-row toc-indent"><span>2.1 Property Description Summary</span><span></span></div>
  <div class="toc-row toc-indent"><span>2.2 Governing Documents Review</span><span></span></div>
  <div class="toc-row toc-indent"><span>2.3 Previous Depreciation Reports</span><span></span></div>
  <div class="toc-row toc-indent"><span>2.4 Historical Financial Analysis</span><span></span></div>
  <div class="toc-row"><span>3. Component Details</span><span></span></div>
  <div class="toc-row toc-indent"><span>3.1 Component Descriptions</span><span></span></div>
  <div class="toc-row toc-indent"><span>3.2 Life Cycle Analysis</span><span></span></div>
  <div class="toc-row toc-indent"><span>3.3 Current Cost Estimates</span><span></span></div>
  <div class="toc-row"><span>4. Economic Forecasting</span><span></span></div>
  <div class="toc-row"><span>5. Funding Models</span><span></span></div>
  <div class="toc-row toc-indent"><span>5.1 Benchmark Analysis</span><span></span></div>
  <div class="toc-row toc-indent"><span>5.2 Reserve Fund Expenditures</span><span></span></div>
  <div class="toc-row toc-indent"><span>5.3 30-Year Reserve Fund Schedule</span><span></span></div>
  <div class="toc-row toc-indent"><span>5.4 Cash Flow Summary</span><span></span></div>
  <div class="toc-row toc-indent"><span>5.5 Deficiency Analysis</span><span></span></div>
  <div class="toc-row"><span>6. Recommendations and Best Practices</span><span></span></div>
  <div class="toc-section">Appendices</div>
  <div class="toc-row"><span>Appendix A — Qualifications</span><span></span></div>
  <div class="toc-row"><span>Appendix B — Assumptions and Limiting Conditions</span><span></span></div>
  <div class="toc-row"><span>Appendix C — Act and Regulation</span><span></span></div>
  <div class="toc-row"><span>Appendix D — Reserve Component Descriptions and Analyses</span><span></span></div>
</div>

<!-- ══ EXECUTIVE SUMMARY ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Executive Summary of Facts and Conclusions</h1>
  <div class="note">This summary highlights key facts, assumptions, and recommendations for convenience. It should not be relied upon as a substitute for the full report. Readers are advised to review the full report to understand the context, limitations, and detailed findings upon which these summaries are based.</div>
  <table style="margin-bottom:18px">
    <tr><td style="width:220px;font-weight:700">Date of Study</td><td>${projectInfo.inspectionDate || "—"} (Inspection Date and Effective Date)</td></tr>
    ${projectInfo.propertyManager ? `<tr><td style="font-weight:700">Property Management</td><td>${projectInfo.propertyManager}${projectInfo.propertyManagerAddress ? `<br>${projectInfo.propertyManagerAddress}` : ""}</td></tr>` : ""}
    <tr><td style="font-weight:700">Property</td><td>${projectInfo.strataName || "—"}${projectInfo.strataNumber ? ` — ${projectInfo.strataNumber}` : ""}<br>${[projectInfo.address, projectInfo.city, projectInfo.province, projectInfo.postalCode].filter(Boolean).join(", ")}<br>Constructed in ${projectInfo.builtYear || "N/A"}</td></tr>
    <tr><td style="font-weight:700">Forecasted Rates</td><td>Construction Cost Inflation: ${projectInfo.constructionInflation || 3.8}%<br>Interest Rate: ${projectInfo.interestRate || 3.1}%<br>CPI Inflation: ${projectInfo.cpiInflation || 2.0}%</td></tr>
    <tr><td style="font-weight:700">Current Fiscal Year</td><td>${fyLabel(currentYear)}</td></tr>
  </table>

  <h2 class="sec">5-Year Plan — Recommendations</h2>
  <table class="sm">
    <tr>
      <th style="min-width:180px">Item</th>
      ${adequateSchedule.slice(0,6).map(r=>`<th class="r">${fyLabel(r.year)}</th>`).join("")}
    </tr>
    <tr><td style="font-weight:700">Opening Balance</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmt2(r.openingBalance)}</td>`).join("")}</tr>
    <tr><td>Annual Contribution <sup>1</sup></td>${adequateSchedule.slice(0,6).map((r,i)=>`<td class="r" style="font-weight:${i===0?'700':'400'}">${fmt2(r.contribution)}</td>`).join("")}</tr>
    <tr><td>Interest Income</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmt2(r.interest)}</td>`).join("")}</tr>
    <tr><td>Special Levy</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${r.specialLevy>0?fmt2(r.specialLevy):"$0"}</td>`).join("")}</tr>
    <tr><td>Less: Expenditures</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r" style="color:${r.expenditure>0?'#c0392b':'inherit'}">${r.expenditure>0?"-"+fmt2(r.expenditure):"—"}</td>`).join("")}</tr>
    <tr class="tr-total"><td>Closing Balance</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmt2(r.closingBalance)}</td>`).join("")}</tr>
    ${projectInfo.units?`<tr><td>Avg Monthly / Unit <sup>2</sup></td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmt2(r.contribution/12/parseInt(projectInfo.units))}</td>`).join("")}</tr>`:""}
  </table>
  <p style="font-size:8.5pt;color:#5a4a3a;margin-top:6px"><sup>1</sup> The strata corporation is not legally required to follow the recommended plan. These recommendations come from the Adequate Funding Model in Section 5.3.<br>
  ${projectInfo.units?`<sup>2</sup> Based on ${projectInfo.units} units; actual fees will be determined based on relative unit entitlement.`:""}</p>

  <h2 class="sec">Adequacy Analysis</h2>
  <table class="sm">
    <tr>
      <th style="min-width:180px">Metric</th>
      ${adequateSchedule.slice(0,6).map(r=>`<th class="r">${fyLabel(r.year)}</th>`).join("")}
    </tr>
    <tr><td>Ideal Contributions</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmt2(r.idealContrib)}</td>`).join("")}</tr>
    <tr><td>Ideal Closing Balance</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmt2(r.idealClosing)}</td>`).join("")}</tr>
    <tr><td>DCQ Score</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${fmtN(r.dcq,1)}</td>`).join("")}</tr>
    <tr><td>Percent Funded</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${r.idealClosing>0?fmtN(r.closingBalance/r.idealClosing*100,0)+"%":"—"}</td>`).join("")}</tr>
    <tr><td>Actual / Ideal Contributions</td>${adequateSchedule.slice(0,6).map(r=>`<td class="r">${r.idealContrib>0?fmtN(r.contribution/r.idealContrib*100,0)+"%":"—"}</td>`).join("")}</tr>
  </table>
</div>

<!-- ══ CERTIFICATION ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Certification</h1>
  <p>I/We certify, to the best of our knowledge and belief, that:</p>
  <ul>
    <li>The statements of fact contained in this report are true and correct.</li>
    <li>The reported analyses, opinions, and conclusions are limited only by the reported assumptions and limiting conditions and are our personal, impartial, and unbiased professional analyses, opinions, and conclusions.</li>
    <li>We have no past, present, or prospective interest in the property that is the subject of this report, and no personal interest with respect to the parties involved.</li>
    <li>Our engagement in and compensation for making this report are not contingent upon developing or reporting predetermined results.</li>
    <li>These analyses, opinions, and conclusions were developed, and this report was prepared, in conformity with the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP).</li>
    <li>As of the date of this report, the undersigned has fulfilled the requirements of the Appraisal Institute of Canada's Continuing Professional Development Program.</li>
  </ul>
  <div style="display:flex;gap:80px;margin-top:60px">
    <div>
      <div class="sig-line"></div>
      <div style="font-weight:700">${projectInfo.advisor || "[Advisor Name]"}${projectInfo.advisorDesignations?`, ${projectInfo.advisorDesignations}`:""}</div>
      <div style="font-size:9.5pt;color:#5a4a3a">${projectInfo.firm || ""}</div>
      ${projectInfo.advisorLicense?`<div style="font-size:9pt;color:#7a6a5a">AIC# ${projectInfo.advisorLicense}</div>`:""}
      <div style="font-size:9pt;color:#7a6a5a">${projectInfo.reportDate || ""}</div>
    </div>
    ${projectInfo.cosigner?`<div>
      <div class="sig-line"></div>
      <div style="font-weight:700">${projectInfo.cosigner}${projectInfo.cosignerDesignations?`, ${projectInfo.cosignerDesignations}`:""}</div>
      <div style="font-size:9.5pt;color:#5a4a3a">Co-signer / Supervisor</div>
    </div>`:""}
  </div>
</div>

<!-- ══ SECTION 1: REPORT OVERVIEW ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">1. Report Overview</h1>
  <h2 class="sec">1.1 Purpose of the Report</h2>
  <p>This depreciation report provides a comprehensive financial evaluation of the common property building components that require major repair or replacement less frequently than once per year. The report estimates long-term expenditures from the Reserve Fund and recommends suitable funding strategies as required by the BC Strata Property Act, Section 6.21 of the Strata Property Regulation.</p>
  <p>This report has been completed in compliance with applicable legislation and in conformance with the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP).</p>
  <h2 class="sec">1.2 Methodology</h2>
  <p>The methodology used in this report involves a site inspection, review of available governing documents and financial records, cost estimation using current RSMeans Commercial Renovation Cost Data adjusted for Metro Vancouver, and 30-year financial modelling using the Adequate Funding, Minimum Funding, and Full Funding models.</p>
  <p>Each reserve component has been analyzed using a Life Cycle approach. The Effective Age considers observed conditions, maintenance history, reported issues, and the strata's intentions. The Lifespan represents average life expectancy based on material type, utilization rate, workmanship, manufacturer's recommendations, CMHC Capital Replacement Planning Manual guidelines, and contractor experience.</p>
</div>

<!-- ══ SECTION 2: PROPERTY INFORMATION ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">2. Property Information</h1>
  <h2 class="sec">2.1 Property Description Summary</h2>
  <table>
    <tr><td style="width:250px;font-weight:700">Strata Corporation</td><td>${projectInfo.strataName || "—"}</td></tr>
    <tr><td style="font-weight:700">Strata Plan Number</td><td>${projectInfo.strataNumber || "—"}</td></tr>
    <tr><td style="font-weight:700">Civic Address</td><td>${[projectInfo.address, projectInfo.city, projectInfo.province, projectInfo.postalCode].filter(Boolean).join(", ")}</td></tr>
    <tr><td style="font-weight:700">Year of Construction</td><td>${projectInfo.builtYear || "—"}</td></tr>
    <tr><td style="font-weight:700">Number of Strata Lots</td><td>${projectInfo.units || "—"}</td></tr>
    ${projectInfo.propertyManager?`<tr><td style="font-weight:700">Property Management</td><td>${projectInfo.propertyManager}</td></tr>`:""}
    <tr><td style="font-weight:700">Site Inspection Date</td><td>${projectInfo.inspectionDate || "—"}</td></tr>
    <tr><td style="font-weight:700">Effective Date of Report</td><td>${projectInfo.reportDate || "—"}</td></tr>
  </table>

  <h2 class="sec">2.2 Governing Documents Review</h2>
  <p>The consultant has thoroughly examined the governing documents, including the bylaws, which outline the reserve fund components that are the collective responsibility of the strata corporation, rather than the individual unit owners. For detailed descriptions and analyses of each reserve component, please refer to Appendix D.</p>
  ${projectInfo.governingDocumentsNotes ? `<p>${projectInfo.governingDocumentsNotes}</p>` : `<p>Based on the bylaws and our discussions with the property's representatives, all identified components have been included as common property reserve components.</p>`}

  <h2 class="sec">2.3 Previous Depreciation Reports</h2>
  ${projectInfo.previousReportYear ? `<p>Previous depreciation report${projectInfo.previousReportYear.includes(",") ? "s" : ""} completed in ${projectInfo.previousReportYear} ${projectInfo.previousReportYear.includes(",") ? "were" : "was"} provided for review.</p>` : `<p>No previous depreciation reports were available for review at the time of this study.</p>`}

  <h2 class="sec">2.4 Historical Financial Analysis</h2>
  <p>The consultant has reviewed the financial statements of the strata corporation. ${projectInfo.propertyManager ? `The relevant financial documents were provided by ${projectInfo.propertyManager}.` : ""}</p>
  ${reportOpeningBalance > 0 ? `<p>As of the opening of the ${fyLabel(currentYear)} fiscal year, the reserve fund balance is estimated at <strong>${fmt2(reportOpeningBalance)}</strong>. ${adequateSchedule[0] && projectInfo.units ? `The strata corporation has budgeted regular contributions of approximately ${fmt2(adequateSchedule[0].contribution)}, which translates to an average of ${fmt2(adequateSchedule[0].contribution/12/parseInt(projectInfo.units),2)} per unit per month.` : ""}</p>` : ""}
  <table class="sm" style="margin-top:14px">
    <tr>
      <th>Historical Financial Analysis</th>
      ${histRows.map(y=>`<th class="r">${fyLabel(y.year)}</th>`).join("")}
    </tr>
    <tr><td style="font-weight:700">Opening Balance</td>${histRows.map(y=>`<td class="r">${fmt2(y.openingBalance)}</td>`).join("")}</tr>
    <tr class="tr-section"><td colspan="${histRows.length+1}">Reserve Fund Income</td></tr>
    <tr><td class="toc-indent">  Reserve Fund Contributions</td>${histRows.map(y=>`<td class="r">${y.rfContribution?fmt2(y.rfContribution):""}</td>`).join("")}</tr>
    <tr><td class="toc-indent">  Special Levy</td>${histRows.map(y=>`<td class="r">${y.specialLevy?fmt2(y.specialLevy):""}</td>`).join("")}</tr>
    <tr><td class="toc-indent">  Interest Income</td>${histRows.map(y=>`<td class="r">${y.interest?fmt2(y.interest):""}</td>`).join("")}</tr>
    <tr><td class="toc-indent">  Other / Transfer In</td>${histRows.map(y=>`<td class="r">${y.transferIn?fmt2(y.transferIn):""}</td>`).join("")}</tr>
    <tr class="tr-section"><td colspan="${histRows.length+1}">Reserve Fund Expenditures</td></tr>
    ${(components||[]).map(comp=>`<tr><td style="padding-left:20px;font-size:8.5pt">${comp.name}</td>${histRows.map(y=>`<td class="r">${y.expenditures?.[comp.id]?fmt2(y.expenditures[comp.id]):""}</td>`).join("")}</tr>`).join("")}
    <tr><td style="padding-left:20px;font-size:8.5pt">Miscellaneous</td>${histRows.map(y=>`<td class="r">${y.expenditures?.misc?fmt2(y.expenditures.misc):""}</td>`).join("")}</tr>
    <tr class="tr-total"><td>Total Expenditures</td>${histRows.map(y=>`<td class="r">${fmt2(y.totalExp)}</td>`).join("")}</tr>
    <tr class="tr-dark"><td>Closing Balance</td>${histRows.map(y=>`<td class="r">${fmt2(y.closing)}</td>`).join("")}</tr>
  </table>
</div>

<!-- ══ SECTION 3: COMPONENT DETAILS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">3. Component Details</h1>
  <h2 class="sec">3.1 Component Descriptions</h2>
  <p>This report provides an overview of all <strong>${(components||[]).length}</strong> building and site components that have shared responsibility within the strata and are expected to require replacement or major repairs less frequently than once per year. Detailed descriptions of each component are in Appendix D.</p>
  <p>Each component analysis in Appendix D includes: photographs, component description, condition analysis, reserve fund expenditure history, life cycle analysis, potential deterioration, scope of work including current cost estimates, and suggested maintenance.</p>
  <h2 class="sec">3.2 Life Cycle Analysis</h2>
  <p>Each reserve component has a next replacement date based on its Remaining Life, calculated as the difference between its Effective Age and Lifespan. The <strong>Effective Age</strong> is a subjective measure considering actual age, observed performance, reported problems, maintenance history, and the strata's intentions. The <strong>Lifespan</strong> represents average life expectancy based on material type, utilization rate, quality, CMHC guidelines, contractor experience, and observed conditions.</p>
  <h2 class="sec">3.3 Current Cost Estimates</h2>
  <p>Cost estimates are based on the current year's RSMeans Commercial Renovation Cost Data adjusted for time, location, material type, and construction quality, supplemented by local contractor pricing data. All estimates include 5% GST. Individual contingency allowances (typically 5%–25%) are incorporated to account for uncertainties. A Budget Percentage is applied to components not expected to require complete replacement, reflecting an interpretation of costs based on the balance of probabilities.</p>
  <table style="margin-top:14px">
    <tr>
      <th>#</th><th>Component</th><th>Category</th>
      <th class="r">Lifespan</th><th class="r">Eff. Age</th><th class="r">Remaining</th>
      <th class="r">Current Cost</th><th class="r">Projected Cost</th>
    </tr>
    ${(components||[]).map((c,i)=>{
      const br = benchRows.find(b=>b.id===c.id)||{projNext:0};
      return `<tr>
        <td>${i+1}</td><td><strong>${c.name}</strong></td><td style="font-size:9pt">${c.category}</td>
        <td class="r">${c.lifespan} yrs</td><td class="r">${c.effectiveAge} yrs</td>
        <td class="r">${Math.max(0,c.lifespan-c.effectiveAge)} yrs</td>
        <td class="r">${fmt2(c.totalCost)}</td><td class="r">${fmt2(br.projNext)}</td>
      </tr>`;
    }).join("")}
    <tr class="tr-total"><td colspan="6" style="text-align:right">TOTAL</td><td class="r">${fmt2(totalCost)}</td><td class="r">${fmt2(totalProjNext)}</td></tr>
  </table>
</div>

<!-- ══ SECTION 4: ECONOMIC FORECASTING ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">4. Economic Forecasting</h1>
  <p>This depreciation report places significant reliance on long-term economic predictions concerning inflation and interest rates. Although actual economic conditions will differ from our forecasts, we believe our estimates are reasonable and valuable for planning purposes.</p>
  <h3 class="sub">Construction Costs</h3>
  <p>Construction costs tend to increase at a different rate compared to standard CPI inflation. In this study, we have adjusted our estimated current construction costs by applying a localized construction cost inflation rate of <strong>${projectInfo.constructionInflation || 3.8}%</strong>. This rate reflects the BC construction cost index 10-year compound average for the Metro Vancouver area.</p>
  <h3 class="sub">Interest Rates</h3>
  <p>The interest earned on the reserve fund balance can significantly impact the required reserve contributions. The interest rate used in our analysis is <strong>${projectInfo.interestRate || 3.1}%</strong> per annum, representing a conservative estimate based on blended GIC/HISA rates, post-tax.</p>
  <h3 class="sub">CPI Inflation</h3>
  <p>To ensure that the amount contributed towards any given component maintains its purchasing power over time, we increase the annual contributions by a localized CPI inflation rate of <strong>${projectInfo.cpiInflation || 2.0}%</strong> per annum, based on Statistics Canada CPI data for Metro Vancouver.</p>
  <table style="margin-top:14px">
    <tr><th>Parameter</th><th class="r">Rate Applied</th><th>Basis</th></tr>
    <tr><td>Construction Cost Inflation</td><td class="r">${projectInfo.constructionInflation || 3.8}% p.a.</td><td>BC construction cost index, 10-yr compound average</td></tr>
    <tr><td>Reserve Fund Interest Rate</td><td class="r">${projectInfo.interestRate || 3.1}% p.a.</td><td>Conservative GIC/HISA blended rate, post-tax</td></tr>
    <tr><td>CPI Inflation (Contribution Escalation)</td><td class="r">${projectInfo.cpiInflation || 2.0}% p.a.</td><td>Statistics Canada CPI — Metro Vancouver</td></tr>
    <tr><td>Assumed Building Economic Life</td><td class="r">${projectInfo.buildingLife || 100} years</td><td>From ${projectInfo.builtYear || "year of construction"}</td></tr>
    <tr><td>Minimum Reserve Balance</td><td class="r">${fmt2(projectInfo.minBalance || 32000)}</td><td>Adjusted annually by CPI</td></tr>
  </table>
</div>

<!-- ══ SECTION 5.1: BENCHMARK ANALYSIS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">5. Funding Models</h1>
  <h2 class="sec">5.1 Benchmark Analysis</h2>
  <p>The Benchmark Analysis provides an assessment of the ideal opening balance and the ideal annual reserve fund contribution for the current fiscal year. These figures are calculated by evenly distributing the cost to replace a component over its lifespan, while considering the effects of inflation and interest rates. The purpose is to evaluate the performance of the reserve fund and propose fair and equitable funding plans.</p>
  <div style="display:flex;gap:24px;margin-bottom:6px;font-size:9pt;color:#5a4a3a">
    <span>Construction Inflation: <strong>${projectInfo.constructionInflation||3.8}%</strong></span>
    <span>Interest Rate: <strong>${projectInfo.interestRate||3.1}%</strong></span>
    <span>CPI Rate: <strong>${projectInfo.cpiInflation||2.0}%</strong></span>
    <span>For ${fyLabel(currentYear)}</span>
  </div>
  <table class="sm">
    <tr>
      <th>Reserve Component</th>
      <th class="r">Lifespan</th><th class="r">Eff. Age</th><th class="r">Remaining</th>
      <th class="r">Current Cost</th><th class="r">Projected Next Cost</th>
      <th class="r">Ideal Opening Balance</th><th class="r">Ideal Annual Contribution</th>
      <th class="r">Relative Weight</th>
    </tr>
    ${benchRows.map((b,i)=>`<tr>
      <td>#${i+1} ${b.name}</td>
      <td class="r">${b.lifespan} yrs</td><td class="r">${b.effectiveAge} yrs</td><td class="r">${b.R} yrs</td>
      <td class="r">${fmt2(b.totalCost)}</td><td class="r">${fmt2(b.projNext)}</td>
      <td class="r">${fmt2(b.idealOpenBal)}</td><td class="r">${fmt2(b.idealContrib)}</td>
      <td class="r">${totalIdealContrib>0?fmtN(b.idealContrib/totalIdealContrib*100,1)+"%":"—"}</td>
    </tr>`).join("")}
    <tr class="tr-total">
      <td colspan="4" style="text-align:right">TOTAL RESERVES</td>
      <td class="r">${fmt2(totalCost)}</td><td class="r">${fmt2(totalProjNext)}</td>
      <td class="r">${fmt2(totalIdealOpenBal)}</td><td class="r">${fmt2(totalIdealContrib)}</td>
      <td class="r">100%</td>
    </tr>
  </table>
</div>

<!-- ══ SECTION 5.2: PROJECTED EXPENDITURES ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h2 class="sec">5.2 Reserve Fund Expenditures</h2>
  <p>The following provides a 30-year forecast of expenditures from the reserve fund, categorized by component, inflated at <strong>${projectInfo.constructionInflation || 3.8}%</strong> per annum construction cost inflation.</p>
  <table class="sm" style="margin-top:10px">
    <tr>
      <th style="min-width:160px">Component</th><th class="r">Lifespan</th><th class="r">Eff. Age</th><th class="r">Current Cost</th>
      ${projYears.slice(0,15).map(y=>`<th class="r" style="min-width:44px">${y}</th>`).join("")}
    </tr>
    ${(components||[]).map((comp,i)=>`<tr>
      <td style="font-size:8pt">#${i+1} ${comp.name}</td>
      <td class="r">${comp.lifespan}</td><td class="r">${comp.effectiveAge}</td><td class="r">${fmt2(comp.totalCost)}</td>
      ${compCells(comp, projYears.slice(0,15))}
    </tr>`).join("")}
    <tr class="tr-total">
      <td colspan="4" style="text-align:right;font-size:8pt">TOTAL EXPENDITURES</td>
      ${projYears.slice(0,15).map(y=>`<td class="r" style="font-size:8pt;color:${(expendByYear[y]||0)>0?"#c0392b":"inherit"}">${(expendByYear[y]||0)>0?fmt2(expendByYear[y]/1000,0)+"K":""}</td>`).join("")}
    </tr>
  </table>
  ${projYears.length > 15 ? `
  <h3 class="sub" style="margin-top:20px">Years ${projYears[15]}–${projYears[Math.min(29,projYears.length-1)]}</h3>
  <table class="sm">
    <tr>
      <th style="min-width:160px">Component</th><th class="r">Lifespan</th><th class="r">Eff. Age</th><th class="r">Current Cost</th>
      ${projYears.slice(15,30).map(y=>`<th class="r" style="min-width:44px">${y}</th>`).join("")}
    </tr>
    ${(components||[]).map((comp,i)=>`<tr>
      <td style="font-size:8pt">#${i+1} ${comp.name}</td>
      <td class="r">${comp.lifespan}</td><td class="r">${comp.effectiveAge}</td><td class="r">${fmt2(comp.totalCost)}</td>
      ${compCells(comp, projYears.slice(15,30))}
    </tr>`).join("")}
    <tr class="tr-total">
      <td colspan="4" style="text-align:right;font-size:8pt">TOTAL EXPENDITURES</td>
      ${projYears.slice(15,30).map(y=>`<td class="r" style="font-size:8pt;color:${(expendByYear[y]||0)>0?"#c0392b":"inherit"}">${(expendByYear[y]||0)>0?fmt2(expendByYear[y]/1000,0)+"K":""}</td>`).join("")}
    </tr>
  </table>` : ""}
</div>

<!-- ══ SECTION 5.3: 30-YEAR SCHEDULE ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h2 class="sec">5.3 30-Year Reserve Fund Schedule</h2>
  <p>The Reserve Fund Projection below is based on the <strong>Adequate Funding</strong> model, the approach recommended under the BC Strata Property Act. This model ramps contributions over the study period to ensure the reserve fund maintains a positive balance and meets projected expenditures.</p>
  <div style="display:flex;gap:24px;margin-bottom:8px;font-size:9pt;color:#5a4a3a">
    <span>Const. Inflation: <strong>${projectInfo.constructionInflation||3.8}%</strong></span>
    <span>Interest: <strong>${projectInfo.interestRate||3.1}%</strong></span>
    <span>CPI: <strong>${projectInfo.cpiInflation||2.0}%</strong></span>
    <span>Min. Balance: <strong>${fmt2(projectInfo.minBalance||32000)}</strong></span>
  </div>
  <table class="sm">
    <tr>
      <th style="min-width:120px">Fiscal Year</th>
      <th class="r">Opening Balance</th><th class="r">Recommended Contribution</th>
      <th class="r">Interest Income</th><th class="r">Special Levy</th>
      <th class="r">Expenditures</th><th class="r">Closing Balance</th>
      ${projectInfo.units?`<th class="r">Avg $/Unit/Mo</th>`:""}
    </tr>
    <tr class="tr-section"><td colspan="10">Reserve Fund Income &amp; Expenditures</td></tr>
    ${adequateSchedule.slice(0,15).map((row,i)=>`<tr>
      <td style="font-size:8.5pt">${fyLabel(row.year)}</td>
      <td class="r">${fmt2(row.openingBalance)}</td>
      <td class="r" style="font-weight:${i===0?'700':'400'}">${fmt2(row.contribution)}</td>
      <td class="r">${fmt2(row.interest)}</td>
      <td class="r" style="color:${row.specialLevy>0?'#c0392b':'#888'}">${row.specialLevy>0?fmt2(row.specialLevy):"—"}</td>
      <td class="r" style="color:${row.expenditure>0?'#c0392b':'#888'}">${row.expenditure>0?fmt2(row.expenditure):"—"}</td>
      <td class="r" style="font-weight:700;color:${row.closingBalance>=0?'#1a3a5c':'#c0392b'}">${fmt2(row.closingBalance)}</td>
      ${projectInfo.units?`<td class="r">${fmt2(row.contribution/12/parseInt(projectInfo.units))}</td>`:""}
    </tr>`).join("")}
    <tr class="tr-section"><td colspan="10">Deficiency Analysis</td></tr>
    ${adequateSchedule.slice(0,15).map(row=>`<tr>
      <td style="font-size:8.5pt">${fyLabel(row.year)}</td>
      <td class="r" style="color:#888;font-size:8pt" colspan="2">Ideal Contribution: ${fmt2(row.idealContrib)}</td>
      <td class="r" style="color:#888;font-size:8pt" colspan="2">Ideal Closing: ${fmt2(row.idealClosing)}</td>
      <td class="r" style="color:#c0392b;font-size:8pt">Deficiency: ${fmt2(row.deficiency)}</td>
      <td class="r" style="font-size:8pt">DCQ: ${fmtN(row.dcq,1)}</td>
      ${projectInfo.units?`<td class="r" style="font-size:8pt">${row.idealClosing>0?fmtN(row.closingBalance/row.idealClosing*100,0)+"%":"—"} funded</td>`:""}
    </tr>`).join("")}
  </table>
  ${adequateSchedule.length > 15 ? `
  <h3 class="sub" style="margin-top:24px">30-Year Schedule Continued (Years 16–30)</h3>
  <table class="sm">
    <tr>
      <th style="min-width:120px">Fiscal Year</th>
      <th class="r">Opening Balance</th><th class="r">Recommended Contribution</th>
      <th class="r">Interest Income</th><th class="r">Special Levy</th>
      <th class="r">Expenditures</th><th class="r">Closing Balance</th>
      ${projectInfo.units?`<th class="r">Avg $/Unit/Mo</th>`:""}
    </tr>
    ${adequateSchedule.slice(15,30).map((row,i)=>`<tr>
      <td style="font-size:8.5pt">${fyLabel(row.year)}</td>
      <td class="r">${fmt2(row.openingBalance)}</td>
      <td class="r">${fmt2(row.contribution)}</td>
      <td class="r">${fmt2(row.interest)}</td>
      <td class="r" style="color:${row.specialLevy>0?'#c0392b':'#888'}">${row.specialLevy>0?fmt2(row.specialLevy):"—"}</td>
      <td class="r" style="color:${row.expenditure>0?'#c0392b':'#888'}">${row.expenditure>0?fmt2(row.expenditure):"—"}</td>
      <td class="r" style="font-weight:700;color:${row.closingBalance>=0?'#1a3a5c':'#c0392b'}">${fmt2(row.closingBalance)}</td>
      ${projectInfo.units?`<td class="r">${fmt2(row.contribution/12/parseInt(projectInfo.units))}</td>`:""}
    </tr>`).join("")}
  </table>` : ""}
  <div class="note"><strong>Regulatory Note:</strong> The strata corporation is not legally required to follow this recommended funding plan exactly; however, minimum contributions must meet the requirements of Part 6.1 of the Strata Property Regulation. The strata corporation is obligated to update this depreciation report at least once every five years per Section 6.21(2) of the Strata Property Regulation.</div>
</div>

<!-- ══ SECTION 5.4: CASH FLOW SUMMARY ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h2 class="sec">5.4 Cash Flow Summary — Adequate Funding (Nominal)</h2>
  <p>The Nominal Cash Flow Table displays the forecasted and recommended dollar amounts in actual currency. When setting reserve fund contributions, the strata corporation should refer to this table.</p>
  <table class="sm">
    <tr>
      <th>Fiscal Year</th><th class="r">Opening Balance</th><th class="r">Annual Contribution</th>
      <th class="r">Interest</th><th class="r">Special Levy</th><th class="r">Expenditures</th>
      <th class="r">Closing Balance</th>${projectInfo.units?`<th class="r">$/Unit/Mo</th>`:""}
    </tr>
    ${adequateSchedule.map((row,i)=>`<tr style="${i%2===0?'':'background:#faf7f0'}">
      <td style="font-size:8.5pt">${fyLabel(row.year)}</td>
      <td class="r">${fmt2(row.openingBalance)}</td>
      <td class="r" style="color:#1a6b3a">${fmt2(row.contribution)}</td>
      <td class="r">${fmt2(row.interest)}</td>
      <td class="r" style="color:${row.specialLevy>0?'#c0392b':'#888'}">${row.specialLevy>0?fmt2(row.specialLevy):"—"}</td>
      <td class="r" style="color:${row.expenditure>0?'#c0392b':'#888'}">${row.expenditure>0?fmt2(row.expenditure):"—"}</td>
      <td class="r" style="font-weight:700">${fmt2(row.closingBalance)}</td>
      ${projectInfo.units?`<td class="r">${fmt2(row.contribution/12/parseInt(projectInfo.units))}</td>`:""}
    </tr>`).join("")}
  </table>
</div>

<!-- ══ SECTION 5.5: DEFICIENCY ANALYSIS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h2 class="sec">5.5 Deficiency Analysis</h2>
  <p>The Deficiency Analysis compares the actual reserve fund balance with the Benchmark Analysis ideal balance for the current fiscal year. The Benchmark Analysis provides an estimate of the reserve fund balance that would have been achieved if the strata corporation had made ideal contributions each year to fully fund each component's depreciation, considering interest and inflation.</p>
  <table style="max-width:480px">
    <tr><td style="font-weight:700">Deficiency Calculation</td><td></td></tr>
    <tr><td>Opening Balance</td><td class="r">${fmt2(reportOpeningBalance)}</td></tr>
    <tr><td>Annual Contribution</td><td class="r">${fmt2(adequateSchedule[0]?.contribution||0)}</td></tr>
    <tr><td>Interest Income</td><td class="r">${fmt2(adequateSchedule[0]?.interest||0)}</td></tr>
    <tr><td>Special Levy</td><td class="r">${fmt2(adequateSchedule[0]?.specialLevy||0)}</td></tr>
    <tr><td>Less: Estimated Expenditures</td><td class="r">${fmt2(adequateSchedule[0]?.expenditure||0)}</td></tr>
    <tr class="tr-total"><td>Projected Closing Balance</td><td class="r">${fmt2(adequateSchedule[0]?.closingBalance||0)}</td></tr>
    <tr><td>Less: Ideal Closing Balance</td><td class="r">${fmt2(adequateSchedule[0]?.idealClosing||0)}</td></tr>
    <tr class="tr-total"><td>Estimated Reserve Fund Deficiency</td><td class="r" style="color:#c0392b">${fmt2(adequateSchedule[0]?.deficiency||0)}</td></tr>
  </table>
  <table style="max-width:480px;margin-top:16px">
    <tr><td style="font-weight:700">DCQ Calculation</td><td></td></tr>
    <tr class="tr-total"><td>Deficiency / Contribution Quotient (DCQ)</td><td class="r">${fmtN(adequateSchedule[0]?.dcq||0,1)}</td></tr>
  </table>
  <h3 class="sub" style="margin-top:20px">Interpreting the DCQ</h3>
  <table>
    <tr><th>DCQ Range</th><th>Interpretation</th></tr>
    <tr><td>Greater than 40</td><td>Reserve fund contributions have not been prioritized; high risk of special levies</td></tr>
    <tr><td>15 to 40</td><td>Normal for strata corporations that have recently started prioritizing contributions</td></tr>
    <tr><td>0 to 15</td><td>Relative stability; lower likelihood of requiring emergency funding</td></tr>
    <tr><td>0</td><td>Fully funded at ideal benchmark balance</td></tr>
    <tr><td>Less than 0</td><td>Overfunded reserve; very stable</td></tr>
  </table>
</div>

<!-- ══ SECTION 6: RECOMMENDATIONS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">6. Recommendations and Best Practices</h1>
  <p>These recommendations are designed to help the strata corporation effectively plan for future expenditures and ensure that sufficient funds are available to address maintenance and replacement needs.</p>
  <ol style="margin-left:24px;line-height:2.2">
    <li>Properly document and finance major repairs and replacements through a designated reserve fund account, with corresponding expenditures recorded in the general ledger using specific ledger codes for each component.</li>
    <li>Contribute <strong>${fmt2(adequateSchedule[1]?.contribution || adequateSchedule[0]?.contribution || 0)}</strong> for the <strong>${fyLabel((adequateSchedule[1]?.year||adequateSchedule[0]?.year||currentYear+1))}</strong> fiscal year, and subsequently adhere to the recommendations in Section 5.3.</li>
    <li>Invest the reserve fund prudently and professionally in accordance with Section 6.11 of the Strata Property Regulation.</li>
    <li>Provide the necessary resources to ensure the property is maintained in good condition.</li>
    <li>Conduct an annual review of this report to validate the underlying assumptions and ensure the estimates are up to date.</li>
    <li>The strata corporation is obligated to retain copies of the depreciation report as stated in Section 35(2)(n.1) of the Strata Property Act.</li>
    <li>The strata corporation must update the depreciation report to the Information Certificate in accordance with Section 59(4)(d) of the Strata Property Act.</li>
    <li>The strata corporation should update the depreciation report at least every five years, as mandated by Section 6.21(2) of the Strata Property Regulation.</li>
  </ol>
</div>

<!-- ══ APPENDIX A: QUALIFICATIONS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Appendix A — Qualifications</h1>
  ${projectInfo.advisor ? `<h2 class="sec">${projectInfo.advisor}${projectInfo.advisorDesignations?`, ${projectInfo.advisorDesignations}`:""}</h2>
  ${projectInfo.advisorLicense?`<p>Appraisal Institute of Canada Candidate / Member #${projectInfo.advisorLicense}</p>`:""}
  <p>${projectInfo.firm || "StrataWise Consulting"} provides professional reserve fund studies and depreciation reports throughout British Columbia in compliance with the BC Strata Property Act and the Canadian Uniform Standards of Professional Appraisal Practice (CUSPAP).</p>` : `<p>[Advisor qualifications and biography to be completed.]</p>`}
  ${projectInfo.cosigner ? `<h2 class="sec">${projectInfo.cosigner}${projectInfo.cosignerDesignations?`, ${projectInfo.cosignerDesignations}`:""}</h2><p>[Co-signer qualifications and biography to be completed.]</p>` : ""}
</div>

<!-- ══ APPENDIX B: ASSUMPTIONS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Appendix B — Assumptions and Limiting Conditions</h1>
  <ul>
    <li>The inspection was a visual, non-intrusive examination only. No destructive testing, probing, or sampling was performed.</li>
    <li>Cost estimates are based on current RSMeans Commercial Renovation Cost Data adjusted for Metro Vancouver location and date, combined with local contractor pricing data.</li>
    <li>All cost estimates include the applicable 5% Goods and Services Tax (GST). Provincial Sales Tax (PST) is not applied to new construction or major renovations in BC.</li>
    <li>This report is primarily intended as a budgeting tool for the strata corporation. Actual expenditures must be based on the specific conditions of the property at the time of replacement and should be supported by competitive contractor quotes.</li>
    <li>Actual lifespans of components may vary depending on maintenance practices, climatic conditions, usage patterns, and quality of original installation.</li>
    <li>No warranties or guarantees are expressed or implied as to the condition of any building component not observable during the visual inspection.</li>
    <li>The advisor has no responsibility for matters of a legal nature affecting the subject property or title, nor for matters requiring professional engineering assessment.</li>
    <li>Scope of Work cost estimates for repairs and replacements include demolition and disposal, labour, materials, equipment, special construction requirements, safety installations, limited access considerations, potential reuse of salvageable materials, clean-up costs, contingencies, and allowances for contractor profit and overhead.</li>
    <li>Cost estimates are based on quality materials meeting current building code requirements, using contemporary construction techniques and union labour rates where applicable.</li>
    <li>This report has been prepared in conformance with the Reserve Fund Study standards of the Appraisal Institute of Canada (CUSPAP).</li>
  </ul>
  <div class="note"><strong>Copyright Notice:</strong> This report is authorized for use by ${projectInfo.strataName || "the Authorized Client"} and the strata corporation named herein. All rights reserved. No part of this report may be reproduced, distributed, or utilized in any form without written permission from the author, in compliance with the Personal Information Protection Act (PIPA) and applicable copyright law.</div>
</div>

<!-- ══ APPENDIX C: ACT AND REGULATION ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Appendix C — Act and Regulation</h1>
  <h2 class="sec">Strata Property Act — Section 35(2)(n.1)</h2>
  <p>The strata corporation must retain copies of the depreciation report.</p>
  <h2 class="sec">Strata Property Regulation — Section 6.2(1)</h2>
  <p>The strata corporation must have a depreciation report prepared by a person with the prescribed qualifications, unless the strata corporation has waived the requirement by a 3/4 vote.</p>
  <h2 class="sec">Strata Property Regulation — Section 6.21(2)</h2>
  <p>A strata corporation must obtain a new depreciation report at least once every 5 years after the date of its most recent depreciation report.</p>
  <h2 class="sec">Strata Property Regulation — Section 6.1</h2>
  <p>Minimum reserve fund contribution requirements. The strata corporation must contribute to the reserve fund the greater of: (a) 10% of the annual operating fund budget, or (b) the amount required by the depreciation report.</p>
  <h2 class="sec">Strata Property Regulation — Section 6.11</h2>
  <p>Reserve fund investments must be made prudently, in permitted investments, and in the best interests of the strata corporation.</p>
</div>

<!-- ══ APPENDIX D: COMPONENT DESCRIPTIONS ══ -->
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <h1 class="ch">Appendix D — Reserve Component Descriptions and Analyses</h1>
  <h2 class="sec">Component Page Index</h2>
  ${(components||[]).map((c,i)=>`<div style="font-size:10pt;padding:3px 0;border-bottom:1px dotted #d0c8b8">#${i+1} / ${c.category} / ${c.name}</div>`).join("")}
</div>

${(components||[]).map((c,i)=>{
  const R = Math.max(0,c.lifespan-c.effectiveAge);
  const projNext = (c.totalCost||0)*Math.pow(1+ci,R);
  const dueYear = currentYear + R;
  const budgetPct = c.budgetPct||100;
  const base = (c.costItems||[]).reduce((s,item)=>s+(item.rate||0)*(item.qty||0),0);
  return `
<div class="chapter">
  <div class="page-header"><span>File — ${projectInfo.strataNumber || "Draft"}</span><span><strong>${projectInfo.strataName || "Strata Corporation"}</strong></span><span>${new Date(projectInfo.reportDate||Date.now()).getFullYear()}</span></div>
  <div style="font-size:9.5pt;color:#5a4a3a;margin-bottom:12px;font-family:'Cinzel',serif;letter-spacing:0.5px">#${i+1} / ${c.category} / ${c.name}</div>
  ${c.photos&&c.photos.length>0?`<div style="display:flex;gap:10px;margin-bottom:16px;flex-wrap:wrap">${c.photos.slice(0,4).map(p=>`<img src="${p.src}" style="width:180px;height:130px;object-fit:cover;border:1px solid #d0c8b8;border-radius:3px" alt="${p.caption||''}"/>`).join("")}</div>`:""}
  <div class="comp-stats">
    <div class="comp-stat"><label>Estimated Current Cost</label><span>${fmt2(c.totalCost)}</span><small>Budget ${budgetPct}%</small></div>
    <div class="comp-stat"><label>Projected Replacement Cost</label><span>${fmt2(projNext)}</span><small>Due in ${dueYear}</small></div>
    <div class="comp-stat"><label>Effective Age / Lifespan (years)</label><span>${c.effectiveAge} / ${c.lifespan}</span><small>Remaining: ${R} years</small></div>
  </div>
  <div style="border:1px solid #d0c8b8;border-top:none">
    ${c.description?`<div class="comp-row" style="padding:10px 16px;border-bottom:1px solid #ede8e0"><div class="comp-row-label">Description</div><div>${c.description}</div></div>`:""}
    ${c.conditionAnalysis?`<div class="comp-row" style="padding:10px 16px;border-bottom:1px solid #ede8e0"><div class="comp-row-label">Condition Analysis</div><div>${c.conditionAnalysis}</div></div>`:""}
    <div class="comp-row" style="padding:10px 16px;border-bottom:1px solid #ede8e0"><div class="comp-row-label">Work Completed</div><div>${c.workCompleted||"Unknown total scope of reserve fund work completed to date."}</div></div>
    ${c.scopeOfWork?`<div class="comp-row" style="padding:10px 16px;border-bottom:1px solid #ede8e0"><div class="comp-row-label">Scope of Work</div><div>${c.scopeOfWork}</div></div>`:""}
    ${c.possibleDeterioration?`<div class="comp-row" style="padding:10px 16px;border-bottom:1px solid #ede8e0"><div class="comp-row-label">Potential Deterioration</div><div>${c.possibleDeterioration}</div></div>`:""}
    ${c.recommendedAction?`<div class="comp-row" style="padding:10px 16px;border-bottom:1px solid #ede8e0"><div class="comp-row-label">Suggested Maintenance</div><div>${c.recommendedAction}</div></div>`:""}
    ${(c.costItems||[]).length>0?`
    <div style="padding:10px 16px">
      <div style="font-weight:700;color:#1a3a5c;font-size:9pt;margin-bottom:8px">Cost Breakdown</div>
      <table class="sm">
        <tr><th>Description</th><th class="r">Unit</th><th class="r">Unit Rate</th><th class="r">Qty</th><th class="r">Subtotal</th></tr>
        ${c.costItems.map(item=>`<tr><td>${item.name}</td><td class="r">${item.unit}</td><td class="r">${fmt2(item.rate,2)}</td><td class="r">${item.qty}</td><td class="r">${fmt2((item.rate||0)*(item.qty||0))}</td></tr>`).join("")}
        <tr class="tr-total"><td colspan="4" style="text-align:right">Base Subtotal</td><td class="r">${fmt2(base)}</td></tr>
        <tr><td colspan="4" style="text-align:right;font-size:8.5pt">+ Demolition (${c.demolitionPct||0}%), GST (${c.taxPct||0}%), Contingency (${c.contingencyPct||0}%), Budget ${budgetPct}%</td><td class="r" style="font-weight:700">${fmt2(c.totalCost)}</td></tr>
      </table>
    </div>` : ""}
  </div>
</div>`;
}).join("")}

</body>
</html>`;
  };

  const htmlContent = generateHTML();

  const handlePrint = () => {
    const win = window.open("", "_blank");
    win.document.write(htmlContent);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 800);
  };

  const handleDownload = () => {
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Depreciation_Report_${projectInfo.strataNumber || "Draft"}_${new Date().toISOString().split("T")[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#2a2a2a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Preview Toolbar */}
      <div style={{ background: "#1a1a1a", padding: "12px 24px", display: "flex", alignItems: "center", gap: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.5)", zIndex: 10 }}>
        <button onClick={onBack} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, padding: "8px 16px", color: "rgba(255,255,255,0.7)", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontSize: 12 }}>
          <Icon name="back" size={14} /> Back to Editor
        </button>
        <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.1)" }} />
        <div style={{ color: "#c8a96e", fontSize: 13, fontWeight: 600 }}>
          {projectInfo.strataName || "Report Preview"} — Depreciation Report
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
          <button onClick={handleDownload} style={{ background: "rgba(200,169,110,0.15)", border: "1px solid rgba(200,169,110,0.4)", borderRadius: 8, padding: "8px 16px", color: "#c8a96e", cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="download" size={14} /> Download HTML
          </button>
          <button onClick={handlePrint} style={{ background: "linear-gradient(135deg, #c8a96e, #b8942a)", border: "none", borderRadius: 8, padding: "8px 18px", color: "#0d2137", cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="preview" size={14} /> Print / Save PDF
          </button>
        </div>
      </div>

      {/* PDF Preview inline */}
      <div style={{ flex: 1, padding: "24px 32px", display: "flex", justifyContent: "center", overflowY: "auto" }}>
        <div style={{ width: "100%", maxWidth: 960, background: "#fff", boxShadow: "0 8px 48px rgba(0,0,0,0.6)", borderRadius: 4, overflow: "hidden" }}>
          <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{ fontFamily: "Georgia, serif", fontSize: 11, color: "#111", lineHeight: 1.7 }}
          />
        </div>
      </div>
    </div>
  );
}

// ─── PROJECT SETUP ────────────────────────────────────────────────────────────
function ProjectSetup({ info, onChange }) {
  const field = (label, key, type = "text") => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6, fontFamily: "'Georgia', serif" }}>{label}</label>
      <input type={type} value={info[key] || ""} onChange={e => onChange({ ...info, [key]: e.target.value })}
        style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
    </div>
  );
  const numField = (label, key, step = 0.1) => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6, fontFamily: "'Georgia', serif" }}>{label}</label>
      <input type="number" step={step} value={info[key] || ""} onChange={e => onChange({ ...info, [key]: parseFloat(e.target.value) || 0 })}
        style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
    </div>
  );

  return (
    <div>
      <SectionHeader title="Project Setup" subtitle="Property information and economic parameters" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <Card title="Property Information">
          {field("Strata Corporation Name", "strataName")}
          {field("Strata Plan Number (VAS/BCS/EPS…)", "strataNumber")}
          {field("Civic Address", "address")}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 12 }}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6, fontFamily: "'Georgia', serif" }}>City</label>
              <input value={info.city || ""} onChange={e => onChange({ ...info, city: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6, fontFamily: "'Georgia', serif" }}>Prov</label>
              <input value={info.province || "BC"} onChange={e => onChange({ ...info, province: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", marginBottom: 6, fontFamily: "'Georgia', serif" }}>Postal</label>
              <input value={info.postalCode || ""} onChange={e => onChange({ ...info, postalCode: e.target.value })} style={{ width: "100%", padding: "10px 14px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 14, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          {field("Year Built", "builtYear", "number")}
          {field("Number of Strata Units", "units", "number")}
          {field("Inspection Date", "inspectionDate", "date")}
          {field("Report Date", "reportDate", "date")}
        </Card>
        <div>
          <Card title="Advisor Information">
            {field("Lead Advisor Name", "advisor")}
            {field("Designations (e.g. AACI, CRP, RI(BC))", "advisorDesignations")}
            {field("AIC / License Number", "advisorLicense")}
            {field("Co-signer / Supervisor Name", "cosigner")}
            {field("Co-signer Designations", "cosignerDesignations")}
            {field("Firm Name", "firm")}
            {field("Firm Phone", "firmPhone")}
            {field("Firm Website", "firmWebsite")}
            {field("Firm Address", "firmAddress")}
          </Card>
          <div style={{ marginTop: 16 }}>
            <Card title="Property Management">
              {field("Property Management Company", "propertyManager")}
              {field("PM Address", "propertyManagerAddress")}
              {field("Previous Report Year(s)", "previousReportYear")}
              {field("Governing Documents Notes", "governingDocumentsNotes")}
              {field("Fiscal Year Start Month", "fiscalMonthStart")}
            </Card>
          </div>
          <div style={{ marginTop: 16 }}>
            <Card title="Economic Parameters">
              <div style={{ background: "#f0e8d8", borderRadius: 8, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#5a4a3a", lineHeight: 1.6 }}>
                These rates drive all 30-year financial projections. Based on local Vancouver/BC construction cost indices, BoC interest rates, and StatCan CPI data.
              </div>
              {numField("Construction Cost Inflation Rate (%)", "constructionInflation")}
              {numField("Reserve Fund Interest Rate (%)", "interestRate")}
              {numField("CPI Inflation Rate (%)", "cpiInflation")}
              {numField("Minimum Reserve Balance ($)", "minBalance", 1000)}
              {numField("Assumed Building Economic Life (years)", "buildingLife", 5)}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── COMPONENTS TAB ───────────────────────────────────────────────────────────
function ComponentsTab({ selected, onChange }) {
  const [expandedId, setExpandedId] = useState(null);
  const [showLibrary, setShowLibrary] = useState(false);
  const grouped = groupBy(COMPONENT_LIBRARY, "category");

  const addComponent = (lib) => {
    if (selected.find(s => s.libId === lib.id)) return;
    const newComp = {
      id: `${lib.id}_${Date.now()}`, libId: lib.id, name: lib.name, category: lib.category,
      description: lib.desc, condition: "Good", effectiveAge: 0, lifespan: 20, photos: [],
      conditionAnalysis: "", scopeOfWork: "", possibleDeterioration: "", recommendedAction: "", workCompleted: "",
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
      <SectionHeader title="Building Components" subtitle="Select common property components from the library and enter field data" />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ color: "#5a4a3a", fontSize: 14 }}>{selected.length} component{selected.length !== 1 ? "s" : ""} selected</div>
        <button onClick={() => setShowLibrary(!showLibrary)} style={{ background: "#1a3a5c", color: "#c8a96e", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", gap: 8, fontFamily: "'Georgia', serif", letterSpacing: 1 }}>
          <Icon name="plus" size={14} /> Add Component from Library
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
                    <button key={item.id} onClick={() => !already && addComponent(item)} disabled={!!already} style={{
                      background: already ? "#e8e0d0" : "#fffef8", border: `1px solid ${already ? "#c8b89a" : "#c8a96e"}`,
                      borderRadius: 6, padding: "10px 14px", cursor: already ? "not-allowed" : "pointer",
                      textAlign: "left", opacity: already ? 0.6 : 1,
                    }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#1a3a5c", fontFamily: "'Georgia', serif" }}>{item.name}</div>
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
      {selected.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#8a7a6a", background: "#fffef8", borderRadius: 12, border: "2px dashed #c8b89a" }}>
          <Icon name="building" size={40} />
          <div style={{ marginTop: 16, fontSize: 16, fontFamily: "'Georgia', serif" }}>No components added yet</div>
        </div>
      )}
      {selected.map((comp, idx) => (
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
  return (
    <div style={{ background: "#fffef8", border: "1px solid #d8c8b0", borderRadius: 12, marginBottom: 12, overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
      <div onClick={onToggle} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer", background: expanded ? "#f5efe0" : "#fffef8" }}>
        <div style={{ background: catColor, color: "#fff", borderRadius: 6, padding: "6px 10px", fontSize: 12, fontWeight: 700, minWidth: 28, textAlign: "center" }}>{idx + 1}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#1a2a3a", fontFamily: "'Georgia', serif" }}>{comp.name}</div>
          <div style={{ fontSize: 11, color: "#8a7a6a", marginTop: 2, letterSpacing: 1, textTransform: "uppercase" }}>{comp.category}</div>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center", fontSize: 13, color: "#5a4a3a" }}>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: catColor }}>{comp.effectiveAge} / {comp.lifespan} yrs</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Age / Life</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: remaining <= 5 ? "#c0392b" : "#2d6a4f" }}>{remaining} yrs</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Remaining</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontWeight: 700, color: "#1a3a5c" }}>{fmt(comp.totalCost)}</div><div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 1 }}>Current Cost</div></div>
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
              <textarea value={comp.description || ""} onChange={e => onUpdate({ description: e.target.value })} rows={3} style={textareaStyle} />
              <SubLabel>Condition</SubLabel>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {CONDITION_OPTIONS.map(c => (
                  <button key={c} onClick={() => onUpdate({ condition: c })} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${comp.condition === c ? "#1a3a5c" : "#c8b89a"}`, background: comp.condition === c ? "#1a3a5c" : "#fffef8", color: comp.condition === c ? "#fff" : "#5a4a3a", cursor: "pointer", fontSize: 12 }}>{c}</button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
                <div><SubLabel>Effective Age (yrs)</SubLabel><input type="number" value={comp.effectiveAge} onChange={e => onUpdate({ effectiveAge: parseInt(e.target.value) || 0 })} style={inputStyle} /></div>
                <div><SubLabel>Lifespan (yrs)</SubLabel><input type="number" value={comp.lifespan} onChange={e => onUpdate({ lifespan: parseInt(e.target.value) || 1 })} style={inputStyle} /></div>
              </div>
              <SubLabel>Photos</SubLabel>
              <PhotoUpload photos={comp.photos || []} onUpdate={(photos) => onUpdate({ photos })} />
            </div>
            <div>
              <SubLabel>Condition Analysis</SubLabel>
              <textarea value={comp.conditionAnalysis || ""} onChange={e => onUpdate({ conditionAnalysis: e.target.value })} placeholder="Describe observed conditions, deficiencies…" rows={3} style={textareaStyle} />
              <SubLabel>Work Completed to Date</SubLabel>
              <textarea value={comp.workCompleted || ""} onChange={e => onUpdate({ workCompleted: e.target.value })} placeholder="Known reserve fund work completed to date…" rows={2} style={textareaStyle} />
              <SubLabel>Scope of Work</SubLabel>
              <textarea value={comp.scopeOfWork || ""} onChange={e => onUpdate({ scopeOfWork: e.target.value })} placeholder="Describe anticipated scope of repair or replacement…" rows={3} style={textareaStyle} />
              <SubLabel>Possible Deterioration</SubLabel>
              <textarea value={comp.possibleDeterioration || ""} onChange={e => onUpdate({ possibleDeterioration: e.target.value })} placeholder="How may this component deteriorate if deferred…" rows={2} style={textareaStyle} />
              <SubLabel>Suggested Maintenance</SubLabel>
              <textarea value={comp.recommendedAction || ""} onChange={e => onUpdate({ recommendedAction: e.target.value })} placeholder="Ongoing maintenance and suggested actions…" rows={2} style={textareaStyle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PhotoUpload({ photos, onUpdate }) {
  const handleFile = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
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
              <button onClick={() => onUpdate(photos.filter((_, j) => j !== i))} style={{ position: "absolute", top: -6, right: -6, background: "#c0392b", color: "#fff", border: "none", borderRadius: "50%", width: 18, height: 18, cursor: "pointer", fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
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
  const addCostItem = (item) => { const newItem = { ...item, qty: 1, id: `${item.id}_${Date.now()}` }; updateComp({ costItems: [...(comp.costItems || []), newItem] }); };
  const updateCostItem = (itemId, updates) => updateComp({ costItems: comp.costItems.map(i => i.id === itemId ? { ...i, ...updates } : i) });
  const removeCostItem = (itemId) => updateComp({ costItems: comp.costItems.filter(i => i.id !== itemId) });

  const filteredRS = RS_MEANS_ITEMS.filter(i => !rsMeansSearch || i.name.toLowerCase().includes(rsMeansSearch.toLowerCase()) || i.category.toLowerCase().includes(rsMeansSearch.toLowerCase()));
  const rsGrouped = groupBy(filteredRS, "category");

  if (components.length === 0) return <div style={{ textAlign: "center", padding: 80, color: "#8a7a6a" }}>Add components first in the Components tab.</div>;

  return (
    <div>
      <SectionHeader title="Component Costing" subtitle="Build cost estimates from RS Means database items with adjustments for demolition, tax, and contingency" />
      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        <Card title="Components">
          {components.map((c, i) => (
            <button key={c.id} onClick={() => setActiveComp(c.id)} style={{ width: "100%", textAlign: "left", background: activeComp === c.id ? "#f0e8d8" : "transparent", border: "none", borderLeft: `3px solid ${activeComp === c.id ? "#1a3a5c" : "transparent"}`, padding: "10px 14px", cursor: "pointer", marginBottom: 4, borderRadius: "0 6px 6px 0" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1a2a3a" }}>{i + 1}. {c.name}</div>
              <div style={{ fontSize: 12, color: "#8a7a6a", marginTop: 2 }}>{fmt(c.totalCost)}</div>
            </button>
          ))}
        </Card>
        {comp && (
          <div>
            <Card title={`Costing: ${comp.name}`}>
              <div style={{ marginBottom: 24 }}>
                <SubLabel>Add Items from RS Means Database</SubLabel>
                <input placeholder="Search RS Means items…" value={rsMeansSearch} onChange={e => setRsMeansSearch(e.target.value)} style={{ ...inputStyle, marginBottom: 12 }} />
                <div style={{ maxHeight: 220, overflowY: "auto", border: "1px solid #e0d8cc", borderRadius: 8, background: "#f8f4ec" }}>
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
                <div style={{ marginBottom: 24 }}>
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
                      <tr style={{ background: "#f0e8d8", fontWeight: 700 }}>
                        <td colSpan={4} style={{ padding: "10px 12px", textAlign: "right", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Base Cost Subtotal</td>
                        <td style={{ padding: "10px 12px", color: "#1a3a5c" }}>{fmt(comp.costItems.reduce((sum, i) => sum + (i.rate || 0) * (i.qty || 0), 0))}</td>
                        <td />
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
                {[{ label: "Demolition / Removal (%)", key: "demolitionPct" }, { label: "GST / Tax (%)", key: "taxPct" }, { label: "Contingency (%)", key: "contingencyPct" }, { label: "Budget % (Cost Applied)", key: "budgetPct" }].map(({ label, key }) => (
                  <div key={key}><SubLabel>{label}</SubLabel><input type="number" step={0.5} value={comp[key] ?? 0} onChange={e => updateComp({ [key]: parseFloat(e.target.value) || 0 })} style={inputStyle} /></div>
                ))}
              </div>
              <CostSummary comp={comp} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

function recalcCost(comp) {
  const base = (comp.costItems || []).reduce((sum, i) => sum + (i.rate || 0) * (i.qty || 0), 0);
  const withDemolition = base * (1 + (comp.demolitionPct || 0) / 100);
  const withTax = withDemolition * (1 + (comp.taxPct || 0) / 100);
  const withContingency = withTax * (1 + (comp.contingencyPct || 0) / 100);
  return { ...comp, totalCost: withContingency * ((comp.budgetPct ?? 100) / 100) };
}

function CostSummary({ comp }) {
  const base = (comp.costItems || []).reduce((sum, i) => sum + (i.rate || 0) * (i.qty || 0), 0);
  const withDemo = base * (1 + (comp.demolitionPct || 0) / 100);
  const withTax = withDemo * (1 + (comp.taxPct || 0) / 100);
  const withCont = withTax * (1 + (comp.contingencyPct || 0) / 100);
  const total = withCont * ((comp.budgetPct ?? 100) / 100);
  return (
    <div style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 12, padding: 24, color: "#fff" }}>
      <div style={{ fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: "#c8a96e", marginBottom: 16 }}>Component Cost Summary</div>
      {[["Base Material & Labour", base], [`+ Demolition (${comp.demolitionPct || 0}%)`, withDemo - base], [`+ GST/Tax (${comp.taxPct || 0}%)`, withTax - withDemo], [`+ Contingency (${comp.contingencyPct || 0}%)`, withCont - withTax], [`× Budget % (${comp.budgetPct ?? 100}%)`, total - withCont]].map(([label, val]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 13 }}><span style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span><span>{fmt(val)}</span></div>
      ))}
      <div style={{ borderTop: "1px solid rgba(200,169,110,0.4)", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between" }}>
        <span style={{ color: "#c8a96e", fontWeight: 700, fontSize: 14, letterSpacing: 1 }}>TOTAL CURRENT COST</span>
        <span style={{ color: "#c8a96e", fontWeight: 700, fontSize: 20 }}>{fmt(total)}</span>
      </div>
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

  return (
    <div>
      <SectionHeader title="Projected Expenditures" subtitle={`30-year forecast with ${projectInfo.constructionInflation || 3.8}% construction cost inflation`} />
      <Card title="30-Year Expenditure Schedule">
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
            <thead>
              <tr style={{ background: "#1a3a5c" }}>
                <th style={{ padding: "10px 12px", textAlign: "left", color: "#c8a96e", fontWeight: 700, letterSpacing: 1, position: "sticky", left: 0, background: "#1a3a5c", minWidth: 200 }}>Component</th>
                {years.map(y => <th key={y} style={{ padding: "10px 8px", color: "#fff", fontWeight: 600, textAlign: "center", minWidth: 72 }}>{y}</th>)}
              </tr>
            </thead>
            <tbody>
              {projections.map((comp, i) => (
                <tr key={comp.id} style={{ background: i % 2 === 0 ? "#fffef8" : "#f5f0e8" }}>
                  <td style={{ padding: "8px 12px", fontSize: 12, position: "sticky", left: 0, background: i % 2 === 0 ? "#fffef8" : "#f5f0e8" }}>
                    <div style={{ fontWeight: 600, color: "#1a2a3a" }}>{i + 1}. {comp.name}</div>
                    <div style={{ color: "#8a7a6a", fontSize: 10 }}>{fmt(comp.totalCost)} today · {comp.lifespan}yr life</div>
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
      <SectionHeader title="Historical & Current Financial Analysis" subtitle="5-year reserve fund history plus current fiscal year projection" />
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead>
            <tr style={{ background: "#1a3a5c" }}>
              <th style={{ padding: "12px 16px", textAlign: "left", color: "#c8a96e", letterSpacing: 1, fontSize: 11, textTransform: "uppercase", minWidth: 220 }}>Item</th>
              {financials.years.map((y, i) => (
                <th key={i} style={{ padding: "12px 12px", color: "#fff", fontSize: 12, fontWeight: 700, textAlign: "right", minWidth: 140 }}>
                  Apr {y.year}–Mar {y.year + 1}
                  {i === financials.years.length - 1 && <div style={{ fontSize: 9, color: "#c8a96e", letterSpacing: 1 }}>REPORT YEAR</div>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <FinRow label="Opening Balance" bgColor="#e8ddd0" bold>
              {financials.years.map((y, i) => <td key={i} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#1a3a5c", background: "#e8ddd0" }}><input type="number" value={y.openingBalance || ""} onChange={e => updateYear(i, { openingBalance: parseFloat(e.target.value) || 0 })} style={miniInputStyle} disabled={i > 0} /></td>)}
            </FinRow>
            <FinSectionLabel label="Reserve Fund Income" />
            {[{ key: "rfContribution", label: "Reserve Fund Contributions" }, { key: "specialLevy", label: "Special Levy" }, { key: "interest", label: "Interest Income" }, { key: "transferIn", label: "Transfer In / (Out)" }].map(({ key, label }) => (
              <FinRow key={key} label={label}>
                {financials.years.map((y, i) => <td key={i} style={{ padding: "8px 12px", textAlign: "right" }}><input type="number" value={y[key] || ""} onChange={e => updateYear(i, { [key]: parseFloat(e.target.value) || 0 })} style={miniInputStyle} /></td>)}
              </FinRow>
            ))}
            <FinSectionLabel label="Reserve Fund Expenditures" />
            {components.map(comp => (
              <FinRow key={comp.id} label={comp.name} indent>
                {financials.years.map((y, i) => <td key={i} style={{ padding: "6px 12px", textAlign: "right" }}><input type="number" value={y.expenditures?.[comp.id] || ""} onChange={e => updateYear(i, { expenditures: { ...(y.expenditures || {}), [comp.id]: parseFloat(e.target.value) || 0 } })} style={miniInputStyle} placeholder="0" /></td>)}
              </FinRow>
            ))}
            <FinRow label="Other / Miscellaneous" indent>
              {financials.years.map((y, i) => <td key={i} style={{ padding: "6px 12px", textAlign: "right" }}><input type="number" value={y.expenditures?.misc || ""} onChange={e => updateYear(i, { expenditures: { ...(y.expenditures || {}), misc: parseFloat(e.target.value) || 0 } })} style={miniInputStyle} placeholder="0" /></td>)}
            </FinRow>
            <FinRow label="Total Expenditures" bgColor="#f5efe0" bold>
              {financials.years.map((y, i) => { const total = Object.values(y.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0); return <td key={i} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, color: "#c0392b", background: "#f5efe0" }}>{fmt(total)}</td>; })}
            </FinRow>
            <FinRow label="Closing Balance" bgColor="#1a3a5c" bold dark>
              {financials.years.map((y, i) => { const inc = (y.rfContribution || 0) + (y.interest || 0) + (y.specialLevy || 0) + (y.transferIn || 0); const exp = Object.values(y.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0); const closing = (y.openingBalance || 0) + inc - exp; return <td key={i} style={{ padding: "10px 12px", textAlign: "right", fontWeight: 700, fontSize: 14, color: closing >= 0 ? "#c8a96e" : "#ff6b6b", background: "#1a3a5c" }}>{fmt(closing)}</td>; })}
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

// ─── FUNDING MODELS TAB ───────────────────────────────────────────────────────
function FundingModelsTab({ components, financials, projectInfo, fundingModel, onChange }) {
  const currentYear = projectInfo.inspectionDate ? new Date(projectInfo.inspectionDate).getFullYear() : new Date().getFullYear();
  const constructionInflation = (projectInfo.constructionInflation || 3.8) / 100;
  const interestRate = (projectInfo.interestRate || 3.1) / 100;
  const cpiInflation = (projectInfo.cpiInflation || 2.0) / 100;
  const buildingLife = projectInfo.buildingLife || 100;
  const builtYear = parseInt(projectInfo.builtYear) || (currentYear - 38);
  const numYears = Math.min(30, builtYear + buildingLife - currentYear);
  const years = Array.from({ length: numYears }, (_, i) => currentYear + i + 1);

  const lastFinYear = financials.years[financials.years.length - 1];
  const lastInc = (lastFinYear?.rfContribution || 0) + (lastFinYear?.interest || 0) + (lastFinYear?.specialLevy || 0) + (lastFinYear?.transferIn || 0);
  const lastExp = Object.values(lastFinYear?.expenditures || {}).reduce((a, b) => a + (parseFloat(b) || 0), 0);
  const reportOpeningBalance = (lastFinYear?.openingBalance || 0) + lastInc - lastExp;

  const expendByYear = {};
  years.forEach(yr => {
    expendByYear[yr] = components.reduce((sum, comp) => {
      let nextYear = currentYear + Math.max(0, comp.lifespan - comp.effectiveAge);
      while (nextYear <= currentYear + numYears) { if (nextYear === yr) sum += (comp.totalCost || 0) * Math.pow(1 + constructionInflation, nextYear - currentYear); nextYear += comp.lifespan; }
      return sum;
    }, 0);
  });

  const totalCurrentCost = components.reduce((s, c) => s + (c.totalCost || 0), 0);
  const idealAnnualContrib = totalCurrentCost > 0 ? totalCurrentCost * (1 + cpiInflation) / (components.reduce((s, c) => s + c.lifespan, 0) / Math.max(components.length, 1)) : 0;

  function buildSchedule(model) {
    let balance = reportOpeningBalance;
    const lastContrib = lastFinYear?.rfContribution || idealAnnualContrib * 0.15;
    return years.map((yr, i) => {
      const expend = expendByYear[yr] || 0;
      let contrib;
      if (model === "minimum") { contrib = lastContrib * Math.pow(1 + cpiInflation, i + 1); }
      else if (model === "full") { const rem = years.length - i; contrib = Math.max(lastContrib, (totalCurrentCost * 0.9 - balance + expend) / Math.max(rem, 1)); contrib = Math.max(contrib, lastContrib * Math.pow(1 + cpiInflation, i + 1)); }
      else { const ramp = 0.15 + (0.85 * i / Math.max(years.length - 1, 1)); contrib = idealAnnualContrib * ramp * Math.pow(1 + cpiInflation, i); contrib = Math.max(contrib, lastContrib * Math.pow(1 + cpiInflation, i + 1)); }
      const interest = Math.max(0, balance - expend) * interestRate;
      const closing = balance + contrib + interest - expend;
      const minBal = (projectInfo.minBalance || 16000) * Math.pow(1 + cpiInflation, i);
      const specialLevy = closing < minBal ? minBal - closing : 0;
      const finalClosing = closing + specialLevy;
      const row = { year: yr, openingBalance: balance, contribution: contrib, interest, expenditure: expend, specialLevy, closingBalance: finalClosing };
      balance = finalClosing;
      return row;
    });
  }

  const schedules = { minimum: buildSchedule("minimum"), adequate: buildSchedule("adequate"), full: buildSchedule("full") };
  const activeModel = fundingModel.activeModel || "adequate";
  const activeSchedule = schedules[activeModel];
  const modelInfo = {
    minimum: { label: "Minimum Funding", color: "#c0392b", desc: "CPI-adjusted current contributions only. Higher special levy risk." },
    adequate: { label: "Adequate Funding", color: "#2d6a4f", desc: "Recommended under BC legislation. Ramped contributions to flatten deficiency curve." },
    full: { label: "Full Funding", color: "#1a3a5c", desc: "Targets zero deficiency by year 30. Highest contributions, maximum stability." },
  };

  return (
    <div>
      <SectionHeader title="Funding Models" subtitle="Three 30-year reserve fund scenarios per BC Strata Property Act requirements" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 32 }}>
        {Object.entries(modelInfo).map(([key, info]) => (
          <button key={key} onClick={() => onChange({ ...fundingModel, activeModel: key })} style={{ background: activeModel === key ? info.color : "#fffef8", border: `2px solid ${info.color}`, borderRadius: 12, padding: 24, cursor: "pointer", textAlign: "left" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: activeModel === key ? "#fff" : info.color, fontFamily: "'Georgia', serif", marginBottom: 8 }}>{info.label}</div>
            <div style={{ fontSize: 12, color: activeModel === key ? "rgba(255,255,255,0.8)" : "#5a4a3a", lineHeight: 1.5 }}>{info.desc}</div>
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 32 }}>
        {[{ label: "Opening Balance", val: fmt(reportOpeningBalance) }, { label: "Year 1 Contribution", val: fmt(activeSchedule[0]?.contribution) }, { label: "Year 30 Contribution", val: fmt(activeSchedule[activeSchedule.length - 1]?.contribution) }, { label: "Avg Monthly / Unit", val: projectInfo.units ? fmt((activeSchedule[0]?.contribution || 0) / 12 / parseInt(projectInfo.units)) : "—" }].map(({ label, val }) => (
          <div key={label} style={{ background: "linear-gradient(135deg, #0d2137, #1a3a5c)", borderRadius: 12, padding: 20, color: "#fff" }}>
            <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#c8a96e", marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{val}</div>
          </div>
        ))}
      </div>
      <Card title={`${modelInfo[activeModel].label} — 30-Year Schedule`}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#1a3a5c" }}>
                {["Fiscal Year", "Opening Balance", "Contribution", "Special Levy", "Interest", "Expenditures", "Closing Balance", "$/Unit/Mo"].map(h => <th key={h} style={{ padding: "10px 12px", textAlign: "right", color: "#c8a96e", fontSize: 10, textTransform: "uppercase", fontWeight: 700, whiteSpace: "nowrap" }}>{h === "Fiscal Year" ? <span style={{ textAlign: "left", display: "block" }}>{h}</span> : h}</th>)}
              </tr>
            </thead>
            <tbody>
              {activeSchedule.map((row, i) => (
                <tr key={row.year} style={{ background: i % 2 === 0 ? "#fffef8" : "#f5f0e8", borderBottom: "1px solid #ede8e0" }}>
                  <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1a3a5c" }}>Apr {row.year}–Mar {row.year + 1}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", color: "#5a4a3a" }}>{fmt(row.openingBalance)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", color: "#2d6a4f", fontWeight: 600 }}>{fmt(row.contribution)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", color: row.specialLevy > 0 ? "#c0392b" : "#8a7a6a" }}>{row.specialLevy > 0 ? fmt(row.specialLevy) : "—"}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>{fmt(row.interest)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", color: row.expenditure > 0 ? "#c0392b" : "#8a7a6a" }}>{row.expenditure > 0 ? fmt(row.expenditure) : "—"}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, color: row.closingBalance >= 0 ? "#1a3a5c" : "#c0392b" }}>{fmt(row.closingBalance)}</td>
                  <td style={{ padding: "8px 12px", textAlign: "right" }}>{projectInfo.units ? fmt(row.contribution / 12 / parseInt(projectInfo.units)) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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
      {title && <div style={{ padding: "14px 20px", background: "#f0e8d8", borderBottom: "1px solid #d8c8b0", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#5a4a3a", fontWeight: 700 }}>{title}</div>}
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}
function SubLabel({ children }) {
  return <div style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "#7a6a5a", marginBottom: 6, marginTop: 4 }}>{children}</div>;
}
const inputStyle = { width: "100%", padding: "9px 12px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 13, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box" };
const textareaStyle = { width: "100%", padding: "9px 12px", border: "1px solid #c8b89a", borderRadius: 6, background: "#fffef8", fontSize: 13, fontFamily: "'Georgia', serif", outline: "none", resize: "vertical", boxSizing: "border-box", marginBottom: 16 };
const miniInputStyle = { width: 130, padding: "6px 10px", border: "1px solid #c8b89a", borderRadius: 4, background: "#fffef8", fontSize: 12, fontFamily: "'Georgia', serif", textAlign: "right" };
