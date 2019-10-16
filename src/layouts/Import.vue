<template>
  <q-layout view="hHh Lpr fFf">
    <!-- (Optional) The Header -->
    <q-header elevated>
      <title-bar @config="configClick"></title-bar>
    </q-header>
    <!-- (Optional) The Footer -->
    <q-footer>
      <footer-content></footer-content>
    </q-footer>
    <q-page-container>
      <q-page class="flex">
        <div style="flex: auto" class="flex justify-center items-center">
          <q-btn
            color="primary"
            label="暂无视频源，点击选择文件导入"
            @click="openDialog"
          />
          <span class="q-pa-sm">或前往</span>
          <q-btn
            color="primary"
            icon="settings"
            label="设置"
            @click="configClick"
          />
          <span class="q-pa-sm">页面手动添加</span>
        </div>
      </q-page>
    </q-page-container>
    <q-uploader
      label="Upload"
      ref="upload"
      style="max-width: 300px"
      accept=".json"
      v-show="false"
      @added="readFile"
    />
  </q-layout>
</template>

<script>
import footerContent from 'components/footerContent';
import titleBar from 'components/titleBar';
import { mapMutations, mapState } from 'vuex';

export default {
  name: 'Import',
  components: {
    titleBar,
    footerContent,
  },
  computed: {
    ...mapState({
      siteList: state => state.site.siteList,
    }),
  },
  methods: {
    ...mapMutations(['setSiteList']),
    async openDialog() {
      this.$refs.upload.pickFiles();
    },
    configClick() {
      this.$router.push('/config');
    },
    readFile(files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedFile = JSON.parse(e.target.result);
        this.setSiteList(importedFile);
        this.$router.push('/');
      };
      reader.readAsText(files[0]);
    },
  },
};
</script>

<style lang="stylus">
</style>
