<template>
  <span >
      {{ params.value !== null ? (typeof params.value === 'number' || !isNaN(params.value)) ? Number(params.value).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") : params.value : ''}}
  </span>
</template>

<script>

export default {

};
</script>
