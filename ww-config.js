export default {
  editor: { label: { en: "Estimate Details" } },
  triggerEvents: [
    { name: "projectClick", label: { en: "On project name click" }, event: { value: "", recordId: "" } },
    { name: "addressClick", label: { en: "On address click" }, event: { address: "", recordId: "" } },
    { name: "fieldEdit", label: { en: "On field saved (inline edit)" }, event: { index: 0, label: "", key: "", value: "", type: "", patch: {}, recordId: "", field: {} } },
    { name: "durationEdit", label: { en: "On estimated duration saved" }, event: { index: 0, label: "", key: "", value: "", type: "", patch: {}, recordId: "", field: {} } },
  ],
  properties: {
    // ---- data ----
    // Bind the estimate record. Accepts a single object OR an array (first
    // record is used): collections['97714a5c-c126-49c5-b973-4433ffeeae68']?.['data']
    estimate: {
      label: { en: "Estimate (bind record or list)" }, type: "Array", bindable: true,
      defaultValue: [
        {
          Name: "EST#10 - 1",
          Status: "Declined",
          "Creation Date": "2025-04-11T12:42:43.000Z",
          "Estimated Cost": 376,
          "Estimate Approval Date": "",
          "Estimate Age": 452,
          "Customer Email": "",
          customer_name: ["Jerry Todd"],
          address: ["3999 Matty Drive Northeast, Marietta, GA 30066, USA"],
          customer_phone: ["(770) 634-4215"],
          project_uid: ["Project#11 - 3999 Matty Drive Northeast"],
          estimated_duration: "",
          shared_photo_link: "",
          scope_from_project: ["Grout Quote"],
          project_notes: [],
          external_id: [],
          id: "reckOfMz1yq9flz8o",
        },
      ],
    },
    idKey: { label: { en: "Field: record id" }, type: "Text", defaultValue: "id", bindable: true, section: "settings" },

    // ---- customer card ----
    showCustomer: { label: { en: "Show customer card" }, type: "OnOff", defaultValue: true, bindable: true },
    customerTitle: { label: { en: "Customer card title" }, type: "Text", defaultValue: "Customer Information", bindable: true },
    nameKey: { label: { en: "Field: customer name" }, type: "Text", defaultValue: "customer_name", bindable: true, section: "settings" },
    emailKey: { label: { en: "Field: customer email" }, type: "Text", defaultValue: "Customer Email", bindable: true, section: "settings" },
    phoneKey: { label: { en: "Field: customer phone" }, type: "Text", defaultValue: "customer_phone", bindable: true, section: "settings" },

    // ---- address card ----
    showAddress: { label: { en: "Show address card" }, type: "OnOff", defaultValue: true, bindable: true },
    addressTitle: { label: { en: "Address card title" }, type: "Text", defaultValue: "Property Address", bindable: true },
    addressKey: { label: { en: "Field: address" }, type: "Text", defaultValue: "address", bindable: true, section: "settings" },
    addressClickable: { label: { en: "Address clickable" }, type: "OnOff", defaultValue: true, bindable: true },

    // ---- summary card ----
    showSummary: { label: { en: "Show summary card" }, type: "OnOff", defaultValue: true, bindable: true },
    summaryTitle: { label: { en: "Summary card title" }, type: "Text", defaultValue: "Estimate Summary", bindable: true },
    allowInlineEdit: { label: { en: "Allow inline field editing" }, type: "OnOff", defaultValue: true, bindable: true },
    // Each entry: { label, key, type: "text"|"multiline"|"date"|"url"|"link",
    //   editable: true|false, patchKey (column written by event.patch, defaults
    //   to key), span: "full" (multiline defaults to full width),
    //   editEvent: "<trigger name>" — routes this field's save to its OWN
    //   workflow instead of the shared "fieldEdit" (e.g. Estimated Duration). }
    summaryFields: {
      label: { en: "Summary fields" }, type: "Array", bindable: true, section: "settings",
      defaultValue: [
        { label: "Estimate ID", key: "Name" },
        { label: "Project Name", key: "project_uid", type: "link" },
        { label: "Creation Date", key: "Creation Date", type: "date" },
        { label: "Estimate Age", key: "Estimate Age" },
        { label: "Estimated Duration", key: "estimated_duration", editable: true, editEvent: "durationEdit" },
        { label: "Approval Date", key: "Estimate Approval Date", type: "date" },
        { label: "Shared Photo Link", key: "shared_photo_link", type: "url" },
        { label: "WO#", key: "external_id", editable: true },
        { label: "Scope", key: "scope_from_project", type: "multiline", editable: true },
        { label: "Project Notes", key: "project_notes", type: "multiline", editable: true },
      ],
    },
    emptyText: { label: { en: "Empty value text" }, type: "Text", defaultValue: "—", bindable: true },

    // ---- theme (standard across pp- components) ----
    primaryColor: { label: { en: "Primary color" }, type: "Color", defaultValue: "#10b981", bindable: true },
    accentColor: { label: { en: "Accent color" }, type: "Color", defaultValue: "#6366f1", bindable: true },
    darkMode: {
      label: { en: "Theme mode" }, type: "TextSelect",
      options: { options: [
        { value: "auto", label: { en: "Auto (system)" } },
        { value: "light", label: { en: "Light" } },
        { value: "dark", label: { en: "Dark" } },
      ] }, defaultValue: "auto", bindable: true,
    },
    radius: { label: { en: "Corner radius (px)" }, type: "Number", options: { min: 0, max: 32, step: 1 }, defaultValue: 16, bindable: true },
    sectionGap: { label: { en: "Section spacing (px)" }, type: "Number", options: { min: 0, max: 80, step: 2 }, defaultValue: 32, bindable: true },
  },
};
