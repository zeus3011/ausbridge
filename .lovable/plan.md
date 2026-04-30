# Change Font to Georgia for Section Headings

## Summary
Apply Georgia font family to specific section headings across the landing page while keeping the rest of the site in Poppins.

## Target Headings to Change

1. **Hero Section** - "Your Trusted Guide, Every Step to Australia"
2. **How We Work** - "An advisory-grade approach to migration"  
3. **Our Services** - "Visa pathways, expertly managed"
4. **Client Outcomes** - "Trusted by professionals and families"
5. **About** - "Migration advice, delivered with care and rigour"
6. **Insights** - "Updates, guides and analysis"
7. **CTA** - "Ready to Move Forward with Clarity?"

## Implementation

### Step 1: Add Georgia Font to CSS
Add a custom Georgia font utility class in `src/index.css` for clean reuse.

### Step 2: Apply Georgia Font to Headings
Update each target heading in `src/pages/Index.tsx` to use the Georgia font class.

## Files to Edit
- `src/index.css` - Add Georgia font utility
- `src/pages/Index.tsx` - Apply font class to 7 headings