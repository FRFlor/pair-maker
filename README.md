# TechTalk!

<details>
    <summary>What is Bonello Rodello?</summary>

- Kudos to Justin
- Let's try this again!

</details>

<details>
<summary>Composition API</summary>

- Similar to React Hooks

- Makes isolating logic and reusing it in multiple components easier and safer than mixins

- Tests for composables are just regular javascript tests

</details>

<details>
<summary>A discussion on TDD</summary>

- Tests that aren't great can still be useful. See RNG.spec.ts
- Another note to Composables being great to work with
- Using components libraries add some headaches to writing feature vue tests

</details>

<details>
    <summary>PrimeVue?</summary>

- Loads of free themes available
- Easy to load only the parts that you need
- More fine-tuned customization of the components often can't be done with tailwind classes alone.

</details>

<details>
  <summary>Installing Tailwind can be made simple using Vue UI.</summary>

## Installing Tailwind can be made simple using Vue UI.

To setup breakpoints that follow in accordance to the Tailwind sizes, there is a helpful @screen directive, that among
other things allow you to use the Tailwind Breakpoints as values.

```
  
@screen md {
  section {
    grid-template-areas:
        "input input input"
        "errors errors errors"
        "names pairs history"
        "names pairs history"
        "names pairs history"
  }
}
``` 

</details>


<details>
  <summary>Justify Evenly</summary>

## Justify Evenly

CSS Flexbox has a way to justify content called "space-evenly".

```html
 <Fieldset :legend="person" :toggleable="true">
            <div class="flex items-center justify-evenly max-w-xl flex-wrap gap-2">
              <span v-for="pair in previousPairs" :key="`${person}-${pair}`" class="chip">
                {{ pair }}
              </span>
            </div>
  </Fieldset>
```

</details>


<details>
  <summary>A downside of using Component Libraries</summary>

## A downside of using Component Libraries

Interacting with a "Select dropdown"

Before (using native DOM elements)

```typescript
await wrapper.find("select[name=right-hand-side]").setValue("Alice");
```

After (using PrimeVue Dropdown component)

```typescript
async function selectNameInDropdown(wrapper: VueWrapper, name: string) {
    wrapper.findComponent(Dropdown).vm.$emit("update:modelValue", name);
    await wrapper.vm.$nextTick();
}
```

## Checking options available

Before (using native DOM elements)

```typescript
const allSelectOptions = wrapper.findAll('option')
```

After (using PrimeVue Dropdown component)

```typescript
await selectNameInDropdown(wrapper, "Alice");
expect(wrapper.find(`[toggle-name=Bob]`).exists()).toBe(true)

await selectNameInDropdown(wrapper, "Bob");
expect(wrapper.find(`[toggle-name=Alice]`).exists()).toBe(true)
```

</details>

<details>
<summary>Thank You!</summary>
</details>

