import { types } from "mobx-state-tree";

/**
 * @todo rework this into MetaMixin for all the meta data
 * @todo it's used by too much files, so that's for later
 * Meta Information
 * Additional information for regions and their results, like text and lead_time
 * Only text is used here actually, lead_time is stored directly in results
 */
const NormalizationMixin = types
  .model({
    meta: types.frozen<{ text?: string[] }>({}),
    brand: types.optional(types.union(types.string, types.null), null),
    detectedColor: types.optional(
      types.frozen<Record<string, { value: string; color: string }>>(),
      {}
    ),
    category: types.optional(types.union(types.string, types.null), null),
    shoeModel: types.optional(types.union(types.string, types.null), null),
    bibId: types.optional(types.union(types.string, types.null), null),
    eventId: types.optional(types.union(types.string, types.null), null),
  })
  .actions((self) => ({
    /**
     * Set meta text
     * @param {*} text
     */
    setDetectedColor(key: string, value: string, color: string) {
      if (!self.detectedColor) {
        self.detectedColor = {};
      }
      self.detectedColor = {
        ...self.detectedColor,
        [key]: { value, color },
      };
    },
    setCategory(value: string) {
      self.category = value;
    },
    setBrand(value: string) {
      self.brand = value;
    },
    setShoeModel(value: string) {
      self.shoeModel = value;
    },
    setBibId(bibId: string) {
      self.bibId = bibId;
    },
    setEventId(eventId: string) {
      self.eventId = eventId;
    },

    setMetaText(text: string) {
      if (text) {
        self.meta = { ...self.meta, text: [text] };
      } else {
        const adjusted = { ...self.meta };

        delete adjusted.text;
        self.meta = adjusted;
      }
    },
  }))

  .actions((self) => ({
    /**
     * Delete meta text
     */
    deleteMetaText() {
      self.setMetaText("");
    },
  }));
export default NormalizationMixin;
