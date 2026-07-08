<template>
  <div class="pp-root" :class="themeClass" :style="rootStyle">
   <div class="pp-stack">
    <!-- customer -->
    <div v-if="content.showCustomer !== false" class="pp-card">
      <h2 class="pp-card__heading">
        <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('user')"></path></svg>
        {{ content.customerTitle || 'Customer Information' }}
      </h2>
      <div class="pp-cols">
        <div class="pp-kv">
          <span class="pp-kv__label">Name</span>
          <span class="pp-kv__value" :class="{ 'pp-muted': !val(content.nameKey) }">{{ val(content.nameKey) || empty }}</span>
        </div>
        <div class="pp-kv">
          <span class="pp-kv__label">Email</span>
          <a v-if="val(content.emailKey)" class="pp-kv__value pp-kv__link" :href="`mailto:${val(content.emailKey)}`">{{ val(content.emailKey) }}</a>
          <span v-else class="pp-kv__value pp-muted">{{ empty }}</span>
        </div>
        <div class="pp-kv">
          <span class="pp-kv__label">Phone</span>
          <a v-if="val(content.phoneKey)" class="pp-kv__value pp-kv__link" :href="`tel:${val(content.phoneKey)}`">{{ val(content.phoneKey) }}</a>
          <span v-else class="pp-kv__value pp-muted">{{ empty }}</span>
        </div>
      </div>
    </div>

    <!-- address -->
    <div v-if="content.showAddress !== false" class="pp-card">
      <h2 class="pp-card__heading">
        <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('map-pin')"></path></svg>
        {{ content.addressTitle || 'Property Address' }}
      </h2>
      <a v-if="content.addressClickable !== false && val(content.addressKey)" class="pp-address pp-kv__link" href="#" @click.prevent="emitAddress">
        {{ val(content.addressKey) }}
        <svg class="pp-kv__linkico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('external')"></path></svg>
      </a>
      <span v-else class="pp-address" :class="{ 'pp-muted': !val(content.addressKey) }">{{ val(content.addressKey) || empty }}</span>
    </div>

    <!-- summary -->
    <div v-if="content.showSummary !== false" class="pp-card">
      <h2 class="pp-card__heading">
        <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('file')"></path></svg>
        {{ content.summaryTitle || 'Estimate Summary' }}
      </h2>
      <div class="pp-cols pp-cols--summary">
        <div v-for="(f, i) in summaryFields" :key="i" class="pp-kv" :class="{ 'pp-kv--full': isFull(f), 'pp-kv--editing': editingIndex === i }">
          <span class="pp-kv__label">{{ f.label }}</span>
          <div class="pp-kv__body">
            <!-- edit mode -->
            <template v-if="editingIndex === i">
              <textarea
                v-if="fType(f) === 'multiline'"
                class="pp-editinput pp-editinput--area" v-model="editValue" ref="editor" rows="2"
                @input="autoGrow" @keydown.esc="cancelEdit"
              ></textarea>
              <input
                v-else class="pp-editinput" :type="fType(f) === 'url' ? 'url' : 'text'"
                v-model="editValue" ref="editor" :placeholder="f.label"
                @keydown.enter="saveEdit(i, f)" @keydown.esc="cancelEdit"
              />
              <div class="pp-editactions">
                <button type="button" class="pp-iconbtn pp-iconbtn--save" @click="saveEdit(i, f)" title="Save">
                  <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('check')"></path></svg>
                </button>
                <button type="button" class="pp-iconbtn" @click="cancelEdit" title="Cancel">
                  <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('x')"></path></svg>
                </button>
              </div>
            </template>
            <!-- read mode -->
            <template v-else>
              <button v-if="fType(f) === 'link' && display(f)" type="button" class="pp-kv__value pp-kv__link pp-linkbtn" @click="emitProject(f)">
                {{ display(f) }}
              </button>
              <a v-else-if="fType(f) === 'url' && display(f)" class="pp-kv__value pp-kv__link" :href="display(f)" target="_blank" rel="noopener noreferrer">
                <span>{{ display(f) }}</span>
                <svg class="pp-kv__linkico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('external')"></path></svg>
              </a>
              <span v-else class="pp-kv__value pp-kv__value--rich" :class="{ 'pp-muted': !display(f) }">{{ display(f) || empty }}</span>
              <button v-if="isEditable(f)" type="button" class="pp-kv__edit" @click="startEdit(i, f)" title="Edit">
                <svg class="pp-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path :d="ic('pencil')"></path></svg>
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
   </div>
  </div>
</template>

<script>
const ICONS = {
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  "map-pin": "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6",
  external: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3",
  pencil: "M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z",
  check: "M20 6L9 17l-5-5",
  x: "M18 6L6 18M6 6l12 12",
};

export default {
  props: { content: { type: Object, required: true }, uid: { type: String, required: false } },
  emits: ["trigger-event"],
  data() {
    // overrides holds optimistically-saved edits (keyed by field key) so the
    // UI reflects a save immediately; cleared when the bound record changes.
    return { editingIndex: null, editValue: "", overrides: {} };
  },
  watch: {
    "content.estimate"() { this.overrides = {}; this.editingIndex = null; },
  },
  computed: {
    record() {
      let e = this.content.estimate;
      if (e && !Array.isArray(e) && Array.isArray(e.data)) e = e.data;
      if (Array.isArray(e)) e = e[0];
      return e && typeof e === "object" ? e : {};
    },
    recordId() { return this.unwrap(this.record[this.content.idKey || "id"]) || ""; },
    summaryFields() {
      const list = Array.isArray(this.content.summaryFields) ? this.content.summaryFields : [];
      return list.filter((f) => f && typeof f === "object" && (f.label || f.key));
    },
    empty() { return this.content.emptyText != null ? this.content.emptyText : "—"; },
    themeClass() {
      const m = this.content.darkMode || "auto";
      return { "pp-auto": m === "auto", "pp-dark": m === "dark", "pp-light": m === "light" };
    },
    rootStyle() {
      return {
        "--pp-primary": this.content.primaryColor || "#10b981",
        "--pp-accent": this.content.accentColor || "#6366f1",
        "--pp-radius": (this.content.radius != null ? this.content.radius : 16) + "px",
        "--pp-gap": (this.content.sectionGap != null ? this.content.sectionGap : 32) + "px",
      };
    },
  },
  methods: {
    ic(name) { return ICONS[name] || ""; },
    // Airtable lookups arrive as arrays — reduce to a display scalar.
    unwrap(v) {
      if (Array.isArray(v)) {
        const list = v.filter((x) => x != null && x !== "");
        return list.length ? (list.length === 1 ? list[0] : list.join(", ")) : "";
      }
      return v == null ? "" : v;
    },
    val(key) { return String(this.unwrap(this.record[key]) || ""); },
    rawValue(f) {
      if (f.key in this.overrides) return this.overrides[f.key];
      return this.unwrap(this.record[f.key]);
    },
    fType(f) { return f.type || "text"; },
    isFull(f) { return f.span === "full" || this.fType(f) === "multiline"; },
    isEditable(f) { return this.content.allowInlineEdit !== false && f.editable === true; },
    display(f) {
      const v = this.rawValue(f);
      if (v == null || v === "") return "";
      if (this.fType(f) === "date") return this.formatDate(v);
      if (this.fType(f) === "multiline") return this.richText(v);
      return String(v);
    },
    formatDate(v) {
      const d = new Date(v);
      if (isNaN(d.getTime())) return String(v);
      return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    },
    emitAddress() {
      this.$emit("trigger-event", { name: "addressClick", event: { address: this.val(this.content.addressKey), recordId: this.recordId } });
    },
    emitProject(f) {
      this.$emit("trigger-event", { name: "projectClick", event: { value: this.rawValue(f), recordId: this.recordId } });
    },
    // ---- inline editing (same UX as pp-details) ----
    autoGrow(e) {
      const el = e && e.target ? e.target : e;
      if (!el) return;
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 320) + "px";
    },
    startEdit(i, f) {
      if (!this.isEditable(f)) return;
      this.editingIndex = i;
      const v = this.rawValue(f);
      this.editValue = this.fType(f) === "multiline" ? this.richText(v) : (v == null ? "" : String(v));
      this.$nextTick(() => {
        const el = this.$refs.editor;
        const node = Array.isArray(el) ? el[0] : el;
        if (node) {
          node.focus();
          if (node.tagName === "TEXTAREA") { node.style.height = "auto"; node.style.height = Math.min(node.scrollHeight, 320) + "px"; }
          else if (node.select) node.select();
        }
      });
    },
    cancelEdit() { this.editingIndex = null; },
    saveEdit(i, f) {
      const value = this.editValue;
      this.overrides = Object.assign({}, this.overrides, { [f.key]: value });
      this.editingIndex = null;
      const key = f.patchKey || f.key;
      // Ready-to-save object keyed by the column name: bind Fields -> event.patch.
      const patch = { [key]: value };
      // A field can route to its own workflow via `editEvent` (e.g. Estimated
      // Duration -> "durationEdit"); otherwise it uses the shared "fieldEdit".
      const eventName = f.editEvent || "fieldEdit";
      this.$emit("trigger-event", {
        name: eventName,
        event: { index: i, label: f.label, key, value, type: this.fType(f), patch, recordId: this.recordId, field: Object.assign({}, f, { value }) },
      });
    },
    decodeEntities(s) {
      return String(s)
        .replace(/&nbsp;/gi, " ")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">")
        .replace(/&quot;/gi, '"')
        .replace(/&#0?39;/g, "'")
        .replace(/&apos;/gi, "'")
        .replace(/&amp;/gi, "&");
    },
    richText(v) {
      if (v == null || v === "") return "";
      if (typeof v !== "string") return String(v);
      let s = v;
      s = s.replace(/<\s*br\s*\/?>/gi, "\n");
      s = s.replace(/<\/p\s*>\s*<p[^>]*>/gi, "\n\n");
      s = s.replace(/<\/(p|div|li)\s*>/gi, "\n");
      s = s.replace(/<[^>]+>/g, "");
      s = s.replace(/\s*\\+\s*/g, "\n");
      s = this.decodeEntities(s);
      s = s.replace(/[ \t]+\n/g, "\n").replace(/\n[ \t]+/g, "\n");
      s = s.replace(/\n{3,}/g, "\n\n");
      return s.trim();
    },
  },
};
</script>

<style lang="scss" scoped>
.pp-root {
  --surface: #ffffff; --surface-2: #f7f9fc; --surface-3: #eef2f7; --border: #e4e9f0; --border-strong: #d4dbe6;
  --text: #1f2a37; --text-muted: #64748b; --text-subtle: #94a3b8;
  --shadow: 0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06);
  --shadow-sm: 0 1px 2px rgba(16, 24, 40, 0.06);
  --success: #10b981; --warning: #f59e0b; --danger: #ef4444; --info: #3b82f6;
  --primary: var(--pp-primary, #10b981); --accent: var(--pp-accent, #6366f1); --radius: var(--pp-radius, 16px);
  box-sizing: border-box; width: 100%; max-width: 100%; container-type: inline-size; color: var(--text);
  font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.45;
}
.pp-root *, .pp-root *::before, .pp-root *::after { box-sizing: border-box; }
/* Layout lives on an inner wrapper: WeWeb applies its own Display/layout
   settings to the component's root element, which would override a flex
   layout set directly on .pp-root (and kill the gap). */
.pp-stack { display: flex; flex-direction: column; gap: var(--pp-gap, 32px); width: 100%; }
@mixin dark {
  --surface: #161f30; --surface-2: #1b2638; --surface-3: #202c40; --border: #28344a; --border-strong: #34425c;
  --text: #e8eef7; --text-muted: #94a3b8; --text-subtle: #64748b;
  --shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 12px 28px rgba(0, 0, 0, 0.35);
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
}
.pp-root.pp-dark { @include dark; }
@media (prefers-color-scheme: dark) { .pp-root.pp-auto { @include dark; } }

/* cards */
.pp-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); padding: clamp(16px, 2.4vw, 24px); min-width: 0; }
.pp-card__heading { margin: 0 0 14px; font-size: 15px; font-weight: 700; color: var(--text); display: flex; align-items: center; gap: 8px; }
.pp-card__heading .pp-svg { width: 18px; height: 18px; color: var(--primary); }

.pp-address { display: inline-flex; align-items: center; gap: 6px; color: var(--text); font-weight: 500; word-break: break-word; }

/* key/value grid */
.pp-cols { display: grid; grid-template-columns: 1fr; gap: 20px 28px; }
.pp-kv { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
.pp-kv--full { grid-column: 1 / -1; }
.pp-kv__label { font-weight: 600; color: var(--text-muted); font-size: 13px; }
.pp-kv__body { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
.pp-kv--editing .pp-kv__body { flex-direction: column; align-items: stretch; gap: 8px; }
.pp-kv__value { color: var(--text); flex: 1 1 auto; min-width: 0; font-weight: 500; }
.pp-kv__value--rich { white-space: pre-line; word-break: break-word; line-height: 1.55; }
.pp-kv__link { color: var(--info); font-weight: 600; text-decoration: none; word-break: break-word; cursor: pointer; }
.pp-kv__link:hover { text-decoration: underline; }
.pp-kv__linkico { display: inline-block; width: 13px; height: 13px; vertical-align: -1px; margin-left: 4px; flex: none; }
.pp-linkbtn { border: none; background: none; padding: 0; font: inherit; font-weight: 600; text-align: left; }

.pp-kv__edit { flex: none; display: inline-grid; place-items: center; width: 26px; height: 26px; border-radius: 7px; border: none; background: none; color: var(--text-subtle); cursor: pointer; opacity: .45; transition: opacity .15s, background .15s, color .15s; }
.pp-kv:hover .pp-kv__edit { opacity: 1; }
.pp-kv__edit:hover { background: var(--surface-2); color: var(--primary); }
.pp-kv__edit .pp-svg { width: 15px; height: 15px; }

.pp-editinput { width: 100%; padding: 9px 11px; border-radius: 9px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text); font-size: 13.5px; font-family: inherit; outline: none; transition: border-color .15s, box-shadow .15s; }
.pp-editinput:focus { border-color: var(--primary); box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 18%, transparent); }
.pp-editinput--area { resize: none; overflow-y: auto; min-height: 40px; max-height: 320px; line-height: 1.5; white-space: pre-wrap; }
.pp-editactions { display: flex; gap: 6px; justify-content: flex-end; }
.pp-iconbtn { display: inline-grid; place-items: center; width: 32px; height: 32px; border-radius: 8px; border: 1px solid var(--border-strong); background: var(--surface); color: var(--text-muted); cursor: pointer; transition: background .15s, filter .15s; }
.pp-iconbtn:hover { background: var(--surface-2); }
.pp-iconbtn .pp-svg { width: 16px; height: 16px; }
.pp-iconbtn--save { color: #fff; background: var(--primary); border-color: var(--primary); }
.pp-iconbtn--save:hover { background: var(--primary); filter: brightness(1.06); }

.pp-muted { color: var(--text-muted); font-weight: 400; }
.pp-svg { display: block; }

/* responsive: 1 col mobile, 2 mid, 3 wide — to the element's own width */
@container (min-width: 560px) {
  .pp-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@container (min-width: 860px) {
  .pp-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@supports not (container-type: inline-size) {
  @media (min-width: 560px) { .pp-cols { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  @media (min-width: 860px) { .pp-cols { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
}
</style>
