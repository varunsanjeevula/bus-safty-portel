# 🎯 Theme System - Quick Implementation Guide

## How to Update Any Page to Use Unified Theme

### Step 1: Import the Theme Hook
```typescript
import { useTheme } from '@/contexts/ThemeContext';
```

### Step 2: Use the Hook in Your Component
```typescript
export default function MyPage() {
  const { isDarkMode, themeClasses } = useTheme();
  // rest of component
}
```

### Step 3: Apply Theme Classes

#### Background
```typescript
// Replace any hard-coded backgrounds with:
className={themeClasses.background}

// Old:
<div className="bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">

// New:
<div className={themeClasses.background}>
```

#### Cards
```typescript
// Replace with:
className={`${themeClasses.card} rounded-lg p-4 shadow-lg`}

// Old:
<div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-lg">

// New:
<div className={`${themeClasses.card} rounded-lg p-4 shadow-lg`}>
```

#### Text Colors
```typescript
// Use theme text classes:
className={themeClasses.text.primary}    // Main text
className={themeClasses.text.secondary}  // Secondary text
className={themeClasses.text.muted}      // Muted text

// Old:
<p className="text-gray-900">Text</p>

// New:
<p className={themeClasses.text.primary}>Text</p>
```

#### Headers
```typescript
// Old:
<header className="bg-gradient-to-r from-white via-indigo-50 to-white border-indigo-200">

// New:
<header className={themeClasses.header}>
```

#### Buttons
```typescript
// Old:
<button className="bg-gradient-to-r from-indigo-600 to-purple-600">

// New:
<button className={themeClasses.button.primary}>
```

#### Conditional Styling
```typescript
// For things not in themeClasses, use isDarkMode:
className={isDarkMode ? 'bg-slate-700' : 'bg-gray-100'}

// Or create a style object:
const style = isDarkMode 
  ? 'text-yellow-400 hover:bg-slate-700'
  : 'text-indigo-600 hover:bg-indigo-100'
```

---

## 📝 Replacement Patterns

### Pattern 1: Full Page Background
```typescript
// OLD
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50">
    {/* content */}
  </div>
);

// NEW
return (
  <div className={`min-h-screen ${themeClasses.background}`}>
    {/* content */}
  </div>
);
```

### Pattern 2: Card Container
```typescript
// OLD
<div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-lg">
  <p className="text-gray-900">Card content</p>
</div>

// NEW
<div className={`${themeClasses.card} rounded-xl p-6 shadow-lg`}>
  <p className={themeClasses.text.primary}>Card content</p>
</div>
```

### Pattern 3: Header/Navigation
```typescript
// OLD
<header className="bg-gradient-to-r from-white via-indigo-50 to-white border-indigo-200">
  <h1 className="text-slate-900">Title</h1>
</header>

// NEW
<header className={themeClasses.header}>
  <h1 className={themeClasses.text.primary}>Title</h1>
</header>
```

### Pattern 4: Button Styling
```typescript
// OLD
<button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
  Click me
</button>

// NEW
<button className={`${themeClasses.button.primary} text-white`}>
  Click me
</button>
```

### Pattern 5: Form Elements
```typescript
// OLD
<input 
  className="bg-white border-2 border-indigo-200 text-gray-900 focus:border-purple-500"
/>

// NEW
<input 
  className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-indigo-200 text-gray-900'} border-2 focus:border-purple-500`}
/>
```

---

## 🎨 Available Theme Classes

```typescript
themeClasses.background      // Full page background gradient
themeClasses.header          // Header/navigation styling
themeClasses.card            // Card component styling
themeClasses.text.primary    // Main text color
themeClasses.text.secondary  // Secondary text color
themeClasses.text.muted      // Muted/disabled text
themeClasses.button.primary  // Primary button gradient
themeClasses.button.secondary // Secondary button
themeClasses.gradient.primary // Primary gradient (Indigo→Purple→Pink)
themeClasses.gradient.secondary // Secondary gradient
themeClasses.gradient.accent  // Accent gradient
themeClasses.divider         // Border colors
themeClasses.shadow          // Shadow depth
```

---

## 📋 Pages to Update

### Priority 1 (High Impact)
1. **ReportIncident.tsx** - Currently has red theme, needs unified
2. **BusDetails.tsx** - Likely has mixed colors
3. **LiveTracking.tsx** - Should match main theme

### Priority 2 (Medium Impact)
4. **ProfessionalHome.tsx** - Professional pages need consistency
5. **ProfessionalSearch.tsx**
6. **ProfessionalProfile.tsx**

### Priority 3 (Lower Impact)
7. **Scanner.tsx** - QR scanner page
8. **Index.tsx** - Index/listing page
9. **Privacy.tsx** - Static page

---

## ✅ Verification Checklist

After updating a page:

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] Text is readable in both modes
- [ ] Buttons are visible and clickable
- [ ] Cards are properly styled
- [ ] No hard-coded colors remain
- [ ] Theme toggle switches colors instantly
- [ ] No console errors or warnings
- [ ] Responsive design maintained
- [ ] Accessibility maintained

---

## 🚀 Quick Start Template

```typescript
import { useTheme } from '@/contexts/ThemeContext';

export default function NewPage() {
  const { isDarkMode, themeClasses } = useTheme();

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <header className={themeClasses.header}>
        <h1 className={themeClasses.text.primary}>Page Title</h1>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4">
        {/* Card Example */}
        <div className={`${themeClasses.card} rounded-lg p-6 shadow-lg`}>
          <h2 className={themeClasses.text.primary}>Section</h2>
          <p className={themeClasses.text.secondary}>Description</p>
        </div>

        {/* Button Example */}
        <button className={`${themeClasses.button.primary} text-white px-6 py-2 rounded-lg`}>
          Action
        </button>
      </main>
    </div>
  );
}
```

---

## 💡 Tips

1. **Copy-Paste Safe**: You can directly replace background/card classNames
2. **Search & Replace**: Use your editor's find/replace to update text colors
3. **Test Frequently**: Switch theme while developing to catch issues early
4. **Keep It Simple**: Don't override theme classes unless necessary
5. **Ask for Help**: Check existing implementations (Home.tsx, Login.tsx)

---

## 🎓 Learn More

- Full documentation: `UNIFIED_THEME_SYSTEM.md`
- Theme config: `src/lib/themeConfig.ts`
- Context code: `src/contexts/ThemeContext.tsx`
- Example implementation: `src/pages/Home.tsx`

---

**All pages can now be easily updated to maintain perfect theme consistency!** ✨
