import { OptionMap } from '../../types'; // Adjusted path if types.ts is in root
import { ASPECT_RATIO_OPTIONS } from '../../constants'; // Import from constants

export const PROMPT_OPTIONS_DATA: OptionMap = {
  aspectRatio: ASPECT_RATIO_OPTIONS, 
  era: [
    { label: "— اختر الحقبة —", value: "" },
    { label: "Pre‑Islamic Arabia (Jāhilīyah)", value: "pre_islamic_arabia" },
    { label: "Prophetic Era (610‑632 CE)", value: "prophetic_era" },
    { label: "Rashidun Caliphate (632‑661 CE)", value: "rashidun_caliphate" },
    { label: "Umayyad Caliphate (661‑750 CE)", value: "umayyad_caliphate" },
    { label: "Abbasid Caliphate – Early Golden Age", value: "abbasid_caliphate" },
    { label: "Fatimid Caliphate (909‑1171 CE)", value: "fatimid_caliphate" },
    { label: "Al‑Andalus (Umayyad Spain)", value: "al_andalus" },
    { label: "Ayyubid & Crusader Period", value: "ayyubid_crusader" },
    { label: "Mamluk Sultanate", value: "mamluk_sultanate" },
    { label: "Edo Period Japan", value: "edo_japan"},
  ],
  location: [
    { label: "— اختر المكان —", value: "" },
    { 
      label: "The Ancient Cube Shrine (Structure)", 
      value: "A massive, ancient, simple cuboid stone structure, without ornate calligraphy, covered in rough dark cloths, surrounded by primitive idols in a sandy courtyard", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "The House of Wisdom (Baghdad Structure)", 
      value: "A grand Abbasid complex with ornate archways and vast libraries filled with scrolls, bustling with scholars", 
      eraScope: ["abbasid_caliphate"] 
    },
    {
      label: "Dar al-Nadwa (Mecca's Parliament Structure)",
      value: "A significant, simple stone building near the Kaaba courtyard, where tribal elders and leaders are gathered in serious discussion",
      eraScope: ["pre_islamic_arabia"]
    },
    { label: "Meccan Bazaar", value: "mecca_bazaar", eraScope: ["pre_islamic_arabia", "prophetic_era"] },
    { label: "Kaaba Courtyard", value: "kaaba_courtyard", eraScope: ["prophetic_era", "rashidun_caliphate"] },
    { label: "Medina Date‑Palm Grove", value: "medina_palm_grove", eraScope: ["prophetic_era", "rashidun_caliphate"] },
    { label: "Damascus Grand Mosque", value: "damascus_mosque", eraScope: ["umayyad_caliphate"] },
    { label: "Cairo Al‑Azhar Courtyard", value: "al_azhar_cairo", eraScope: ["fatimid_caliphate", "mamluk_sultanate"] },
    { label: "Andalusian Patio (Cordoba)", value: "cordoba_patio", eraScope: ["al_andalus"] },
    { label: "Desert Caravan Route", value: "desert_caravan" },
    { label: "Serene Temple Garden (Japan)", value: "serene_temple_garden", eraScope: ["edo_japan"]}
  ],
  timeOfDay: [
    { label: "Any Time", value: "" },
    { label: "Golden Hour (Sunrise/Sunset)", value: "golden_hour" },
    { label: "Midday (Bright Sun)", value: "midday_sun" },
    { label: "Twilight (Dusk/Dawn)", value: "twilight" },
    { label: "Night (Moonlit)", value: "night_moonlit" },
    { label: "Night (Dark)", value: "night_dark" },
    { label: "Overcast Afternoon", value: "overcast_afternoon" },
    { label: "Spring Morning", value: "spring_morning" }
  ],
  lighting: [
    { label: "Any Lighting", value: "" },
    { label: "Cinematic Lighting", value: "cinematic_lighting" },
    { label: "Chiaroscuro (High Contrast)", value: "chiaroscuro" },
    { label: "Soft Diffused Light", value: "soft_diffused_light" },
    { label: "Rim Lighting", value: "rim_lighting" },
    { label: "Volumetric Lighting", value: "volumetric_lighting" },
    { label: "Natural Light", value: "natural_light" },
    { label: "Single Oil‑Lamp Key", value: "oil_lamp_key", eraScope: ["pre_islamic_arabia", "prophetic_era", "abbasid_caliphate"] },
    { label: "Low‑angle Sun Rim", value: "low_angle_sun_rim" },
    { label: "Torch‑lit Courtyard", value: "torch_courtyard", eraScope: ["umayyad_caliphate", "fatimid_caliphate"] },
    { label: "Soft Window Light", value: "soft_window_light" },
    { label: "Volumetric Dust Shafts", value: "volumetric_shafts" }
  ],
  mood: [
    { label: "Any Mood", value: "" },
    { label: "Mysterious", value: "mysterious" },
    { label: "Joyful & Celebratory", value: "joyful_celebratory" },
    { label: "Dramatic & Tense", value: "dramatic_tense" },
    { label: "Peaceful & Serene", value: "peaceful_serene" },
    { label: "Epic & Grandiose", value: "epic_grandiose" },
    { label: "Solemn / Spiritual", value: "solemn_spiritual" },
    { label: "Triumphant", value: "triumphant" },
    { label: "Reflective / Scholarly", value: "reflective_scholarly" },
    { label: "Bustling Market Energy", value: "bustling_market" },
    { label: "Battle Tension", value: "battle_tension" }
  ],
  weather: [
    { label: "Any Weather", value: "" },
    { label: "Clear Sky", value: "clear_sky"},
    { label: "Light Rain", value: "light_rain"},
    { label: "Misty / Foggy", value: "misty_foggy"},
    { label: "Sandstorm", value: "sandstorm", eraScope: ["pre_islamic_arabia", "abbasid_caliphate"]}, // Example scope
    { label: "Snowing Lightly", value: "snowing_lightly"},
    { label: "Overcast Clouds", value: "overcast_clouds"},
    { label: "Clear Sky, Cherry Blossoms Falling", value: "clear_sky_cherry_blossoms_falling", eraScope:["edo_japan"]}
  ],
  palette: [
    { label: "Any Palette", value: "" },
    { label: "Rich Jewel Tones", value: "rich_jewel_tones", eraScope: ["abbasid_caliphate"] },
    { label: "Monochrome (Black & White)", value: "monochrome" },
    { label: "Sepia Tone", value: "sepia_tone" },
    { label: "Earthy Tones (Browns, Greens)", value: "earthy_tones" },
    { label: "Vibrant & Saturated", value: "vibrant_saturated" },
    { label: "Pastel Colors", value: "pastel_colors" },
    { label: "Cool Blues & Grays", value: "cool_blues_grays" },
  ],
  cameraAngle: [
    { label: "Any Angle", value: "" },
    { label: "Eye-Level Shot", value: "eye_level" },
    { label: "Low-Angle Shot", value: "low_angle" },
    { label: "High-Angle Shot", value: "high_angle" },
    { label: "Aerial View (Bird's Eye)", value: "aerial_view" },
    { label: "Dutch Angle (Canted)", value: "dutch_angle" },
    { label: "Close-Up Shot", value: "close_up" },
    { label: "Wide Shot", value: "wide_shot" },
  ],
  lens: [
    { label: "Any Lens", value: "" },
    { label: "50mm Prime Lens (Standard)", value: "50mm_prime" },
    { label: "Wide-Angle Lens (e.g., 24mm)", value: "wide_angle_24mm" },
    { label: "Telephoto Lens (e.g., 200mm)", value: "telephoto_200mm" },
    { label: "Macro Lens (Extreme Close-up)", value: "macro_lens" },
    { label: "Fisheye Lens", value: "fisheye_lens" },
  ],
  aperture: [
    { label: "Any Aperture", value: "" },
    { label: "f/1.4 (Very Shallow Depth of Field)", value: "f_1_4_shallow" },
    { label: "f/2.8 (Shallow Depth of Field)", value: "f_2_8_shallow" },
    { label: "f/8.0 (Moderate Depth of Field)", value: "f_8_0_moderate" },
    { label: "f/16 (Deep Depth of Field)", value: "f_16_deep" },
  ],
  artisticStyle: [
    { label: "Any Style", value: "" },
    { label: "Photorealistic", value: "photorealistic" },
    { label: "Oil Painting (General)", value: "oil_painting" },
    { label: "Orientalist Oil Painting", value: "orientalist_oil_painting", eraScope: ["abbasid_caliphate", "mamluk_sultanate"] },
    { label: "Ukiyo-e Woodblock Print", value: "ukiyo_e_woodblock", eraScope: ["edo_japan"] },
    { label: "Impressionistic", value: "impressionistic" },
    { label: "Charcoal Sketch", value: "charcoal_sketch" },
    { label: "Watercolor Painting", value: "watercolor_painting" },
    { label: "Cinematic Film Still", value: "cinematic_film_still" },
  ],
  keyElements: [
    { label: "— Add a Key Element —", value: "" }, // Placeholder for dropdown

    // --- Iconic Structures ---
    { 
      label: "The Ancient Cube Shrine (Jahiliyyah Kaaba)", 
      // Value is the description to be injected. Using a shorter internal value for selection if needed, but prompt wants full desc.
      // For consistency with current `OptionSet`, `value` here will be the description itself to avoid an extra lookup layer for now.
      // If `value` was `jahiliyyah_kaaba_desc`, we'd need to look up this full string.
      // Let's assume `value` *is* the string to inject.
      value: "A massive, ancient, simple cuboid stone structure, without ornate calligraphy, covered in rough dark cloths, surrounded by primitive idols in a sandy courtyard.", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "The House of Wisdom (Baghdad)", 
      value: "A grand Abbasid complex with ornate archways and vast libraries filled with scrolls, bustling with scholars.", 
      eraScope: ["abbasid_caliphate"] 
    },
    {
      label: "Dar al-Nadwa (Mecca's Parliament)",
      value: "A significant, simple stone building near the Kaaba courtyard, where tribal elders and leaders are gathered in serious discussion.",
      eraScope: ["pre_islamic_arabia"]
    },

    // --- Key Characters ---
    { 
      label: "Character: Hashim (Charismatic Leader)", 
      value: "A handsome, charismatic, and respected middle-aged Quraysh leader with a confident and generous expression.", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "Character: Umayyah (Envious Nephew)", 
      value: "A man with a face consumed by envy and bitterness, watching from the fringes of a crowd.", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "Character: Abd al-Muttalib (Venerable Elder)", 
      value: "A venerable and wise old man with a serene and determined face, often depicted in a dream-like state or leading a great discovery.", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "Character: Qusayy ibn Kilab (The Founder)", 
      value: "A powerful and sagacious elderly leader with an authoritative presence, seen making a fateful decision in a council of elders.", 
      eraScope: ["pre_islamic_arabia"] 
    },

    // --- Symbolic Objects & Details ---
    { 
      label: "Object: Bowl of Perfume", 
      value: "An ornate golden bowl filled with glistening, expensive perfume, emitting a fragrant haze.", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "Object: Bowl of Blood", 
      value: "A rustic clay vessel filled with dark, sacrificial blood, used in a grim oath-swearing ritual.", 
      eraScope: ["pre_islamic_arabia"] 
    },
    { 
      label: "Object: The Keys of the Kaaba", 
      value: "An ornate, heavy, antique iron key, a symbol of great honor and responsibility.", 
      eraScope: ["pre_islamic_arabia", "prophetic_era", "rashidun_caliphate"] 
    },
    { 
      label: "Detail: Idols around the Shrine", 
      value: "Various small and large pagan idols and statues are arranged around the central cube shrine.", 
      eraScope: ["pre_islamic_arabia"] 
    }
  ]
};