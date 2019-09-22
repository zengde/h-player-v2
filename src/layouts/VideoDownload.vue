// todo
// fluent-ffmpeg ffmpeg-static ffprobe-static
// ffmpeg -i https://.m3u8 -c copy output.mp4
<template>
  <q-btn dense flat round icon="save_alt" @click="videoDownload">
    <q-menu auto-close>
      <div class="q-pa-md q-gutter-sm">
        <q-toggle label="清空" color="red" v-model="clear" />
        <q-btn flat label="全部启动" color="secondary" />
        <q-btn flat label="全部暂停" color="red" />
      </div>
      <q-list dense style="min-width: 100px" separator>
        <q-item v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>name</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-icon name="close" color="red" />
          </q-item-section>
        </q-item>
        <q-item v-close-popup>
          <q-item-section avatar>
            <q-avatar icon="folder" color="primary" text-color="white" />
          </q-item-section>
          <q-item-section>
            <q-item-label>name</q-item-label>
            <q-item-label caption>February 22, 2016</q-item-label>
            <q-item-label>
              <q-linear-progress :value="progress" />
            </q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-toggle color="blue" v-model="clearSingle" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
<script>
export default {
  data() {
    return {
      clear: false,
      clearSingle: false,
      progress: 50,
    };
  },
  methods: {
    videoDownload() {},
    onItemClick() {

    },
  },
};
</script>
