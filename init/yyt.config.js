module.exports = {
  default: {
    src_folders: ['./yyt/test'],
    custom_commands_path: ['./yyt/command'],
    output_folder: false,
    __extend: {
      headless: false
    }
  },
  dev: {
    src_folders: ['./yyt/test'],
    custom_commands_path: ['./yyt/command'],
    output_folder: false,
    __extend: {
      proxy: 8887,
      headless: true
    }
  }
};
