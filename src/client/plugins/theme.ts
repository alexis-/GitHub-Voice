import { BootstrapVue } from 'bootstrap-vue';
import { VueConstructor } from 'vue/types/umd.d';

import '@/assets/vendor/nucleo/css/nucleo.css';
import '@/assets/vendor/font-awesome/css/font-awesome.css';
import '@/assets/scss/argon.scss';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Badge from '@/components/Badge.vue';
import BaseAlert from '@/components/BaseAlert.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseCheckbox from '@/components/BaseCheckbox.vue';
import BaseInput from '@/components/BaseInput.vue';
import BasePagination from '@/components/BasePagination.vue';
import BaseProgress from '@/components/BaseProgress.vue';
import BaseRadio from '@/components/BaseRadio.vue';
import BaseSlider from '@/components/BaseSlider.vue';
import BaseSwitch from '@/components/BaseSwitch.vue';
import Card from '@/components/Card.vue';
import Icon from '@/components/Icon.vue';
import Modal from '@/components/Modal.vue';

export default {
  install(Vue: VueConstructor) {
    Vue.use(BootstrapVue);

    Vue.component(Badge.name, Badge);
    Vue.component(BaseAlert.name, BaseAlert);
    Vue.component(BaseButton.name, BaseButton);
    Vue.component(BaseInput.name, BaseInput);
    Vue.component(BaseCheckbox.name, BaseCheckbox);
    Vue.component(BasePagination.name, BasePagination);
    Vue.component(BaseProgress.name, BaseProgress);
    Vue.component(BaseRadio.name, BaseRadio);
    Vue.component(BaseSlider.name, BaseSlider);
    Vue.component(BaseSwitch.name, BaseSwitch);
    Vue.component(Card.name, Card);
    Vue.component(Icon.name, Icon);
    Vue.component(Icon.name, Icon);
    Vue.component(Modal.name, Modal);
  },
};
