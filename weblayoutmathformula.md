# Web Layout Mathematical Formulas

## Golden Ratio Applications

### 1. Sidebar-to-Content Ratio
```
Sidebar Width : Content Width = 16rem : flex-1
```
- **Current:** 256px : flex (dynamic)
- **Fixed Nav:** 16rem (64px × 4) for readability

### 2. Header Height Formula
```
Header Height = Base × 6
```
Where Base = 4px (0.25rem)
- **Header:** 24px (6rem) for prominence
- **With padding:** Total height ~88px

## Spacing System Formula

### 3. Consistent Spacing Progression
```
Spacing(n) = Base × 2^n
```
Where Base = 6px (1.5rem)
- **Level 1:** 6px (p-6) - section padding
- **Level 2:** 8px (p-8) - content padding
- **Level 3:** 16px (w-16) - logo size
- **Level 4:** 24px (p-6) - navigation padding
- **Level 5:** 32px - large gaps

## Layout Proportions

### 4. Three-Zone Layout Ratio
```
Navigation : Content = 16rem : flex-1
```
Flex-based layout for dynamic content scaling

### 5. Vertical Space Distribution
```
Content Distribution = flex-col with gap-4
```
- **Nav Title:** text-2xl (24px)
- **Nav Links:** text-lg (18px)
- **Content:** flex-1 (dynamic)

## Button Styling Formula

### 6. Interactive Element Dimensions
```
Text Size = Base × 1.125 (text-lg)
Padding = horizontal(1.5rem) vertical(0.5rem)
Border Radius = 0.25rem
```

### 7. Visual Feedback
```
Hover State = {
    Background: opacity + 10%
    Border: accent color
    Color: accent color
    Transition: 150ms ease
}
```

## Color System

### 8. Theme Colors
```
Primary Accents:
- Accent: #3794ff
- Header: #0e639c
- Nav: #252526
- Content: #333333
```

### 9. Interactive States
```
Hover Effects:
- Background: white opacity 10%
- Border: accent color
- Text: accent color
```

## Key Insights

1. **Fixed Navigation** (16rem) provides stable visual anchor
2. **Whitespace Hierarchy** (p-6, p-8) creates visual breathing room
3. **Interactive Feedback** through borders, colors, and transitions
4. **Consistent Text Scale** (text-2xl, text-lg) establishes hierarchy
5. **Accent Color Usage** for interactive elements and emphasis

These formulas prioritize user interaction, readability, and visual hierarchy while maintaining a modern development workflow.