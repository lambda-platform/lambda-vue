<template>
  <span class="block align-right">
    {{
          params.value !== null
              ? (typeof params.value === 'number' || !isNaN(params.value))
                  ? Number(params.value)
                      .toFixed(2) // Rounds to 2 decimal places
                      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") // Adds thousand separators
                  : params.value
              : ''
      }}
  </span>
</template>

<script>
export default {};
</script>
