
# Project Documentation: Historical-Scene Prompt Builder

## 1. Project Overview

### Purpose
The Historical-Scene Prompt Builder is a web application designed to help content creators, artists, and writers generate consistent, richly-described, and high-quality textual prompts for generative AI image tools. It focuses particularly on crafting prompts for historical scenes, organizing them through a hierarchical structure of Scenes and Shots to ensure thematic coherence and detail.

### Core Technology Stack
*   **React**: For building the user interface.
*   **TypeScript**: For static typing and improved code quality.
*   **Tailwind CSS (via CDN)**: For utility-first styling.
*   **Zustand**: For lightweight global state management.
*   **Native ES Modules**: For modern JavaScript module handling in the browser.

## 2. Core Concepts & Architecture

### The "Scene > Shot" Hierarchy
The application is built around a "Scene > Shot" hierarchy. While the documentation request mentions a "Project > Scene > Shot" structure, the current implementation primarily features "Scene" as the top-level organizational unit. For future development, a "Project" level could be introduced above "Scene".

*   **Scene (Scene DNA)**:
    *   This is the primary container for a distinct setting or sequence. Each scene has a "DNA" which defines its core, consistent characteristics.
    *   **Scene DNA** includes:
        *   `aspectRatio`: The aspect ratio for all shots within this scene (e.g., "16:9").
        *   `era`: The Historical Era (e.g., "Pre-Islamic Arabia", "Abbasid Caliphate").
        *   `location`: The general setting (e.g., "Meccan Bazaar", "House of Wisdom").
        *   `timeOfDay`, `mood`, `lighting`, `weather`, `palette`, `artisticStyle`: Atmospheric and stylistic elements.
        *   `keyElements`: Predefined, detailed descriptions of recurring characters, structures, or objects relevant to the scene's era.
        *   `inspiration`, `negativePrompt`: Scene-level artistic influences and exclusions.
    *   All these DNA elements are defined once per scene and automatically applied to or influence every shot within it.

*   **Shot**:
    *   An individual image prompt within a Scene. Each shot represents a specific moment, action, or view.
    *   **Shot-specific data** includes:
        *   `subject`: The main characters, actions, or focal points of this particular shot. This is where Key Elements are injected.
        *   `cameraAngle`, `lens`, `aperture`: Cinematographic choices for this shot.
        *   `details`: Any other specific objects or details unique to this shot.
        *   `selectedCreativeConceptId`: An optional "Impact Lab" concept to add a unique creative twist.
    *   A Shot inherits all the Scene DNA from its parent Scene. The final prompt for a shot combines its specific data with the overarching Scene DNA.

### Consistency by Design
The hierarchical Scene > Shot structure is fundamental to the application's design. By defining core elements at the Scene level (the "Scene DNA"), consistency is automatically enforced across all shots within that scene. Users set the era, location, mood, lighting, key elements, etc., once for the entire scene, and these are then automatically incorporated into the prompts for each individual shot. This significantly reduces repetitive input and ensures thematic and stylistic coherence.

## 3. Data Structure: `src/data/promptOptions.ts` Explained

### File Purpose
The `src/data/promptOptions.ts` file is the **single source of truth** for all predefined dropdown options and selectable content within the application. It centralizes the data used to populate selection menus for Scene DNA and Shot-specific details.

### The `OptionMap` Type
The main data structure in this file is `PROMPT_OPTIONS_DATA`, which is typed as `OptionMap`.
`OptionMap` is a TypeScript type defined as:
`Partial<Record<keyof OptionMapKeys, OptionSet[]>>`
Where `OptionMapKeys` are strings like `"era"`, `"location"`, `"keyElements"`, etc., and `OptionSet` is an interface:
```typescript
export interface OptionSet {
  label: string; // User-facing text in dropdowns
  value: string; // Internal value used in prompts or for logic
  tags?: string[];
  eraScope?: string[]; // CRITICAL: for filtering by historical era
  userScope?: string[];
}
```

### Key Data Sections
`PROMPT_OPTIONS_DATA` contains several top-level keys, each corresponding to a field in the Scene DNA or Shot details:

*   `aspectRatio`: Predefined aspect ratios (e.g., "16:9", "1:1").
*   `era`: Historical periods (e.g., "Pre-Islamic Arabia", "Edo Period Japan"). This selection is crucial as it drives `eraScope` filtering.
*   `location`: Predefined locations or settings, often filtered by `eraScope`.
*   `timeOfDay`: Times of day (e.g., "Golden Hour", "Night (Moonlit)").
*   `lighting`: Lighting styles (e.g., "Cinematic Lighting", "Chiaroscuro").
*   `mood`: Overall emotional tones for a scene.
*   `weather`: Weather conditions.
*   `palette`: Color palettes.
*   `cameraAngle`, `lens`, `aperture`: Cinematographic options for shots.
*   `artisticStyle`: Visual styles or mediums (e.g., "Photorealistic", "Oil Painting").
*   `keyElements`: **CRITICAL FEATURE**. A list of predefined, detailed textual descriptions for recurring characters, structures, or objects. Each key element has a `label` for the UI and a `value` which is the full description to be injected into prompts. These are heavily filtered by `eraScope`.

### The `eraScope` Property (CRITICAL)
The `eraScope` property on an `OptionSet` object is a cornerstone of the application's context-aware UI.

*   **How it works**: `eraScope` is an array of strings. Each string is a `value` from the `era` options (e.g., `["pre_islamic_arabia", "prophetic_era"]`).
*   **Dynamic Filtering Mechanism**: When a user selects a "Historical Era" for a Scene, other dropdowns (like "Location", "Lighting", "Key Elements") are dynamically filtered. An option will only appear in these subsequent dropdowns if:
    1.  It has no `eraScope` property (meaning it's universally applicable).
    2.  Its `eraScope` array is empty (also universal).
    3.  Its `eraScope` array includes the `value` of the currently selected "Historical Era".
*   **Example**:
    *   Suppose the user selects "Pre-Islamic Arabia" (value: `"pre_islamic_arabia"`) as the "Historical Era".
    *   In the "Key Elements" dropdown:
        *   An element like `{ label: "The Ancient Cube Shrine", value: "...", eraScope: ["pre_islamic_arabia"] }` **WILL** be shown.
        *   An element like `{ label: "The House of Wisdom (Baghdad)", value: "...", eraScope: ["abbasid_caliphate"] }` **WILL NOT** be shown.
        *   An element with no `eraScope` **WILL** be shown.

This ensures that users are only presented with options that are contextually relevant to the chosen historical period, enhancing usability and the quality of generated prompts.

## 4. Key Features & Logic

### Dynamic Dropdowns
As explained above, dropdowns for fields like "Location", "Lighting Style", and "Key Elements" are dynamically filtered based on the `eraScope` property of their options, reacting to the "Historical Era" selected in the Scene DNA. This is managed by the `useFilteredOptions` hook and the `getOptionsForField` method in the Zustand store.

### Key Elements Feature
This feature allows users to easily incorporate predefined, detailed descriptions of recurring or significant characters, structures, and objects into their scenes.

*   **Selection**: Users select "Key Elements" from a multi-select dropdown in the Scene DNA settings. This dropdown is filtered by the scene's "Historical Era".
*   **Injection Logic**:
    1.  When a user selects one or more Key Elements, the `value` property of each selected `OptionSet` (which is the full, detailed English description) is stored in the `scene.dna.keyElements` array.
    2.  During the final prompt generation for *each shot* within that scene, these stored description strings are concatenated together (typically separated by a period and space).
    3.  This concatenated string of Key Element descriptions is then **appended to the `subject` field** of the shot. This ensures these elements are described as part of the shot's main action or focus.

### Final Prompt Assembly
The final prompt string for each shot is constructed by combining various pieces of information in a structured way. This process is handled by the `serializeFullPrompt` and `serializePartialPrompt` functions in `lib/promptUtils.ts`.

Here's a step-by-step summary:

1.  **Gather Scene DNA**: Values for fields like "Historical Era", "Location", "Time of Day", "Mood", "Lighting Style", "Artistic Style", "Inspirations", and "Negative Prompts" are retrieved from the current `scene.dna`.
2.  **Gather Shot-Specific Data**: Values for "Main Subject(s) / Action", "Camera Angle", "Lens Type", "Aperture", and "Specific Details" are retrieved from the current `shot.shotSpecificData`.
3.  **Prepare Key Elements**: The descriptive strings stored in `scene.dna.keyElements` are joined together into a single string.
4.  **Enhance Shot Subject**:
    *   The concatenated Key Elements string is appended to the shot's "Main Subject(s) / Action" text.
    *   If an "Impact Lab" Creative Concept is selected for the shot, its `promptSnippet` is also appended to this enhanced subject text.
5.  **Serialize Parts**:
    *   The Scene DNA data is serialized into a string, typically with each element formatted as `Label: Value.` (e.g., `Mood: Mysterious.`). Key Elements are *not* directly serialized as part of this Scene DNA block because they are already incorporated into the shot's subject.
    *   The Shot-specific data (including the enhanced subject) is serialized into another string, similarly formatted.
6.  **Combine and Add Aspect Ratio**:
    *   The serialized Scene DNA string and the serialized Shot-specific string are concatenated.
    *   The aspect ratio from `scene.dna.aspectRatio` is appended to the very end in the format ` --ar [value]` (e.g., ` --ar 16:9`).
7.  **Clean Up**: Minor clean-up is performed (e.g., removing double periods, extra spaces).

**Conceptual Example of a Final Prompt:**

`Historical Era/Period: Pre-Islamic Arabia. Location/Setting: Kaaba Courtyard. Time of Day: Midday. Mood: Solemn / Spiritual. Lighting Style: Natural Light. Artistic Style: Photorealistic. Main Subject(s) / Action: A venerable and wise old man with a serene and determined face, often depicted in a dream-like state. An ornate, heavy, antique iron key, a symbol of great honor and responsibility. Camera Angle/View: Eye-Level Shot. Lens Type/Focal Length: 50mm Prime Lens. Aperture/Depth of Field: f/2.8 (Shallow Depth of Field). Specific Details/Objects (Shot Level): Dust motes visible in sunbeams. --ar 16:9`

*(Note: The exact formatting and inclusion of labels depend on the `serializePartialPrompt` implementation.)*

## 5. How to Add New Content

Adding new predefined options to the application is primarily done by editing the `src/data/promptOptions.ts` file.

### Adding a New Era, Location, Style, etc.

1.  **Open `src/data/promptOptions.ts`**.
2.  **Navigate to the relevant array**: Find the top-level key corresponding to the field you want to update (e.g., `era`, `location`, `artisticStyle`).
3.  **Add a new object**: Following the `OptionSet` interface, add a new object to the array.
    *   `label`: The text displayed to the user in the dropdown.
    *   `value`: A unique internal string (often a lowercase, snake_case version of the label) used for storing the selection and in logic.
    *   `eraScope` (optional): If this option should only be available for specific historical eras, add an array of era `value`s (e.g., `eraScope: ["abbasid_caliphate", "mamluk_sultanate"]`). If omitted or empty, the option is considered universal.

    **Example (adding a new Location)**:
    ```javascript
    // Inside PROMPT_OPTIONS_DATA.location array:
    {
      label: "Ancient Alexandria Library (Interior)",
      value: "alexandria_library_interior",
      eraScope: ["hellenistic_egypt"] // Assuming "hellenistic_egypt" is an existing era value
    }
    ```

### Adding a New 'Key Element'

1.  **Open `src/data/promptOptions.ts`**.
2.  **Navigate to the `keyElements` array** within the `PROMPT_OPTIONS_DATA` object.
3.  **Create a new object**: Add a new object to this array, conforming to the `OptionSet` structure.
    *   `label`: This is the short, user-friendly name that appears in the "Key Elements" multi-select dropdown (e.g., "Character: Wise Scholar").
    *   `value`: This is the **full, detailed textual description** that will be injected into the prompt's subject when this key element is selected (e.g., "A wise, elderly scholar with kind eyes and a long white beard, poring over ancient scrolls in a dimly lit study.").
    *   `eraScope`: An array of era `value`s for which this key element is relevant. This is crucial for ensuring users only see appropriate key elements for their chosen scene era.

    **Example (adding a new Key Element)**:
    ```javascript
    // Inside PROMPT_OPTIONS_DATA.keyElements array:
    {
      label: "Object: Astrolabe (Ornate Brass)",
      value: "An intricate, ornate brass astrolabe, covered in detailed celestial engravings, held by a scholar.",
      eraScope: ["abbasid_caliphate", "al_andalus"]
    }
    ```
    In this example, the `label` "Object: Astrolabe (Ornate Brass)" is what the user sees in the selection UI. If selected, the entire string in the `value` field is what gets added to the prompt.

After making changes to `promptOptions.ts`, ensure the application is reloaded (or the development server is restarted if applicable) for the changes to take effect.
Ensure that any new `value` for eras added to `eraScope` actually corresponds to an existing `value` in the `era` options list for the filtering to work correctly.

## 6. Project Structure

This section provides a high-level overview of the key directories and files to help navigate the codebase.

*   **`(root directory)`**:
    *   `index.html`: The main HTML entry point for the application. Contains CDN links, basic styles, and the import map for ES modules.
    *   `index.tsx`: The main React entry point that renders the `App` component into the DOM.
    *   `metadata.json`: Configuration for the specific environment where this app might be deployed (e.g., within an AI studio).
    *   `types.ts`: Contains all global TypeScript interface and type definitions for the application's data structures.
    *   `constants.ts`: Defines application-wide constants, such as form structures (Scene DNA, Shot specifics), default templates, and static content.
    *   `DOCUMENTATION.md`: This file.

*   **`components/`**: This directory houses all the React UI components.
    *   `App.tsx`: The root React component, handling routing, global modals, and overall layout.
    *   `Header.tsx`: The main application header.
    *   `Modal.tsx`: A generic modal component.
    *   `CustomOptionModal.tsx`: Modal for users to add custom options to dropdowns.
    *   `HomePage.tsx`, `SceneSettingsPage.tsx`, `StoryboardPage.tsx`: Components for the main views/pages of the application.
    *   `ShotCard.tsx`: Component to display individual shot details on the storyboard.
    *   `TemplateLibrary.tsx`: UI for managing and applying scene templates.
    *   **`components/icons/`**: Contains simple SVG icon components (e.g., `LucideIcons.tsx`).
    *   **`components/prompt-builder/`**: Contains components specifically used in the forms for building Scene DNA and Shot details.
        *   `FormFieldGroup.tsx`: Renders a group of form fields.
        *   `SelectInput.tsx`, `TagInput.tsx`, `MultiSelectInput.tsx`: Custom input components for different field types.
        *   `ImpactLab.tsx`: UI for selecting creative concept modifiers.
    *   **`components/admin/`**:
        *   `AdminOptionsPanel.tsx`: A panel for managing (viewing/adding) custom prompt options.

*   **`hooks/`**: Contains custom React hooks.
    *   `useDebounce.ts`: A hook for debouncing values.
    *   `useFilteredOptions.ts`: Hook to get dynamically filtered dropdown options based on context (like `eraScope`).

*   **`lib/`**: Contains utility functions and business logic not tied directly to React components.
    *   `promptUtils.ts`: Core logic for serializing Scene DNA and Shot data into the final textual prompt.
    *   `exportUtils.ts`: Utility functions for exporting data (e.g., to CSV).
    *   `shotUtils.ts`: Utilities related to shot data, like generating initial empty shot structures.

*   **`store/`**: Contains the global state management setup.
    *   `useAppStore.ts`: Defines the Zustand store, including state variables and actions for managing scenes, shots, templates, UI state, and custom options.

*   **`src/data/`**: Intended for static data sources.
    *   `promptOptions.ts`: The central file defining all predefined options for dropdowns and selectable elements, including their `eraScope` for dynamic filtering.

This structure aims to separate concerns: UI components, state management, utility functions, data definitions, and hooks are organized into their respective directories for better maintainability.
