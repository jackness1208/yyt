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
      proxy: 1234,
      headless: true,
      html_report_folder: './yyt/__report'
    }
  }
};
