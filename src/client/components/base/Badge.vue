<template>
    <component :is="tag"
               class="badge"
               :class="
               [`badge-${type}`,
                rounded ? `badge-pill` : '',
                circle && 'badge-circle'
               ]"
               :style="styling">
        <slot>
            <i v-if="icon" :class="icon"></i>
        </slot>
    </component>
</template>

<script>
import tinyColor from '@/utils/tinycolor';

const textColors = [ 'white', 'black' ];
const textReadabilityOptions = { level: 'AAA', size: 'small' };

export default {
  name: 'badge',
  computed: {
    styling() {
      if (!this.customColor) {
        return {};
      }

      /*
      const mostReadable = { score: -1 };

      for (let i = -1; i <= 1; i++) {
        const bgColor = tinyColor(this.customColor).shadeOrBlend(0.1 * i);

        textColors.forEach((fgColor) => {
          const score = tinyColor.readability(bgColor, fgColor);

          if (score > mostReadable.score) {
            mostReadable.score = score;
            mostReadable.bgColor = bgColor;
            mostReadable.fgColor = fgColor;
          }
        });
      }

      const fgColor = tinyColor(mostReadable.fgColor).toHex8String();
      const bgColor = tinyColor(mostReadable.bgColor).toHex8String();
      */

      const fgColor = tinyColor.mostReadable(this.customColor, textColors, textReadabilityOptions).toHexString();
      const bgColor = tinyColor(this.customColor).setAlpha(0.5).toHexString();

      return this.customColor ? {
        color: fgColor,
        backgroundColor: bgColor,
      } : {};
    },
  },
  props: {
    tag: {
      type: String,
      default: 'span',
      description: 'Html tag to use for the badge.',
    },
    rounded: {
      type: Boolean,
      default: false,
      description: 'Whether badge is of pill type',
    },
    circle: {
      type: Boolean,
      default: false,
      description: 'Whether badge is circle',
    },
    icon: {
      type: String,
      default: '',
      description: 'Icon name. Will be overwritten by slot if slot is used',
    },
    type: {
      type: String,
      default: 'default',
      description: 'Badge type (primary|info|danger|default|warning|success)',
    },
    customColor: {
      type: String,
      default: null,
      description: 'Custom color for the badge',
    },
  },
};
</script>
<style>
</style>
