import type { CollectionConfig } from "payload";

export const Properties: CollectionConfig = {
  slug: "properties",
  labels: {
    singular: "Property",
    plural: "Properties",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "propertyType", "price", "city", "featured"],
    listSearchableFields: ["title", "address", "city", "zipCode", "propertyId"],
  },
  access: {
    read: () => true,
  },
  fields: [
    // ─── Basic Info ───────────────────────────────────────────────────────────
    {
      name: "title",
      label: "Property Title / Address",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        description: "URL-friendly identifier (auto-populated from WP slug on import)",
      },
    },
    {
      name: "description",
      label: "Description",
      type: "richText",
    },
    {
      name: "excerpt",
      label: "Short Description / Excerpt",
      type: "textarea",
    },

    // ─── Listing Details ─────────────────────────────────────────────────────
    {
      name: "status",
      label: "Listing Status",
      type: "select",
      required: true,
      defaultValue: "for-sale",
      options: [
        { label: "For Sale", value: "for-sale" },
        { label: "Sold", value: "sold" },
        { label: "In Escrow", value: "in-escrow" },
        { label: "For Lease", value: "for-lease" },
        { label: "Leased", value: "leased" },
        { label: "Pending", value: "pending" },
        { label: "On Hold", value: "on-hold" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Coming Soon", value: "coming-soon" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "propertyType",
      label: "Property Type",
      type: "select",
      options: [
        { label: "Single Family Home", value: "single-family-home" },
        { label: "Condo", value: "condo" },
        { label: "Townhouse", value: "townhouse" },
        { label: "Duplex", value: "duplex" },
        { label: "Fourplex", value: "fourplex" },
        { label: "Multi Unit", value: "multi-unit" },
        { label: "Apartment", value: "apartment" },
        { label: "Land", value: "land" },
        { label: "Co-Op", value: "co-op" },
      ],
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "featured",
      label: "Featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
        description: "Show this property prominently on the site",
      },
    },

    // ─── Pricing ─────────────────────────────────────────────────────────────
    {
      type: "row",
      fields: [
        {
          name: "price",
          label: "List Price ($)",
          type: "number",
          admin: { width: "50%" },
        },
        {
          name: "priceOld",
          label: "Original Price ($)",
          type: "number",
          admin: { width: "50%" },
        },
      ],
    },

    // ─── Property Specs ───────────────────────────────────────────────────────
    {
      type: "row",
      fields: [
        {
          name: "bedrooms",
          label: "Bedrooms",
          type: "number",
          admin: { width: "25%" },
        },
        {
          name: "bathrooms",
          label: "Bathrooms",
          type: "number",
          admin: { width: "25%" },
        },
        {
          name: "sqft",
          label: "Living Area (sqft)",
          type: "number",
          admin: { width: "25%" },
        },
        {
          name: "garage",
          label: "Garage",
          type: "number",
          admin: { width: "25%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "lotSize",
          label: "Lot Size",
          type: "text",
          admin: { width: "33%" },
        },
        {
          name: "yearBuilt",
          label: "Year Built",
          type: "number",
          admin: { width: "33%" },
        },
        {
          name: "propertyId",
          label: "MLS / Property ID",
          type: "text",
          admin: { width: "33%" },
        },
      ],
    },

    // ─── Location ────────────────────────────────────────────────────────────
    {
      name: "address",
      label: "Full Address",
      type: "text",
    },
    {
      type: "row",
      fields: [
        {
          name: "city",
          label: "City",
          type: "text",
          index: true,
          admin: { width: "33%" },
        },
        {
          name: "state",
          label: "State",
          type: "text",
          defaultValue: "CA",
          admin: { width: "17%" },
        },
        {
          name: "zipCode",
          label: "Zip Code",
          type: "text",
          index: true,
          admin: { width: "25%" },
        },
        {
          name: "county",
          label: "County",
          type: "text",
          admin: { width: "25%" },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "latitude",
          label: "Latitude",
          type: "number",
          admin: { width: "50%" },
        },
        {
          name: "longitude",
          label: "Longitude",
          type: "number",
          admin: { width: "50%" },
        },
      ],
    },

    // ─── Media ───────────────────────────────────────────────────────────────
    {
      name: "featuredImage",
      label: "Featured Image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "gallery",
      label: "Photo Gallery",
      type: "array",
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
        {
          name: "caption",
          type: "text",
        },
      ],
    },

    // ─── Features & Tags ─────────────────────────────────────────────────────
    {
      name: "features",
      label: "Property Features",
      type: "array",
      fields: [
        {
          name: "feature",
          type: "text",
          required: true,
        },
      ],
    },

    // ─── Meta ─────────────────────────────────────────────────────────────────
    {
      name: "dateAdded",
      label: "Date Added / Listed",
      type: "date",
      admin: {
        position: "sidebar",
        date: {
          pickerAppearance: "dayOnly",
          displayFormat: "MMMM d, yyyy",
        },
      },
    },
    {
      name: "wpId",
      label: "WordPress ID (import reference)",
      type: "number",
      index: true,
      admin: {
        position: "sidebar",
        description: "Original WP post ID — do not edit",
      },
    },
    {
      name: "wpImageUrls",
      label: "Original WP Image URLs",
      type: "array",
      admin: {
        description: "Cached for future re-import. Not used in frontend.",
        condition: () => false, // hidden in admin UI
      },
      fields: [
        {
          name: "url",
          type: "text",
        },
      ],
    },
  ],
  timestamps: true,
};
