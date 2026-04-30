import { iconNames } from "@/lib/icons";

export type FieldType = "text" | "textarea" | "image" | "select" | "boolean";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  placeholder?: string;
}

export interface ListField {
  key: string;
  label: string;
  itemLabel: string; // e.g. "Slide", "Card"
  fields: Field[];
  /** Field key used to title each list row in the UI. */
  titleKey?: string;
}

export interface SectionSchema {
  key: string;
  label: string;
  description?: string;
  fields: Field[];
  lists?: ListField[];
}

const ICON_OPTIONS = iconNames;

export const sectionSchemas: SectionSchema[] = [
  {
    key: "site",
    label: "Site Settings",
    description: "Logo, tagline, header phone and CTA shown across the site.",
    fields: [
      { key: "logo_url", label: "Logo image", type: "image" },
      { key: "tagline", label: "Tagline", type: "text" },
      { key: "phone_label", label: "Phone (display)", type: "text" },
      { key: "phone_href", label: "Phone link (e.g. tel:...)", type: "text" },
      { key: "cta_label", label: "Header CTA label", type: "text" },
    ],
  },
  {
    key: "header",
    label: "Header Navigation",
    fields: [],
    lists: [
      {
        key: "links",
        label: "Menu links",
        itemLabel: "Link",
        titleKey: "label",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Href (e.g. #about)", type: "text" },
        ],
      },
    ],
  },
  {
    key: "hero",
    label: "Hero Slider",
    fields: [
      { key: "primary_cta", label: "Primary button", type: "text" },
      { key: "secondary_cta", label: "Secondary button", type: "text" },
    ],
    lists: [
      {
        key: "slides",
        label: "Slides",
        itemLabel: "Slide",
        titleKey: "title_line_1",
        fields: [
          { key: "image", label: "Background image", type: "image" },
          { key: "eyebrow", label: "Eyebrow", type: "text" },
          { key: "title_line_1", label: "Title line 1", type: "text" },
          { key: "title_line_2", label: "Title line 2", type: "text" },
          { key: "sub", label: "Subtext", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "trust",
    label: "Trust Strip",
    fields: [],
    lists: [
      {
        key: "items",
        label: "Trust badges",
        itemLabel: "Badge",
        titleKey: "title",
        fields: [
          { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
          { key: "title", label: "Title", type: "text" },
          { key: "sub", label: "Subtitle", type: "text" },
        ],
      },
    ],
  },
  {
    key: "principles",
    label: "How We Work",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "intro", label: "Intro paragraph", type: "textarea" },
    ],
    lists: [
      {
        key: "items",
        label: "Principles",
        itemLabel: "Principle",
        titleKey: "title",
        fields: [
          { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS },
          { key: "title", label: "Title", type: "text" },
          { key: "text", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "services",
    label: "Services",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "intro", label: "Intro paragraph", type: "textarea" },
    ],
    lists: [
      {
        key: "items",
        label: "Service cards",
        itemLabel: "Service",
        titleKey: "title",
        fields: [
          { key: "img", label: "Image", type: "image" },
          { key: "title", label: "Title", type: "text" },
          { key: "badge", label: "Badge text", type: "text" },
          { key: "items", label: "Bullet points (one per line)", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "outcomes",
    label: "Client Outcomes",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
    ],
    lists: [
      {
        key: "items",
        label: "Testimonials",
        itemLabel: "Testimonial",
        titleKey: "name",
        fields: [
          { key: "quote", label: "Quote", type: "textarea" },
          { key: "name", label: "Author name", type: "text" },
          { key: "sub", label: "Author subtitle", type: "text" },
        ],
      },
    ],
  },
  {
    key: "about",
    label: "About Section",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "paragraph_1", label: "Paragraph 1", type: "textarea" },
      { key: "paragraph_2", label: "Paragraph 2", type: "textarea" },
      { key: "button_label", label: "Button label", type: "text" },
      { key: "image", label: "Image", type: "image" },
    ],
  },
  {
    key: "pricing",
    label: "Pricing & Plans",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading", label: "Heading", type: "text" },
      { key: "intro", label: "Intro paragraph", type: "textarea" },
    ],
    lists: [
      {
        key: "plans",
        label: "Plans",
        itemLabel: "Plan",
        titleKey: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "price", label: "Price", type: "text" },
          { key: "period", label: "Period", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "features", label: "Features (one per line)", type: "textarea" },
          { key: "buttonText", label: "Button label", type: "text" },
          {
            key: "variant",
            label: "Button style",
            type: "select",
            options: ["hero", "outlinePrimary"],
          },
        ],
      },
    ],
  },
  {
    key: "cta",
    label: "Call-to-Action Band",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "heading_line_1", label: "Heading line 1", type: "text" },
      { key: "heading_line_2", label: "Heading line 2", type: "text" },
      { key: "sub", label: "Subtext", type: "textarea" },
      { key: "button_label", label: "Button label", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    fields: [
      { key: "blurb", label: "Brand blurb", type: "textarea" },
      { key: "contact.phone", label: "Phone", type: "text" },
      { key: "contact.email", label: "Email", type: "text" },
      { key: "contact.address_line_1", label: "Address line 1", type: "text" },
      { key: "contact.address_line_2", label: "Address line 2", type: "text" },
      { key: "social.linkedin", label: "LinkedIn URL", type: "text" },
      { key: "social.facebook", label: "Facebook URL", type: "text" },
      { key: "social.instagram", label: "Instagram URL", type: "text" },
      { key: "copyright", label: "Copyright line", type: "text" },
      { key: "registration_note", label: "Registration note", type: "text" },
      { key: "compliance", label: "Compliance lines (one per line)", type: "textarea" },
    ],
    lists: [
      {
        key: "quick_links",
        label: "Quick links",
        itemLabel: "Link",
        titleKey: "label",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Href", type: "text" },
        ],
      },
    ],
  },
];

export function getSectionSchema(key: string): SectionSchema | undefined {
  return sectionSchemas.find((s) => s.key === key);
}