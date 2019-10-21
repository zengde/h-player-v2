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
      <q-page class="row justify-center items-center">
        <div class="row q-col-gutter-md justify-center items-center">
          <div class="col-auto">
            <q-btn
              color="primary"
              label="暂无视频源，点击选择文件导入"
              @click="openDialog"
            />
          </div>
          <div class="col-auto"><span class="q-pa-sm">或前往</span></div>
          <div class="col-auto">
            <q-btn
              color="primary"
              icon="settings"
              label="设置"
              @click="configClick"
            />
          </div>
          <div class="col-auto"><span class="q-pa-sm">页面手动添加</span></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import footerContent from 'components/footerContent';
import titleBar from 'components/titleBar';
import { mapMutations, mapState } from 'vuex';
import { Plugins, FilesystemEncoding } from '@capacitor/core';

const { Filesystem } = Plugins;

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
      fileChooser.open({}, (uri) => {
        if (uri.indexOf('.json') === -1) {
          this.$q.dialog({
            title: 'Alert',
            message: '请选择有效的json文件！',
          });
        } else {
          this.readFile(uri);
        }
      }, e => console.log(e));
    },
    configClick() {
      this.$router.push('/config');
    },
    async readFile(file) {
      // console.log(file);
      const contents = await Filesystem.readFile({
        path: file,
        encoding: FilesystemEncoding.UTF8,
      });
      this.setSiteList(JSON.parse(contents.data));
      this.$router.push('/');
    },
  },
};
</script>

<style lang="stylus">
</style>
